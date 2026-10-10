/* Planning model for Second Wind.
   Same bones as the TRU All-In Calculator (v2.1).
   The project study names one planning close, $295,000.
   The high card uses the ask. Tax defaults to zero.
   The 6% switch is the Florida state rate as a planning input.
   It does not decide Florida sales or use tax. Not an offer. */

const TAX_RATE = 0.06;
const INS_RATE = 0.02;
const LIST = 319900;
const CLOSE = 295000;
const CASH = 400000;
const PHOTO_COUNT = 29;

const REFIT = [
  ["Anchor", "The listing says an anchor on the bow and a windlass with a remote. It does not name the anchor or the chain. The low side is an inspection. The high side is a primary sized for a 26,014 lb boat.", 400, 2500],
  ["Dinghy", "2020 Zodiac Cadet 270, aluminum hull, 8 ft 10 in, and a 2021 Tohatsu 9.8 hp. Service them. Do not buy a tender into the low column.", 300, 1500],
  ["Elec", "12v and 110v. A Victron 2,000 watt inverter is listed. The battery-charger line on the equipment list is blank. The low side finds the charger. The high side buys one.", 400, 2500],
  ["Energy", "Two large soft panels under the boom. No wattage is printed. Keep them on the low side. The high side is a hard array with a stated output.", 0, 8000],
  ["Energy", "Ten AGM batteries replaced in 2025: four house, four bow thruster, one generator, one engine. Amp-hours are not printed. Leave them on the low side.", 0, 4000],
  ["Mech", "Rainman watermaker, 110v, listed at 26 to 37 gallons per hour. That is a dock or generator machine until someone shows it making water under way. Service it and prove the output.", 400, 2500],
  ["Mech", "No diesel heater is listed. The low side leaves the hole. The high side buys heat for a boat that may see New Zealand.", 0, 6000],
  ["Nav", "A Raymarine autopilot is named. Operation is not confirmed. No windvane is listed. The low side leaves a second way to steer at zero. The high side is a vane or a second pilot.", 0, 12000],
  ["Hull", "Bottom painted in 2025. Leave the paint on the low side.", 0, 1500],
  ["Rigging", "Standing rigging replaced December 2025. The in-mast furling spindle was replaced the same year. This is not a new-rig purchase. It is a survey of work that is newer than any survey in the packet. No survey was read.", 800, 4000],
  ["Sails", "In-mast furling main. Year not stated. Furling genoa replaced in 2025. The high side is cloth for the main, not a second inventory.", 800, 8000],
  ["Safety", "No life raft is listed. The low side is a recertified raft if one is aboard and the listing omitted it. The high side buys one.", 1500, 8000],
  ["Prop", "Yanmar 4JH5CE, 54 hp, 382 hours, Yanmar SD-60 saildrive fitted in 2025 in place of Dock & Go. The class card’s factory engine is a 4JH4TE, 75 hp. This reserve is a look at the new drive, not a horsepower swap.", 800, 4000],
  ["Nav", "Axiom Pro 9 inch from 2024, networked, plus a Garmin standalone plotter. Raymarine radar, wind, and speed and depth. VHF and AIS are named without models. Prove the radar and the pilot.", 400, 2000],
  ["Mech", "Cummins Onan 6MDKBJ-1100C, 6 kW, 210 hours. Chilled-water air conditioning is the load. Service it and load-test it.", 400, 2500],
  ["Other", "Contingency. The listing also names a Star Link mount, spelled that way, and does not say a terminal is aboard.", 4000, 10000]
];

const DD_BASE = {
  ddSurvey: 2500,
  ddOilAnalysis: 250,
  ddHaulout: 900,
  ddRig: 800,
  ddSails: 400,
  ddDiesel: 1500,
  ddTravel: 1500,
  txBrokerage: 1500,
  txDelivery: 0,
  txOther: 2000
};

