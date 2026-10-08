/* Planning model for Sara Lynn.
   Same bones as the TRU All-In Calculator (v2.1).
   One price, the ask, then refit low/high.
   No lower close is in the file. The negotiated field stays editable.
   Tax defaults to zero. The 7.75% switch is a planning rate for a
   San Diego boat. It is not a determination of California tax.
   Not tax advice. Not an offer. */

const TAX_RATE = 0.0775;
const INS_RATE = 0.02;
const LIST = 295000;
const CASH = 400000;
const PHOTO_COUNT = 9;

const REFIT = [
  ["Anchor", "CQR 60 lb on G4 3/8 in chain, Lofrans 24v windlass. The CQR is light for a 48,623 lb boat. Inspect the rode. The high side is a primary anchor sized for her, not a second of the same.", 400, 2500],
  ["Dinghy", "No dinghy is listed. The stern arch has an outboard bracket. The low side leaves the hole. The high side is a tender and an outboard.", 0, 8000],
  ["Elec", "110v, plus 12v and 24v. The Heart Interface inverter/charger is aboard and not in use. The listing’s Xantrax Link 1000 and Link 10 are not operational. The port water-tank sender is not operational. The low side is diagnosis. The high side replaces the inverter and the monitors.", 800, 6000],
  ["Energy", "No solar is listed. Balmar MC-624 on 24v and MC-618 on 12v, both 2025. ProMariner ProNautic 24-30P and 12-40P. Keep the chargers. Buy the panels.", 4000, 14000],
  ["Energy", "Two Lifeline 8D AGM batteries on 24v, replaced in 2025, and two Powerstride 8A4D AGM batteries on 12v from 2021. They are not scrap. A lithium bank is the high side only, and only if someone chooses it.", 0, 12000],
  ["Mech", "No watermaker is listed. The low side stays at zero and names the hole. The high side is a cruising unit. Nothing on the boat is already that unit.", 0, 12000],
  ["Mech", "Air conditioning, with separate thermostats, is aboard. No diesel heater is listed. Heat for a Pacific passage is the high side. The low side stays at zero.", 0, 6000],
  ["Mech", "Onan 13.5MDKA2-1954, 13.5 kW, 1,282.3 hours. Service and a load test. This is not a generator replacement.", 600, 3500],
  ["Nav", "Raymarine P70s, i70s, EV-1, ACU400, E7 hybrid, ST70 pods, and a Plastimo Olympic 135. A wireless autopilot controller is aboard and its operation is unknown. Service the pilot that is installed.", 500, 2500],
  ["Nav", "No windvane is listed. One Raymarine pilot is the steering the listing describes. A vane is optional and stays at zero on the low side.", 0, 12000],
  ["Nav", "Icom IC-M802 with an AT-140 powers up. Operation is not confirmed, and there is no antenna. The Raymarine RL70C powers up, operation is not confirmed, and there is no antenna. The McMurdo MOB receiver is not operational.", 500, 4000],
  ["Prop", "Yanmar 4LHA-HTP, 160 hp, 1,394.8 hours, Kanzaki KM5A, feathering three-blade. Cutlass, Volvo 40 mm shaft seal, rudder bearing, and steering ram were done in 2021. The Lecomble & Schmitt LS 90 CT8 pump was replaced in 2026. Service reserve, not a replacement.", 2000, 8000],
  ["Hull", "Teak deck, toe rail, and cockpit were cleaned and sealed in 2026, not replaced. The deck is balsa-cored, which is what the listing says the construction is. The high side is moisture and fastenings. It is not a new-deck quote.", 1500, 20000],
  ["Hull", "Bottom paint in 2025. A refresh if it is due. Not a new coating system.", 0, 2500],
  ["Rigging", "Standing rigging replaced in 2026, double backstay. Mast painted in 2021 and polished in 2026. Mast wiring, VHF antenna, and Windex replaced in 2026. Lifelines in 2026. Inspection reserve, not a new rig.", 800, 4000],
  ["Sails", "The listing spells the sailmaker Neil Pride. Main and genoa, age not stated. Leisure Furl boom work in 2021. Profurl electric genoa furler serviced in 2021. Quantum cruising spinnaker with a sock. Inner forestay and staysail are not included. A self-tacking Lewmar track is fitted. The high side is cloth and a staysail.", 800, 12000],
  ["Safety", "The life-raft locker under the gangway has no life raft. Engine-room fire suppression is in place, and the agent bottle is past its 12-year inspection. Recertify or replace.", 1500, 7000],
  ["Other", "Contingency. A December 2025 survey is offered for review and has not been read.", 8000, 18000]
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
  1: "Under sail. Navy hull, a white stripe, teak on the deck and the cockpit, navy canvas, and a stern arch. The transom reads Sara Lynn, San Diego, CA.",
  2: "From above, under main and headsail. Teak decks, navy canvas over the cockpit, and a short wake.",
  3: "The saloon. Cream settees, an oval wood table, a smaller pedestal table, and a television in a side locker. A cabin shows through a doorway.",
  4: "A double cabin. Floral cover, a hatch overhead, an oval port, a small television, and an open door into a head.",
  5: "A head. White toilet, a pale green glass sink beyond, and a frosted shower door.",
  6: "A head, closer to the sink. Pale green glass basin, a wide mirror, white toilet, and a frosted door.",
  7: "A shower stall. White interior, a chrome bar and a handheld, frosted door slid aside.",
  8: "From a head, looking through a doorway to a double berth. Floral cover, and a hatch overhead.",
  9: "A double cabin from the foot of the berth. Floral cover, two pillows, a hatch, and an open door onto curved steps."
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

function loadAsk() {
  document.getElementById("negPrice").value = LIST.toLocaleString("en-US");
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
  const close = LIST;
  const ins = Math.round(close * INS_RATE);
  const tax = Math.round(close * TAX_RATE);
  const rows = [
    ["Low reserve", loR, "The ask, and the low column. Solar is in. The watermaker, the vane, the heater, the dinghy, and a lithium bank stay at zero."],
    ["Middle of the file", midR, "Every reserve at the middle, including half of a watermaker, half of a vane, and half of the teak line."],
    ["High reserve", hiR, "The ask, and every line at the top. Teak, solar, watermaker, vane, heat, sails, and a life raft all go high."]
  ];
  document.getElementById("cases").innerHTML = rows.map(([label, refit, note]) => {
    const allIn = close + dd + ins + refit;
    const taxed = allIn + tax;
    return `<article class="case"><em>${label} · ${money(close)}</em><strong>${money(allIn)}</strong><span class="fine">${note} Refit ${money(refit)}. Turn on the 7.75% switch and this card is ${money(taxed)}.</span></article>`;
  }).join("");
  const low = close + dd + ins + loR;
  const mid = close + dd + ins + midR;
  const ask = close + dd + ins + hiR;
  document.getElementById("tease").textContent =
    `Planning all-in at the ask, tax at zero: ${money(low)} on the low reserve, ${money(mid)} in the middle, ${money(ask)} if every line goes high.`;
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
    boatName: "Beneteau 57",
    boatLink: "https://swiftsureyachts.com/products/beneteau-57-sarah-lynn",
    boatLOA: "58.4",
    boatVesselName: "Sara Lynn"
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
    "Sara Lynn, 2003 Beneteau 57, San Diego ask $295,000. Planning figures, not an offer. 8 Oct 2026.",
    "Every preset path uses the ask. No lower close is in the file. Cash default $400,000 is the planning cap. Loan left blank.",
    "Insurance line is 2% of the price in use.",
    "Tax is $0 unless the 7.75% switch is on. That switch is a planning rate for a San Diego boat. It is not a determination of California sales or use tax.",
    "Delivery is not quoted and defaults to zero. She is already in San Diego.",
    "LOA on the specification is 58.4 ft. The short length field prints 57.0. Ratios use 58.4.",
    "Engine hours on the listing: 1,394.8. Generator hours: 1,282.3.",
    "December 2025 survey is offered for review and was not read for this file."
  ];
  const data = { version: "2.1", hull: "mono", labor: "hire", loaUnit: "ft", currency: "USD", currencyRate: 1, fields, refitRows, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "All In Calc Beneteau 57 - SARA LYNN.tru";
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
  loadAsk();
  document.getElementById("calc").addEventListener("input", recalc);
  document.getElementById("insAuto").addEventListener("change", recalc);
  document.getElementById("taxAuto").addEventListener("change", recalc);
  document.getElementById("loadAsk").addEventListener("click", loadAsk);
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
