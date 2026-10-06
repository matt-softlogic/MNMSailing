/* Planning model for Mariana.
   Same bones as the TRU All-In Calculator (v2.1).
   One price, purchase costs, then refit low/high.
   Tax defaults to zero. The 5.5% switch is Maine sales or use tax
   if she is kept there. A nonresident removal exemption exists in
   statute and is not applied by this page. Not tax advice. */

const TAX_RATE = 0.055;
const INS_RATE = 0.02;
const LIST = 220000;
const CASH = 400000;
const PHOTO_COUNT = 13;

const REFIT = [
  ["Anchor", "Lewmar Ocean windlass, rebuilt in 2026. Rocna Vulcan 33, 60 m of chain, Mantus swivel. Inspect the rode. Do not buy a new anchor into this file.", 200, 800],
  ["Dinghy", "Highfield 310 from 2019, Yamaha 15 hp two-stroke, chaps from 2020, Simpson S175 davits. Service the two-stroke. Treat a replacement outboard as the high side.", 400, 2500],
  ["Elec", "The boat is 230 V and 50 Hz, a UK system. Map the shore-power path before a U.S. marina, and budget an isolation transformer if the inverter cannot feed both.", 1500, 4000],
  ["Energy", "Solar is 300 W on the arch, with an MPPT. The route wants about 1,000 to 1,200 W. The Rutland 1200 and the generator are the other two sources.", 2500, 8000],
  ["Energy", "House bank is 600 Ah of lithium, two 300 Ah cells. The year is not on the listing. Keep it if the BMS and the cells are healthy.", 0, 8000],
  ["Energy", "Dakar Combi 12/2500-100 inverter/charger, and a ProMariner ProISOCharge from 2024. Confirm the model is still supportable.", 400, 2500],
  ["Hull", "Dek-King replaced the teak decks in 2016. The seller says the old teak leaked and the price already reflects cosmetic veneer damage. Moisture-map the core. The high side is real remediation, not a new deck.", 2000, 15000],
  ["Hull", "Coppercoat from 2018, refreshed in 2023. Leave it on the low side. The high side is a refresh if the survey finds it tired.", 0, 2500],
  ["Mech", "Spectra 380C. No membrane age and no hours on the page. Service it and prove the output.", 400, 2500],
  ["Mech", "Eberspächer diesel heat is already aboard. Service it. This is not a boat that still needs a furnace bought.", 300, 1200],
  ["Mech", "Whisper Power 3,500 W generator, 230 V. Hours are not on the listing. Service and a load test, or a bigger repair if it will not carry a load.", 400, 3000],
  ["Nav", "Raymarine linear drive and an ST6000+. Service it and load-test it. It can be pilot A if it passes.", 400, 1500],
  ["Nav", "No windvane is listed. A second, independent pilot is the offshore hole. Leave this at zero if the existing drive is the plan.", 0, 12000],
  ["Prop", "Volvo Penta TMD22, 78 hp. The narrative says roughly 7,600 hours. The specification says about 7,500. Turbo and exhaust flex in 2026, starter in 2024. This reserve is not an engine replacement quote.", 10000, 40000],
  ["Prop", "Shaft 2019, PSS seal 2019, cutlass 2022, MaxProp rebuilt by PYI in 2022, rope cutter fitted. Inspect the line. Do not buy it again.", 400, 2000],
  ["Rigging", "Standing rigging new in January 2016, Spencer Rigging, with a full inspection including chainplates in 2025. Obtain that report. Carry a medium-term reserve. Do not buy a new rig on the low side.", 2000, 15000],
  ["Sails", "Yankee 2016, cleaned and repaired 2025. In-mast main 2013. Staysail described as original. Asymmetric with a top-down furler and bowsprit, 2019. The high side is cloth, not a new inventory.", 800, 6000],
  ["Safety", "Six-person raft, McMurdo EPIRB, ACR GlobalFix. The seller says safety gear may be out of date. Recertify or replace. Do not pay for uncertified gear.", 1500, 8000],
  ["Other", "Contingency.", 10000, 20000]
];

const DD_BASE = {
  ddSurvey: 2500,
  ddOilAnalysis: 250,
  ddHaulout: 700,
  ddRig: 800,
  ddSails: 400,
  ddDiesel: 1500,
  ddTravel: 800,
  txBrokerage: 1500,
  txDelivery: 0,
  txOther: 2000
};