const CAPTIONS = {
  1: "Stern quarter at a dock. White hull, a dark cove stripe, a dark bimini, and an American flag. The listing does not put the name in this crop.",
  2: "From the dock, looking aft along the starboard side. Dark canvas, twin wheels, and the flag.",
  3: "The starboard side in a marina. White topsides, a dark stripe, and the mast.",
  4: "A wider starboard view. The hull number 5 is on the bow. The listing does not explain that digit.",
  5: "The stern. A fold-down swim platform, dark canvas, twin wheels, and the flag.",
  6: "The starboard helm seat. BENETEAU is on the back of the seat. A wheel and the bimini.",
  7: "The cockpit from the stern. Twin wheels, dark canvas over both helms, and a yellow horseshoe.",
  8: "Looking forward from the helm. The companionway, both wheels, and the mainsheet area.",
  9: "The cockpit from the side deck. Covered winches, a wood deck, and the bimini.",
  10: "The same cockpit, closer. Covered winches and the wheels.",
  11: "A layout drawing. Two cabins and two heads, a saloon, and a galley. It is a drawing, not a photograph of this interior.",
  12: "The saloon from forward. A settee with a striped throw, a table, the galley to port, and hull windows.",
  13: "The saloon table and settees. Dark placemats, a striped cushion, and a wide window.",
  14: "The galley to port. A stove, a sink, a microwave, and a wood counter.",
  15: "The saloon from the galley. The table, both settees, and windows on both sides.",
  16: "The galley counter and the back of a settee. A fire extinguisher is on the sole.",
  17: "Looking aft in the saloon. A television, the companionway door open, and papers on the bulkhead. The papers are not read here.",
  18: "A wider saloon. The table, the television, the galley, and windows down both sides.",
  19: "The galley from the saloon. Stove, sink, microwave, and a wood counter in the foreground.",
  20: "A double berth. A white quilt, a net along the hull, and a port.",
  21: "The same berth from the foot. A black case with Jackery lettering sits on the sole. The listing does not name it as the house bank.",
  22: "The berth from the doorway. Quilt, net, and a hull port.",
  23: "The berth and the hanging locker. A small screen is at the left edge.",
  24: "The berth from the doorway, with an overhead hatch and a jacket on the right.",
  25: "A second double. A gray cover, a net overhead, and a turquoise cloth.",
  26: "That berth from the side. Gray cover, wood lockers, and the net.",
  27: "A shower stall. White, a handheld, and a wood vanity beyond.",
  28: "A head. A white sink, a toilet, and a mirror.",
  29: "The engine under a companionway hatch. A Yanmar cover, filters, and hoses. The hour meter is not in this frame."
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
  const neg = { ceiling: CLOSE, base: CLOSE, ask: LIST }[name];
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
    ["Planning close, low reserve", CLOSE, loR, "The $295,000 figure is the planning close from the project study. It is not an offer. Heat and a second way to steer stay at zero."],
    ["Planning close, middle reserve", CLOSE, midR, "The same close. Every reserve at the middle, including half of a heater and half of a vane or a second pilot."],
    ["Ask and the high column", LIST, hiR, "Pay the ask. Solar, heat, a vane, sails, and a raft all go to the top. Delivery is still zero because nobody has quoted it."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, close, refit, note]) => {
    const ins = Math.round(close * INS_RATE);
    const allIn = close + dd + ins + refit;
    const taxed = allIn + Math.round(close * TAX_RATE);
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}. Add the 6% switch and it is ${money(taxed)}.</span></article>`;
  }).join("");
  const low = CLOSE + dd + Math.round(CLOSE * INS_RATE) + loR;
  const mid = CLOSE + dd + Math.round(CLOSE * INS_RATE) + midR;
  const ask = LIST + dd + Math.round(LIST * INS_RATE) + hiR;
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
    const cap = CAPTIONS[i] || `Listing photograph ${i} of ${PHOTO_COUNT}.`;
    const alt = cap.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const file = String(i).padStart(2, "0");
    html += `<button type="button" data-i="${i}" aria-label="Open photo ${file}"><img src="photos/${file}.jpg" alt="${alt}" width="1440" height="1080"></button>`;
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
  box.querySelector("img").src = `photos/${String(i).padStart(2, "0")}.jpg`;
  box.querySelector("p").textContent = CAPTIONS[i] || `Photo ${i} of ${PHOTO_COUNT}`;
}
function move(delta) {
  openLightbox(((current - 1 + delta + PHOTO_COUNT) % PHOTO_COUNT) + 1);
}

function downloadTru() {
  const saleFields = ["listPrice","negPrice","surveyDeduct","cash","loan","ddSurvey","ddOilAnalysis","ddHaulout","ddRig","ddSails","ddDiesel","ddTravel","txBrokerage","txInsurance","txTaxes","txDelivery","txOther"];
  const fields = {
    boatName: "Beneteau Sense 46",
    boatLink: "https://murrayyachtsales.com/yacht-details/?id=82464&vessel=2842882",
    boatLOA: "46.32",
    boatVesselName: "Second Wind"
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
    "Second Wind, 2014 Beneteau Sense 46, Key West, ask $319,900. Planning figures, not an offer. 10 Oct 2026.",
    "The project study uses a $295,000 planning close. The high card uses the ask. Cash default $400,000 is the planning cap. Loan left blank.",
    "Insurance line is 2% of the price in use.",
    "Tax is $0 unless the 6% switch is on. That switch is the Florida state rate as a planning input. A nonresident removal rule exists and is not applied here. Not tax advice.",
    "Delivery from Key West is not quoted and defaults to zero.",
    "Engine: Yanmar 4JH5CE, 54 hp, 382 hours. Class card factory engine is 4JH4TE, 75 hp. Generator 210 hours.",
    "Listing draft 5 ft 9 in. Class deep keel 6.73 ft. Class shallow note 5.75 ft. Denison highlight prints 5 ft 0 in."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Beneteau Sense 46 - SECOND WIND.tru";
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
