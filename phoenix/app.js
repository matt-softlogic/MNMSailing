/* Planning model for Phoenix.
   Same bones as the TRU All-In Calculator (v2.1).
   Lines are planning estimates built 12 Oct 2026 from the BVI Yacht Sales
   listing, the broker's 26 Aug 2026 email, and the 22 Jun 2025 hull repair report.
   The only close on this page is the ask, $395,000. Not an offer, not tax advice. */

const INS_RATE = 0.02;
const INS_FIXED = 8000;
const LIST = 395000;
const CASH = 400000;
const PHOTO_COUNT = 29;
const CLOSES = { ask: 395000 };

const REFIT = [
  ["Energy", "Solar. Two 120 W portable panels are aboard. The brief asks for 800 W or more, which on a PS47 likely means an arch or a bimini array.", 4000, 12000],
  ["Elec", "Shore power. The spec sheet lists 110/230 V, 50/60 Hz shore power and a shore isolation transformer already aboard. The boat circuits stay 230 V: an inlet adapter, a few 120 V outlets, and a check of the chargers on 60 Hz.", 500, 1500],
  ["Hull", "July 2024 grounding, Anambas. Purchase-survey check of the repaired grid, keel bolts, and the keel-to-hull joint. Zero if it comes back clean.", 0, 20000],
  ["Hull", "Teak decks, 2015. Condition not described in the listing. Recaulk on the low side is folded into contingency.", 0, 20000],
  ["Prop", "Yanmar 4JH4-HTE, about 3,250 hours. Service, injectors, heat exchanger, and the drive train. A major on the high side.", 1000, 15000],
  ["Other", "Delivery top-up. The seller may move her to the Med and then the Caribbean. The base delivery line assumes a Caribbean or Panama handover; a Seychelles or Med start costs more.", 0, 20000],
  ["Nav", "Navigation refresh. Three Raymarine MFDs, Starlink, Iridium, AIS, and ForwardScan are aboard. No second autopilot is budgeted: the ST50 has a full spare unit. Software, sensors, and US charts.", 0, 3000],
  ["Safety", "Life raft service and recertification of the listed kit: raft, AIS, PLB, drogue, survival suits, grab bag.", 300, 2000],
  ["Sails", "Sails after 48,000-plus miles. Loft inspection, repair, or a new headsail.", 1000, 10000],
  ["Other", "Spares. The spec sheet lists a full set aboard.", 0, 1000],
  ["Other", "Import, documentation, and a US broker for a foreign-flagged boat. Not tax advice.", 0, 6000],
  ["Other", "Contingency.", 3000, 12000]
];

const DD_BASE = {
  ddSurvey: 3500,
  ddOilAnalysis: 250,
  ddHaulout: 1500,
  ddRig: 800,
  ddSails: 400,
  ddDiesel: 1200,
  ddTravel: 5000,
  txBrokerage: 1500,
  txInsurance: INS_FIXED,
  txTaxes: 0,
  txDelivery: 25000,
  txOther: 2000
};

const CAPTIONS = {
  1: "Phoenix alongside. The broker’s main image, and the hero frame.",
  2: "At anchor below the cliffs.",
  3: "In harbor, stern-to.",
  4: "The transom: Phoenix, the cockpit, and the twin wheels.",
  5: "Under way, looking aft along the topsides.",
  6: "Under sail on open water.",
  7: "From the masthead. Teak decks and the raised saloon roof.",
  8: "Cockpit. Teak sole, twin wheels, and the instrument pods.",
  9: "Helm pod with three Raymarine displays.",
  10: "Cockpit cover and the dinghy outboard on the rail.",
  11: "Raised saloon to the nav station. The windows are the reason for the boat.",
  12: "Nav station. Main display, panel, and radios.",
  13: "Saloon dinette, looking aft.",
  14: "Saloon settee and table under the raised windows.",
  15: "Pilot Saloon 47 layout drawing. Class, not this boat’s survey.",
  16: "Owner’s cabin.",
  17: "Companionway passage below.",
  18: "Forward cabin.",
  19: "Bunk cabin.",
  20: "A double cabin with the settee.",
  21: "Head and vanity.",
  22: "Shower stall.",
  23: "Head with the shower behind.",
  24: "Navigation and radio electronics, out of the boat.",
  25: "Helm pod covers on the Raymarine displays.",
  26: "Engine space.",
  27: "Victron electrical installation.",
  28: "Equipment bay.",
  29: "The tender, PHOENIX on the tube, on deck."
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
    ["Ask, low column", CLOSES.ask, loR, "The $395,000 ask and the low end of every line. Tax at zero, insurance $8,000, delivery $25,000."],
    ["Ask, high column", CLOSES.ask, hiR, "Same price. Structure, teak, engine, delivery, and sails all go to the top."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, close, refit, note]) => {
    const allIn = close + dd + refit;
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}.</span></article>`;
  }).join("");
  const low = CLOSES.ask + dd + loR;
  const high = CLOSES.ask + dd + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in at the $395,000 ask, delivered toward Puget Sound, tax at zero: ${money(low)} to ${money(high)}.`;
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
    const cap = CAPTIONS[i] || `Photograph ${i} of ${PHOTO_COUNT}. Phoenix broker set.`;
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
    boatLink: "https://bviyachtsales.com/yacht/2842689/2015-Wauquiez-47-PS47-Phoenix/",
    boatLOA: "47",
    boatVesselName: "PHOENIX"
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
    "Spec sheet update 12 Oct 2026: ST50 plus full spare, 110/230 V 50/60 Hz shore power with isolation transformer, LiFePO4 400 A, 4,000 W inverter, Balmar 250 A second alternator, 860 L fuel, 500 L water.",
    "Phoenix, 2015 Wauquiez Pilot Saloon 47, the last PS47 built, one owner. Lying Seychelles. Ask $395,000, BVI Yacht Sales. Planning figures, not an offer. 12 Oct 2026.",
    "The broker's 26 Aug 2026 email calls her a 2016. The listing says 2015. Confirm.",
    "July 2024 grounding in the Anambas, Indonesia: keel, hull, internal grid. Repaired in Phuket 2024-25 under a surveyor. Report dated 22 Jun 2025. Disclosed by the broker.",
    "Draft 8 ft 0 in on the listing, 2.10 m (6 ft 11 in) in the repair report. Unresolved.",
    "Engine Yanmar 4JH4-HTE 110 hp, about 3,250 hours. 48,000+ miles. 230 V / 50 Hz.",
    "Insurance $8,000 unless the 2% switch is on. ST50 has a full spare. Shore isolation transformer and 50/60 Hz shore power aboard per the spec sheet. Fuel 860 L. Tax $0 here; import and use tax for a foreign-flagged boat are separate questions. Not tax advice. Delivery $25,000 base, with a top-up line."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Wauquiez PS47 - PHOENIX.tru";
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
