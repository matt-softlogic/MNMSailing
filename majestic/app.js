/* Planning model for Majestic.
   Same bones as the TRU All-In Calculator (v2.1).
   Lines are planning estimates built 19 Oct 2026 from the Seattle Yachts listing
   (stock 2848172), its YachtWorld / Denison mirrors, and Matt's 8 Sep 2026
   analysis of this hull. Estimates, not quotes.
   The only close on this page is the ask, $349,500. Not an offer.
   Tax defaults to zero: the Oregon-buyer 45-day Washington exit.
   The 8.9% switch is the missed-clock case. Not tax advice. */

const TAX_RATE = 0.089;
const INS_RATE = 0.02;
const INS_FIXED = 7000;
const LIST = 349500;
const CASH = 400000;
const PHOTO_COUNT = 44;
const SECTIONS = { listing: [1, 44] };
const CLOSES = { ask: 349500 };

const REFIT = [
  ["Anchor", "The Ultra stainless anchor (2018) and 300 ft of 3/8 in HT chain convey. The Rocna 55 stainless is excluded. A second anchor and rode for the route.", 400, 1500],
  ["Anchor", "Windlass and chain-counter service.", 200, 600],
  ["Dinghy", "No tender in the sale. The Achilles, the 20 hp Mercury, and the bridle are excluded. Dinghy and outboard, Matt’s range.", 8000, 15000],
  ["Energy", "House bank. Twelve Lifeline GPL-27T AGMs, about 1,200 Ah at 12 V, dated about 2018. Load-test. Like-for-like AGMs on the low side, lithium on the high side (Matt: $12,000–22,000).", 4500, 22000],
  ["Energy", "No generator listed. A portable Honda on the low side, a small diesel set on the high side (Matt’s range).", 2000, 12000],
  ["Energy", "Victron Cerbo GX and an isolation transformer for 230 V marinas. Neither is on the listing.", 1100, 1800],
  ["Energy", "Solar is already 3 × 375 W Trina on the bimini with two Victron SmartSolar 150/60. Inspect connectors and mounts only.", 0, 500],
  ["Hull", "Cat-eye window bonds. The known 54 DS item. Zero if the survey finds clean bonds and dry liners. Re-bedding on the high side. Estimate.", 0, 15000],
  ["Hull", "Keel joint and bolts, and the upper rudder support (the class recall item). Survey-driven. Zero if clean.", 0, 8000],
  ["Hull", "Teak cockpit sole and seats, teak caprail and rub rail. Side decks are non-skid in the photos, not teak. Recaulk or refinish as found.", 500, 6000],
  ["Hull", "Moisture readings on the cored topsides and balsa deck. Bottom sand and antifoul on a 55 ft hull.", 3500, 8000],
  ["Mech", "Spectra Newport 400 (2018). Membranes, filters, and a service.", 400, 2500],
  ["Mech", "Eberspächer 16 kW hydronic heat and the engine heat exchanger loop. Service, burner, and a coolant check.", 400, 2000],
  ["Mech", "Holding is 20 gal for three heads. Keep the pump-out schedule on the low side, a larger tank on the high side.", 0, 4000],
  ["Mech", "Thru-hulls, seacocks, and the rainwater path down the mast into the bilge (a known model item).", 300, 2500],
  ["Nav", "Raymarine eS128, Axiom 9, RD418HD radar, EV-400 autopilot with the original 6002 kept as a switchable backup, all 2018. Software, sensors, and service.", 0, 1500],
  ["Nav", "Offshore comms. Iridium GO is aboard and the SSB is prewired. Starlink is not listed.", 0, 1500],
  ["Prop", "Yanmar 4JH4-HTE, 110 hp, 1,735 hours, serviced every 250 hours per the listing. Service file, then injectors, heat exchanger, mounts, and elbow on the high side.", 1000, 5000],
  ["Prop", "Three-blade feathering Max-Prop and the shaft seal and cutlass bearing. Inspect and service.", 300, 2000],
  ["Rigging", "Haine standing rigging, all new 2018 at KKMI. Eight years old. Rigger inspection and tune. No replacement in this file.", 500, 1500],
  ["Rigging", "In-mast furler and foil. Service on the low side, foil work on the high side (Matt: $1,000–6,000; the ugly case is $8,000–15,000 and is not in this line).", 1000, 6000],
  ["Rigging", "Redundancy for the route. A staysail stay or solent, a windvane, or a spare autopilot ram (Matt’s range). None is listed.", 3000, 12000],
  ["Rigging", "Running rigging.", 800, 3000],
  ["Safety", "Viking 6-person raft, listed as needing certification, and the GlobalFix Pro406 EPIRB. Recertify on the low side, a new raft on the high side (Matt’s range).", 1500, 6000],
  ["Sails", "UK carbon in-mast main (6/2019), UK X-Drive 110% genoa (2018), Matrix asymmetric with sock (2018). Loft inspection and repair.", 500, 4000],
  ["Sails", "Full cockpit enclosure from 2018. Zips, windows, and stitching before Mexico.", 500, 4000],
  ["Other", "Spares.", 1500, 4000],
  ["Other", "Contingency.", 8000, 20000]
];

