/* Planning model for Paragon.
   Same bones as the TRU All-In Calculator (v2.1) file
   "All In Calc Wauquiez PS47 - PARAGON.tru".
   One price, purchase costs, then refit low/high.
   Tax defaults to zero: the Oregon-buyer 45-day Washington exit.
   The 8.9% switch is the missed-clock case. */

const TAX_RATE = 0.089;
const INS_RATE = 0.02;
const LIST = 379000;
const CASH = 400000;
const PHOTO_COUNT = 37;

const REFIT = [
  ["Anchor", "Keep the Rocna 33 kg and the extra 100 ft of chain. Inspect, and add rode if it is short of a Pacific passage.", 0, 1500],
  ["Anchor", "Keep the Fortress FX-23. Add rode or a snubber as found.", 200, 600],
  ["Anchor", "Windlass and chain-counter service.", 200, 600],
  ["Dinghy", "Keep the tender on the Kato davits. The list fights itself: Highfield 2021, an AB with a Nissan, a Tohatsu from November 2023. Service and chaps.", 400, 1500],
  ["Dinghy", "Optional later: an OC Tender sailing package in New Zealand. Leave this at zero if the davits already hold the tender.", 0, 20000],
  ["Elec", "Electrical tidy and a Victron-ready DC bus. The inverter aboard is an Xantrex 3000 on a mixed panel.", 1500, 3500],
  ["Elec", "A galvanic isolator is aboard. It does not make 230 V 50 Hz. This line stays at zero.", 0, 0],
  ["Energy", "Solar. Three Renogy 175 W panels, 525 W, from 2021. The route wants about 1,000 to 1,200 W.", 2500, 5500],
  ["Energy", "House bank. Keep the Lifeline 800 Ah from November 2023 for a season, or step to about 1,000 Ah of lithium.", 0, 8000],
  ["Energy", "Replace the Xantrex 3000 from November 2023 with a Victron MultiPlus 3000.", 1800, 2800],
  ["Energy", "Cerbo GX, a touch display, and the wiring.", 500, 900],
  ["Energy", "Victron isolation transformer, 3,600 W, so New Zealand and Australia 230 V shore power has a path to 120 V.", 600, 900],
  ["Hull", "Teak decks. Sanded and varnished in 2023, which is a flag. Recaulk on the low side. Local recore, or a later synthetic, on the high side.", 3000, 18000],
  ["Hull", "Balsa-core moisture samples. Mexico sun, three owners, no plugs on file.", 400, 4000],
  ["Hull", "Bottom sand and antifoul at Sidney. A 47 ft full stay plus paint labour.", 2800, 5500],
  ["Mech", "Rainman from 2021. Service the membranes and pickle it. Keep it portable.", 400, 1500],
  ["Mech", "Diesel hydronic heat. The listing is reverse-cycle air conditioning and heat, which will disappoint in 40°F water.", 6000, 12000],
  ["Mech", "Frigoboat keel cooler from 2024. Inspect the plate that lived in Mexico.", 200, 800],
  ["Mech", "Thru-hulls and seacocks as found. The aft-head thru-hull is 2024.", 300, 2000],
  ["Nav", "Keep the November 2020 B&G, the 2022 Hydrovane, and the tiller pilot. Service them.", 400, 1500],
  ["Nav", "Optional. A Jefa direct-drive pilot on its own arm, because a second electronic pilot is a preference, not a hole. The vane stays. Leave at zero if the vane is the plan.", 0, 13000],
  ["Nav", "Satellite communications.", 600, 1500],
  ["Prop", "Yanmar 4JH4-HTE, 110 hp. Hours have read 530 reported since April 2024. Other copies say 770, and a listing photo of the meter looks like the mid-700s. Oil and a 1,000-hour look.", 800, 4000],
  ["Prop", "Northern Lights genset, advertised at 244 hours. Service and a load test.", 400, 1500],
  ["Prop", "Max Prop and a 2021 PSS shaft seal. Inspect. A Shaft Shark is already fitted.", 200, 800],
  ["Rigging", "Standing rig. Age is not invoiced. Treat it as original 2008 wire until a receipt or a pull says otherwise.", 2000, 25000],
  ["Rigging", "Running rigging.", 800, 3000],
  ["Safety", "Life raft. Not clearly listed. Buy one, or recertify the one you find.", 800, 5500],
  ["Safety", "EPIRB. The listing says it needs recertification. Jacklines and PFDs are aboard.", 400, 1200],
  ["Sails", "Quantum HydraNet radial main and genoa from 2019, plus a furling asymmetric. Loft card, UV, slides.", 800, 4000],
  ["Sails", "2023 enclosure, dodger, and bimini. Mexican canvas. Restitch and windows as found.", 400, 2500],
  ["Other", "Sidney yard block. Published 47 ft averages at Westport, Van Isle, and Canoe Cove, GST on, 0.73 dollars to the Canadian dollar.", 2500, 6000],
  ["Other", "Spares.", 2000, 4000],
  ["Other", "Contingency.", 10000, 20000]
];

