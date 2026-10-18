// Career paths: hand-written guidance for each fundamental career, researched for patch 4.10.2
// (October 2026). Ships, items, parts and contracts are referenced by their ids in the other apps,
// so prices, stats, owned status and contract pay are always read live from those apps' data.
//
// Every claim here that the game data can't confirm is unverified until checked in game. Each
// career has `verified: false` and a list of `sources`. Edit freely; nothing regenerates this file.
//
// Career fields:
//   id, group, name, tagline, summary, description, synopsis
//   group: Combat | Industry | Transport & trade | Support | Exploration & sport | Outlaw
//   style: { team, risk, legality, startCost }   short words for the "at a glance" tiles
//   gettingStarted: [text]                        first steps, in order
//   stages: [{
//     id, name, goal, why
//     ships: [ship id], items: [personal item id], parts: [ship part id]
//     contracts: [{ act, by, rank: [min, max], title, bp, q, label }]
//        act: contracts app activity; by: contractor; rank: required rank range; title: a regular
//        expression the title must match (bounty tiers are in the title, not the rank); q: the
//        contracts app search to link to (built from act, by and rank when left out); bp: true keeps
//        only contracts that can reward a crafting blueprint
//     steps: [{ id, text, own?: [ids], rep?: [contractor, rank] }]
//        own: done when you own any of these (ships: bought or pledged; items/parts: owned)
//        rep: [contractor, rank, track?] done when your rank (in character.js) is at least this. The
//             track defaults to the contractor's main one; name it when there are two (Eckhart)
//        neither: you tick it yourself
//   }]
//   forks: [{ after: stage id, question, options: [{ label, text, ships?: [ids] }] }]
//   thingsToKnow: [{ level: "warn" | "info", text }]
//   links: [{ label, app?: "ships"|"items"|"components"|"contracts"|"locations"|"dashboard", q?, hash?, url? }]
//   sources: [{ label, url }]
//   verified: false until you've checked the guidance in game

window.CAREERS_META = { patch: "4.10.2", gathered: "2026-10-18" };