const DD_BASE = {
  ddSurvey: 3000,
  ddOilAnalysis: 250,
  ddHaulout: 900,
  ddRig: 800,
  ddSails: 400,
  ddDiesel: 900,
  ddTravel: 400,
  txBrokerage: 1500,
  txInsurance: INS_FIXED,
  txTaxes: 0,
  txDelivery: 1500,
  txOther: 1000
};

const CAPTIONS = {
  1: "Majestic alongside in Anacortes. Flag Blue hull, gold stripe. The card and hero frame.",
  2: "Bow and name. Flag Blue Awlgrip.",
  3: "Under sail, main and genoa set. A small image in the Seattle Yachts set; the larger copy on the mirrors is a thumbnail.",
  4: "Bow quarter at the dock, the enclosure up.",
  5: "Transom and swim platform, the enclosure and the bimini above.",
  6: "Stern quarter. The solar array sits on the frame over the bimini.",
  7: "Bow-on at the dock.",
  8: "Side deck forward. Non-skid on the decks, teak on the caprail.",
  9: "Foredeck hatch and the bow.",
  10: "Coachroof, the cat-eye window, and the deck hatches.",
  11: "Cockpit under the enclosure. Twin wheels and the table.",
  12: "Cockpit seats and table, teak sole.",
  13: "Port helm and pod.",
  14: "Starboard helm.",
  15: "Cockpit looking aft from the companionway.",
  16: "Cockpit looking forward to the companionway and the table.",
  17: "Helm view forward through the enclosure.",
  18: "Saloon from the companionway. Galley to port, settees ahead.",
  19: "Raised saloon dinette under the cat-eye windows.",
  20: "Nav station and the companionway passage.",
  21: "Saloon settees and table, looking forward.",
  22: "Saloon looking forward toward the master cabin door.",
  23: "Galley, looking down from the saloon.",
  24: "Galley. Stove, oven, and sinks.",
  25: "Galley counters and the twin sinks.",
  26: "Galley stove and oven.",
  27: "A cabin or locker used for stowage at the time of the photographs.",
  28: "Head and vanity.",
  29: "Passage and cabin doors.",
  30: "Galley from aft.",
  31: "Saloon and galley from aft.",
  32: "Aft cabin with a queen berth.",
  33: "Aft cabin berth.",
  34: "Hanging locker and joinery.",
  35: "Head and vanity.",
  36: "Saloon panorama.",
  37: "Nav station. Raymarine display and the electrical panel.",
  38: "Engine access under the companionway. Yanmar 4JH4-HTE.",
  39: "Master cabin forward.",
  40: "Master cabin, hanging locker and berth.",
  41: "Head with the separate shower.",
  42: "Master cabin berth.",
  43: "Victron MultiPlus 12/3000/120 and the two SmartSolar MPPT controllers (Seattle Yachts set, small image).",
  44: "An older photograph of Majestic at a dock, from the Seattle Yachts set. Undated."
};

const money = (n) => {
  const r = Math.round(n);
  return (r < 0 ? "−" : "") + "$" + Math.abs(r).toLocaleString("en-US");
};
const num = (el) => {
  const v = parseFloat(String(el.value || "").replace(/,/g, ""));
  return Number.isFinite(v) ? v : 0;
};

function refitSums() {
  let lo = 0, hi = 0;
  document.querySelectorAll("[data-lo]").forEach((el) => { lo += num(el); });
  document.querySelectorAll("[data-hi]").forEach((el) => { hi += num(el); });
  return { lo, hi };
}

function salePrice() {
  const survey = num(document.getElementById("surveyDeduct"));
  const neg = num(document.getElementById("negPrice"));
  const list = num(document.getElementById("listPrice"));
  return survey > 0 ? survey : (neg > 0 ? neg : list);
}

