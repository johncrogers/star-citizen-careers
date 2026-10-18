// Careers app: loads the other apps' data and my saved choices, and works out where my character
// stands on each career path. The career guidance itself is in careers.data.js; my own progress
// that the other apps don't know (aUEC, reputation ranks, steps done) is in character.js.
(function () {
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (n) => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));
  const short = (n) => (n == null ? "—" : n >= 1e6 ? `${+(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(Math.round(n)));
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const SITE = window.SITE || {};
  const published = SITE.mode === "published";
  const siteHref = (id) => ((SITE.links || []).find((l) => l.id === id) || {}).href || null;
  const baseOf = (id) => {
    const h = siteHref(id);
    return h ? h.replace(/[^/]*\.html$/, "") : null;
  };
  // A link into another app: its page, plus a search (?q=) and/or a hash (#...).
  function appHref(app, { q, hash } = {}) {
    const base = baseOf(app);
    if (!base) return null;
    return `${base}index.html${q ? `?q=${encodeURIComponent(q)}` : ""}${hash ? `#${hash}` : ""}`;
  }

  // ── Loading the other apps ─────────────────────────────────────────────────
  // Each app's files in load order, and the globals to keep. Several apps share global names
  // (WISHLIST, OWNED), so each app's globals are collected and cleared before the next loads.
  const SOURCES = [
    { id: "ships", files: ["catalog.data.js", "ships.data.js", "wishlist.js", "purchases.js"],
      keep: ["SHIP_CATALOG", "SHIP_CATALOG_META", "SHIPS", "WISHLIST", "PURCHASES"] },
    { id: "items", files: ["catalog.data.js", "items.data.js", "wishlist.js", "owned.js"],
      keep: ["ITEM_CATALOG", "ITEM_CATALOG_META", "ITEMS", "WISHLIST", "OWNED"] },
    { id: "components", files: ["catalog.data.js", "components.data.js", "wishlist.js", "owned.js", "builds.js"],
      keep: ["COMPONENT_CATALOG", "COMPONENT_CATALOG_META", "COMPONENTS", "WISHLIST", "OWNED", "BUILDS"] },
    { id: "contracts", files: ["catalog.data.js"], keep: ["CONTRACTS", "CONTRACTS_META"] },
  ];
  const DROP = ["ITEM_LOCATIONS", "ITEM_LOCATION_CODES", "ITEM_DESCRIPTIONS", "COMPONENT_LOCATIONS", "COMPONENT_LOCATION_CODES",
    "COMPONENT_DESCRIPTIONS", "SHIP_LOADOUTS", "CONTRACT_PLACES", "CONTRACT_SHIPS", "CONTRACT_BLUEPRINTS", "CONTRACT_TEXT"];

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => { s.remove(); resolve(); };
      s.onerror = () => { s.remove(); reject(new Error(src)); };
      document.head.appendChild(s);
    });

  async function loadAll(progress) {
    const raw = {};
    const missing = [];
    for (const src of SOURCES) {
      const base = baseOf(src.id);
      progress(src.id);
      try {
        if (!base) throw new Error("no link");
        for (const f of src.files) await loadScript(base + f);
        raw[src.id] = Object.fromEntries(src.keep.map((k) => [k, window[k]]));
      } catch (e) {
        missing.push(src.id);
      }
      for (const k of [...src.keep, ...DROP]) delete window[k];
    }
    lastRaw = raw;
    return { world: buildWorld(raw), missing };
  }
  // Rebuild from the data already loaded, re-reading saved choices (cheap: no files reloaded).
  let lastRaw = null;
  const refresh = () => (lastRaw ? buildWorld(lastRaw) : null);

  // Saved choices: the .js file plus unsaved changes from that app's page (same rule the apps use).
  function withOverrides(fileState, key) {
    const out = { ...(fileState || {}) };
    let o = {};
    try { o = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { o = {}; }
    for (const [id, v] of Object.entries(o)) {
      if (v) out[id] = v;
      else delete out[id];
    }
    return out;
  }

  // Curated records override catalog records field by field, matched by className then id.
  function merge(catalog, curated, nested) {
    const byClass = new Map(catalog.filter((s) => s.className).map((s) => [s.className.toLowerCase(), s]));
    const byId = new Map(catalog.map((s) => [s.id, s]));
    const out = new Map(catalog.map((s) => [s.id, s]));
    for (const cur of curated || []) {
      const base = (cur.className && byClass.get(cur.className.toLowerCase())) || byId.get(cur.id);
      const merged = { ...(base || {}), ...cur };
      for (const k of nested) merged[k] = { ...((base || {})[k] || {}), ...(cur[k] || {}) };
      if (base) out.delete(base.id);
      out.set(merged.id, merged);
    }
    return out;
  }
  const minPrice = (rows) => {
    const p = (rows || []).map((b) => (Array.isArray(b) ? b[1] : b.price)).filter((x) => x > 0);
    return p.length ? Math.min(...p) : null;
  };

  // Pay per hour, same rule as the contracts app.
  const NO_RATE = new Set(["mining", "wikelo", "gathering"]);
  const perHour = (c) => {
    const t = c.community;
    if (!t || !c.reward || !t.mins || t.runs < 3 || NO_RATE.has(c.act)) return null;
    return Math.round((c.reward * 60) / Math.max(t.mins, 5));
  };
  const median = (xs) => {
    const s = xs.filter((x) => x != null).sort((a, b) => a - b);
    if (!s.length) return null;
    return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
  };

  // Everything the career pages need, in one place.
  function buildWorld(raw) {
    const w = { ships: new Map(), items: new Map(), parts: new Map(), contracts: [], ladders: new Map(), meta: {}, builds: {} };
    if (raw.ships) {
      const d = raw.ships;
      w.ships = merge(d.SHIP_CATALOG || [], d.SHIPS, ["stats", "acquisition", "pledge", "links"]);
      w.shipWish = withOverrides(d.WISHLIST, "sc-ships-wishlist:wishlist-overrides");
      w.shipOwned = withOverrides(d.PURCHASES, "sc-ships-wishlist:purchase-overrides");
      w.meta.ships = d.SHIP_CATALOG_META;
    }
    if (raw.items) {
      const d = raw.items;
      w.items = merge(d.ITEM_CATALOG || [], d.ITEMS, ["stats"]);
      w.itemWish = withOverrides(d.WISHLIST, "sc-items-wishlist:wishlist-overrides");
      w.itemOwned = withOverrides(d.OWNED, "sc-items-wishlist:owned-overrides");
      w.meta.items = d.ITEM_CATALOG_META;
    }
    if (raw.components) {
      const d = raw.components;
      w.parts = merge(d.COMPONENT_CATALOG || [], d.COMPONENTS, ["stats"]);
      w.partWish = withOverrides(d.WISHLIST, "sc-ship-components:wishlist-overrides");
      w.partOwned = withOverrides(d.OWNED, "sc-ship-components:owned-overrides");
      w.builds = withOverrides(d.BUILDS, "sc-ship-components:builds-overrides");
      w.meta.parts = d.COMPONENT_CATALOG_META;
    }
    if (raw.contracts) {
      w.contracts = (raw.contracts.CONTRACTS || []).filter((c) => !c.off);
      w.acts = (raw.contracts.CONTRACTS_META || {}).activities || {};
      w.meta.contracts = raw.contracts.CONTRACTS_META;
      // Each contractor's rank ladders, from the ranks contracts ask for. Some contractors have more
      // than one track (Red Wind: "Standing" for deliveries, "Hauling" for freight), each with its
      // own rank names. ladders: "<contractor>|<track>" -> { by, track, names: Map(index -> name), count }.
      // Required ranks first, so their names win over the odd "max rank" entry.
      for (const field of ["rank", "maxRank"]) for (const c of w.contracts) {
        for (const r of [c[field]]) {
          if (!r || r[1] == null || !c.by) continue;
          const k = `${c.by}|${r[2] || ""}`;
          if (!w.ladders.has(k)) w.ladders.set(k, { by: c.by, track: r[2] || "", names: new Map(), count: 0 });
          const l = w.ladders.get(k);
          if (!l.names.has(r[0])) l.names.set(r[0], r[1]);
          if (r === c.rank) l.count++;
        }
      }
    }
    w.shipOwned = w.shipOwned || {};
    w.shipWish = w.shipWish || {};
    w.itemOwned = w.itemOwned || {};
    w.itemWish = w.itemWish || {};
    w.partOwned = w.partOwned || {};
    w.partWish = w.partWish || {};
    return w;
  }

  // What kind of thing an id is, its name, price, and whether I own or want it.
  function lookup(w, id) {
    const s = w.ships.get(id);
    if (s) return {
      kind: "ship", id, name: s.name, rec: s,
      price: minPrice((s.acquisition || {}).buy), usd: (s.pledge || {}).usd || null,
      owned: !!w.shipOwned[id], wanted: !!w.shipWish[id],
      pledged: !!(w.shipOwned[id] && w.shipOwned[id].pledge),
      href: appHref("ships", { hash: id }),
      sub: [s.manufacturer, s.role].filter(Boolean).join(" · "),
    };
    const it = w.items.get(id);
    if (it) return {
      kind: "item", id, name: it.name, rec: it, price: minPrice(it.buy),
      owned: !!w.itemOwned[id], wanted: !!w.itemWish[id], href: appHref("items", { hash: id }), sub: it.type,
    };
    const p = w.parts.get(id);
    if (p) return {
      kind: "part", id, name: p.name, rec: p, price: minPrice(p.buy),
      owned: !!w.partOwned[id], wanted: !!w.partWish[id], href: appHref("components", { hash: id }),
      sub: [p.type, p.stats && p.stats.size ? `S${p.stats.size}` : null].filter(Boolean).join(" · "),
    };
    return { kind: "missing", id, name: id, owned: false, wanted: false, href: null, sub: "Not in the data" };
  }

  // A stage's contract reference -> the matching contracts and their numbers.
  function contractStats(w, ref) {
    const re = ref.title ? new RegExp(ref.title, "i") : null;
    const list = w.contracts.filter((c) =>
      c.act === ref.act && (!ref.by || c.by === ref.by) && (!re || re.test(c.title)) && (!ref.bp || !!c.bp) &&
      (!ref.rank || ((c.rank ? c.rank[0] : 0) >= ref.rank[0] && (c.rank ? c.rank[0] : 0) <= ref.rank[1])));
    const rates = list.map(perHour);
    const rewards = list.map((c) => c.reward).filter(Boolean);
    const q = ref.q || [`act:${ref.act}`, ref.by ? `by:"${ref.by}"` : "", ref.rank ? `rank:${ref.rank[0]}..${ref.rank[1]}` : "", ref.bp ? "has:blueprint" : ""].filter(Boolean).join(" ");
    return {
      ref, list, count: list.length,
      reward: median(rewards), rewardMax: rewards.length ? Math.max(...rewards) : null,
      rate: median(rates), rateBest: rates.some((r) => r != null) ? Math.max(...rates.filter((r) => r != null)) : null,
      starters: list.filter((c) => c.starter).length, illegal: list.filter((c) => c.illegal).length,
      href: appHref("contracts", { q }),
    };
  }

  // ── My character (character.js) ────────────────────────────────────────────
  // One file, one line per entry: "profile", "rep:<contractor>", "step:<career>/<stage>/<step>",
  // "follow:<career>". Changes made here are kept in this browser until saved over the file.
  const KEY = "sc-careers:character-overrides";
  const fileState = window.CHARACTER || {};
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { overrides = {}; }
  const listeners = [];
  const same = (a, b) => JSON.stringify(a || null) === JSON.stringify(b || null);
  function persist() {
    for (const id of Object.keys(overrides)) if (same(overrides[id], fileState[id])) delete overrides[id];
    try { localStorage.setItem(KEY, JSON.stringify(overrides)); } catch (e) { /* storage unavailable */ }
  }
  persist();
  function all() {
    const out = { ...fileState };
    for (const [id, v] of Object.entries(overrides)) {
      if (v) out[id] = v;
      else delete out[id];
    }
    return out;
  }
  const Character = {
    all,
    get: (id) => all()[id] || null,
    set(id, value) {
      overrides[id] = value || null;
      persist();
      listeners.forEach((fn) => fn());
    },
    profile: () => all().profile || {},
    setProfile(patch) { Character.set("profile", { ...Character.profile(), ...patch, updated: today() }); },
    // ladder: "<contractor>|<track>" (see buildWorld).
    rank: (ladder) => (all()[`rep:${ladder}`] || {}).rank ?? null,
    setRank: (ladder, rank) => Character.set(`rep:${ladder}`, rank == null || rank === "" ? null : { rank: +rank, date: today() }),
    stepDone: (key) => !!all()[`step:${key}`],
    setStep: (key, on) => Character.set(`step:${key}`, on ? { date: today() } : null),
    following: (id) => !!all()[`follow:${id}`],
    setFollow: (id, on) => Character.set(`follow:${id}`, on ? { since: today() } : null),
    pending: () => Object.keys(overrides).length,
    discard() { overrides = {}; persist(); listeners.forEach((fn) => fn()); },
    onChange: (fn) => listeners.push(fn),
    fileText() {
      const order = (k) => (k === "profile" ? 0 : k.startsWith("follow:") ? 1 : k.startsWith("rep:") ? 2 : 3);
      const entries = Object.entries(all()).sort(([a], [b]) => order(a) - order(b) || a.localeCompare(b));
      const obj = (v) => `{ ${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${JSON.stringify(x)}`).join(", ")} }`;
      const body = entries.length ? `{\n${entries.map(([id, v]) => `  ${JSON.stringify(id)}: ${obj(v)}`).join(",\n")}\n}` : "{}";
      return [
        `// My character: what the other apps don't know. One line per entry:`,
        `//   "profile":                        { handle, aUEC, home, updated }`,
        `//   "follow:<career id>":             { since }      careers I'm working towards`,
        `//   "rep:<contractor>|<track>":       { rank, date } my rank number on a contractor's track (0 = first rank)`,
        `//   "step:<career>/<stage>/<step>":   { date }       steps I've ticked off`,
        `// The careers page saves to the browser right away. Click "Save character.js" there and replace this`,
        `// file to make changes permanent (and visible to agents and git).`,
        `window.CHARACTER = ${body};`,
        ``,
      ].join("\n");
    },
    async save() {
      const text = Character.fileText();
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({ id: "careers", suggestedName: "character.js", types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }] });
          const wr = await handle.createWritable();
          await wr.write(text);
          await wr.close();
          return "saved";
        } catch (e) {
          if (e.name === "AbortError") return "cancelled";
        }
      }
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([text], { type: "text/javascript" })), download: "character.js" });
      a.click();
      URL.revokeObjectURL(a.href);
      return "downloaded";
    },
  };

  function renderPendingBanner(el) {
    const n = Character.pending();
    el.hidden = published || !n;
    if (el.hidden) return;
    el.innerHTML = `<span><strong>${n} character change${n > 1 ? "s" : ""}</strong> saved in this browser only. To keep them for good, save character.js over the one in this folder.</span>
      <span class="pending-actions"><button type="button" data-save>Save character.js</button><button type="button" class="ghost" data-discard>Discard</button></span>
      <span class="pending-msg" aria-live="polite"></span>`;
    el.onclick = async (e) => {
      if (e.target.closest("[data-discard]") && confirm("Discard character changes that aren't in character.js?")) Character.discard();
      if (e.target.closest("[data-save]")) {
        const r = await Character.save();
        const msg = el.querySelector(".pending-msg");
        if (r === "saved") msg.textContent = "Saved. Reload the page to confirm.";
        if (r === "downloaded") msg.textContent = "Downloaded. Move it into this folder, replacing the old character.js, then reload.";
      }
    };
  }

  // ── Progress on a career ───────────────────────────────────────────────────
  // The ladder a step means: the named track, or the contractor's track with the most contracts.
  function ladderFor(w, by, track) {
    if (track != null) return w.ladders.has(`${by}|${track}`) ? `${by}|${track}` : null;
    let best = null;
    for (const [k, l] of w.ladders) if (l.by === by && (!best || l.count > w.ladders.get(best).count)) best = k;
    return best;
  }
  const rankName = (w, ladder, r) => (ladder && w.ladders.get(ladder) ? w.ladders.get(ladder).names.get(r) : null) || (r != null ? `Rank ${r}` : null);

  const ownsAny = (w, ids) => (ids || []).some((id) => lookup(w, id).owned);
  // A step is done when I ticked it, when I own one of its things, or when my rank is high enough.
  function stepState(w, career, stage, step) {
    const key = `${career.id}/${stage.id}/${step.id}`;
    if (step.own) return { key, auto: "own", done: ownsAny(w, step.own) || Character.stepDone(key) };
    if (step.rep) {
      const ladder = ladderFor(w, step.rep[0], step.rep[2]);
      const r = ladder ? Character.rank(ladder) : null;
      return { key, auto: "rep", ladder, done: (r != null && r >= step.rep[1]) || Character.stepDone(key), rank: r };
    }
    return { key, auto: null, done: Character.stepDone(key) };
  }
  function progress(w, career) {
    const stages = career.stages.map((st) => {
      const steps = (st.steps || []).map((s) => ({ step: s, ...stepState(w, career, st, s) }));
      const done = steps.length > 0 && steps.every((s) => s.done);
      return { stage: st, steps, done, doneCount: steps.filter((s) => s.done).length };
    });
    // Where I am: the furthest stage I've made progress in (or the one after it, if it's done).
    // Skipped early stages don't hold me back.
    let last = -1;
    stages.forEach((s, i) => { if (s.doneCount) last = i; });
    const current = last < 0 ? stages.find((s) => !s.done) || null
      : !stages[last].done ? stages[last] : stages.slice(last + 1).find((s) => !s.done) || null;
    const nextStep = current ? current.steps.find((s) => !s.done) : null;
    const allSteps = stages.flatMap((s) => s.steps);
    return {
      stages, current, nextStep,
      stagesDone: stages.filter((s) => s.done).length,
      stepsDone: allSteps.filter((s) => s.done).length,
      stepsTotal: allSteps.length,
    };
  }

  window.Careers = {
    esc, fmt, short, today, published, siteHref, appHref, loadAll, refresh, lookup, contractStats, median, ladderFor, rankName,
    Character, renderPendingBanner, progress, careers: window.CAREERS || [], meta: window.CAREERS_META || {},
  };
})();