window.CAREERS = [
  // ───────────────────────────── Bounty hunting ─────────────────────────────
  {
    id: "bounty-hunting",
    group: "Combat",
    name: "Bounty Hunting",
    tagline: "Hunt wanted pilots for the Bounty Hunters Guild, from very-low-risk targets to extreme-risk fleets.",
    summary: "Take bounty contracts, find the target, and destroy it. Pay rises steeply with each risk tier, and each tier is unlocked by a Guild certification contract.",
    description: "Bounty hunting is ship combat with a clear ladder. The Bounty Hunters Guild oversees bounties from Crusader Security, Hurston Security and Northrock Service Group. You start with a training permit that only allows very-low-risk targets (VLRT), then work up through low, medium, high and very-high risk to extreme-risk targets (ERT), which bring escorts and waves of reinforcements. Each step is a certification contract you take once you've done enough bounties. The ship you need grows with the tier: a light fighter is fine to start, a heavy fighter or a crewed gunship is expected at the top.",
    synopsis: "Learn to fly and fight in a starter ship, earn your tracker permit, then climb the Guild's certification ladder, upgrading from a light fighter to a heavy fighter (solo) or a gunship with friends as targets get tougher.",
    style: { team: "Solo to small group", risk: "High", legality: "Lawful (outlaw option)", startCost: "A starter ship" },
    gettingStarted: [
      "Finish the new player tutorial and learn takeoff, quantum travel and landing.",
      "Take a Gilly's Flight School contract or two to practise dogfighting without much risk.",
      "Accept the Tracker Training Permit Certification contract from the Bounty Hunters Guild (rank 0, Applicant).",
      "Do very-low-risk (VLRT) bounties near your home location until the next certification appears.",
      "Keep spare aUEC for repairs, ammo and claims, and set your medical respawn near where you hunt.",
    ],
    stages: [
      {
        id: "learn",
        name: "Learn to fight",
        goal: "Get comfortable in a dogfight and earn the Tracker Training Permit.",
        why: "Low-risk bounties pay little, but losing a ship costs time. Practising first saves money later.",
        ships: ["aurora-mk-ii", "mustang-alpha", "c8x-pisces-expedition"],
        items: ["lh86-pistol", "medpen-hemozal"],
        contracts: [
          { act: "ship-combat", by: "Gilly's Flight School", label: "Flight school practice" },
          { act: "bounty", by: "Bounty Hunters Guild", title: "Tracker Training Permit|Very Low-Risk", q: 'act:bounty "very low"', label: "Training permit and very-low-risk bounties" },
        ],
        steps: [
          { id: "flight-school", text: "Complete a Gilly's Flight School contract" },
          { id: "permit", text: "Complete the Tracker Training Permit Certification", rep: ["Bounty Hunters Guild", 1] },
        ],
      },
      {
        id: "low-risk",
        name: "Low-risk bounties",
        goal: "Clear VLRT and LRT bounties and earn the Beginner's Permit.",
        why: "This is where you learn to keep a target in front of you and when to disengage. An all-rounder with some cargo space also covers early hauling jobs.",
        ships: ["avenger-titan", "arrow", "cutlass-black"],
        parts: ["cf-337-panther-repeater"],
        contracts: [{ act: "bounty", by: "Bounty Hunters Guild", title: "Low-Risk|Beginner's Permit", q: 'act:bounty "low-risk"', label: "Low-risk bounties and the Beginner's Permit" }],
        steps: [
          { id: "first-fighter", text: "Own a ship that can handle low-risk targets", own: ["avenger-titan", "arrow", "cutlass-black", "gladius", "f7c-hornet-mk-ii"] },
          { id: "beginner-permit", text: "Complete the Tracker Beginner's Permit Certification", rep: ["Bounty Hunters Guild", 2] },
        ],
      },
      {
        id: "mid-risk",
        name: "Medium and high risk",
        goal: "Fly MRT and HRT bounties and earn the Tracker License, then the Journeyman license.",
        why: "Targets now have more shields and escorts. Kill speed matters more than survival: a dedicated fighter with upgraded guns pays for itself.",
        ships: ["gladius", "f7c-hornet-mk-ii", "arrow"],
        parts: ["attrition-3-repeater", "cf-337-panther-repeater"],
        contracts: [{ act: "bounty", by: "Bounty Hunters Guild", title: "Moderate-Risk|(?<!Very )High-Risk Target|\\| High Risk|^Tracker License|Journeyman", q: 'act:bounty "high-risk"', label: "Moderate and high-risk bounties, Tracker and Journeyman licenses" }],
        steps: [
          { id: "fighter", text: "Own a dedicated light or medium fighter", own: ["gladius", "f7c-hornet-mk-ii", "arrow", "hawk"] },
          { id: "license", text: "Complete the Tracker License Certification", rep: ["Bounty Hunters Guild", 3] },
          { id: "journeyman", text: "Complete the Journeyman Tracker License Certification", rep: ["Bounty Hunters Guild", 4] },
          { id: "loadout", text: "Plan a weapon and component upgrade for your fighter in the loadout planner" },
        ],
      },
      {
        id: "high-risk",
        name: "Very high risk",
        goal: "Fly VHRT bounties and earn the Advanced Tracker License.",
        why: "VHRT targets come with wingmen. A heavy fighter survives mistakes; a two-seat ship with a gunner kills faster.",
        ships: ["vanguard-warden", "scorpius", "ares-star-fighter-ion", "f7c-m-super-hornet-mk-i"],
        contracts: [{ act: "bounty", by: "Bounty Hunters Guild", title: "Very High-Risk|Very-High Risk|Advanced Tracker", q: 'act:bounty "very high"', label: "Very-high-risk bounties and the Advanced license" }],
        steps: [
          { id: "heavy", text: "Own a heavy fighter", own: ["vanguard-warden", "vanguard-sentinel", "scorpius", "ares-star-fighter-ion", "ares-star-fighter-inferno", "f7c-m-super-hornet-mk-i", "guardian"] },
          { id: "advanced", text: "Complete the Advanced Tracker License Certification", rep: ["Bounty Hunters Guild", 5] },
        ],
      },
      {
        id: "extreme",
        name: "Extreme risk",
        goal: "Take ERT bounties and reach Guild Steward with the Master Tracker License.",
        why: "Extreme-risk targets bring escorts and reinforcement waves. Consistent ERT clears need a crewed gunship or a wing of friends.",
        ships: ["redeemer", "paladin", "hammerhead", "starlancer-tac"],
        contracts: [{ act: "bounty", by: "Bounty Hunters Guild", title: "Extreme|Master Tracker", q: 'act:bounty extreme', label: "Extreme-risk bounties and the Master license" }],
        steps: [
          { id: "master", text: "Complete the Master Tracker License Certification", rep: ["Bounty Hunters Guild", 6] },
          { id: "crew", text: "Fly an ERT bounty with a crew or wing" },
        ],
      },
    ],
    forks: [
      {
        after: "low-risk",
        question: "Lawful bounties, or the Headhunters?",
        options: [
          { label: "Bounty Hunters Guild", text: "The lawful path. Clear certification ladder, payment bonuses with rank, and you stay welcome at stations." },
          { label: "Headhunters", text: "An outlaw gang that offers hits on targets. Quick, well-paid starter contracts, but the work is illegal: expect CrimeStat and fewer safe places to land. Their ranks also unlock ground combat and repair work." },
        ],
      },
      {
        after: "mid-risk",
        question: "Solo heavy fighter, or a ship for two?",
        options: [
          { label: "Solo", text: "A Vanguard Warden or an Ares is forgiving and fights well alone.", ships: ["vanguard-warden", "ares-star-fighter-ion"] },
          { label: "With a gunner", text: "A Scorpius or Cutlass with a friend on the turret kills faster for less money.", ships: ["scorpius", "cutlass-black"] },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "Each risk tier is unlocked by a Bounty Hunters Guild certification contract (Tracker Training Permit, Beginner's Permit, Tracker License, Journeyman, Advanced, Master). They show up once you've done enough bounties at the tier below." },
      { level: "warn", text: "Failing contracts lowers your reputation and can demote you." },
      { level: "info", text: "Energy weapons need fewer rearm stops than ballistic ones, which helps chain bounties." },
      { level: "warn", text: "Lawful bounties need a low CrimeStat. Outlaw work (Headhunters) can lock you out of some stations." },
    ],
    links: [
      { label: "Bounty contracts", app: "contracts", q: "act:bounty" },
      { label: "Combat ships on the value map (pilot DPS)", app: "ships", hash: "value" },
      { label: "Gun trade-offs", app: "components", hash: "tradeoffs" },
      { label: "Bounty hunting on the Star Citizen Wiki", url: "https://starcitizen.tools/Bounty_hunting" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Bounty hunting", url: "https://starcitizen.tools/Bounty_hunting" },
      { label: "BoostRoom bounty hunting guide (March 2026)", url: "https://boostroom.com/blog/star-citizen-bounty-hunting-guide-ships-loadouts-tips" },
      { label: "Contracts app data (ranks, rewards, pay per hour)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Cargo hauling ─────────────────────────────
  {
    id: "cargo-hauling",
    group: "Transport & trade",
    name: "Cargo Hauling & Trading",
    tagline: "Move freight for Red Wind, Covalex and Ling Family, from 1 SCU boxes to thousands of SCU across systems.",
    summary: "Carry cargo between stations, outposts and cities. Each hauling company has its own rank ladder; higher ranks unlock bigger boxes, longer routes and much bigger pay.",
    description: "Hauling is low risk and steady. You pick up contract cargo from the freight elevator in your hangar, load it with a tractor beam, fly it to the destination and unload it at their elevator. Contracts are sized by the largest box and by the route: direct, planetary, across the system, or between systems. The biggest limit is your ship: each contract lists the largest box it uses, which must fit your cargo grid. You can also trade commodities without a contract, buying low and selling high, which is more profitable and riskier.",
    synopsis: "Start with deliveries in any ship, buy a small hauler for Trainee and Rookie work, step up to a medium freighter as your rank opens medium hauls, then a large freighter for Experienced and Senior contracts, and finally a Hull C for Master and interstellar freight.",
    style: { team: "Solo", risk: "Low", legality: "Lawful", startCost: "A ship with a few SCU" },
    gettingStarted: [
      "Get a tractor beam: the multi-tool's tractor attachment works for small boxes, the MaxLift tractor beam for larger ones.",
      "Do a few delivery contracts (small packages, any ship) to learn the freight elevator and pick-up flow.",
      "Accept the Trainee contract from Red Wind Linehaul, Covalex or Ling Family Hauling.",
      "Stick to one company: each has its own rank, and higher ranks show bigger contracts.",
      "Stack several contracts going to the same destination once your rank allows it.",
    ],
    stages: [
      {
        id: "deliveries",
        name: "Deliveries",
        goal: "Learn the pick-up, loading and freight elevator flow with small packages.",
        why: "Deliveries are quick, low risk and need no cargo ship: your starter ship is enough.",
        items: ["pyro-ryt-multi-tool", "truhold-tractor-beam-attachment"],
        contracts: [
          { act: "delivery", by: "Covalex Independent Contractors", rank: [0, 1], label: "Covalex deliveries" },
          { act: "delivery", by: "FTL Courier", label: "FTL Courier" },
        ],
        steps: [
          { id: "tractor", text: "Own a tractor beam", own: ["truhold-tractor-beam-attachment", "maxlift-tractor-beam"] },
          { id: "delivery", text: "Complete a few delivery contracts" },
        ],
      },
      {
        id: "small-hauler",
        name: "First hauler",
        goal: "Reach Rookie and Junior with one hauling company.",
        why: "Extra-small and small hauls use 1–4 SCU boxes. A small multi-role ship with a cargo grid is enough, and doubles as a combat or mining transport later.",
        ships: ["avenger-titan", "nomad", "cutlass-black", "hull-a", "golem-ox"],
        items: ["maxlift-tractor-beam"],
        contracts: [
          { act: "hauling", by: "Red Wind Linehaul", rank: [0, 2], label: "Red Wind, Trainee to Junior" },
          { act: "hauling", by: "Ling Family Hauling", rank: [0, 1], label: "Ling Family, Trainee" },
        ],
        steps: [
          { id: "hauler", text: "Own a ship with a cargo grid", own: ["avenger-titan", "nomad", "cutlass-black", "hull-a", "golem-ox", "freelancer", "freelancer-max"] },
          { id: "rookie", text: "Reach Rookie with Red Wind Linehaul", rep: ["Red Wind Linehaul", 1] },
          { id: "junior", text: "Reach Junior with Red Wind Linehaul", rep: ["Red Wind Linehaul", 2] },
        ],
      },
      {
        id: "medium",
        name: "Medium freight",
        goal: "Reach Member and Experienced.",
        why: "Medium hauls use 8–16 SCU boxes and run up to a few hundred SCU. A freighter with 100–200 SCU lets you take one full contract or stack several.",
        ships: ["freelancer-max", "raft", "starlancer-max", "constellation-mk-iv-taurus"],
        contracts: [{ act: "hauling", by: "Red Wind Linehaul", rank: [2, 4], label: "Red Wind, Junior to Experienced" }],
        steps: [
          { id: "medium-ship", text: "Own a medium freighter (100+ SCU)", own: ["freelancer-max", "raft", "starlancer-max", "constellation-mk-iv-taurus", "mercury-star-runner"] },
          { id: "member", text: "Reach Member", rep: ["Red Wind Linehaul", 3] },
          { id: "experienced", text: "Reach Experienced", rep: ["Red Wind Linehaul", 4] },
        ],
      },
      {
        id: "large",
        name: "Large freight",
        goal: "Reach Senior with 32 SCU containers and 600+ SCU hauls.",
        why: "Large hauls use 32 SCU boxes. The C2 Hercules is the common choice: its big open cargo bay and ramp take large containers.",
        ships: ["c2-hercules-starlifter", "caterpillar"],
        contracts: [{ act: "hauling", by: "Red Wind Linehaul", rank: [4, 5], label: "Red Wind, Experienced to Senior" }],
        steps: [
          { id: "large-ship", text: "Own a large freighter", own: ["c2-hercules-starlifter", "caterpillar", "hull-c"] },
          { id: "senior", text: "Reach Senior", rep: ["Red Wind Linehaul", 5] },
        ],
      },
      {
        id: "master",
        name: "Master and interstellar",
        goal: "Reach Master and haul between systems.",
        why: "The top contracts move thousands of SCU. The Hull C carries 4,608 SCU on its external spindle.",
        ships: ["hull-c"],
        contracts: [{ act: "hauling", by: "Red Wind Linehaul", rank: [5, 6], label: "Red Wind, Senior to Master" }, { act: "hauling", by: "Covalex Independent Contractors", rank: [6, 6], label: "Covalex Master hauls" }],
        steps: [
          { id: "hull-c", text: "Own a Hull C", own: ["hull-c"] },
          { id: "master", text: "Reach Master", rep: ["Red Wind Linehaul", 6] },
        ],
      },
    ],
    forks: [
      {
        after: "small-hauler",
        question: "Contracts, or trading commodities?",
        options: [
          { label: "Hauling contracts", text: "Guaranteed pay and no money at risk in the cargo. Pay and box sizes are set by your rank." },
          { label: "Trading", text: "Buy commodities and sell where they're worth more. Bigger margins, but your aUEC is in the hold: a crash or a pirate loses it. Judge routes by profit per minute, not per run." },
        ],
      },
      {
        after: "medium",
        question: "Which company to rank up with?",
        options: [
          { label: "Red Wind Linehaul", text: "The most hauling contracts in the data, with a full rank ladder from Trainee to Master." },
          { label: "Covalex or Ling Family", text: "Their own rank ladders and routes. Covalex also offers delivery contracts that build its standing." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Each contract lists the largest box it uses. Check it fits your ship's cargo grid before accepting." },
      { level: "info", text: "Delivering part of the cargo pays part of the reward (see each contract's partial pay table in the contracts app)." },
      { level: "info", text: "Once a company ranks you up, it may stop offering its lower-rank contracts." },
      { level: "warn", text: "Hauling contracts need a low CrimeStat so you can enter both stations." },
    ],
    links: [
      { label: "Hauling contracts", app: "contracts", q: "act:hauling" },
      { label: "Cargo ships on the value map", app: "ships", hash: "value" },
      { label: "Where to shop", app: "dashboard", hash: "shop" },
      { label: "Hauling on the Star Citizen Wiki", url: "https://starcitizen.tools/Hauling" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Hauling", url: "https://starcitizen.tools/Hauling" },
      { label: "Tribality: Covalex hauling guide (4.8)", url: "https://www.tribality.com/?p=37505" },
      { label: "expcarry: Star Citizen trading guide 2026", url: "https://expcarry.com/star-citizen-best-cargo-routes" },
      { label: "Contracts app data (ranks, rewards, pay per hour)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Mining ─────────────────────────────
  {
    id: "mining",
    group: "Industry",
    name: "Mining",
    tagline: "From hand-mining gems in caves to running a three-head MOLE with a crew.",
    summary: "Find rocks with valuable ore, break them with a laser, collect the ore and sell it raw or refined. Shubin Interstellar buys ore through purchase-order contracts with its own rank ladder.",
    description: "Mining comes in three sizes. Hand mining uses a multi-tool with an OreBit attachment to chip gems in caves. Vehicle mining uses the Greycat ROC on planet surfaces for crystalline gem nodes. Ship mining uses a Golem, Prospector or MOLE on asteroids and surface rocks: you scan a rock, apply laser power until it's in the green window, fracture it and extract the ore. Lasers and modules change how easily rocks break. You can sell ore raw or refine it at a station refinery for more value, after a wait and a fee.",
    synopsis: "Hand-mine gems to learn scanning, buy a ROC for surface gems, step up to a Golem or Prospector to mine ore solo, upgrade its laser and modules, then crew a MOLE for the biggest rocks and best hourly pay.",
    style: { team: "Solo, best with a crew at the top", risk: "Low to medium", legality: "Lawful", startCost: "A multi-tool and backpack" },
    gettingStarted: [
      "Buy a Pyro RYT Multi-Tool, an OreBit mining attachment and a backpack to carry gems.",
      "Find a cave on a moon (Daymar, Aberdeen, Lyria and Wala are popular) and hand-mine gems.",
      "Sell the gems at a commodity terminal, or hand them in for a Shubin hand-mined purchase order.",
      "Save for a ROC, or a Golem if you want to go straight to ship mining.",
    ],
    stages: [
      {
        id: "hand",
        name: "Hand mining",
        goal: "Learn scanning and the fracture window with almost no money at risk.",
        why: "It costs a few hundred aUEC and teaches the same charge-and-fracture mechanic the ships use. Any ship gets you to the cave.",
        items: ["pyro-ryt-multi-tool", "orebit-mining-attachment", "macflex-backpack-grey"],
        contracts: [{ act: "mining", by: "Shubin Interstellar", rank: [0, 0], label: "Shubin hand-mined orders" }],
        steps: [
          { id: "orebit", text: "Own an OreBit mining attachment", own: ["orebit-mining-attachment"] },
          { id: "first-gems", text: "Hand-mine and sell your first gems" },
        ],
      },
      {
        id: "roc",
        name: "Ground vehicle mining",
        goal: "Mine surface gem nodes with a ROC.",
        why: "The ROC breaks nodes too big for a hand tool. It has no quantum drive, so you fly it out in a ship with a vehicle bay or a big enough cargo hold.",
        ships: ["roc", "roc-ds", "cutlass-black", "nomad"],
        contracts: [{ act: "mining", by: "Shubin Interstellar", rank: [1, 1], label: "Shubin vehicle-mined orders" }],
        steps: [
          { id: "roc", text: "Own a ROC or ROC-DS", own: ["roc", "roc-ds"] },
          { id: "shubin-1", text: "Reach Jr. Contractor with Shubin", rep: ["Shubin Interstellar", 1] },
        ],
      },
      {
        id: "solo-ship",
        name: "Solo ship mining",
        goal: "Mine asteroids and surface rocks alone in a Golem or Prospector.",
        why: "One pilot, one size 1 laser. The Golem is the cheapest entry; the Prospector carries more and is the classic solo miner.",
        ships: ["golem", "prospector"],
        parts: ["helix-i-mining-laser", "lancet-mh1-mining-laser", "surge-module", "focus-module", "rime-module"],
        contracts: [{ act: "mining", by: "Shubin Interstellar", rank: [1, 3], label: "Shubin ship-mined orders" }],
        steps: [
          { id: "ship", text: "Own a Golem or Prospector", own: ["golem", "prospector"] },
          { id: "laser", text: "Upgrade the mining laser (plan it in the loadout planner)", own: ["helix-i-mining-laser", "lancet-mh1-mining-laser", "hofstede-s1-mining-laser", "klein-s1-mining-laser"] },
          { id: "refine", text: "Refine a load at a station refinery and compare it with selling raw" },
          { id: "shubin-3", text: "Reach Sr. Contractor with Shubin", rep: ["Shubin Interstellar", 3] },
        ],
      },
      {
        id: "crew",
        name: "Crewed mining",
        goal: "Run a MOLE with friends on its three size 2 lasers.",
        why: "Three lasers break the biggest, most valuable rocks and fill the hold far faster. It's hard to run alone.",
        ships: ["mole"],
        parts: ["helix-ii-mining-laser", "lancet-mh2-mining-laser", "hofstede-s2-mining-laser"],
        contracts: [{ act: "mining", by: "Shubin Interstellar", rank: [3, 5], label: "Shubin large and special orders" }],
        steps: [
          { id: "mole", text: "Own a MOLE", own: ["mole"] },
          { id: "shubin-5", text: "Reach Head Contractor with Shubin", rep: ["Shubin Interstellar", 5] },
        ],
      },
    ],
    forks: [
      {
        after: "hand",
        question: "ROC first, or straight to a ship?",
        options: [
          { label: "ROC", text: "Cheap and good money from surface gems, but you need a ship to carry it.", ships: ["roc"] },
          { label: "Golem", text: "Skip vehicles and learn ship mining right away. Costs about ten times more.", ships: ["golem"] },
        ],
      },
      {
        after: "solo-ship",
        question: "Stay solo, or mine with a crew?",
        options: [
          { label: "Solo", text: "Keep the Prospector and upgrade its laser and modules.", ships: ["prospector"] },
          { label: "Crew", text: "A MOLE with two friends earns the most per hour. Recco Battaglia at Levski offers a reward chain that, by community reports, can earn the Golem, Prospector and MOLE.", ships: ["mole"] },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Quantanium is the most valuable ore but becomes unstable and can explode if you hold it too long. Sell it quickly." },
      { level: "info", text: "Refining raises the value of most ores for a fee and a wait. Quantanium is usually sold raw." },
      { level: "warn", text: "The ROC has had a long-running laser alignment bug (reportedly improved in 4.9)." },
      { level: "info", text: "Shubin's purchase orders ask for specific ores. The contracts app can't show pay per hour for mining, because players' times only cover the hand-in." },
    ],
    links: [
      { label: "Mining contracts", app: "contracts", q: "act:mining" },
      { label: "Mining laser trade-offs", app: "components", hash: "tradeoffs" },
      { label: "Plan a Prospector loadout", app: "components", hash: "plan=prospector" },
      { label: "Mining on the Star Citizen Wiki", url: "https://starcitizen.tools/Mining" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Mining", url: "https://starcitizen.tools/Mining" },
      { label: "timesaver.gg: best mining ship (4.9)", url: "https://timesaver.gg/blog/star-citizen-best-mining-ship-alpha-4-9" },
      { label: "expcarry: mining guide", url: "https://expcarry.com/star-citizen-mining-guide" },
      { label: "Contracts app data (Shubin and Recco Battaglia ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Salvage ─────────────────────────────
  {
    id: "salvage",
    group: "Industry",
    name: "Salvage",
    tagline: "Scrape wrecks for RMC, from a multi-tool to a crewed Reclaimer.",
    summary: "Strip ship hulls with salvage beams to collect Recycled Material Composite (RMC), then sell it or fill Adagio Holdings orders. Larger ships also break wrecks down for construction materials.",
    description: "Hull scraping turns a wreck's surface into RMC, which you sell at commodity terminals or use for repairs. You can start on foot with a multi-tool and the Cambio-Lite SRT attachment, but a salvage ship is where the money is. The Vulture is the standard solo salvager. The Reclaimer adds a claw and disintegrator for structural salvage and far more storage, with a crew. Wrecks come from salvage contracts, from ships destroyed in fights, and from abandoned derelicts. Scraper modules trade speed against yield.",
    synopsis: "Learn hull scraping on foot, buy a Vulture to scrape solo, tune its scraper modules for speed or yield, then move to a Reclaimer with a crew for structural salvage and big Adagio orders.",
    style: { team: "Solo, crew at the top", risk: "Low", legality: "Lawful (check ownership)", startCost: "A multi-tool and attachment" },
    gettingStarted: [
      "Buy a Pyro RYT Multi-Tool and a Cambio-Lite SRT attachment (Dumper's Depot or Platinum Bay sell them).",
      "Scrape a small wreck by hand to learn how the beam works.",
      "Take Adagio Holdings' small RMC orders when you have a salvage ship.",
      "Before scraping a ship, scan it: if a player owns it, scraping can be a crime.",
    ],
    stages: [
      {
        id: "hand",
        name: "Hand salvage",
        goal: "Learn hull scraping with a multi-tool.",
        why: "Slow and low volume, but almost free.",
        items: ["pyro-ryt-multi-tool", "cambio-lite-srt-attachment"],
        steps: [
          { id: "cambio", text: "Own a Cambio-Lite SRT attachment", own: ["cambio-lite-srt-attachment"] },
          { id: "scrape", text: "Scrape a wreck by hand" },
        ],
      },
      {
        id: "light",
        name: "Light salvage ship",
        goal: "Scrape wrecks solo and fill small Adagio orders.",
        why: "The Salvation and Fortune are cheaper ways in; the Vulture is the standard solo salvager with its own storage.",
        ships: ["salvation", "fortune", "vulture"],
        parts: ["abrade-scraper-module", "cinch-scraper-module", "trawler-scraper-module"],
        contracts: [{ act: "salvage", by: "Adagio Holdings", rank: [0, 1], label: "Adagio small and medium orders" }],
        steps: [
          { id: "ship", text: "Own a salvage ship", own: ["salvation", "fortune", "vulture"] },
          { id: "vulture", text: "Own a Vulture", own: ["vulture"] },
          { id: "adagio-1", text: "Reach Jr. Contractor with Adagio Holdings", rep: ["Adagio Holdings", 1] },
          { id: "sell", text: "Sell a full load of RMC" },
        ],
      },
      {
        id: "heavy",
        name: "Crewed salvage",
        goal: "Run a Reclaimer with a crew for structural salvage and large orders.",
        why: "The Reclaimer's claw and disintegrator break whole wrecks down, and its hold takes large orders. It's clumsy alone.",
        ships: ["reclaimer"],
        contracts: [{ act: "salvage", by: "Adagio Holdings", rank: [2, 2], label: "Adagio large orders" }],
        steps: [
          { id: "reclaimer", text: "Own a Reclaimer", own: ["reclaimer"] },
          { id: "adagio-2", text: "Reach Contractor with Adagio Holdings", rep: ["Adagio Holdings", 2] },
        ],
      },
    ],
    forks: [
      {
        after: "light",
        question: "Speed or yield?",
        options: [
          { label: "Trawler", text: "Wide beam, fast, but heat burns off more material." },
          { label: "Abrade", text: "The all-rounder." },
          { label: "Cinch", text: "Narrow beam, slower, most RMC per hull. Swap to it on valuable wrecks." },
        ],
      },
      {
        after: "light",
        question: "Stay with the Vulture, or crew a Reclaimer?",
        options: [
          { label: "Vulture", text: "Simple and solo. Pairs well with bounty hunting: salvage what you shoot down.", ships: ["vulture"] },
          { label: "Reclaimer", text: "Much more storage and structural salvage, but needs friends to be efficient.", ships: ["reclaimer"] },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Scan intact ships first. If the owner is a player, scraping it can earn you a CrimeStat." },
      { level: "info", text: "Intact ships with shields up can't be scraped. Distortion weapons power them down first." },
      { level: "warn", text: "Sell RMC before logging off: loose cargo isn't guaranteed to survive a crash." },
      { level: "info", text: "Selling filled multi-tool canisters isn't worth it; use them for repairs instead." },
    ],
    links: [
      { label: "Salvage contracts", app: "contracts", q: "act:salvage" },
      { label: "Plan a Vulture loadout", app: "components", hash: "plan=vulture" },
      { label: "Salvaging guide on the Star Citizen Wiki", url: "https://starcitizen.tools/Guide:Salvaging" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Guide: Salvaging", url: "https://starcitizen.tools/Guide:Salvaging" },
      { label: "timesaver.gg: salvage guide (4.10)", url: "https://timesaver.gg/blog/star-citizen-salvage-guide-alpha-4-10" },
      { label: "Contracts app data (Adagio Holdings ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Mercenary ─────────────────────────────
  {
    id: "mercenary",
    group: "Combat",
    name: "Mercenary (FPS)",
    tagline: "Clear bunkers and outposts on foot, from first defend contracts to XenoThreat campaigns.",
    summary: "Fight on foot for security firms and civic groups: clear bunkers, defend sites, take out named targets and sabotage equipment. Gear and ammo matter more than the ship.",
    description: "Mercenary work is first-person combat. Citizens for Prosperity, Eckhart Security and Foxwell Enforcement offer lawful work; the Headhunters offer outlaw jobs. Each has a rank ladder, with harder and better-paid contracts higher up, ending in XenoThreat campaigns. You need armor sized to the job, a primary weapon you know, spare magazines and medpens, plus a ship to get there. Bunkers also drop weapons and armor, which is how many players kit themselves out early.",
    synopsis: "Kit out cheaply and learn on easy defend contracts, move into bunkers with medium armor and a reliable rifle, rank up with one firm, then lead group operations against XenoThreat with heavy armor and a dropship.",
    style: { team: "Solo to squad", risk: "High", legality: "Lawful (outlaw option)", startCost: "Armor, a rifle and medpens" },
    gettingStarted: [
      "Buy a cheap loadout: undersuit and helmet, light or medium armor, one rifle with spare magazines, a pistol and medpens.",
      "Set your medical respawn near where you'll fight.",
      "Take a Citizens for Prosperity defend contract or an Eckhart Security evaluation.",
      "Loot what you can carry from bunkers to upgrade your kit, but keep good gear in storage until you know the death and recovery loop.",
    ],
    stages: [
      {
        id: "kit",
        name: "First kit",
        goal: "Survive your first defend and clear contracts.",
        why: "A cheap, disposable loadout keeps losses small while you learn. Your starter ship gets you there.",
        items: ["p4-ar-rifle", "lh86-pistol", "medpen-hemozal", "orc-mkx-core-arctic"],
        contracts: [
          { act: "ground-combat", by: "Citizens for Prosperity", rank: [0, 0], label: "CFP, Neutral" },
          { act: "ground-combat", by: "Eckhart Security", rank: [0, 0], label: "Eckhart evaluation" },
        ],
        steps: [
          { id: "rifle", text: "Own a primary weapon", own: ["p4-ar-rifle", "karna-rifle", "fs-9-lmg", "arrowhead-sniper-rifle"] },
          { id: "armor", text: "Own a core armor piece", own: ["orc-mkx-core-arctic", "inquisitor-core", "morozov-sh-core"] },
          { id: "first", text: "Complete a defend or clear contract" },
        ],
      },
      {
        id: "bunkers",
        name: "Bunkers",
        goal: "Clear bunkers reliably and reach Contractor rank.",
        why: "Bunkers are the bread and butter: several armed enemies, loot, and turrets that don't fire at you on foot.",
        items: ["inquisitor-core", "karna-rifle", "fs-9-lmg"],
        contracts: [
          { act: "ground-combat", by: "Eckhart Security", rank: [1, 2], label: "Eckhart Security Trainee to Jr." },
          { act: "ground-combat", by: "Citizens for Prosperity", rank: [1, 2], label: "CFP Jr. Contractor to Contractor" },
        ],
        steps: [
          { id: "eckhart", text: "Reach Security Trainee with Eckhart Security", rep: ["Eckhart Security", 1, "Security"] },
          { id: "cfp-2", text: "Reach Contractor with Citizens for Prosperity", rep: ["Citizens for Prosperity", 2] },
        ],
      },
      {
        id: "veteran",
        name: "Veteran contractor",
        goal: "Take Sr. and Veteran contracts with heavy armor and a dropship.",
        why: "Higher ranks bring tougher, better-armed enemies and multi-site jobs. A dropship gets a squad in and out.",
        ships: ["cutlass-steel", "cutlass-black"],
        items: ["morozov-sh-core", "arrowhead-sniper-rifle"],
        contracts: [{ act: "ground-combat", by: "Citizens for Prosperity", rank: [3, 4], label: "CFP Sr. to Veteran" }],
        steps: [
          { id: "heavy", text: "Own heavy armor", own: ["morozov-sh-core"] },
          { id: "cfp-4", text: "Reach Veteran Contractor with Citizens for Prosperity", rep: ["Citizens for Prosperity", 4] },
        ],
      },
      {
        id: "campaign",
        name: "Campaigns",
        goal: "Lead squad operations against XenoThreat.",
        why: "The top ground contracts are multi-stage campaigns built for groups.",
        ships: ["valkyrie", "asgard", "vanguard-hoplite"],
        contracts: [{ act: "ground-combat", by: "Citizens for Prosperity", rank: [5, 5], label: "CFP Head Contractor" }],
        steps: [
          { id: "cfp-5", text: "Reach Head Contractor with Citizens for Prosperity", rep: ["Citizens for Prosperity", 5] },
          { id: "squad", text: "Complete a campaign with a squad" },
        ],
      },
    ],
    forks: [
      {
        after: "kit",
        question: "Lawful or outlaw?",
        options: [
          { label: "Lawful", text: "Citizens for Prosperity, Eckhart Security and Foxwell Enforcement. Safe to land anywhere." },
          { label: "Headhunters", text: "The most ground contracts in the data, up to Elite Contractor, but the work is illegal and you'll operate from outlaw stations." },
        ],
      },
      {
        after: "bunkers",
        question: "Assault or marksman?",
        options: [
          { label: "Assault", text: "Rifle or LMG, medium to heavy armor, close-quarters bunkers." },
          { label: "Marksman", text: "A sniper rifle clears outposts from range before you move in. Lighter armor for mobility." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Don't take combat contracts without a weapon you know, spare magazines and medpens." },
      { level: "info", text: "Bunker turrets fire at ships, not at you on foot. Land a little away and walk in." },
      { level: "warn", text: "Keep your best gear in storage until you're used to dying and recovering your body." },
    ],
    links: [
      { label: "Ground combat contracts", app: "contracts", q: "act:ground-combat" },
      { label: "Armor and weapons", app: "items", q: "is:armor" },
      { label: "Armor temperature coverage", app: "items", hash: "temperature" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Remove Illegal Occupants", url: "https://starcitizen.tools/Remove_Illegal_Occupants" },
      { label: "expcarry: beginner guide 2026", url: "https://expcarry.com/star-citizen-beginner-guide-2026" },
      { label: "expcarry: best armor guide", url: "https://expcarry.com/star-citizen-best-armor-guide" },
      { label: "Contracts app data (CFP, Eckhart, Headhunters ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Medical ─────────────────────────────
  {
    id: "medical",
    group: "Support",
    name: "Medical & Rescue",
    tagline: "Answer rescue beacons and run mobile hospitals, from a ParaMed to an Apollo.",
    summary: "Revive and treat injured players, ferry them to medical beds, and give your group a place to respawn. Income comes mostly from rescue beacons, so it pairs well with another career.",
    description: "When a player is incapacitated, they can send a rescue beacon that pays the rescuer when they're revived or delivered to a medical facility. On site you stabilise and revive with medpens and a medical tool. Ships with medical beds treat injuries by tier: Tier 3 beds handle minor injuries, Tier 2 moderate, Tier 1 everything, and beds can also be set as a respawn point within range. That makes a medical ship valuable to any group doing combat. There are few medical contracts in the data, so most medics also fly combat, salvage or exploration.",
    synopsis: "Carry medpens and a medical tool, answer beacons in a small rescue ship, move to a Cutlass Red or Terrapin Medic for more beds and armor, then run an Apollo as your group's hospital and respawn point.",
    style: { team: "Solo responder, best supporting a group", risk: "Medium", legality: "Lawful", startCost: "Medpens and a small ship" },
    gettingStarted: [
      "Buy a ParaMed medical device and Hemozal medpens.",
      "Learn what the injury tiers mean and which beds treat them.",
      "Watch the Contracts Manager for Beacon missions near you.",
      "Fly a small, fast ship to beacons. A C8R Pisces Rescue has a Tier 3 bed.",
    ],
    stages: [
      {
        id: "first-aid",
        name: "First aid",
        goal: "Revive players on site.",
        why: "Hemozal stops bleeding and revives incapacitated players. A medical tool lets you dose drugs precisely.",
        items: ["paramed-medical-device", "medpen-hemozal"],
        steps: [
          { id: "paramed", text: "Own a ParaMed medical device", own: ["paramed-medical-device"] },
          { id: "beacon", text: "Answer a rescue beacon" },
        ],
      },
      {
        id: "rescue",
        name: "Rescue ship",
        goal: "Pick up patients and treat minor injuries in your own ship.",
        why: "A Tier 3 bed stabilises and treats minor injuries and can be a respawn point nearby.",
        ships: ["c8r-pisces-rescue", "ursa-medivac", "cutlass-red"],
        steps: [
          { id: "medship", text: "Own a ship or vehicle with a medical bed", own: ["c8r-pisces-rescue", "ursa-medivac", "cutlass-red", "terrapin-medic", "apollo-triage", "apollo-medivac"] },
          { id: "deliver", text: "Deliver a patient to a medical facility" },
        ],
      },
      {
        id: "combat-medic",
        name: "Combat medic",
        goal: "Support a group in combat with armor and better beds.",
        why: "The Cutlass Red has two Tier 3 beds and some armor; the Terrapin Medic has a Tier 2 bed for moderate injuries and heavy armor.",
        ships: ["cutlass-red", "terrapin-medic"],
        steps: [
          { id: "t2", text: "Own a ship with a Tier 2 bed", own: ["terrapin-medic", "apollo-triage", "apollo-medivac"] },
          { id: "group", text: "Fly medical support for a group operation" },
        ],
      },
      {
        id: "hospital",
        name: "Mobile hospital",
        goal: "Run an Apollo as your group's hospital and respawn point.",
        why: "The Apollo carries Tier 1 beds that treat every injury and work as a respawn point from very far away.",
        ships: ["apollo-triage", "apollo-medivac"],
        steps: [
          { id: "apollo", text: "Own an Apollo", own: ["apollo-triage", "apollo-medivac"] },
          { id: "respawn", text: "Set up your Apollo as a respawn point for a group" },
        ],
      },
    ],
    forks: [
      {
        after: "rescue",
        question: "What do you pair medical with?",
        options: [
          { label: "Combat medic", text: "Join mercenary or bounty groups. A Cutlass Red or Terrapin Medic keeps the squad fighting.", ships: ["cutlass-red", "terrapin-medic"] },
          { label: "Explorer-medic", text: "Exploration ships go far from hospitals. A ship with a bed is your own safety net." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Rescue beacon pay has changed over time: CIG's 4.3.1 medical guide says 15,000 aUEC, the Star Citizen Wiki says 50,000 aUEC from the patient's account. Check in game." },
      { level: "info", text: "Every drug raises your blood drug level (BDL). At 50% you overdose. Resurgera lowers it." },
      { level: "info", text: "Tier 3 beds treat minor injuries, Tier 2 moderate, Tier 1 all. A bed can't treat injuries above its tier, but it can stabilise them." },
      { level: "warn", text: "There are almost no medical contracts in the contracts data, so plan on beacons or group support for income." },
    ],
    links: [
      { label: "Medical items", app: "items", q: "type:medical" },
      { label: "Medical ships", app: "ships", q: "role:medical" },
      { label: "Medical on the Star Citizen Wiki", url: "https://starcitizen.tools/Medical" },
    ],
    sources: [
      { label: "CIG: Medical Gameplay Guide (4.3.1)", url: "https://robertsspaceindustries.com/comm-link/transmission/20750" },
      { label: "Star Citizen Wiki: Medical", url: "https://starcitizen.tools/Medical" },
      { label: "starcitizenhelp: Medical gameplay guide (2026)", url: "https://starcitizenhelp.com/game-guides/medical-gameplay" },
    ],
    verified: false,
  },

  // ───────────────────────────── Exploration ─────────────────────────────
  {
    id: "exploration",
    group: "Exploration & sport",
    name: "Exploration & Investigation",
    tagline: "Find missing people, wrecks and ore for Hockrow Agency and Recco Battaglia, deeper into Pyro and Nyx.",
    summary: "Search for missing people, black boxes and lost cargo, scout for other players, and travel far from help. Investigation contracts from Hockrow Agency, Vaughn and Recco Battaglia pay for it.",
    description: "Exploration is about finding things and getting there and back. Investigation contracts send you to locate missing people, crews and ships, recover data, and find out what happened, often with some combat at the end. Hockrow Agency's missing-person cases climb from easy, non-combat searches to multi-stop cases in Nyx. Recco Battaglia's work at Levski mixes prospecting, mining and recovery. You'll want good scanning, quantum range, an exploration suit rated for harsh temperatures, and eventually a ship you can live in.",
    synopsis: "Start with short missing-person cases in a small pathfinder, kit out for extreme environments, move to a tougher scanning ship for longer cases in Pyro and Nyx, then take an expedition ship you can live aboard.",
    style: { team: "Solo", risk: "Medium, higher in Pyro and Nyx", legality: "Lawful", startCost: "A small pathfinder" },
    gettingStarted: [
      "Take an easy Hockrow Agency 'Locate Missing Person' case. They're short and mostly non-combat.",
      "Buy an exploration suit rated for the temperatures you'll visit (use the items app's Temperature tab).",
      "Learn to use your ship's scanner and to find points of interest on the starmap.",
      "Learn Stanton before heading to Pyro or Nyx, where help is far away.",
    ],
    stages: [
      {
        id: "pathfinder",
        name: "Pathfinder",
        goal: "Complete your first missing-person cases.",
        why: "Small pathfinders are cheap, have decent quantum range and room for a few boxes.",
        ships: ["cutter-scout", "c8x-pisces-expedition", "315p"],
        items: ["pyro-ryt-multi-tool", "medpen-hemozal"],
        contracts: [{ act: "investigation", by: "Hockrow Agency", rank: [0, 1], label: "Hockrow, Neutral to Jr." }],
        steps: [
          { id: "pathfinder", text: "Own a pathfinder", own: ["cutter-scout", "c8x-pisces-expedition", "315p", "cutter", "c8-pisces"] },
          { id: "hockrow-1", text: "Reach Jr. Contractor with Hockrow Agency", rep: ["Hockrow Agency", 1] },
        ],
      },
      {
        id: "kit",
        name: "Kitted for extremes",
        goal: "Survive hostile planets and moons.",
        why: "Exploration suits cover a much wider temperature range than normal armor, and a backpack carries what you recover.",
        items: ["novikov-exploration-suit", "pembroke-exploration-suit", "macflex-backpack-grey"],
        contracts: [{ act: "investigation", by: "Vaughn", rank: [0, 2], label: "Vaughn, Neutral to Contractor" }],
        steps: [
          { id: "suit", text: "Own an exploration suit", own: ["novikov-exploration-suit", "pembroke-exploration-suit"] },
          { id: "hockrow-2", text: "Reach Contractor with Hockrow Agency", rep: ["Hockrow Agency", 2] },
        ],
      },
      {
        id: "scout",
        name: "Deep scout",
        goal: "Take longer cases in Pyro and Nyx.",
        why: "Tougher ships with better scanning and range get you there and back. The Terrapin is heavily armored; the Freelancer DUR and Corsair add cargo and firepower.",
        ships: ["terrapin", "freelancer-dur", "corsair"],
        contracts: [{ act: "investigation", by: "Hockrow Agency", rank: [2, 5], label: "Hockrow, Contractor to Head" }, { act: "investigation", by: "Recco Battaglia", rank: [0, 2], label: "Recco Battaglia" }],
        steps: [
          { id: "scout-ship", text: "Own a long-range scout", own: ["terrapin", "freelancer-dur", "corsair", "carrack", "600i"] },
          { id: "hockrow-5", text: "Reach Head Contractor with Hockrow Agency", rep: ["Hockrow Agency", 5] },
        ],
      },
      {
        id: "expedition",
        name: "Expedition",
        goal: "Live aboard an expedition ship far from civilisation.",
        why: "The Carrack has a medical bay, repair space, a vehicle bay and a snub fighter. The 600i is the more comfortable option.",
        ships: ["carrack", "600i"],
        steps: [{ id: "carrack", text: "Own an expedition ship", own: ["carrack", "600i"] }],
      },
    ],
    forks: [
      {
        after: "pathfinder",
        question: "Investigator or prospector?",
        options: [
          { label: "Investigator", text: "Hockrow Agency's missing-person ladder and Vaughn's cases." },
          { label: "Prospector", text: "Recco Battaglia at Levski: prospecting, mining and recovery, with a reward chain that leads into mining ships." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Pyro and Nyx are lawless. Learn recovery and ship replacement in Stanton first." },
      { level: "info", text: "Hockrow's easy cases are short and non-combat; higher ranks add travel and sometimes enemies." },
      { level: "info", text: "Pay per hour is modest compared with combat and hauling. Explorers often salvage or mine along the way." },
    ],
    links: [
      { label: "Investigation contracts", app: "contracts", q: "act:investigation" },
      { label: "Exploration suits and temperature", app: "items", hash: "temperature" },
      { label: "Exploration ships", app: "ships", q: "career:exploration" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Locate Missing Person missions", url: "https://api.star-citizen.wiki/missions/search-body-space-very-easy" },
      { label: "Contracts app data (Hockrow, Vaughn, Recco Battaglia ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Refueling & repair ─────────────────────────────
  {
    id: "refuel-repair",
    group: "Support",
    name: "Refueling & Repair",
    tagline: "Keep fleets flying: refuel stranded ships for the United Wayfarers Club and fix outposts for Citizens for Prosperity.",
    summary: "Answer refuel requests and fleet refuel contracts, and repair damaged outposts and stations. Support work with a long rank ladder at the United Wayfarers Club.",
    description: "Refueling means flying fuel to ships that need it and transferring it through a docking arm. The United Wayfarers Club offers refuel contracts from single stranded ships up to capital fleets, with a rank ladder from Neutral to Elite Contractor. You need a ship that carries and transfers fuel: the small MISC Starlite, or the Starfarer for big jobs. Repair contracts send you to damaged outposts with a multi-tool. Citizens for Prosperity offer them from minor to extensive repairs, and the Headhunters offer some too.",
    synopsis: "Start with repair contracts on foot, buy a Starlite for small refuels, move up to a Starfarer as the United Wayfarers Club trusts you with convoy and fleet refuels, then run capital fleet refuels at Elite rank.",
    style: { team: "Solo", risk: "Low to medium", legality: "Lawful", startCost: "A multi-tool" },
    gettingStarted: [
      "Take Citizens for Prosperity 'Minor Repairs Needed' contracts with a multi-tool.",
      "Learn how ship fuel works: hydrogen for flight, quantum fuel for jumps.",
      "Buy a refueling ship and take United Wayfarers Club refuel requests.",
      "Transfer hydrogen first, then quantum fuel.",
    ],
    stages: [
      {
        id: "repairs",
        name: "Outpost repairs",
        goal: "Fix outposts for Citizens for Prosperity.",
        why: "Repair contracts need little more than a multi-tool, and pay well per hour at the start.",
        items: ["pyro-ryt-multi-tool"],
        contracts: [{ act: "repair", by: "Citizens for Prosperity", rank: [0, 1], label: "CFP minor repairs" }],
        steps: [
          { id: "multitool", text: "Own a multi-tool", own: ["pyro-ryt-multi-tool"] },
          { id: "cfp-1", text: "Reach Jr. Contractor with Citizens for Prosperity", rep: ["Citizens for Prosperity", 1] },
        ],
      },
      {
        id: "small-refuel",
        name: "Small refueler",
        goal: "Refuel single ships for the United Wayfarers Club.",
        why: "The Starlite is a small refueling ship, far cheaper than a Starfarer.",
        ships: ["starlite"],
        contracts: [{ act: "refueling", by: "United Wayfarers Club", rank: [0, 2], label: "UWC, Neutral to Contractor" }],
        steps: [
          { id: "starlite", text: "Own a refueling ship", own: ["starlite", "starfarer", "starfarer-gemini"] },
          { id: "uwc-2", text: "Reach Contractor with the United Wayfarers Club", rep: ["United Wayfarers Club", 2] },
        ],
      },
      {
        id: "convoy",
        name: "Convoy refueling",
        goal: "Take convoy and fleet refuels.",
        why: "The Starfarer carries far more fuel for multi-ship jobs. The Gemini variant is armored and armed.",
        ships: ["starfarer", "starfarer-gemini"],
        contracts: [{ act: "refueling", by: "United Wayfarers Club", rank: [3, 5], label: "UWC, Sr. to Head" }, { act: "repair", by: "Citizens for Prosperity", rank: [3, 5], label: "CFP moderate to extensive repairs" }],
        steps: [
          { id: "starfarer", text: "Own a Starfarer", own: ["starfarer", "starfarer-gemini"] },
          { id: "uwc-5", text: "Reach Head Contractor with the United Wayfarers Club", rep: ["United Wayfarers Club", 5] },
        ],
      },
      {
        id: "capital",
        name: "Capital fleet refueling",
        goal: "Refuel capital fleets at Elite Contractor rank.",
        why: "The top refuel contracts are the best-paid support work.",
        ships: ["starfarer-gemini"],
        contracts: [{ act: "refueling", by: "United Wayfarers Club", rank: [6, 6], label: "UWC, Elite" }],
        steps: [{ id: "uwc-6", text: "Reach Elite Contractor with the United Wayfarers Club", rep: ["United Wayfarers Club", 6] }],
      },
    ],
    forks: [
      {
        after: "small-refuel",
        question: "Starfarer or Starfarer Gemini?",
        options: [
          { label: "Starfarer", text: "Cheaper, the same fuel capacity.", ships: ["starfarer"] },
          { label: "Gemini", text: "Armored and armed, better for refueling in dangerous places.", ships: ["starfarer-gemini"] },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "Transfer hydrogen first, then quantum fuel." },
      { level: "info", text: "Many refuel contracts don't have enough reported run times for a pay-per-hour figure yet." },
      { level: "warn", text: "Guides from patch 4.8 disagree on the Starfarer's fuel pod layout. Check the ship in game." },
    ],
    links: [
      { label: "Refueling contracts", app: "contracts", q: "act:refueling" },
      { label: "Repair contracts", app: "contracts", q: "act:repair" },
      { label: "Refueling ships", app: "ships", q: "role:refueling" },
    ],
    sources: [
      { label: "MMOPIXEL: refueling missions guide (4.8)", url: "https://www.mmopixel.com/news/star-citizen-4-8-refueling-missions-guide-how-to-become-a-successful-fuel-runner" },
      { label: "citizen-starter-guide: refueling contract finder", url: "https://citizen-starter-guide.com/star-citizen-refueling-contract-finder/" },
      { label: "Contracts app data (United Wayfarers Club, CFP ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ═══════════════════════════ Phase 2 ═══════════════════════════

  // ───────────────────────────── Security & escort ─────────────────────────────
  {
    id: "security-escort",
    group: "Combat",
    name: "Security & Escort",
    tagline: "Protect clients, convoys and stations for Foxwell, Eckhart and InterSec, up to Vanduul patrols.",
    summary: "Lawful ship combat for hire: answer ships under attack, guard VIPs and fuel tanks, patrol dangerous sectors and strike hostile fleets. Three security firms each have a rank ladder up to Head Contractor.",
    description: "Where bounty hunting chases one target, security work defends something: a ship under attack, a VIP's transport, a station's fuel tanks, a patrol route. Foxwell Enforcement grades its contracts Yellow, Orange and Red by danger. Eckhart Security runs protection details from executive escorts to 'Top Tier Operator' jobs. InterSec Defense Solutions sends you on patrols and strikes, including Vanduul hunting grounds. Many of these contracts also reward crafting blueprints. The fights grow from a few pirates to large waves, so the path runs from a light fighter to a heavy fighter or a crewed gunship.",
    synopsis: "Answer ships-under-attack calls in a starter fighter, rank up on protection details, move to a heavy fighter for Red-level and VIP work, then fly InterSec strikes and top-tier protection with a gunship crew.",
    style: { team: "Solo to group", risk: "High", legality: "Lawful", startCost: "A starter fighter" },
    gettingStarted: [
      "Practise at Gilly's Flight School if you're new to dogfighting.",
      "Take Eckhart Security's 'Save Ship' and Foxwell's Yellow Level contracts at Neutral rank.",
      "Pick one or two firms to rank with: each has its own ladder.",
      "Keep missiles for the end of a fight and land to repair and rearm between contracts.",
    ],
    stages: [
      {
        id: "first-calls",
        name: "First calls",
        goal: "Save ships under attack and reach Jr. Contractor.",
        why: "Low-level calls bring a few pirates. They teach target priority and when to leave.",
        ships: ["aurora-mk-ii", "avenger-titan", "arrow", "cutlass-black"],
        contracts: [
          { act: "ship-combat", by: "Eckhart Security", rank: [0, 0], label: "Eckhart, Neutral" },
          { act: "ship-combat", by: "Foxwell Enforcement", rank: [0, 1], label: "Foxwell Yellow and Red calls" },
          { act: "ship-combat", by: "InterSec Defense Solutions", rank: [0, 0], label: "InterSec patrols" },
        ],
        steps: [
          { id: "fighter", text: "Own a combat-capable ship", own: ["aurora-mk-ii", "avenger-titan", "arrow", "cutlass-black", "gladius", "f7c-hornet-mk-ii"] },
          { id: "eckhart-1", text: "Reach Jr. Contractor with Eckhart Security", rep: ["Eckhart Security", 1, "Standing"] },
        ],
      },
      {
        id: "protection",
        name: "Protection details",
        goal: "Guard executives and clients; reach Contractor.",
        why: "Protection contracts pay more and bring bigger groups of attackers. A dedicated fighter with upgraded guns kills faster.",
        ships: ["gladius", "f7c-hornet-mk-ii", "hawk"],
        parts: ["attrition-3-repeater", "cf-337-panther-repeater"],
        contracts: [
          { act: "ship-combat", by: "Eckhart Security", rank: [1, 2], label: "Eckhart protection details" },
          { act: "ship-combat", by: "Foxwell Enforcement", rank: [2, 2], label: "Foxwell Orange level" },
        ],
        steps: [
          { id: "dedicated", text: "Own a dedicated fighter", own: ["gladius", "f7c-hornet-mk-ii", "hawk", "arrow"] },
          { id: "foxwell-2", text: "Reach Contractor with Foxwell Enforcement", rep: ["Foxwell Enforcement", 2] },
        ],
      },
      {
        id: "red-level",
        name: "Red level and VIPs",
        goal: "Take Sr. and Veteran contracts: VIP clients, fuel tanks, high-risk details.",
        why: "Waves get larger and tougher. A heavy fighter survives mistakes; a two-seater with a gunner clears waves faster.",
        ships: ["vanguard-warden", "f7c-m-super-hornet-mk-i", "scorpius", "ares-star-fighter-ion"],
        contracts: [
          { act: "ship-combat", by: "Foxwell Enforcement", rank: [3, 4], label: "Foxwell Sr. to Veteran" },
          { act: "ship-combat", by: "Eckhart Security", rank: [3, 4], label: "Eckhart VIP and high-risk details" },
          { act: "ship-combat", by: "InterSec Defense Solutions", rank: [2, 3], label: "InterSec Vanduul patrols and strike groups" },
        ],
        steps: [
          { id: "heavy", text: "Own a heavy fighter", own: ["vanguard-warden", "vanguard-sentinel", "f7c-m-super-hornet-mk-i", "scorpius", "ares-star-fighter-ion", "ares-star-fighter-inferno", "guardian"] },
          { id: "foxwell-4", text: "Reach Veteran Contractor with Foxwell Enforcement", rep: ["Foxwell Enforcement", 4] },
        ],
      },
      {
        id: "strike",
        name: "Strike groups",
        goal: "Reach Head Contractor and run InterSec strikes and top-tier protection with a crew.",
        why: "The top contracts target whole fleets. A gunship with crewed turrets, or a wing of friends, makes them routine.",
        ships: ["redeemer", "starlancer-tac", "hammerhead", "paladin"],
        contracts: [
          { act: "ship-combat", by: "InterSec Defense Solutions", rank: [4, 5], label: "InterSec Veteran to Head" },
          { act: "ship-combat", by: "Eckhart Security", rank: [5, 5], label: "Eckhart Top Tier Operator" },
          { act: "ship-combat", by: "Foxwell Enforcement", rank: [5, 5], label: "Foxwell Head Contractor" },
        ],
        steps: [
          { id: "gunship", text: "Own a gunship, or fly in a group", own: ["redeemer", "starlancer-tac", "hammerhead", "paladin", "retaliator"] },
          { id: "intersec-5", text: "Reach Head Contractor with InterSec", rep: ["InterSec Defense Solutions", 5] },
        ],
      },
    ],
    forks: [
      {
        after: "first-calls",
        question: "Which firm to rank with?",
        options: [
          { label: "Foxwell Enforcement", text: "The most ship-combat contracts in the data, graded Yellow, Orange and Red. Many reward blueprints." },
          { label: "Eckhart Security", text: "Protection details with steady pay steps up to 'Top Tier Operator'." },
          { label: "InterSec", text: "Fewer contracts but the best pay per hour in the data, including Vanduul patrols." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "Security contracts are a common source of crafting blueprints. The contract details in the contracts app show which ones." },
      { level: "warn", text: "Shooting the wrong ship in a crowded fight can earn you a CrimeStat. Check the target's marker before firing." },
      { level: "info", text: "Pay per hour climbs fast with rank: compare Neutral and Sr. contracts below." },
    ],
    links: [
      { label: "Ship combat contracts", app: "contracts", q: "act:ship-combat" },
      { label: "Combat ships on the value map", app: "ships", hash: "value" },
      { label: "Gun trade-offs", app: "components", hash: "tradeoffs" },
    ],
    sources: [
      { label: "Contracts app data (Foxwell, Eckhart, InterSec ranks and pay)", app: "contracts" },
      { label: "BoostRoom bounty hunting guide (ship and loadout advice)", url: "https://boostroom.com/blog/star-citizen-bounty-hunting-guide-ships-loadouts-tips" },
    ],
    verified: false,
  },

  // ───────────────────────────── Piracy ─────────────────────────────
  {
    id: "piracy",
    group: "Outlaw",
    name: "Piracy",
    tagline: "Stop ships, take their cargo, and work for the Headhunters, from outpost raids to interdiction fleets.",
    summary: "Steal cargo from other ships and outposts, and take outlaw combat contracts from the Headhunters. You'll need to stop targets (interdiction, distortion, EMP), board or tractor their cargo, and sell it where no one asks questions.",
    description: "Piracy is the outlaw counterpart to security work. On the ground you raid outposts and loading pads. In space you pull ships out of quantum travel (a Mantis's quantum snare or another interdiction device), stop them from jumping away, disable them with distortion weapons or an EMP, then board them or haul off their cargo with a tractor beam. Stolen goods sell at outlaw stations like Grim HEX and across Pyro. The Headhunters also offer illegal combat contracts with their own rank ladder. In Stanton every crime raises your CrimeStat; Pyro has no CrimeStat, only reputation with its factions.",
    synopsis: "Start with Headhunters jobs and outpost raids, add distortion weapons to disable instead of destroy, learn interdiction with a Mantis or Cutlass Blue, then run crewed operations with an interdictor, gunships and a hauler for the loot.",
    style: { team: "Small group", risk: "Very high", legality: "Outlaw", startCost: "A combat ship" },
    gettingStarted: [
      "Learn how CrimeStat works: crimes near an active comm array raise it, and level 3+ puts a bounty on you.",
      "Move your base of operations to Pyro or an outlaw station (Grim HEX in Stanton).",
      "Take Headhunters 'Pilot Needs a Hand' and similar contracts at Neutral rank.",
      "Find a crew: piracy works best with an interdictor, someone to disable, and someone to carry the loot.",
    ],
    stages: [
      {
        id: "outlaw",
        name: "Outlaw jobs",
        goal: "Work for the Headhunters and learn to operate from outlaw stations.",
        why: "Headhunters contracts are illegal combat jobs with clear pay steps, and their outposts are safe for outlaws.",
        ships: ["cutlass-black", "avenger-titan", "buccaneer"],
        contracts: [
          { act: "ship-combat", by: "Headhunters", rank: [0, 1], label: "Headhunters, Neutral to Jr." },
          { act: "bounty", by: "Headhunters", label: "Headhunters hits" },
        ],
        steps: [
          { id: "hh-1", text: "Reach Jr. Contractor with the Headhunters", rep: ["Headhunters", 1] },
          { id: "grimhex", text: "Set your home or respawn at an outlaw station" },
        ],
      },
      {
        id: "disable",
        name: "Disable and board",
        goal: "Stop ships without destroying their cargo.",
        why: "Distortion weapons overload power without hull damage, and an EMP knocks out systems in a radius. A boarding-capable ship and a tractor beam take the cargo.",
        ships: ["avenger-warlock", "cutlass-black"],
        parts: ["suckerpunch-cannon", "suckerpunch-l-cannon"],
        items: ["maxlift-tractor-beam", "p4-ar-rifle"],
        contracts: [{ act: "ship-combat", by: "Headhunters", rank: [2, 3], label: "Headhunters, Contractor to Sr." }],
        steps: [
          { id: "distortion", text: "Fit distortion weapons (plan them in the loadout planner)", own: ["suckerpunch-cannon", "suckerpunch-l-cannon", "suckerpunch-xl-cannon"] },
          { id: "board", text: "Board a disabled ship and take its cargo" },
          { id: "hh-3", text: "Reach Sr. Contractor with the Headhunters", rep: ["Headhunters", 3] },
        ],
      },
      {
        id: "interdiction",
        name: "Interdiction",
        goal: "Pull ships out of quantum travel on busy routes.",
        why: "The Mantis's quantum snare forces ships in its range to stop, and its dampener keeps them from jumping away. It has no cargo space, so it needs partners.",
        ships: ["mantis", "cutlass-blue"],
        steps: [
          { id: "interdictor", text: "Own an interdiction ship", own: ["mantis", "cutlass-blue"] },
          { id: "snare", text: "Snare a ship on a quantum route" },
        ],
      },
      {
        id: "fleet",
        name: "Pirate operations",
        goal: "Run crewed operations and reach Head Contractor with the Headhunters.",
        why: "An interdictor, a gunship or fighters to disable, and a hauler to take the loot turn piracy into a business.",
        ships: ["redeemer", "caterpillar", "c2-hercules-starlifter"],
        contracts: [{ act: "ship-combat", by: "Headhunters", rank: [4, 5], label: "Headhunters, Veteran to Head" }],
        steps: [
          { id: "hh-5", text: "Reach Head Contractor with the Headhunters", rep: ["Headhunters", 5] },
          { id: "org", text: "Run an operation with an org or crew" },
        ],
      },
    ],
    forks: [
      {
        after: "outlaw",
        question: "Pyro or Stanton?",
        options: [
          { label: "Pyro", text: "No CrimeStat, only faction reputation. Lawless, with outlaw stations everywhere and other pirates hunting you too." },
          { label: "Stanton", text: "Richer traffic, but every crime near an active comm array raises CrimeStat. Clearing a murder means hacking a terminal or time in Klescher prison." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "CrimeStat 3 and up puts a bounty on you: other players are paid to hunt you." },
      { level: "info", text: "Disabling comm arrays stops crimes from being reported nearby." },
      { level: "warn", text: "Guides say the quantum snare is limited in practice because route scanning isn't in the game yet. Expect to place it by trial and error." },
      { level: "info", text: "Fines clear CrimeStat unless there's a murder on record." },
    ],
    links: [
      { label: "Headhunters contracts", app: "contracts", q: 'by:"headhunters"' },
      { label: "Distortion cannons", app: "components", q: "type:distortion" },
      { label: "Quantum enforcement on the Star Citizen Wiki", url: "https://starcitizen.tools/Quantum_enforcement" },
    ],
    sources: [
      { label: "SPECTRE piracy guide (4.8)", url: "https://www.specr.eu/piracy.html" },
      { label: "Star Citizen Wiki: Quantum enforcement", url: "https://starcitizen.tools/Quantum_enforcement" },
      { label: "The Impound: Mantis guide", url: "https://theimpound.com/blogs/ships-and-vehicles/mantis-guide-specs-features" },
      { label: "Contracts app data (Headhunters ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Smuggling ─────────────────────────────
  {
    id: "smuggling",
    group: "Outlaw",
    name: "Smuggling",
    tagline: "Run illegal cargo and data for the Dead Saints and Bit Zeros, and trade contraband for the biggest margins.",
    summary: "Carry illegal deliveries, outlaw hauls and contraband. Dead Saints and Bit Zeros offer smuggling contracts with rank ladders; contraband commodities pay the most but risk your cargo and your record.",
    description: "Smuggling is hauling on the wrong side of the law. The Dead Saints run 'easy creds' deliveries and cargo hauls from outlaw outposts. Bit Zeros pays for data transfers and stolen tech. Higher ranks pay more for more dangerous runs. Contraband commodities (guides name drugs like Neon, E'tam and Atlasiam) can be bought and sold at outlaw stations for large margins, but stock is limited and security can scan your hold. A small, fast ship gets past trouble; a bigger hold makes each risky run count.",
    synopsis: "Start with Dead Saints and Bit Zeros deliveries in a small ship, rank up into Dead Saints cargo hauls, then trade contraband between outlaw stations in a fast, well-armed hauler.",
    style: { team: "Solo", risk: "High", legality: "Outlaw", startCost: "A small ship" },
    gettingStarted: [
      "Take a Dead Saints 'Easy Creds for Easy Work' or Bit Zeros data transfer at Neutral rank.",
      "Learn which stations are safe for outlaws, and where security scans cargo.",
      "Keep your CrimeStat low enough to land where you need to.",
      "Never carry more contraband than you can afford to lose.",
    ],
    stages: [
      {
        id: "runner",
        name: "Runner",
        goal: "Run illegal deliveries and data transfers.",
        why: "Small packages, low stakes, and a way into the Dead Saints and Bit Zeros ladders.",
        ships: ["avenger-titan", "mustang-alpha", "c8x-pisces-expedition"],
        contracts: [
          { act: "delivery", by: "Dead Saints", rank: [0, 1], label: "Dead Saints deliveries" },
          { act: "delivery", by: "Bit Zeros", rank: [0, 2], label: "Bit Zeros data transfers" },
        ],
        steps: [
          { id: "ds-1", text: "Reach Jr. Contractor with the Dead Saints", rep: ["Dead Saints", 1, "Standing"] },
          { id: "bz-2", text: "Reach Contractor with Bit Zeros", rep: ["Bit Zeros", 2] },
        ],
      },
      {
        id: "outlaw-hauls",
        name: "Outlaw hauls",
        goal: "Haul cargo for the Dead Saints.",
        why: "Dead Saints cargo hauls pay far more than their deliveries. A small cargo ship with some armor is enough to start.",
        ships: ["cutlass-black", "freelancer", "zeus-mk-ii-cl"],
        items: ["maxlift-tractor-beam"],
        contracts: [{ act: "hauling", by: "Dead Saints", label: "Dead Saints cargo hauls" }],
        steps: [
          { id: "cargo", text: "Own an armed ship with a cargo grid", own: ["cutlass-black", "freelancer", "zeus-mk-ii-cl", "mercury-star-runner"] },
          { id: "ds-haul", text: "Reach Rookie on the Dead Saints hauling track", rep: ["Dead Saints", 1, "Hauling"] },
        ],
      },
      {
        id: "contraband",
        name: "Contraband trader",
        goal: "Trade illegal commodities between outlaw stations.",
        why: "The biggest margins in trading, limited by stock and by the risk of losing a full hold.",
        ships: ["mercury-star-runner", "zeus-mk-ii-cl", "freelancer-max"],
        contracts: [{ act: "delivery", by: "Dead Saints", rank: [2, 4], label: "Dead Saints higher-rank runs" }, { act: "delivery", by: "Bit Zeros", rank: [3, 5], label: "Bit Zeros higher-rank data" }],
        steps: [
          { id: "msr", text: "Own a fast, armed hauler", own: ["mercury-star-runner", "zeus-mk-ii-cl"] },
          { id: "trade", text: "Complete a contraband trade run" },
        ],
      },
    ],
    forks: [
      {
        after: "runner",
        question: "Contracts or contraband?",
        options: [
          { label: "Smuggling contracts", text: "Set pay, no money tied up in the cargo." },
          { label: "Contraband trading", text: "Bigger profits, but you pay for the cargo up front and lose it if you're caught or destroyed." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "All Dead Saints and Bit Zeros contracts in the data are illegal." },
      { level: "info", text: "Contraband stock is limited and shared across a server, so the best goods run out." },
      { level: "warn", text: "Contraband locations and prices change between patches. Check UEX before buying." },
    ],
    links: [
      { label: "Illegal deliveries and hauls", app: "contracts", q: "is:illegal act:delivery" },
      { label: "Dead Saints contracts", app: "contracts", q: 'by:"dead saints"' },
      { label: "Where to shop (outlaw stations)", app: "locations" },
    ],
    sources: [
      { label: "MMOPIXEL: smuggling guide (4.4)", url: "https://www.mmopixel.com/news/star-citizen-4-4-smuggling-guide-best-smuggling-starter-ships" },
      { label: "MMOPIXEL: illegal cargo routes (4.7)", url: "https://www.mmopixel.com/news/star-citizen-4-7-riskiest-cargo-routes-illegal-commodities" },
      { label: "Contracts app data (Dead Saints, Bit Zeros ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Courier & data running ─────────────────────────────
  {
    id: "courier",
    group: "Transport & trade",
    name: "Courier & Data Running",
    tagline: "Fast deliveries, black-box recoveries and data runs for FTL Courier, Covalex and Hockrow.",
    summary: "Move small packages, recover black boxes and run data quickly. Several lawful contractors have delivery ladders, and the work needs only a fast ship and some room for boxes.",
    description: "Courier work is about speed and route planning rather than cargo space. FTL Courier and Covalex pay for package deliveries across a system, Hockrow Agency pays for black-box recoveries from wrecks, and Red Wind runs package recovery jobs. Because each contract is small, the trick is stacking several that share a route. A small, fast ship with good quantum speed is ideal; a data runner like the Herald is built for it.",
    synopsis: "Start with entry-level courier jobs in any ship, rank up with FTL Courier and Covalex, add black-box recovery, and move to a fast courier ship for long-distance and special deliveries.",
    style: { team: "Solo", risk: "Low", legality: "Lawful", startCost: "Any ship" },
    gettingStarted: [
      "Take FTL Courier's entry-level courier contracts.",
      "Learn to stack deliveries going the same way.",
      "Carry a multi-tool with a tractor attachment for boxes.",
      "Check quantum speed when choosing your next ship: courier pay is about trips per hour.",
    ],
    stages: [
      {
        id: "entry",
        name: "Entry-level courier",
        goal: "Complete courier and package jobs.",
        why: "Any ship can do it, and FTL Courier has good-to-start contracts in every system.",
        items: ["pyro-ryt-multi-tool", "truhold-tractor-beam-attachment"],
        contracts: [
          { act: "delivery", by: "FTL Courier", rank: [0, 1], label: "FTL Courier, Neutral to Jr." },
          { act: "delivery", by: "Red Wind Linehaul", rank: [0, 2], label: "Red Wind package recovery" },
        ],
        steps: [
          { id: "ftl-1", text: "Reach Jr. Contractor with FTL Courier", rep: ["FTL Courier", 1] },
          { id: "stack", text: "Complete three deliveries in one trip" },
        ],
      },
      {
        id: "recovery",
        name: "Recovery runs",
        goal: "Recover black boxes and run long-distance deliveries.",
        why: "Hockrow's black-box recoveries and Covalex's long-distance deliveries pay more and use the same skills.",
        ships: ["c8x-pisces-expedition", "cutter-scout", "315p"],
        contracts: [
          { act: "delivery", by: "Hockrow Agency", rank: [0, 3], label: "Hockrow black-box recovery" },
          { act: "delivery", by: "Covalex Independent Contractors", rank: [1, 2], label: "Covalex long-distance" },
        ],
        steps: [
          { id: "hockrow-blackbox", text: "Reach Contractor with Hockrow Agency", rep: ["Hockrow Agency", 2] },
          { id: "covalex-2", text: "Reach Contractor with Covalex (deliveries)", rep: ["Covalex Independent Contractors", 2, "Standing"] },
        ],
      },
      {
        id: "express",
        name: "Express courier",
        goal: "Take special and senior deliveries in a dedicated fast ship.",
        why: "Top courier contracts reward speed. A data runner or fast medium ship makes more runs per hour.",
        ships: ["herald", "mercury-star-runner", "zeus-mk-ii-cl"],
        contracts: [
          { act: "delivery", by: "Covalex Independent Contractors", rank: [3, 3], label: "Covalex special deliveries" },
          { act: "delivery", by: "FTL Courier", rank: [2, 3], label: "FTL Courier, Contractor to Sr." },
          { act: "delivery", by: "Hockrow Agency", rank: [4, 5], label: "Hockrow special investigator recovery" },
        ],
        steps: [
          { id: "fast", text: "Own a dedicated courier or data runner", own: ["herald", "mercury-star-runner", "zeus-mk-ii-cl"] },
          { id: "ftl-3", text: "Reach Sr. Contractor with FTL Courier", rep: ["FTL Courier", 3] },
        ],
      },
    ],
    forks: [
      {
        after: "entry",
        question: "Lawful courier, or Bit Zeros data runs?",
        options: [
          { label: "Lawful", text: "FTL Courier, Covalex, Hockrow and Red Wind. Safe everywhere." },
          { label: "Bit Zeros", text: "Better-paid data runs, but illegal. See the Smuggling career." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "Many delivery contracts don't have enough reported run times for pay per hour. Compare rewards and distances instead." },
      { level: "info", text: "Quantum speed and spool time matter more than cargo space. Use the value map with 'Quantum speed'." },
    ],
    links: [
      { label: "Delivery contracts", app: "contracts", q: "act:delivery" },
      { label: "Fast ships on the value map", app: "ships", hash: "value" },
      { label: "Quantum drive trade-offs", app: "components", hash: "tradeoffs" },
    ],
    sources: [{ label: "Contracts app data (FTL Courier, Covalex, Hockrow, Red Wind ranks)", app: "contracts" }],
    verified: false,
  },

  // ───────────────────────────── Gathering ─────────────────────────────
  {
    id: "gathering",
    group: "Industry",
    name: "Gathering & Xenobiology",
    tagline: "Collect plants, creature parts and rare minerals for Rayari's research, from cave dung to irradiated Valakkar pearls.",
    summary: "Gather biological samples and minerals for Rayari Incorporated. Contracts start with plants and cave finds and climb to hunting irradiated creatures, with blueprint rewards at higher ranks.",
    description: "Rayari is a lawful research company that pays for specific samples. The chain starts with a one-off introduction (five Ranta Dung from caves), then collection orders: plants like Prota, Revenant Pods and Sunset Berries; creature parts like Kopion horns and Valakkar fangs, pearls and eggs; and minerals like Carinite, Saldynium and Jaclium. Higher ranks ask for irradiated creature parts taken from dangerous areas, and some orders award crafting blueprints. Expect exploration on foot, some hunting, and lots of carrying.",
    synopsis: "Do Rayari's introduction, fill plant and cave orders on foot, kit out for hostile areas and hunt Kopion and Valakkar for their parts, then take senior orders and blueprint-rewarding research jobs with a group.",
    style: { team: "Solo, group for the top", risk: "Medium", legality: "Lawful", startCost: "A backpack and a knife" },
    gettingStarted: [
      "Collect five Ranta Dung from caves and turn them in for Rayari's 'Interested in Building a Better Future?'.",
      "Carry a big backpack: most orders want 15–20 of an item.",
      "Stockpile one easy resource (Prota on Arial, for example) and turn it in by the batch.",
      "Check each order's exact item: similar names can want different things.",
    ],
    stages: [
      {
        id: "intro",
        name: "Introduction",
        goal: "Unlock Rayari's research contracts.",
        why: "The one-off introduction opens the collection chain.",
        items: ["macflex-backpack-grey", "fsk-8-combat-knife"],
        contracts: [{ act: "gathering", by: "Rayari Incorporated", rank: [0, 0], label: "Rayari, Neutral" }],
        steps: [
          { id: "intro", text: "Complete 'Interested in Building a Better Future?'" },
          { id: "backpack", text: "Own a large backpack", own: ["macflex-backpack-grey", "novikov-backpack", "pembroke-backpack", "stirling-exploration-backpack"] },
        ],
      },
      {
        id: "collector",
        name: "Collector",
        goal: "Fill plant, mineral and cave orders; reach Contractor.",
        why: "Bulk orders of plants and cave creatures pay steadily and build rank.",
        ships: ["c8x-pisces-expedition", "cutter-scout", "cyclone"],
        contracts: [{ act: "gathering", by: "Rayari Incorporated", rank: [1, 1], label: "Rayari, Jr. Contractor" }],
        steps: [
          { id: "rayari-2", text: "Reach Contractor with Rayari", rep: ["Rayari Incorporated", 2] },
        ],
      },
      {
        id: "hunter",
        name: "Hunter",
        goal: "Collect irradiated Kopion and Valakkar parts.",
        why: "Irradiated creature orders pay much more. They need protection from radiation and a weapon that can take down big creatures.",
        items: ["stirling-exploration-suit", "arrowhead-sniper-rifle", "fs-9-lmg", "medpen-hemozal"],
        contracts: [{ act: "gathering", by: "Rayari Incorporated", rank: [2, 2], label: "Rayari, Contractor" }],
        steps: [
          { id: "suit", text: "Own an exploration or hazard suit", own: ["stirling-exploration-suit", "novikov-exploration-suit", "pembroke-exploration-suit"] },
          { id: "valakkar", text: "Complete an irradiated Valakkar order" },
        ],
      },
      {
        id: "researcher",
        name: "Senior researcher",
        goal: "Reach Sr. Contractor and take blueprint-rewarding research orders.",
        why: "Senior orders pay the most and some award weapon and armor blueprints. Some, like Yormandi eyes at ASD Onyx, are best done as a group.",
        contracts: [{ act: "gathering", by: "Rayari Incorporated", rank: [3, 3], label: "Rayari, Sr. Contractor" }, { act: "gathering", bp: true, label: "Gathering orders that reward blueprints" }],
        steps: [
          { id: "rayari-3", text: "Reach Sr. Contractor with Rayari", rep: ["Rayari Incorporated", 3] },
          { id: "blueprint", text: "Earn a blueprint from a Rayari order" },
        ],
      },
    ],
    forks: [
      {
        after: "collector",
        question: "Peaceful collecting, or hunting?",
        options: [
          { label: "Collecting", text: "Plants and minerals: safe, steady, lower pay." },
          { label: "Hunting", text: "Irradiated creature parts: dangerous, much better paid, and where the blueprints are." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "Rayari's blueprint rewards are a chance, not guaranteed: check your item fabricator after turning in." },
      { level: "warn", text: "Irradiated areas need radiation protection. Check a suit's radiation rating in the items app." },
      { level: "info", text: "Test a small turn-in first before moving a large stockpile through a freight elevator." },
    ],
    links: [
      { label: "Gathering contracts", app: "contracts", q: "act:gathering" },
      { label: "Exploration and hazard suits", app: "items", hash: "temperature" },
      { label: "Rayari guide (expcarry)", url: "https://expcarry.com/star-citizen-rayari-guide" },
    ],
    sources: [
      { label: "expcarry: Rayari missions, ranks and resources (4.10.2)", url: "https://expcarry.com/star-citizen-rayari-guide" },
      { label: "Star Citizen Wiki: Interested in Building a Better Future?", url: "https://api.star-citizen.wiki/missions/interested-in-building-a-better-future" },
      { label: "Contracts app data (Rayari ranks)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Crafting ─────────────────────────────
  {
    id: "crafting",
    group: "Industry",
    name: "Crafting",
    tagline: "Collect blueprints from contracts, source quality materials, and fabricate weapons, armor and ship components.",
    summary: "Use an item fabricator to make gear from blueprints and raw materials. Blueprints come from contract rewards across many careers; material quality sets the crafted item's stats.",
    description: "Crafting arrived in patch 4.7. An item fabricator (sold at Kel-To and Dumper's Depot shops in Stanton and refinery shops in Pyro) sits in your hangar or a ship's cargo grid. You pick an unlocked blueprint, assign materials, and the fabricator makes the item over time. Blueprints are permanent and reusable; most come as contract rewards from security, mining, salvage, refueling and research contracts. Materials come from mining and refining, salvage and dismantling, on a 0–1000 quality scale where better materials make better items. Crafting reaches ship components: shields, power plants, coolers and quantum drives.",
    synopsis: "Buy a fabricator and craft the default P4-AR, dismantle loot for materials, collect blueprints from the contracts you already run, source high-quality ore through mining and refining, then craft ship components to quality targets.",
    style: { team: "Solo", risk: "Low", legality: "Lawful", startCost: "An item fabricator" },
    gettingStarted: [
      "Buy an item fabricator at a Kel-To or Dumper's Depot shop (Stanton) or a refinery shop (Pyro).",
      "Place it in your hangar, or on a ship's cargo grid big enough for it.",
      "Craft the default P4-AR rifle to learn how material slots affect stats.",
      "Dismantle looted gear for materials. Found items return materials at quality 500.",
    ],
    stages: [
      {
        id: "first-craft",
        name: "First crafts",
        goal: "Craft the default recipes and learn quality.",
        why: "A few blueprints come with every fabricator. The P4-AR shows how frame, stock and barrel materials change recoil, handling and damage.",
        items: ["p4-ar-rifle"],
        steps: [
          { id: "fabricator", text: "Buy and place an item fabricator" },
          { id: "p4ar", text: "Craft a P4-AR rifle" },
          { id: "dismantle", text: "Dismantle a looted item for materials" },
        ],
      },
      {
        id: "blueprints",
        name: "Blueprint hunting",
        goal: "Unlock blueprints from contract rewards.",
        why: "Most blueprints come from contracts. Pick contracts whose reward pool has the blueprint you want; you probably already run some.",
        contracts: [
          { act: "ground-combat", by: "Citizens for Prosperity", bp: true, label: "CFP ground contracts with blueprints" },
          { act: "ship-combat", by: "Foxwell Enforcement", bp: true, label: "Foxwell security with blueprints" },
          { act: "investigation", by: "Recco Battaglia", bp: true, label: "Recco Battaglia (mining modules, ore pods)" },
          { act: "refueling", by: "United Wayfarers Club", bp: true, label: "UWC refueling with blueprints" },
        ],
        steps: [
          { id: "bp-1", text: "Unlock your first contract blueprint" },
          { id: "bp-5", text: "Unlock five blueprints" },
        ],
      },
      {
        id: "materials",
        name: "Quality materials",
        goal: "Source your own high-quality materials.",
        why: "Quality above 500 improves stats, and some recipes require a minimum (the MISC Enhanced Ore Pod needs Q800 iron). Mining and refining keep quality under your control.",
        ships: ["prospector", "golem"],
        items: ["orebit-mining-attachment", "pyro-ryt-multi-tool"],
        contracts: [{ act: "mining", by: "Shubin Interstellar", bp: true, label: "Shubin orders with blueprints" }],
        steps: [
          { id: "mine", text: "Own a way to mine", own: ["orebit-mining-attachment", "roc", "golem", "prospector", "mole"] },
          { id: "refine", text: "Refine ore and keep it for a recipe" },
        ],
      },
      {
        id: "components",
        name: "Component crafter",
        goal: "Craft ship components to quality targets.",
        why: "Shields, power plants, coolers and quantum drives can be crafted. Check the stat changes in the loadout planner and confirm they fit your ship first.",
        parts: ["fr-76", "snowpack", "atlas"],
        contracts: [{ act: "salvage", by: "Adagio Holdings", bp: true, label: "Adagio salvage with blueprints" }],
        steps: [
          { id: "component", text: "Craft a ship component" },
          { id: "fit", text: "Fit a crafted component and compare it in the loadout planner" },
        ],
      },
    ],
    forks: [
      {
        after: "blueprints",
        question: "Personal gear or ship components?",
        options: [
          { label: "Personal gear", text: "Weapons and armor blueprints come mostly from combat contracts (CFP, Headhunters, Bounty Hunters Guild)." },
          { label: "Ship components", text: "Shields, coolers and power plants. Pair with mining for the materials." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "Blueprints are reusable: crafting doesn't use them up, only the materials." },
      { level: "info", text: "Mixing material qualities averages the result. Some ammo recipes ignore quality, so don't waste good materials on them." },
      { level: "warn", text: "Blueprint reward pools change between patches. Check a contract's details before farming it." },
      { level: "info", text: "Over 400 contracts in the data reward blueprints. Shubin mining and UWC refueling have the most." },
    ],
    links: [
      { label: "Contracts that reward blueprints", app: "contracts", q: "has:blueprint" },
      { label: "Craftable items", app: "items", q: "is:craft" },
      { label: "SC-Craft.Tools crafting database", url: "https://robertsspaceindustries.com/community-hub/post/sc-craft-tools-the-complete-crafting-database-XXVPC6JqS5s6K" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Item fabricator", url: "https://starcitizen.tools/Item_fabricator" },
      { label: "expcarry: crafting and blueprints guide (4.10.2)", url: "https://expcarry.com/star-citizen-crafting-blueprints-guide" },
      { label: "The Impound: Alpha 4.7 crafting guide", url: "https://theimpound.com/blogs/guides/star-citizen-alpha-4-7-introduces-crafting" },
      { label: "Contracts app data (blueprint rewards)", app: "contracts" },
    ],
    verified: false,
  },

  // ───────────────────────────── Wikelo trading ─────────────────────────────
  {
    id: "wikelo",
    group: "Transport & trade",
    name: "Wikelo Trading",
    tagline: "Trade rare finds for Wikelo's unique gear and special ships, up to the Polaris and Idris.",
    summary: "Wikelo, a Banu trader, swaps unique weapons, armor and 'Wikelo Special' ships for collections of rare items and Wikelo Favor. It's a collector's career that pulls in mining, gathering, salvage and combat.",
    description: "Wikelo runs three Emporium stations in Stanton (Dasi near Hurston, Selo near Crusader, Kinga near microTech). You accept a trade contract, collect the listed items, deposit them at the Emporium's freight elevator and get the reward. Many trades also want Wikelo Favor, which you earn from other trades (for example 50 Carinite for one Favor). Rewards range from unique weapons and armor to modified ships with upgraded loadouts. Reputation ranks (New Customer, Very Good Customer, Very Best Customer) unlock the biggest trades.",
    synopsis: "Make your first gear trades, learn which items Wikelo wants and how to earn Favor, trade up to a Wikelo Special starter ship, then work toward the Very Best Customer trades for capital ships.",
    style: { team: "Solo, helped by friends", risk: "Low to medium", legality: "Lawful", startCost: "Items you collect" },
    gettingStarted: [
      "Visit a Wikelo Emporium (Dasi, Selo or Kinga station) and look at its trade contracts.",
      "Pick one trade and gather its items: they come from mining, gathering, salvage and loot.",
      "Learn how to earn Wikelo Favor. Many ship trades need several.",
      "Deposit items at the Emporium's freight elevator and check the local inventory for the reward.",
    ],
    stages: [
      {
        id: "gear",
        name: "Gear trades",
        goal: "Complete your first trades for unique weapons and armor.",
        why: "Gear trades are the simplest and teach the deposit flow.",
        contracts: [{ act: "wikelo", title: "Gun|Shot|Shotgun|Stabber|Weapon|LMG|Armor|Suit|Heavy and Bright", label: "Weapon and armor trades" }],
        steps: [
          { id: "first", text: "Complete a gear trade with Wikelo" },
          { id: "favor", text: "Earn your first Wikelo Favor" },
        ],
      },
      {
        id: "starter-ship",
        name: "Starter ship trades",
        goal: "Trade up to a Wikelo Special vehicle.",
        why: "Small ships and vehicles (Pulse, Golem, Fortune, Intrepid) are the first ship trades and come with upgraded loadouts.",
        ships: ["golem-wikelo-work-special", "fortune-wikelo-special", "intrepid-wikelo-work-special"],
        contracts: [{ act: "wikelo", title: "Pulse Plus|Golem Rocks|Fortune ship|Upgrade Intrepid|Noxy|Ursa Mod|Prospects", label: "Starter vehicle trades" }],
        steps: [{ id: "special", text: "Own a Wikelo Special ship", own: ["golem-wikelo-work-special", "fortune-wikelo-special", "intrepid-wikelo-work-special", "prospector-wikelo-work-special", "raft-wikelo-work-special"] }],
      },
      {
        id: "ship-mods",
        name: "Ship mods",
        goal: "Trade for modified fighters and haulers.",
        why: "Mid-tier trades turn popular ships (Scorpius, Guardian, F7, Zeus, Starlancer) into Wikelo variants. Reaching Very Good Customer unlocks more.",
        ships: ["starlancer-max-wikelo-work-special", "scorpius-wikelo-sneak-special", "guardian-wikelo-war-special"],
        contracts: [{ act: "wikelo", title: "Mod|Special|Zeus|Taurus|Starlancer|RAFT|Terrapin|Clipper|Wolf|Guardian|Max|Prowler|Apollo|F7|Starfighter", label: "Ship and mod trades" }],
        steps: [
          { id: "mod", text: "Complete a ship mod trade" },
          { id: "very-good", text: "Reach Very Good Customer", rep: ["Wikelo", 1] },
        ],
      },
      {
        id: "capital",
        name: "Capital trades",
        goal: "Reach Very Best Customer and trade for a capital ship.",
        why: "The Polaris and Idris trades are Wikelo's top rewards and need large collections and lots of Favor.",
        ships: ["polaris", "idris-p"],
        contracts: [{ act: "wikelo", title: "Polaris|Idris", label: "Capital ship trades" }],
        steps: [{ id: "very-best", text: "Reach Very Best Customer", rep: ["Wikelo", 2] }],
      },
    ],
    forks: [
      {
        after: "gear",
        question: "Where do your trade items come from?",
        options: [
          { label: "Mining and gathering", text: "Carinite, Saldynium and creature parts. See the Mining and Gathering careers." },
          { label: "Combat and salvage", text: "Military loot, ASD drives and salvage finds. See the Mercenary and Salvage careers." },
        ],
      },
    ],
    thingsToKnow: [
      { level: "warn", text: "Wikelo's trades rotate between patches. Check the Emporium before collecting for a specific reward." },
      { level: "info", text: "Rewards appear in the local inventory at the station where you turned in." },
      { level: "info", text: "Wikelo trades pay in items, not aUEC, so the contracts app shows no reward or pay per hour for them." },
    ],
    links: [
      { label: "Wikelo trades", app: "contracts", q: "act:wikelo" },
      { label: "Wikelo Special ships", app: "ships", q: "wikelo" },
      { label: "Wikelo on the Star Citizen Wiki", url: "https://starcitizen.tools/Wikelo" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Wikelo", url: "https://starcitizen.tools/Wikelo" },
      { label: "UVerse: Wikelo Emporium trades", url: "https://uverse.space/wikelo" },
      { label: "expcarry: Wikelo ships and rewards", url: "https://expcarry.com/star-citizen-wikelo-ships-guide" },
    ],
    verified: false,
  },

  // ───────────────────────────── Racing ─────────────────────────────
  {
    id: "racing",
    group: "Exploration & sport",
    name: "Racing",
    tagline: "Fly Wildstar Racing time trials on Stanton's tracks, from a budget racer to a tuned Razor.",
    summary: "Race ships through checkpoint courses for time and prize money. Wildstar Racing's time trials unlock track by track with reputation; ground racing is run by the community.",
    description: "Ship racing in the game is mostly time trials: seven community-built courses around Stanton, from the 10.5 km Snake Pit on Clio to the 52.5 km zero-G Miner's Lament at Yela. Each trial has an entry fee and pays bonuses for Bronze, Silver, Gold and Platinum times, and your Wildstar Racing reputation unlocks the next track. Racing ships trade cargo and guns for acceleration and handling. Ground races (Cyclone, HoverQuad, Dragonfly) are organised by players. Racing earns little: it's a skill hobby, so pair it with an income career.",
    synopsis: "Learn the first track in a cheap fast ship, unlock the rest of Wildstar's time trials, move to a dedicated racer like the Razor or 350r, then chase Platinum times and community events.",
    style: { team: "Solo", risk: "Low", legality: "Lawful", startCost: "A fast ship" },
    gettingStarted: [
      "Wear a helmet: the race timer only shows in the helmet HUD.",
      "Start the Lorville Outskirts time trial at Hurston (no reputation needed, 400 aUEC entry).",
      "Learn one track until you can beat Bronze, then move on.",
      "Practise in decoupled mode and learn your ship's boost.",
    ],
    stages: [
      {
        id: "first-track",
        name: "First track",
        goal: "Finish Lorville Outskirts and earn your first Wildstar reputation.",
        why: "The first trial needs no reputation, and a cheap fast ship is enough to learn the course.",
        ships: ["mustang-gamma", "p-52-merlin", "fury-lx"],
        items: ["g-2-helmet-grey", "tailwind-flight-suit"],
        steps: [
          { id: "helmet", text: "Own a helmet", own: ["g-2-helmet-grey", "pembroke-helmet", "novikov-helmet"] },
          { id: "lorville", text: "Finish the Lorville Outskirts time trial" },
        ],
      },
      {
        id: "circuit",
        name: "The circuit",
        goal: "Unlock and finish all seven time-trial tracks.",
        why: "Each track needs more Wildstar reputation and a bigger entry fee, and tests different flying: low visibility, narrow gates, low altitude and zero-G.",
        ships: ["m50", "mustang-gamma"],
        steps: [
          { id: "icebreaker", text: "Finish The Icebreaker (Euterpe)" },
          { id: "snake-pit", text: "Finish The Snake Pit (Clio)" },
          { id: "miners-lament", text: "Finish Miner's Lament (Yela)" },
        ],
      },
      {
        id: "racer",
        name: "Dedicated racer",
        goal: "Race a purpose-built ship and chase Gold and Platinum times.",
        why: "Top racers have the acceleration and handling for Platinum times. The Razor is a common choice; the 350r and Fury LX rank highly too.",
        ships: ["razor", "razor-lx", "350r", "m50"],
        steps: [
          { id: "racer", text: "Own a dedicated racer", own: ["razor", "razor-lx", "razor-ex", "350r", "m50"] },
          { id: "platinum", text: "Set a Platinum time on any track" },
        ],
      },
      {
        id: "events",
        name: "Community racing",
        goal: "Race other players in community events and ground races.",
        why: "Organised races (and the Murray Cup, the in-lore goal) are where racers compete head to head. Ground racers use bikes and hover vehicles.",
        ships: ["cyclone-rc", "hoverquad", "dragonfly-black", "x1-velocity"],
        steps: [{ id: "event", text: "Enter a community race" }],
      },
    ],
    forks: [
      {
        after: "circuit",
        question: "Space or ground?",
        options: [
          { label: "Ship racing", text: "Wildstar's time trials and community ship races.", ships: ["razor"] },
          { label: "Ground racing", text: "Community-run races with bikes and buggies.", ships: ["cyclone-rc", "x1-velocity"] },
        ],
      },
    ],
    thingsToKnow: [
      { level: "info", text: "A 'Did Not Place' finish returns your entry fee. Better finishes add their bonuses on top." },
      { level: "warn", text: "Racing barely pays. Fund it with another career." },
      { level: "info", text: "Spec sheets don't predict lap times well. Some racers lose speed and handling in atmosphere." },
      { level: "warn", text: "Wildstar's time trials aren't in the contracts data, and the track list is from patch 3.18. Check the in-game list." },
    ],
    links: [
      { label: "Racing ships on the value map (SCM speed)", app: "ships", hash: "value" },
      { label: "Racing on the Star Citizen Wiki", url: "https://starcitizen.tools/Racing" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Racing", url: "https://starcitizen.tools/Racing" },
      { label: "The Impound: racer's guide", url: "https://theimpound.com/blogs/the-impound-news/sc-racers-guide" },
      { label: "expcarry: ship tier list (4.10.2)", url: "https://expcarry.com/star-citizen-ship-tier-list" },
    ],
    verified: false,
  },

  // ───────────────────────────── Ship engineer ─────────────────────────────
  {
    id: "engineer",
    group: "Support",
    name: "Ship Engineer & Crew",
    tagline: "Keep multi-crew ships running: power, cooling, relays, fuses, fires and field repairs.",
    summary: "Engineering (added in patch 4.5) gives ships a limited power budget, physical relays and fuses, and components that can be damaged and repaired. On bigger ships it's a full crew job; solo pilots use the same skills to stay alive.",
    description: "Every ship's power plant feeds a limited number of power segments to weapons, shields, engines, coolers and other systems through relays. Relays hold fuses; a relay can run on one working fuse at reduced capacity, and a damaged relay can cut power even when the power plant is fine. In combat an engineer moves power where it's needed, swaps fuses, fights fires and repairs components with a multi-tool. There are no engineering contracts: you earn by crewing for others (often an org) or by keeping your own ship in the fight longer.",
    synopsis: "Learn power management in your own ship, carry field-repair gear, crew a multi-crew ship's engineering station, then run engineering on a large ship or capital for an org.",
    style: { team: "Crew role", risk: "Medium", legality: "Lawful", startCost: "A multi-tool" },
    gettingStarted: [
      "Learn your ship's power screen: set presets for combat, travel and stealth, and keep cooling under 100%.",
      "Find the relays and fuses aboard your ship.",
      "Carry a multi-tool with a Cambio-Lite SRT attachment and full RMC canisters for repairs.",
      "Offer to crew a friend's or an org's multi-crew ship as engineer.",
    ],
    stages: [
      {
        id: "power",
        name: "Power management",
        goal: "Manage power and cooling in your own ship.",
        why: "Every pilot benefits: the right preset means faster shields, more gun power or a quieter signature.",
        steps: [
          { id: "presets", text: "Set up combat, travel and stealth power presets" },
          { id: "budget", text: "Check a ship's power budget in the loadout planner" },
        ],
      },
      {
        id: "repair",
        name: "Field repair",
        goal: "Repair components and replace fuses in the field.",
        why: "A ship with a damaged relay or burnt fuses can lose systems even with a healthy power plant. Fixing them mid-fight keeps it flying.",
        items: ["pyro-ryt-multi-tool", "cambio-lite-srt-attachment"],
        steps: [
          { id: "kit", text: "Own a multi-tool and Cambio-Lite SRT attachment", own: ["cambio-lite-srt-attachment"] },
          { id: "fuse", text: "Replace a fuse and repair a component" },
        ],
      },
      {
        id: "crew",
        name: "Crew engineer",
        goal: "Run the engineering station on a multi-crew ship.",
        why: "On medium and large ships, an engineer reroutes power, fights fires and swaps components while others fly and shoot.",
        ships: ["constellation-mk-iv-taurus", "starlancer-tac", "c2-hercules-starlifter", "carrack"],
        steps: [{ id: "crewed", text: "Crew as engineer on a multi-crew ship" }],
      },
      {
        id: "chief",
        name: "Chief engineer",
        goal: "Run engineering on a large ship or capital for an org.",
        why: "Capital ships have many relays, components and crew stations. A chief engineer coordinates repairs and power for the whole ship.",
        ships: ["polaris", "hammerhead", "idris-p"],
        steps: [{ id: "capital", text: "Run engineering on a large or capital ship" }],
      },
    ],
    forks: [],
    thingsToKnow: [
      { level: "info", text: "A relay can run on one working fuse at reduced capacity." },
      { level: "info", text: "There are no engineering contracts. Engineers earn by crewing, usually for an org." },
      { level: "warn", text: "Engineering mechanics are still changing between patches. Guides disagree on details." },
    ],
    links: [
      { label: "Power budgets in the loadout planner", app: "components", hash: "plan" },
      { label: "Star Citizen Alpha 4.5.0 (engineering)", url: "https://starcitizen.tools/Update:Star_Citizen_Alpha_4.5.0" },
    ],
    sources: [
      { label: "Star Citizen Wiki: Alpha 4.5.0", url: "https://starcitizen.tools/Update:Star_Citizen_Alpha_4.5.0" },
      { label: "The Impound: engineering explained", url: "https://theimpound.com/blogs/star-citizen-news/engineering-gameplay-guide" },
      { label: "The Impound: returning in October 2026", url: "https://theimpound.com/blogs/guides/returning-to-star-citizen-in-october-2026-cargo-engineering-and-new-work" },
      { label: "MMOPIXEL: power management guide (4.8.1)", url: "https://www.mmopixel.com/news/star-citizen-4-8-1-ship-power-management-complete-guide" },
    ],
    verified: false,
  },
];
