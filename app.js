// Careers app views: My character, the careers index, and one page per career path.
(function () {
  const {
    esc, fmt, short, published, appHref, loadAll, lookup, contractStats, ladderFor, rankName,
    Character, renderPendingBanner, progress, careers, meta,
  } = window.Careers;
  const $ = (id) => document.getElementById(id);
  let world = null;
  let view = { page: "character", career: null };

  // ── Small pieces ───────────────────────────────────────────────────────────
  const statusBadge = (t) =>
    t.owned ? `<span class="badge owned">${t.pledged ? "pledged" : "owned"}</span>` : t.wanted ? `<span class="badge wanted">wanted</span>` : "";
  const priceText = (t) =>
    t.price != null ? `${fmt(t.price)} aUEC` : t.kind === "ship" && t.usd ? `pledge $${fmt(t.usd)}` : t.kind === "missing" ? "" : "not sold in game";
  const thing = (id) => {
    const t = lookup(world, id);
    return `<li class="thing ${t.owned ? "is-owned" : ""}">
      <div>${t.href ? `<a href="${esc(t.href)}">${esc(t.name)}</a>` : esc(t.name)} ${statusBadge(t)}<small>${esc(t.sub || "")}</small></div>
      <span class="thing-price">${esc(priceText(t))}</span></li>`;
  };
  const bar = (done, total) => `<span class="pbar" role="img" aria-label="${done} of ${total}"><span style="width:${total ? (done / total) * 100 : 0}%"></span></span>`;
  const linkOf = (l) => (l.url ? l.url : l.app ? appHref(l.app, { q: l.q, hash: l.hash }) : null);

  // Best pay per hour among a career's contracts, for the at-a-glance tile.
  function careerPay(c) {
    const stats = c.stages.flatMap((s) => (s.contracts || []).map((r) => contractStats(world, r)));
    const rates = stats.map((s) => s.rate).filter((r) => r != null);
    return { typical: rates.length ? window.Careers.median(rates) : null, best: stats.reduce((m, s) => Math.max(m, s.rateBest || 0), 0) || null };
  }
  // Rough aUEC to get into a stage: the cheapest ship of the stage, unless I already own one.
  function stageCost(stage) {
    const opts = (stage.ships || []).map((id) => lookup(world, id));
    if (!opts.length || opts.some((t) => t.owned)) return null;
    const priced = opts.filter((t) => t.price != null).sort((a, b) => a.price - b.price);
    return priced[0] || null;
  }

  // ── My character ───────────────────────────────────────────────────────────
  function characterView() {
    const p = Character.profile();
    const shipsOwned = [...world.ships.values()].filter((s) => world.shipOwned[s.id]);
    const pledged = shipsOwned.filter((s) => world.shipOwned[s.id].pledge);
    const fleetValue = shipsOwned.reduce((t, s) => t + (lookup(world, s.id).price || 0), 0);
    const itemsOwned = Object.keys(world.itemOwned).filter((id) => world.items.has(id)).length;
    const partsOwned = Object.keys(world.partOwned).filter((id) => world.parts.has(id)).length;
    const wanted = [
      ...Object.keys(world.shipWish).filter((id) => !world.shipOwned[id]),
      ...Object.keys(world.itemWish).filter((id) => !world.itemOwned[id]),
      ...Object.keys(world.partWish).filter((id) => !world.partOwned[id]),
    ].map((id) => lookup(world, id)).filter((t) => t.price != null).sort((a, b) => a.price - b.price);
    const wantCost = wanted.reduce((t, x) => t + x.price, 0);
    const balance = +p.aUEC || 0;
    const affordable = [];
    let left = balance;
    for (const t of wanted) if (t.price <= left) { affordable.push(t); left -= t.price; }

    const rows = careers.map((c) => {
      const pr = progress(world, c);
      const f = Character.following(c.id);
      return { c, pr, f };
    }).sort((a, b) => b.f - a.f || b.pr.stepsDone / (b.pr.stepsTotal || 1) - a.pr.stepsDone / (a.pr.stepsTotal || 1));

    return `<div class="char-grid">
      <div class="cmp-card">
        <h3>Profile</h3>
        <div class="profile-form">
          <label>Handle <input data-profile="handle" value="${esc(p.handle || "")}" placeholder="Your in-game name"></label>
          <label>aUEC balance <input data-profile="aUEC" inputmode="numeric" value="${esc(p.aUEC ?? "")}" placeholder="0"></label>
          <label>Home location <input data-profile="home" value="${esc(p.home || "")}" placeholder="e.g. New Babbage"></label>
        </div>
        <div class="tiles">
          <div class="tile"><span>Ships</span><strong>${shipsOwned.length}</strong><small>${pledged.length} pledged · fleet worth ${short(fleetValue)} aUEC</small></div>
          <div class="tile"><span>Personal items owned</span><strong>${itemsOwned}</strong><small>from the items app</small></div>
          <div class="tile"><span>Ship parts owned</span><strong>${partsOwned}</strong><small>${Object.keys(world.builds).length} saved builds</small></div>
          <div class="tile"><span>Wishlists still to buy</span><strong>${short(wantCost)}</strong><small>${wanted.length} things · ${balance ? `${affordable.length} affordable now` : "set your balance"}</small></div>
        </div>
        ${balance && affordable.length ? `<p class="note">With ${fmt(balance)} aUEC you could buy, cheapest first: ${affordable.slice(0, 8).map((t) => `<a href="${esc(t.href)}">${esc(t.name)}</a>`).join(", ")}${affordable.length > 8 ? "…" : ""}.</p>` : ""}
      </div>

      <div class="cmp-card">
        <h3>Career progress</h3>
        <p class="muted">Star a career to follow it. Progress counts the steps you've done: owning the ships and gear, reaching ranks, and steps you tick yourself.</p>
        <div class="career-rows">${rows.map(({ c, pr, f }) => `<div class="career-row">
          <button type="button" class="star${f ? " on" : ""}" data-follow="${esc(c.id)}" title="${f ? "Stop following" : "Follow this career"}" aria-label="${f ? "Stop following" : "Follow"} ${esc(c.name)}">${f ? "★" : "☆"}</button>
          <div class="cr-main"><a href="#career/${esc(c.id)}"><strong>${esc(c.name)}</strong></a>
            <small>${pr.current ? `Stage ${pr.stages.indexOf(pr.current) + 1}: ${esc(pr.current.stage.name)}${pr.nextStep ? ` · next: ${esc(pr.nextStep.step.text)}` : ""}` : "All stages done"}</small></div>
          <div class="cr-bar">${bar(pr.stepsDone, pr.stepsTotal)}<small>${pr.stagesDone} of ${pr.stages.length} stages</small></div>
        </div>`).join("")}</div>
      </div>

      <div class="cmp-card">
        <h3>Reputation</h3>
        <p class="muted">Your rank with each contractor the careers use. The rank names come from the contracts data. Set them as you rank up in game; steps that need a rank tick themselves.</p>
        ${repTable()}
      </div>
    </div>`;
  }

  // Contractor tracks the careers refer to, then everyone else in the contracts data.
  function repTable() {
    const used = new Set();
    for (const c of careers) for (const s of c.stages) {
      for (const st of s.steps || []) if (st.rep) { const l = ladderFor(world, st.rep[0], st.rep[2]); if (l) used.add(l); }
      for (const r of s.contracts || []) if (r.by) { const l = ladderFor(world, r.by); if (l) used.add(l); }
    }
    const row = (k) => {
      const l = world.ladders.get(k);
      const cur = Character.rank(k);
      const names = [...l.names].sort((a, b) => a[0] - b[0]);
      return `<tr><td>${esc(l.by)}${l.track && !["Standing", ""].includes(l.track) ? ` <small class="muted">${esc(l.track)}</small>` : ""}</td>
        <td><select data-rank="${esc(k)}" aria-label="My rank with ${esc(l.by)}">
          <option value=""${cur == null ? " selected" : ""}>Not set</option>
          ${names.map(([i, n]) => `<option value="${i}"${cur === i ? " selected" : ""}>${i} · ${esc(n)}</option>`).join("")}
        </select></td></tr>`;
    };
    const others = [...world.ladders.keys()].filter((k) => !used.has(k) && world.ladders.get(k).names.size > 1).sort();
    return `<div class="cmp-scroll"><table class="rep"><tbody>${[...used].sort().map(row).join("")}</tbody></table></div>
      ${others.length ? `<details class="more-rep"><summary>${others.length} more contractors</summary><table class="rep"><tbody>${others.map(row).join("")}</tbody></table></details>` : ""}`;
  }

  // ── Careers index ──────────────────────────────────────────────────────────
  const GROUP_ORDER = ["Combat", "Industry", "Transport & trade", "Support", "Exploration & sport", "Outlaw"];
  function indexView() {
    const groups = [...new Set([...GROUP_ORDER, ...careers.map((c) => c.group || "Other")])].filter((g) => careers.some((c) => (c.group || "Other") === g));
    return groups.map((g) => `<h3 class="path-title">${esc(g)}</h3>${cards(careers.filter((c) => (c.group || "Other") === g))}`).join("") +
      `<p class="note">Career guidance researched for patch ${esc(meta.patch || "?")} (${esc(meta.gathered || "?")}). Ships, gear, contracts and pay come live from the other apps. Guidance not checked in game is marked unverified.</p>`;
  }
  function cards(list) {
    return `<div class="career-cards">${list.map((c) => {
      const pr = progress(world, c);
      const pay = careerPay(c);
      return `<a class="career-card" href="#career/${esc(c.id)}">
        <div class="cc-head"><h2>${esc(c.name)}</h2>${Character.following(c.id) ? `<span class="badge wanted">following</span>` : ""}</div>
        <p>${esc(c.tagline)}</p>
        <div class="cc-tags"><span>${esc(c.style.team)}</span><span>Risk: ${esc(c.style.risk)}</span><span>${esc(c.style.legality)}</span>${pay.typical ? `<span>~${short(pay.typical)}/h typical</span>` : ""}</div>
        <div class="cc-progress">${bar(pr.stepsDone, pr.stepsTotal)}<small>${pr.current ? `Stage ${pr.stages.indexOf(pr.current) + 1} of ${pr.stages.length}: ${esc(pr.current.stage.name)}` : "All stages done"}</small></div>
      </a>`;
    }).join("")}</div>`;
  }

  // ── One career ─────────────────────────────────────────────────────────────
  function careerView(c) {
    const pr = progress(world, c);
    const pay = careerPay(c);
    const following = Character.following(c.id);
    const stageCards = pr.stages.map((s, i) => {
      const st = s.stage;
      const curIndex = pr.current ? pr.stages.indexOf(pr.current) : pr.stages.length;
      const status = s.done ? "done" : s === pr.current ? "current" : i < curIndex ? "skipped" : "upcoming";
      const forks = (c.forks || []).filter((f) => f.after === st.id);
      const cost = stageCost(st);
      const prevRates = i > 0 ? (pr.stages[i - 1].stage.contracts || []).map((r) => contractStats(world, r).rate).filter((r) => r != null) : [];
      const prevRate = prevRates.length ? Math.max(...prevRates) : null;
      const contracts = (st.contracts || []).map((r) => contractStats(world, r));
      return `<li class="stage ${status}">
        <div class="stage-marker" aria-hidden="true">${s.done ? "✓" : i + 1}</div>
        <div class="stage-body cmp-card">
          <div class="stage-head">
            <h3>${esc(st.name)}</h3>
            <span class="stage-status ${status}">${{ done: "Done", current: "You are here", skipped: "Skipped so far", upcoming: "Later" }[status]}</span>
          </div>
          <p class="stage-goal"><strong>Goal:</strong> ${esc(st.goal)}</p>
          ${st.why ? `<p class="muted">${esc(st.why)}</p>` : ""}
          ${cost ? `<p class="stage-cost">To start: about <strong>${fmt(cost.price)} aUEC</strong> for the cheapest ship here (${esc(cost.name)})${prevRate ? `, roughly ${Math.max(1, Math.round(cost.price / prevRate))} h of the previous stage's best-paying contracts` : ""}.</p>` : ""}
          <div class="stage-cols">
            ${s.steps.length ? `<div><h4>Checklist</h4><ul class="checklist">${s.steps.map((x) => {
              const why = x.auto === "own" ? (x.done && !Character.stepDone(x.key) ? "from what you own" : "ticks itself when you own one")
                : x.auto === "rep" ? (x.rank != null ? `your rank: ${esc(rankName(world, x.ladder, x.rank))}` : "set your rank on My character") : "";
              return `<li class="${x.done ? "done" : ""}"><label><input type="checkbox" data-step="${esc(x.key)}"${x.done ? " checked" : ""}${x.done && x.auto && !Character.stepDone(x.key) ? " disabled" : ""}>
                <span>${esc(x.step.text)}${why ? ` <small>${why}</small>` : ""}</span></label></li>`;
            }).join("")}</ul></div>` : ""}
            ${(st.ships || []).length ? `<div><h4>Ships</h4><ul class="things">${st.ships.map(thing).join("")}</ul></div>` : ""}
            ${(st.items || []).length ? `<div><h4>Gear</h4><ul class="things">${st.items.map(thing).join("")}</ul></div>` : ""}
            ${(st.parts || []).length ? `<div><h4>Ship parts</h4><ul class="things">${st.parts.map(thing).join("")}</ul><p class="note">Check what fits your ship in the <a href="${esc(appHref("components", { hash: "plan" }) || "#")}">loadout planner</a>.</p></div>` : ""}
          </div>
          ${contracts.length ? `<h4>Contracts</h4><div class="cmp-scroll"><table class="stage-contracts"><thead><tr><th>Contracts</th><th class="num">Count</th><th class="num">Typical reward</th><th class="num">Pay / hour</th><th></th></tr></thead><tbody>
            ${contracts.map((k) => `<tr><td>${esc(k.ref.label)}${k.starters ? ` <small class="good">${k.starters} good to start</small>` : ""}${k.illegal ? ` <small class="bad">${k.illegal} illegal</small>` : ""}</td>
              <td class="num">${k.count}</td><td class="num">${k.reward != null ? `${short(k.reward)}${k.rewardMax && k.rewardMax > k.reward ? ` <small>up to ${short(k.rewardMax)}</small>` : ""}` : "—"}</td>
              <td class="num">${k.rate != null ? `${short(k.rate)}${k.rateBest > k.rate ? ` <small>best ${short(k.rateBest)}</small>` : ""}` : `<small class="muted">no data</small>`}</td>
              <td>${k.href ? `<a href="${esc(k.href)}">See →</a>` : ""}</td></tr>`).join("")}
          </tbody></table></div>` : ""}
        </div>
        ${forks.map((f) => `<div class="fork cmp-card"><h4>⑂ ${esc(f.question)}</h4><div class="fork-opts">${f.options.map((o) => `<div class="fork-opt"><strong>${esc(o.label)}</strong><p>${esc(o.text)}</p>${(o.ships || []).length ? `<ul class="things">${o.ships.map(thing).join("")}</ul>` : ""}</div>`).join("")}</div></div>`).join("")}
      </li>`;
    }).join("");

    return `<div class="cmp-card career-hero">
        <div class="ch-top">
          <div><p class="crumbs"><a href="#careers">Careers</a> › ${esc(c.group || "")}</p><h2>${esc(c.name)}</h2><p class="tagline">${esc(c.tagline)}</p></div>
          <button type="button" class="wish-toggle${following ? " on" : ""}" data-follow="${esc(c.id)}">${following ? "★ Following" : "☆ Follow this career"}</button>
        </div>
        <div class="ch-progress">${bar(pr.stepsDone, pr.stepsTotal)}<span>${pr.current ? `You're at stage ${pr.stages.indexOf(pr.current) + 1} of ${pr.stages.length}, <strong>${esc(pr.current.stage.name)}</strong>${pr.nextStep ? `. Next: ${esc(pr.nextStep.step.text)}.` : "."}` : "You've done every stage."}</span></div>
        <div class="tiles">
          <div class="tile"><span>Team</span><strong>${esc(c.style.team)}</strong></div>
          <div class="tile"><span>Risk</span><strong>${esc(c.style.risk)}</strong></div>
          <div class="tile"><span>Legality</span><strong>${esc(c.style.legality)}</strong></div>
          <div class="tile"><span>To start</span><strong>${esc(c.style.startCost)}</strong></div>
          <div class="tile"><span>Pay per hour</span><strong>${pay.typical ? `~${short(pay.typical)}` : "—"}</strong><small>${pay.best ? `best ${short(pay.best)} · from contracts data` : "no hourly data"}</small></div>
        </div>
      </div>
      <div class="career-intro">
        <div class="cmp-card"><h3>Summary</h3><p>${esc(c.summary)}</p><p>${esc(c.description)}</p>
          <div class="synopsis"><h4>The path in one line</h4><p>${esc(c.synopsis)}</p></div></div>
        <div class="cmp-card"><h3>Getting started</h3><ol class="start">${c.gettingStarted.map((g) => `<li>${esc(g)}</li>`).join("")}</ol></div>
      </div>
      <h3 class="path-title">The path</h3>
      <ol class="stages">${stageCards}</ol>
      <div class="career-intro">
        <div class="cmp-card"><h3>Things to know</h3><ul class="ttk">${(c.thingsToKnow || []).map((t) => `<li class="ttk-${t.level === "warn" ? "warn" : "info"}"><span class="ttk-icon">${t.level === "warn" ? "!" : "i"}</span>${esc(t.text)}</li>`).join("")}</ul></div>
        <div class="cmp-card"><h3>Links</h3><ul class="plain links-list">${(c.links || []).map((l) => { const h = linkOf(l); return h ? `<li><a href="${esc(h)}"${l.url ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}${l.url ? " ↗" : " →"}</a></li>` : ""; }).join("")}</ul>
          <h3>Sources</h3><ul class="plain links-list">${(c.sources || []).map((s) => { const h = linkOf(s); return `<li>${h ? `<a href="${esc(h)}"${s.url ? ' target="_blank" rel="noopener"' : ""}>${esc(s.label)}</a>` : esc(s.label)}</li>`; }).join("")}</ul>
          <p class="note">${c.verified ? "Checked in game." : "Unverified: researched from the sources above for this patch, not yet checked in game. Ships, prices, ranks and pay come from the other apps' data."}</p></div>
      </div>`;
  }

  // ── Routing and wiring ─────────────────────────────────────────────────────
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith("career/") && careers.some((c) => c.id === h.slice(7))) view = { page: "career", career: h.slice(7) };
    else if (h === "careers") view = { page: "careers", career: null };
    else view = { page: "character", career: null };
  }

  let busy = false, again = false;
  function render() {
    if (busy) { again = true; return; }
    busy = true;
    try { draw(); } finally { busy = false; }
    if (again) { again = false; render(); }
  }
  function draw() {
    $("scope").innerHTML = [["character", "My character", "#character"], ["careers", "Career paths", "#careers"]]
      .map(([k, label, h]) => `<a class="tab${view.page === k || (k === "careers" && view.page === "career") ? " on" : ""}" href="${h}">${label}</a>`).join("");
    renderPendingBanner($("pending"));
    if (!world) return;
    const c = careers.find((x) => x.id === view.career);
    $("view").innerHTML = view.page === "career" && c ? careerView(c) : view.page === "careers" ? indexView() : characterView();
    document.title = view.page === "career" && c ? `${c.name} · Careers` : "Careers";
  }

  $("siteLinks").innerHTML = ((window.SITE || {}).links || []).map((l) => `<a href="${esc(l.href)}">${esc(l.label)} →</a>`).join("");
  $("view").addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.step) Character.setStep(t.dataset.step, t.checked);
    else if (t.dataset.rank) Character.setRank(t.dataset.rank, t.value);
    else if (t.dataset.profile) {
      const k = t.dataset.profile;
      const v = k === "aUEC" ? (t.value.trim() === "" ? undefined : Math.max(0, Math.round(+t.value.replace(/[,\s]/g, "")) || 0)) : t.value.trim() || undefined;
      Character.setProfile({ [k]: v });
    }
  });
  $("view").addEventListener("click", (e) => {
    const f = e.target.closest("[data-follow]");
    if (f) Character.setFollow(f.dataset.follow, !Character.following(f.dataset.follow));
  });
  window.addEventListener("hashchange", () => { fromHash(); render(); window.scrollTo(0, 0); });
  // Coming back from another app: pick up anything bought, starred or ticked there.
  window.addEventListener("focus", () => { if (world) { world = window.Careers.refresh(); render(); } });
  Character.onChange(render);

  const NAMES = { ships: "ships", items: "items", components: "ship parts", contracts: "contracts" };
  fromHash();
  render();
  loadAll((id) => { $("meta").textContent = `Loading ${NAMES[id] || id}…`; }).then((r) => {
    world = r.world;
    const m = world.meta.ships || {};
    $("meta").textContent = `${careers.length} career paths · built from your wishlists, purchases and character.js · game data for patch ${m.patch || meta.patch || "?"}`;
    if (r.missing.length) {
      $("missing").hidden = false;
      $("missing").textContent = `Couldn't load ${r.missing.map((x) => NAMES[x] || x).join(", ")}. Those parts are left out.`;
    }
    render();
  });
})();