const CAPTIONS = {
  1: "At anchor near sunset. White hull, a single blue stripe, navy canvas, and the arch aft.",
  2: "From above. Dek-King side decks, navy bimini, a panel on the arch, the Rutland on the rail, and a red dinghy astern.",
  3: "Hauled out. Wind generator, solar arch, davits, and the red dinghy on the ground. The yard is not named on the listing.",
  4: "Under sail on two headsails, with the navy dodger and the in-mast boom.",
  5: "Under way. Navy dodger over the cockpit.",
  6: "Deck at dusk. Hatches open, a furled sail along the boom, and the pulpit forward.",
  7: "From the deck, a furled headsail and a city skyline. The listing does not name the harbor.",
  8: "The stern arch. Solar panel overhead, Rutland above it, davits, a yellow horseshoe, and the dinghy.",
  9: "The arch and a harbor at dusk. The listing does not name the harbor.",
  10: "The red tender with black dots and an outboard, alongside a dock. The registration number in the frame is on the gray boat next to her.",
  11: "At anchor in clear water, the navy canvas up. The listing does not name the anchorage.",
  12: "Autumn. The name MARIANA on the quarter, the arch and the wind generator aft, a wooded shore behind.",
  13: "Calm water. The name MARIANA on the quarter, the stripe, and the wind generator on the arch."
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
  const neg = { ceiling: 200000, base: 210000, ask: 220000 }[name];
  document.getElementById("negPrice").value = neg.toLocaleString("en-US");
  document.getElementById("surveyDeduct").value = "";
  document.getElementById("insAuto").checked = true;
  document.getElementById("taxAuto").checked = false;
  recalc();
}

function staticCases() {
  const loR = REFIT.reduce((s, r) => s + r[2], 0);
  const hiR = REFIT.reduce((s, r) => s + r[3], 0);
  const midR = Math.round((loR + hiR) / 2);
  const dd = Object.values(DD_BASE).reduce((s, n) => s + n, 0);
  const rows = [
    ["Low path", 200000, loR, "A $200,000 close and the low column. The second pilot stays at zero. The engine line is a reserve, not a rebuild."],
    ["Middle of the file", 210000, midR, "Every line at the middle, including half of the engine reserve and half of a second pilot."],
    ["Ask and the high column", 220000, hiR, "Pay the ask. Engine reserve, deck remediation, rig, sails, and a second pilot all go to the top."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, close, refit, note]) => {
    const ins = Math.round(close * INS_RATE);
    const allIn = close + dd + ins + refit;
    const taxed = allIn + Math.round(close * TAX_RATE);
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}. Add Maine tax at 5.5% and it is ${money(taxed)}.</span></article>`;
  }).join("");
  const low = 200000 + dd + Math.round(200000 * INS_RATE) + loR;
  const mid = 210000 + dd + Math.round(210000 * INS_RATE) + midR;
  const ask = 220000 + dd + Math.round(220000 * INS_RATE) + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in with tax at zero: ${money(low)} on the low path, ${money(mid)} at the middle, ${money(ask)} if the ask holds and every line goes high.`;
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
    const cap = CAPTIONS[i] || `Seller listing photograph ${i} of ${PHOTO_COUNT}.`;
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
    boatName: "Moody 47",
    boatLink: "https://www.lanotravels.com/2001-moody-47-mariana/",
    boatLOA: "47.67",
    boatVesselName: "MARIANA"
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
    "Mariana, 2001 Moody 47, Yarmouth, Maine, ask $220,000. Planning figures, not an offer. 6 Oct 2026.",
    "The low path uses a $200,000 close. The middle uses $210,000. Cash default $400,000 is the planning cap. Loan left blank.",
    "Insurance line is 2% of the price in use.",
    "Tax is $0 unless the Maine switch is on. That switch is 5.5%. A nonresident who removes the boat may have a statutory exemption. Not tax advice.",
    "Delivery from Yarmouth is not quoted and defaults to zero.",
    "Engine hours: the narrative says roughly 7,600 and the specification says about 7,500."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Moody 47 - MARIANA.tru";
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
  loadCase("ceiling");
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
