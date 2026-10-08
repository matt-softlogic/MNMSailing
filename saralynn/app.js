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
const PHOTO_COUNT = 117;

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
  ["Nav", "A listing photograph shows the Icom IC-M802 powered, display reading 20.000.0. That is not a transmission test, and the listing says there is no antenna. The Raymarine RL70C is on in a photograph and reads SCANNER NOT RESPONDING. The fixed VHF photograph reads WARNING! DSC NOT AVAILABLE. The McMurdo MOB receiver is not operational.", 500, 4000],
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
  1: "Under sail. Navy hull, a white cove stripe, teak toe rail, navy canvas, and a stern arch. The transom reads Sara Lynn, San Diego, CA.",
  2: "From above, under main and headsail. Teak deck, navy canvas, and a short wake.",
  3: "The saloon from aft. Cream leather settees, an oval wood table, a blue rug, skylights, and a cabin doorway beyond.",
  4: "A double cabin. Floral cover, an oval port, a small television, and a door toward a head.",
  5: "From a cabin into a head. A toilet, a pale green glass sink, a frosted glass door, and white towels.",
  6: "A head. A curved pale-green glass sink in a wood vanity, a wide mirror, a toilet in the foreground, and a skylight.",
  7: "A shower stall. White, with a chrome bar and a handheld.",
  8: "Down a companionway. A toilet on one side, a floral double berth through a doorway, and a hatch overhead.",
  9: "A double cabin from the foot. Floral cover, two pillows, and a hatch.",
  10: "Closer on a floral double. A small television on the forward bulkhead, and a door ajar.",
  11: "The curved green-glass sink and a chrome faucet.",
  12: "A head corner. Toilet, a ring, towels, a frosted door, and the floral berth beyond.",
  13: "Looking into the floral double.",
  14: "The saloon again. Cream settees, an oval table, a blue rug, a small pedestal table, and a cabin doorway.",
  15: "The same saloon from the opposite side. The navigation desk and the companionway stairs are at the left.",
  16: "A tighter view of the saloon. A settee, the oval table, and the blue rug.",
  17: "The saloon with curved stairs to starboard, a wall-mounted television, and the oval table.",
  18: "A settee corner, and a floral berth through the doorway.",
  19: "The saloon with the navigation desk and instrument screens, a pedestal table, and the stairs.",
  20: "A wider saloon. Skylights, the galley opening at the left, and two settees.",
  21: "A straight settee, a floor lamp, a pedestal table, and the companionway and stairs.",
  22: "Open pantry shelves in a wood locker, and a head beyond.",
  23: "The galley and a white head through an arch, looking aft toward the saloon.",
  24: "The galley. A double stainless sink, a three-burner stove, a refrigerator with a wood front, and a microwave above.",
  25: "The galley sink and counter, looking through an arch toward a settee.",
  26: "A white counter and a front-opening refrigerator under the counter.",
  27: "The stove, a toaster oven, a white fire extinguisher, and white counters.",
  28: "A microwave over a toaster oven, and a stainless refrigerator under the counter.",
  29: "The double sink and a fire extinguisher, with a settee through the doorway.",
  30: "The navigation desk, with instrument screens and a bottle rack, and a settee beyond.",
  31: "The companionway stairs, with the saloon and the oval table beyond.",
  32: "A wood hallway with a mirror, and a cabin through a doorway.",
  33: "A head. Green-glass sink, a toilet, and a mirror.",
  34: "The starboard watch cabin. A single berth, one pillow, and a small port.",
  35: "Looking from the owner cabin toward the saloon.",
  36: "The full-beam aft cabin. A striped double, white leather settees along both sides, and three ports.",
  37: "The striped double and an arched locker door.",
  38: "A desk or settee along the owner cabin, with circular hatches on the bulkhead.",
  39: "The striped double, a shaded lamp, and a nightstand.",
  40: "From the owner cabin into its head. A green sink, a toilet, and a mirror.",
  41: "That head. The toilet and the green sink.",
  42: "The owner shower. A white stall and a chrome bar.",
  43: "An SMX control panel. The green digits read 70.",
  44: "A corner of the aft cabin. The striped berth, wood lockers, and a wall television.",
  45: "Looking forward from the owner cabin, past a television and a settee.",
  46: "The engine room. A diesel with wiring and hoses, seen through open doors.",
  47: "A closer look at the engine from above.",
  48: "The Onan generator. A white cover with red lettering.",
  49: "Engine-room electrics. A white No-Step box, hoses, wiring, and a red extinguisher.",
  50: "Another view of the engine room. Hoses, filters, and a metal can.",
  51: "A ProMariner ProNautic 24-30P charger on a bulkhead.",
  52: "The navigation desk, instrument screens, and the curved pantry stairs.",
  53: "A Raymarine display, on, showing latitude and longitude.",
  54: "A Fusion MS-RA205 stereo. Bluetooth is on the screen.",
  55: "The Standard Horizon Eclipse DSC+, on, channel 16. The screen reads WARNING! DSC NOT AVAILABLE.",
  56: "The Raymarine Pathfinder RL70C, on. A chart of the coast is on the lower half, and the screen reads SCANNER NOT RESPONDING.",
  57: "The Icom IC-M802, powered. The display reads 20.000.0.",
  58: "An electrical panel with an Onan GenSet controller and analog gauges.",
  59: "A breaker panel, AC and DC, with a warning label.",
  60: "The galley microwave, close.",
  61: "The three-burner stove and the oven front.",
  62: "The oven door and its four knobs.",
  63: "The double galley sink.",
  64: "An open refrigerator. Wire baskets, and Frigoboat lettering on the metal.",
  65: "A refrigeration compressor with copper lines.",
  66: "Looking aft along the deck from the mast. The marina is behind, and a white mast fitting is in the foreground.",
  67: "The teak foredeck. A square hatch, the mast boot, and dock lines.",
  68: "The anchor locker open. The windlass, teak, and a blue sail cover.",
  69: "The bow cap, with BENETEAU lettering.",
  70: "The mast step and a white mast fitting, with the marina behind.",
  71: "The anchor locker, with chain and rode.",
  72: "The cockpit from the side deck. Navy dodger, the hard windscreen, and the helm wheel.",
  73: "A canvas-covered winch or sail on the cabin top, in the marina.",
  74: "Looking forward along the teak deck. Hatches, and the bow.",
  75: "A primary winch, teak, and the edge of the hard windscreen.",
  76: "The side deck. Teak, a white step and a rail, and the navy hull below.",
  77: "A wide view forward over the teak decks in the marina.",
  78: "The coachroof and hatches, from the cockpit.",
  79: "The side deck looking aft. Rails, and a dock.",
  80: "The cockpit coaming, winches, and teak steps.",
  81: "The mainsheet area. Clutches, a winch, teak, and BENETEAU on the coaming.",
  82: "A chrome primary winch with blue-flecked line.",
  83: "The helm under the navy dodger. The wheel, blue cockpit cushions, and the side decks.",
  84: "The cockpit settee. Blue cushions and a wood table.",
  85: "The helm and both cockpit settees, with the marina beyond the dodger.",
  86: "Looking forward from the helm under the dodger, with instruments overhead.",
  87: "The wheel and the pedestal compass.",
  88: "The helm from the side. A folding wood seat with a blue cushion.",
  89: "The engine control and a winch at the helm pedestal.",
  90: "The Yanmar helm gauges. The hour meter reads 013948 h. The temperature and oil-pressure needles are low, and the tach is not running.",
  91: "A speaker and a switch at the helm, with teak underfoot.",
  92: "A Raymarine autopilot screen listing devices found, including an EV-1 course computer.",
  93: "An open deck locker with a coiled hose.",
  94: "The dodger and the hard windscreen, from the side deck.",
  95: "Shore-power cords and hoses along the rail at the dock.",
  96: "The stern. The swim platform is down, with teak, navy topsides, and dock lines.",
  97: "The stern quarter at a dock. Navy hull, a teak cap, and fenders.",
  98: "The sheer. Navy topsides, a white stripe, and a teak toe rail.",
  99: "The stern with the platform down, and lines on the dock.",
  100: "The anchor locker open. Chain piled, and the windlass above.",
  101: "The boat at the dock. Navy canvas up, with palms and the marina.",
  102: "Under sail past a bridge pier. Main and headsail, navy hull.",
  103: "The stern quarter under sail at sunset. The transom reads Sara Lynn.",
  104: "Looking forward along the deck under sail. The dodger and the mainsail.",
  105: "The deck and the rail while sailing.",
  106: "Under sail, both sails, with a city skyline behind.",
  107: "Close under the mainsail at sunset. The hull and the stern arch.",
  108: "A wider sailing shot. Both sails, and a wake.",
  109: "Hauled. Navy hull, a white stripe, in slings.",
  110: "The bow on the hard. A round through-hull, and the white stripe.",
  111: "Under the hull. A wing keel with a bulb at the tip, a row of keel bolts, and the rudder behind.",
  112: "The rudder and a three-blade propeller, on the hard.",
  113: "The three-blade propeller, closer. It is bronze-colored.",
  114: "The rudder and the keel from the quarter, with the boat on stands.",
  115: "The bow, hauled, looking up the stem.",
  116: "Under sail, both sails, with a point of land behind.",
  117: "From above, under sail. Both sails, a wake, and darker water."
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
    const alt = cap.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const file = String(i).padStart(2, "0");
    html += `<button type="button" data-i="${i}" aria-label="Open photo ${file}"><img src="photos/${file}.jpg" alt="${alt}" width="1600" height="1067"></button>`;
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
