/* Planning model for Eden.
   Same bones as the TRU All-In Calculator (v2.1).
   Lines are Eden's column of MN_M_All_In_Comparison_Terratima_Eden_Paragon.xlsx
   (22 Sep 2026), which was seeded from the Eden .tru export.
   Workbook close $250,000. The .tru note said $275,000. The ask is $299,000.
   Tax is zero in the workbook. Not an offer, not tax advice. */

const INS_RATE = 0.02;
const INS_FIXED = 6000;
const LIST = 299000;
const CASH = 400000;
const PHOTO_COUNT = 33;
const CLOSES = { workbook: 250000, note: 275000, ask: 299000 };

const REFIT = [
  ["Anchor", "Primary chain, and Pacific rode. The 21 September notes say a roughly 55 lb anchor of unknown make, 100 ft of chain, and 500 ft of rope. The survey says shovel type and galvanized BBB.", 800, 2000],
  ["Anchor", "Fortress kedge and rode.", 800, 1200],
  ["Anchor", "Windlass service. The Lewmar was refurbished in 2025, per the owner.", 200, 500],
  ["Dinghy", "Keep and service the tender. The survey lists an Avon and a Yamaha 15. The call notes list a Highfield 10 ft 6 in and a Honda 10.", 400, 1200],
  ["Dinghy", "Davit, hoist, and lifting. The survey shows one small starboard davit for the outboard.", 400, 1600],
  ["Elec", "Shore power, electrical tidy, and panel. 120 V, 35 A shore power.", 1500, 4000],
  ["Elec", "AIS, if missing. The survey does not list one.", 800, 1500],
  ["Energy", "House bank. New AGM in spring 2026 per the owner, capacity not stated. Keep it short-term, or step to lithium.", 1500, 3000],
  ["Energy", "Replace the Xantrex Prosine 3.0 with a Victron MultiPlus 3000 class inverter/charger.", 1800, 2800],
  ["Energy", "Solar. None is listed anywhere.", 4000, 8000],
  ["Energy", "Alternator regulator.", 800, 2000],
  ["Energy", "Cerbo GX, a touch display, and the wiring.", 500, 900],
  ["Energy", "Victron isolation transformer, 3,600 W, 230 to 120 V. The galvanic isolator aboard does not convert New Zealand shore power.", 600, 900],
  ["Hull", "Bottom sand and antifoul.", 2800, 5500],
  ["Hull", "Teak decks. Aging per the survey, outside edges peeling per the owner. Recaulk on the low side. Recore, or a later synthetic, on the high side.", 3000, 18000],
  ["Hull", "Keel-to-hull aft separation, survey finding 1. Zero if it is cosmetic cavitation. Bolts or sump work on the high side.", 0, 15000],
  ["Hull", "Rudder-tube cavitation and bearing, survey finding 2.", 300, 2000],
  ["Mech", "Watermaker. None aboard. Buy one.", 5000, 10000],
  ["Mech", "Thru-hulls and seacocks as found.", 500, 2000],
  ["Nav", "Second autopilot, Jefa DD2 with an Evolution pack. The vane bracket is aboard without a vane.", 9000, 13000],
  ["Nav", "Navigation and pilot refresh. The Raymarine E120 package is from the 2005–06 commissioning.", 5000, 12000],
  ["Nav", "Satellite communications.", 600, 1500],
  ["Prop", "Yanmar 4JH3-HTE, 2,789.7 indicated hours, not logged. Engine service and the deferred major look.", 800, 4000],
  ["Rigging", "Standing rig. Original 2005 wire. Replace before an ocean.", 15000, 25000],
  ["Rigging", "Running rigging.", 1500, 4000],
  ["Rigging", "Removable inner forestay and a hanked staysail.", 9000, 20000],
  ["Safety", "Life raft. None aboard.", 3500, 5500],
  ["Safety", "PFDs, harnesses, tethers, jacklines, first aid, EPIRB registration.", 1300, 2700],
  ["Sails", "Schattauer sails, about 90% per the owner, no year. Loft card, repair, UV, slides.", 1000, 4000],
  ["Other", "Marina, boatyard, and a haul block after the close.", 3000, 8000],
  ["Other", "Spares.", 2000, 4000],
  ["Other", "Contingency.", 10000, 20000]
];

const DD_BASE = {
  ddSurvey: 3500,
  ddOilAnalysis: 250,
  ddHaulout: 1200,
  ddRig: 1500,
  ddSails: 400,
  ddDiesel: 1200,
  ddTravel: 2800,
  txBrokerage: 1500,
  txInsurance: INS_FIXED,
  txTaxes: 0,
  txDelivery: 8000,
  txOther: 2000
};