function syncDerived() {
  const sale = salePrice();
  if (document.getElementById("insAuto").checked) {
    document.getElementById("txInsurance").value = Math.round(sale * INS_RATE).toLocaleString("en-US");
  }
  if (document.getElementById("taxAuto").checked) {
    document.getElementById("txTaxes").value = Math.round(sale * TAX_RATE).toLocaleString("en-US");
  } else {
    document.getElementById("txTaxes").value = "0";
  }
}

function purchaseSum() {
  const ids = ["ddSurvey","ddOilAnalysis","ddHaulout","ddRig","ddSails","ddDiesel","ddTravel","txBrokerage","txInsurance","txTaxes","txDelivery","txOther"];
  return ids.reduce((s, id) => s + num(document.getElementById(id)), 0);
}

function recalc() {
  syncDerived();
  const sale = salePrice();
  const buy = sale + purchaseSum();
  const { lo, hi } = refitSums();
  const totalLo = buy + lo;
  const totalHi = buy + hi;
  const budget = num(document.getElementById("cash")) + num(document.getElementById("loan"));
  document.getElementById("liveSale").textContent = money(sale);
  document.getElementById("liveBuy").textContent = money(buy);
  document.getElementById("liveRefit").textContent = money(lo) + " – " + money(hi);
  document.getElementById("liveTotal").textContent = money(totalLo) + " – " + money(totalHi);
  document.getElementById("liveLeft").textContent = money(budget - totalLo) + " – " + money(budget - totalHi);
  const pct = budget > 0 ? Math.min(100, (totalHi / budget) * 100) : 0;
  document.getElementById("liveBar").style.width = pct + "%";
  document.getElementById("livePct").textContent = budget > 0 ? Math.round((totalHi / budget) * 100) + "% of the pile on the high figure" : "Set a pile of gold to see the bar";
}

function loadCase(name) {
  document.getElementById("negPrice").value = CLOSES[name].toLocaleString("en-US");
  document.getElementById("surveyDeduct").value = "";
  document.getElementById("insAuto").checked = false;
  document.getElementById("taxAuto").checked = false;
  document.getElementById("txInsurance").value = INS_FIXED.toLocaleString("en-US");
  recalc();
}

function staticCases() {
  const loR = REFIT.reduce((s, r) => s + r[2], 0);
  const hiR = REFIT.reduce((s, r) => s + r[3], 0);
  const midR = Math.round((loR + hiR) / 2);
  const dd = Object.values(DD_BASE).reduce((s, n) => s + n, 0);
  const rows = [
    ["Ask, low column", CLOSES.ask, loR, "The $349,500 ask and the low end of every line. Tax at zero, insurance $7,000."],
    ["Ask, midpoint", CLOSES.ask, midR, "Same price. The middle of every line."],
    ["Ask, high column", CLOSES.ask, hiR, "Same price. Lithium, a diesel generator, window re-bedding, a new raft, and redundancy all go to the top."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, close, refit, note]) => {
    const allIn = close + dd + refit;
    const taxed = allIn + Math.round(close * TAX_RATE);
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}. Add Washington tax and it is ${money(taxed)}.</span></article>`;
  }).join("");
  const low = CLOSES.ask + dd + loR;
  const mid = CLOSES.ask + dd + midR;
  const high = CLOSES.ask + dd + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in at the $349,500 ask, tax at zero: ${money(low)} low, ${money(mid)} mid, ${money(high)} high.`;
}

function renderRefit() {
  document.getElementById("refitBody").innerHTML = REFIT.map((r, i) => `
    <label class="rrow">
      <span>${r[1]}</span>
      <input data-lo id="lo-${i}" type="text" value="${r[2].toLocaleString("en-US")}" inputmode="numeric">
      <input data-hi id="hi-${i}" type="text" value="${r[3].toLocaleString("en-US")}" inputmode="numeric">
    </label>`).join("");
}

function renderGallery() {
  document.querySelectorAll(".grid[data-section]").forEach((grid) => {
    const [a, b] = SECTIONS[grid.dataset.section];
    let html = "";
    for (let i = a; i <= b; i++) {
      const cap = CAPTIONS[i] || `Photograph ${i} of ${PHOTO_COUNT}.`;
      html += `<button type="button" data-i="${i}" aria-label="Open photo ${i}"><img src="photos/${String(i).padStart(2,"0")}.jpg" alt="${cap}" loading="lazy"></button>`;
    }
    grid.innerHTML = html;
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) openLightbox(Number(btn.dataset.i));
    });
  });
  document.querySelectorAll("figure img[data-i]").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(Number(img.dataset.i)));
  });
}