const DD_BASE = {
  ddSurvey: 2500,
  ddOilAnalysis: 250,
  ddHaulout: 700,
  ddRig: 800,
  ddSails: 400,
  ddDiesel: 900,
  ddTravel: 400,
  txBrokerage: 1500,
  txDelivery: 1500,
  txOther: 2000
};

const CAPTIONS = {
  1: "Under sail. White hull, in-mast main and a genoa, dodger up, windvane on the transom.",
  2: "At anchor with the sail cover on and the bimini up. A small file in the listing set.",
  3: "Aft cabin. Island berth, a port on each side, hatch overhead.",
  4: "Pullman cabin. Upper and lower berths beside the hanging locker.",
  6: "Head compartment. Shower stall, portlight, and the joinery at the door.",
  9: "Engine space under the companionway. The Yanmar, filters, and the raw-water hose.",
  11: "Mechanical hour meter in the listing photos. The wheels appear to read about 766, which matches ad copies that say 770 and not the line that says 530 reported.",
  15: "Raised saloon. Red settee, chart table, B&G plotter, and the factory switch panel under the windows.",
  19: "Wauquiez electrical panel. Three tank switches, a second battery bank, and the builder’s mark.",
  23: "Galley refrigerator. The plate on the door reads Isotherm.",
  27: "Forward cabin. Island berth, a settee to port, and lockers to starboard.",
  31: "B&G at the helm. This frame shows 19.7 feet of water and almost no boat speed.",
  35: "Cockpit. Teak sole, a Lewmar winch, and the wheel."
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
  const neg = { ceiling: 340000, base: 340000, ask: 379000 }[name];
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
    ["Ceiling path", 340000, loR, "Low reserves. The optional tender, lithium, and second pilot stay at zero."],
    ["Midpoint of the file", 340000, midR, "Every line at the middle, including half of those optional rows."],
    ["Ask and the high column", 379000, hiR, "The ask holds. Rig, teak, heat, lithium, a second pilot, and a new tender all go to the top."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, close, refit, note]) => {
    const ins = Math.round(close * INS_RATE);
    const allIn = close + dd + ins + refit;
    const taxed = allIn + Math.round(close * TAX_RATE);
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}. Add Washington tax and it is ${money(taxed)}.</span></article>`;
  }).join("");
  const ceiling = 340000 + dd + Math.round(340000 * INS_RATE) + loR;
  const base = 340000 + dd + Math.round(340000 * INS_RATE) + midR;
  const ask = 379000 + dd + Math.round(379000 * INS_RATE) + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in with tax at zero: ${money(ceiling)} on the ceiling path, ${money(base)} at the midpoint, ${money(ask)} if the ask holds and every line goes high.`;
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
    const cap = CAPTIONS[i] || `Listing photograph ${i} of ${PHOTO_COUNT}. Seattle Yachts listing, carried by Denison. YachtWorld id 10191914.`;
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
    boatLink: "https://www.denisonyachtsales.com/yachts-for-sale/paragon-47-wauquiez",
    boatLOA: "47",
    boatVesselName: "PARAGON"
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
    "Paragon, 2008 Wauquiez Pilot Saloon 47, hull 34, Anacortes ask $379,000. Planning figures, not an offer. 5 Oct 2026.",
    "Negotiated price on the ceiling path is $340,000. Cash default $400,000 is the planning cap. Loan left blank.",
    "Insurance line is 2% of the price in use. The companion .tru file was saved at $7,000.",
    "Tax is $0 unless the Washington switch is on. That switch is about 8.9% if an Oregon buyer misses the 45-day exit. Not tax advice.",
    "Labor in the source file is hire. Delivery $1,500 is Anacortes to Sidney.",
    "Hours on the current ad say 530 reported and have not moved on paper since April 2024. Other copies say 770. A listing photo of the meter appears to read about 766."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Wauquiez PS47 - PARAGON.tru";
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
