/* Planning model for Pegasus.
   Same bones as the TRU All-In Calculator (Sailing Totem / TRU Coaching, v2.1):
   one price, purchase costs, then refit low/high.
   The three cases follow the Peregrine workbook: low close + low reserve,
   base close + midpoint reserve, high close + high reserve. */

const TAX_RATE = 0.0775;
const INS_RATE = 0.02;
const LIST = 249000;
const CASH = 400000;

const REFIT = [
  ["Anchor", "Rode and swivel check. Rocna primary and a 2023 Lewmar windlass are already aboard.", 0, 900],
  ["Cabin", "Soft goods. Joinery is custom; cushions date from 2009 unless they were replaced off the list.", 800, 3500],
  ["Dinghy", "2017 Highfield 310 and 9.8 hp Tohatsu. Service, tubes, carburetor.", 250, 1200],
  ["Elec", "House bank, inverters, and solar are done. Shore cord and galvanic protection only.", 0, 600],
  ["Energy", "Lithium install year is unpublished. Watermaker membranes and a controller check.", 600, 4500],
  ["Hull", "Awlgrip and bottom paint are January 2026. Reserve is deck core and keel-joint surprises.", 2000, 12000],
  ["Mech", "Fischer Panda at 405 hours, thruster batteries, pumps.", 800, 2500],
  ["Nav", "Zeus3, radar, Starlink, and Iridium are aboard. Charts and a spare mic.", 200, 700],
  ["Prop", "Yanmar 4JH4-HTE at 2,328 hours. Service through a partial top end.", 3000, 16000],
  ["Rigging", "Standing rigging replaced 2019. Chainplates are not stated as replaced.", 0, 6500],
  ["Safety", "Raft mounts exist. Service a current raft, or buy one. EPIRB date unknown.", 900, 4500],
  ["Sails", "Main, jib, asymmetric, and storm sail are called new. Years are not on the list.", 0, 4000],
  ["Other", "Cruise RO service and a short survey punch list.", 500, 2500]
];

const DD_BASE = {
  ddSurvey: 2400,
  ddOilAnalysis: 180,
  ddHaulout: 1800,
  ddRig: 750,
  ddSails: 400,
  ddDiesel: 900,
  ddTravel: 1600,
  txBrokerage: 1400,
  txDelivery: 0,
  txOther: 0
};

const CAPTIONS = {
  1: "Marlin Blue topsides on the Harbor Island dock. Awlgrip dated January 2026.",
  2: "Starboard bow. The stainless rail runs the length of the deck.",
  5: "Transom: Pegasus, hailing port Oriental, North Carolina. Solar over the arch, enclosure up.",
  11: "Saloon and navigation station. Cherry joinery, new salon windows in the listing.",
  21: "Saloon bulkhead, settee, and television.",
  31: "Companionway. The center cockpit puts the owner's cabin aft of this lobby.",
  33: "Chelsea clock and barometer on the cherry bulkhead.",
  56: "B&G at the helm. Vulcan display beside the keypad. The primary plotter is a 12-inch Zeus3.",
  66: "Companionway panel: B&G depth and speed, clinometer, Sony audio."
};

const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
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
  const neg = { low: 230000, base: 240000, high: 249000 }[name];
  document.getElementById("negPrice").value = neg.toLocaleString("en-US");
  document.getElementById("surveyDeduct").value = "";
  document.getElementById("ddTravel").value = (name === "high" ? 3100 : 1600).toLocaleString("en-US");
  document.getElementById("insAuto").checked = true;
  recalc();
}