let current = 1;
function openLightbox(i) {
  current = i;
  const box = document.getElementById("lightbox");
  box.classList.add("open");
  box.querySelector("img").src = `photos/${String(i).padStart(2,"0")}.jpg`;
  box.querySelector("p").textContent = CAPTIONS[i] || `Photo ${i} of ${PHOTO_COUNT}`;
}
function move(delta) {
  openLightbox(((current - 1 + delta + PHOTO_COUNT) % PHOTO_COUNT) + 1);
}

function downloadTru() {
  const saleFields = ["listPrice","negPrice","surveyDeduct","cash","loan","ddSurvey","ddOilAnalysis","ddHaulout","ddRig","ddSails","ddDiesel","ddTravel","txBrokerage","txInsurance","txTaxes","txDelivery","txOther"];
  const fields = {
    boatName: "Jeanneau 54 DS",
    boatLink: "https://www.seattleyachts.com/used-yachts-for-sale/54-jeanneau-54ds-2009-majestic/2848172_1",
    boatLOA: "54.92",
    boatVesselName: "MAJESTIC"
  };
  saleFields.forEach((id) => {
    const n = num(document.getElementById(id));
    fields[id] = n > 0 ? String(Math.round(n)) : "";
  });
  const refitRows = REFIT.map((r, i) => ({
    cat: r[0],
    label: r[1],
    lo: String(Math.round(num(document.getElementById("lo-" + i)))),
    hi: String(Math.round(num(document.getElementById("hi-" + i))))
  }));
  const notes = [
    "Majestic, 2009 Jeanneau 54 DS, Anacortes. Ask $349,500, Seattle Yachts stock 2848172, YachtWorld 10100003. Active on 19 Oct 2026. Some mirrors still print an older $399,000 ask. Planning figures, not an offer.",
    "Raised deck saloon, not a true deck saloon: the saloon sits above the cabins but below the cockpit sole, with the galley a step down.",
    "Yanmar 4JH4-HTE 110 hp, 1,735 hours, serviced every 250 hours per the listing. Haine standing rigging new 2018 at KKMI. Spectra Newport 400 (2018). Eberspächer 16 kW hydronic. 3 x 375 W solar.",
    "House bank 12 x Lifeline GPL-27T AGM, about 2018. No generator. No tender (excluded with the 20 hp Mercury and the Rocna 55).",
    "Deep fin 7 ft 6 in. Fuel 208 / water 246 / holding 20 gal.",
    "Tax is $0 unless the Washington switch is on. That switch is about 8.9% if an Oregon buyer misses the 45-day exit. Not tax advice."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Jeanneau 54 DS - MAJESTIC.tru";
  a.click();
  URL.revokeObjectURL(a.href);
}

function init() {
  renderRefit();
  renderGallery();
  staticCases();
  document.getElementById("listPrice").value = LIST.toLocaleString("en-US");
  document.getElementById("cash").value = CASH.toLocaleString("en-US");
  document.getElementById("loan").value = "";
  Object.entries(DD_BASE).forEach(([id, val]) => {
    document.getElementById(id).value = val ? val.toLocaleString("en-US") : "0";
  });
  loadCase("ask");
  document.getElementById("calc").addEventListener("input", recalc);
  document.getElementById("insAuto").addEventListener("change", () => {
    if (!document.getElementById("insAuto").checked) document.getElementById("txInsurance").value = INS_FIXED.toLocaleString("en-US");
    recalc();
  });
  document.getElementById("taxAuto").addEventListener("change", recalc);
  document.querySelectorAll("[data-case]").forEach((btn) => btn.addEventListener("click", () => loadCase(btn.dataset.case)));
  document.getElementById("exportTru").addEventListener("click", downloadTru);
  document.querySelector(".lightbox .x").addEventListener("click", () => document.getElementById("lightbox").classList.remove("open"));
  document.querySelector(".lightbox .prev").addEventListener("click", () => move(-1));
  document.querySelector(".lightbox .next").addEventListener("click", () => move(1));
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("open")) return;
    if (e.key === "Escape") document.getElementById("lightbox").classList.remove("open");
    if (e.key === "ArrowRight") move(1);
    if (e.key === "ArrowLeft") move(-1);
  });
}

init();