const CAPTIONS = {
  1: "Under sail on still water below the mountains. The hero frame.",
  2: "Named transom: EDEN, Seward AK.",
  3: "Raised saloon. Blue upholstery, the dinette, and the windows that make it a Pilot Saloon.",
  4: "Saloon to starboard and the nav station, with the plotter at the desk.",
  5: "Galley, to port, forward of the aft cabin.",
  6: "A cabin berth, made up.",
  7: "Cabin with an overhead hatch.",
  8: "Looking forward through the enclosure. Electric winches either side of the companionway.",
  9: "Cockpit. Teak sole, dual wheels, the enclosure up.",
  10: "Cockpit from the stern, the name board between the wheels.",
  11: "Teak on a cockpit seat. Weathered grey, not varnished.",
  12: "Helm pedestal and the Raymarine instruments.",
  13: "The other wheel and its instrument pod.",
  14: "Raymarine Tridata: 8.11 knots of boat speed, 25.1 knots of true wind. The log reads about 9,245 miles.",
  15: "8.13 knots, 29.2 knots true.",
  16: "7.78 knots, 28.4 knots true.",
  17: "From above, under sail.",
  18: "Under sail in a mountain sound.",
  19: "Sailing past snow-streaked mountains.",
  20: "Under sail, seen from shore.",
  21: "Looking up the main.",
  22: "Sail detail, looking up.",
  23: "Side deck under way. Teak, the enclosure, and the coastline.",
  24: "At anchor, the tender on the beach.",
  25: "At anchor at dusk.",
  26: "At anchor below the cliffs.",
  27: "At anchor, mirrored in calm water.",
  28: "Bow at the dock at sunset.",
  29: "On the hard at the spring 2026 haul-out.",
  30: "On a trailer at the haul-out.",
  31: "Profile on the stands. The raised saloon windows read clearly.",
  32: "The keel on the hard. A bulb, not a stub. Draft has not been taped.",
  33: "The keel from aft. The survey’s aft keel-to-hull separation is not visible at this size."
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
  if (document.getElementById("insAuto").checked) {
    document.getElementById("txInsurance").value = Math.round(salePrice() * INS_RATE).toLocaleString("en-US");
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
  document.getElementById("txInsurance").value = INS_FIXED.toLocaleString("en-US");
  recalc();
}

function staticCases() {
  const loR = REFIT.reduce((s, r) => s + r[2], 0);
  const hiR = REFIT.reduce((s, r) => s + r[3], 0);
  const dd = Object.values(DD_BASE).reduce((s, n) => s + n, 0);
  const rows = [
    ["Workbook low", CLOSES.workbook, loR, "The workbook close and the low end of every line. Tax at zero, insurance $6,000."],
    ["Workbook high", CLOSES.workbook, hiR, "Same close. Teak, keel joint, rig, inner forestay, and nav all go to the top."],
    ["Ask and the high column", CLOSES.ask, hiR, "The $299,000 ask holds and every line goes high. Totem’s advice is not to pay this."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, close, refit, note]) => {
    const allIn = close + dd + refit;
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}.</span></article>`;
  }).join("");
  const low = CLOSES.workbook + dd + loR;
  const high = CLOSES.workbook + dd + hiR;
  const ask = CLOSES.ask + dd + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in with tax at zero: ${money(low)} to ${money(high)} at a $250,000 close, ${money(ask)} if the $299,000 ask holds and every line goes high.`;
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
  const grid = document.getElementById("grid");
  let html = "";
  for (let i = 1; i <= PHOTO_COUNT; i++) {
    const cap = CAPTIONS[i] || `Photograph ${i} of ${PHOTO_COUNT}. Eden project folder.`;
    html += `<button type="button" data-i="${i}" aria-label="Open photo ${i}"><img src="photos/${String(i).padStart(2,"0")}.jpg" alt="${cap}" loading="lazy"></button>`;
  }
  grid.innerHTML = html;
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) openLightbox(Number(btn.dataset.i));
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
    boatName: "Wauquiez Pilot Saloon 47",
    boatLink: "",
    boatLOA: "47",
    boatVesselName: "EDEN"
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
    "Eden, 2005 Wauquiez Pilot Saloon 47, hull 003, Seward AK. Private sale, informal ask $299,000 with room to negotiate. Planning figures, not an offer. 10 Oct 2026.",
    "Workbook planning close is $250,000. The earlier .tru note said $275,000. Totem's band is the low $200s. Cash default $400,000 is the planning cap. Loan left blank.",
    "Insurance is the workbook's $6,000 unless the 2% switch is on. Tax is $0: already USCG documented 1179844. WA/OR use tax is a separate legal question. Not tax advice.",
    "Labor is hire. Delivery $8,000 is a mid-June to late-July Seward to Puget Sound window. The .tru note said $12,000 mid. Miss the window and it is about $20,000.",
    "Marathon MMS.009.2026, 26 Apr 2026: condition and value for reinsurance, rated Average, FMV $338,253. Findings: aft keel-hull separation, rudder cavitation, aging teak. Not a purchase survey.",
    "Engine Yanmar 4JH3-HTE SN E23705, 2,789.7 indicated hours. Owner first said he thought 7,000. Hours and maintenance are not logged. Meter photo outstanding."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Wauquiez PS47 - EDEN.tru";
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
  loadCase("workbook");
  document.getElementById("calc").addEventListener("input", recalc);
  document.getElementById("insAuto").addEventListener("change", () => {
    if (!document.getElementById("insAuto").checked) document.getElementById("txInsurance").value = INS_FIXED.toLocaleString("en-US");
    recalc();
  });
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