function staticCases() {
  const loR = REFIT.reduce((s, r) => s + r[2], 0);
  const hiR = REFIT.reduce((s, r) => s + r[3], 0);
  const midR = Math.round((loR + hiR) / 2);
  const dd = Object.values(DD_BASE).reduce((s, n) => s + n, 0);
  const rows = [
    ["Low", 230000, dd, loR],
    ["Base", 240000, dd, midR],
    ["High", 249000, dd + 1500, hiR]
  ];
  const host = document.getElementById("cases");
  host.innerHTML = rows.map(([label, close, diligence, refit]) => {
    const ins = Math.round(close * INS_RATE);
    const tax = Math.round(close * TAX_RATE);
    const withTax = close + diligence + ins + tax + refit;
    const noTax = close + diligence + ins + refit;
    return `<article class="case"><em>${label} close ${money(close)}</em><strong>${money(withTax)}</strong><span class="fine">With San Diego tax. ${money(noTax)} if tax is zero. Refit reserve ${money(refit)}.</span></article>`;
  }).join("");
  const lowAll = 230000 + dd + Math.round(230000 * INS_RATE) + Math.round(230000 * TAX_RATE) + loR;
  const baseAll = 240000 + dd + Math.round(240000 * INS_RATE) + Math.round(240000 * TAX_RATE) + midR;
  const highAll = 249000 + dd + 1500 + Math.round(249000 * INS_RATE) + Math.round(249000 * TAX_RATE) + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in with San Diego tax: ${money(lowAll)} low, ${money(baseAll)} base, ${money(highAll)} high.`;
}

function renderRefit() {
  const body = document.getElementById("refitBody");
  body.innerHTML = REFIT.map((r, i) => `
    <label class="rrow">
      <span>${r[1]}</span>
      <input data-lo id="lo-${i}" type="text" value="${r[2].toLocaleString("en-US")}" inputmode="numeric">
      <input data-hi id="hi-${i}" type="text" value="${r[3].toLocaleString("en-US")}" inputmode="numeric">
    </label>`).join("");
}

function renderGallery() {
  const grid = document.getElementById("grid");
  let html = "";
  for (let i = 1; i <= 95; i++) {
    const cap = CAPTIONS[i] || `Listing photograph ${i} of 95. California Yacht Sales, photographed by Tom Bossenger.`;
    html += `<button type="button" data-i="${i}" aria-label="Open photo ${i}"><img src="photos/${String(i).padStart(2,"0")}.jpg" alt="${cap}" loading="lazy" width="980" height="652"></button>`;
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
  box.querySelector("p").textContent = CAPTIONS[i] || `Photo ${i} of 95`;
}
function move(delta) {
  openLightbox(((current - 1 + delta + 95) % 95) + 1);
}

function downloadTru() {
  const saleFields = ["listPrice","negPrice","surveyDeduct","cash","loan","ddSurvey","ddOilAnalysis","ddHaulout","ddRig","ddSails","ddDiesel","ddTravel","txBrokerage","txInsurance","txTaxes","txDelivery","txOther"];
  const fields = {
    boatName: "Hunter 50 Center Cockpit",
    boatLink: "https://www.californiayachtsales.com/boat/2009/hunter/50-center-cockpit/1673/",
    boatLOA: "50",
    boatVesselName: "Pegasus"
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
    "Pegasus, 2009 Hunter 50 CC, San Diego ask $249,000. Planning figures, not an offer. 5 Oct 2026.",
    "Insurance line is 2% of the price in use, the same method as the other TRU calcs.",
    "Tax line is San Diego combined 7.75% when the switch is on. California has no dollar cap. Zero means a removal case. Not tax advice.",
    "Refit lines are reserves. Lithium, solar, sails, rig, watermaker, hard dodger, Awlgrip, and the dinghy are already in the listing.",
    "Engine hours are 2,328. Lithium year, chainplates, sail years, and the keel (listed draft 5 ft 6 in, listed weight matches the deep keel) are open questions.",
    "Cash default $400,000 is the planning cap used on the companion TRU workbooks. Change it."
  ];
  const data = { version: "2.1", hull: "mono", labor: "diy", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Hunter 50 CC - PEGASUS.tru";
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
    document.getElementById(id).value = val ? val.toLocaleString("en-US") : "";
  });
  loadCase("base");
  document.getElementById("calc").addEventListener("input", recalc);
  document.getElementById("insAuto").addEventListener("change", recalc);
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
