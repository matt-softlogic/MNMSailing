/* Planning model for Paragon.
   Same bones as the TRU All-In Calculator (v2.1) file
   paragon/all-in-calc-wauquiez-ps47-paragon.tru.
   One price, purchase costs, then refit low/high.
   Tax defaults to zero: the Oregon-buyer 45-day Washington exit.
   The 8.9% switch is the missed-clock case. */

const TAX_RATE = 0.089;
const INS_RATE = 0.02;
const LIST = 379000;
const CASH = 400000;
const LISTING_COUNT = 37;
const PHOTO_COUNT = 64; // 1–37 listing, 38–64 Matt’s walk-through, 26 Aug 2026

const REFIT = [
  ["Anchor", "Keep the Rocna 33 kg and the extra 100 ft of chain. Inspect, and add rode if it is short of a Pacific passage.", 0, 1500],
  ["Anchor", "Keep the Fortress FX-23. Add rode or a snubber as found.", 200, 600],
  ["Anchor", "Windlass and chain-counter service.", 200, 600],
  ["Dinghy", "Keep the tender: a Highfield aluminium-hull RIB in tan chaps (confirmed by Matt), the 2021 Highfield on the upgrade list. The outboard appears to be the November 2023 Tohatsu on the same list. The highlights still say an 8 hp Nissan. The owner is to confirm horsepower. Service.", 400, 1500],
  ["Dinghy", "Optional later: an OC Tender sailing package in New Zealand. Leave this at zero if the davits already hold the tender.", 0, 20000],
  ["Elec", "Rewire and tidy the Victron MultiPlus 12/3000/120 already aboard. Matt’s photos show it installed, but poorly wired. Fusing, cable runs, strain relief, AC in and out, labels, done by an ABYC electrician. This is an estimate, not a quote.", 2000, 4500],
  ["Elec", "A galvanic isolator is aboard. It does not make 230 V 50 Hz. This line stays at zero.", 0, 0],
  ["Energy", "Solar. The listing says three Renogy 175 W panels, 525 W, from 2021. No panels show in Matt’s photos, so what is aboard is unknown until the walk. The route wants about 1,000 to 1,200 W.", 2500, 5500],
  ["Energy", "House bank. Keep the Lifeline 800 Ah from November 2023 for a season, or step to about 1,000 Ah of lithium.", 0, 8000],
  ["Energy", "Cerbo GX, a touch display, and the wiring.", 500, 900],
  ["Energy", "Victron isolation transformer, 3,600 W, so New Zealand and Australia 230 V shore power has a path to 120 V.", 600, 900],
  ["Hull", "Teak decks. Sanded and varnished in 2023, which is a flag. Recaulk on the low side. Local recore, or a later synthetic, on the high side.", 3000, 18000],
  ["Hull", "Balsa-core moisture samples. Mexico sun, three owners, no plugs on file.", 400, 4000],
  ["Hull", "Bottom sand and antifoul at Sidney. A 47 ft full stay plus paint labour.", 2800, 5500],
  ["Mech", "Rainman from 2021. Service the membranes and pickle it. Keep it portable.", 400, 1500],
  ["Mech", "Diesel hydronic heat. Zero in the low plan: no Pacific Northwest winter aboard, reverse-cycle heat on shore power. The high side buys a Planar or Webasto.", 0, 12000],
  ["Mech", "Frigoboat keel cooler from 2024. Inspect the plate that lived in Mexico.", 200, 800],
  ["Mech", "Thru-hulls and seacocks as found. The aft-head thru-hull is 2024.", 300, 2000],
  ["Nav", "Keep the November 2020 B&G, the 2022 Hydrovane, and the tiller pilot. Service them.", 400, 1500],
  ["Nav", "Optional. A Jefa direct-drive pilot on its own arm, because a second electronic pilot is a preference, not a hole. The vane stays. Leave at zero if the vane is the plan.", 0, 13000],
  ["Nav", "Starlink is aboard (Matt). Mount, DC power, and cable tidy as found. The service plan is a running cost, not refit.", 0, 500],
  ["Prop", "Yanmar 4JH4-HTE, 110 hp. 766 hours, verified on the meter by Matt. The ad’s “530 reported” is wrong. There are no service records yet. Oil and a 1,000-hour look.", 800, 4000],
  ["Prop", "Northern Lights genset, advertised at 244 hours. Service and a load test.", 400, 1500],
  ["Prop", "Max Prop and a 2021 PSS shaft seal. Inspect. A Shaft Shark is already fitted.", 200, 800],
  ["Rigging", "Standing rig replacement. Required in every plan: no invoice, so it is 2008 wire. Hired, with terminals and a furler look. An estimate until a rigger quotes.", 16000, 25000],
  ["Rigging", "Running rigging.", 800, 3000],
  ["Safety", "Life raft is aboard: a Viking RescYou 6-person in the cockpit locker (Matt’s photos; the Seattle Yachts copy says it needs certifying). The canister label’s last service stamp is 05/2018. Recertify and repack. If it fails the test, a new raft is not in this line.", 900, 2000],
  ["Safety", "EPIRB. The listing says it needs recertification. Jacklines and PFDs are aboard.", 400, 1200],
  ["Sails", "Quantum HydraNet radial main and genoa from 2019, plus a furling asymmetric. Loft card, UV, slides.", 800, 4000],
  ["Sails", "Canvas before Mexico. The listing dates the dodger, bimini, and enclosure to 2023. Matt’s walk-through says they need attention: restitching, windows, zips, chafe. Partial replacement on the high side. Estimate.", 1500, 6000],
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
  11: "Mechanical hour meter in the listing photos. It reads about 766, which matches the meter Matt verified in August 2026. The ad’s “530 reported” is wrong.",
  15: "Raised saloon. Red settee, chart table, B&G plotter, and the factory switch panel under the windows.",
  19: "Wauquiez electrical panel. Three tank switches, a second battery bank, and the builder’s mark.",
  23: "Galley refrigerator. The plate on the door reads Isotherm.",
  27: "Forward cabin. Island berth, a settee to port, and lockers to starboard.",
  31: "B&G at the helm. This frame shows 19.7 feet of water and almost no boat speed.",
  35: "Cockpit. Teak sole, a Lewmar winch, and the wheel.",
  38: "Matt’s walk-through, 26 August 2026. Paragon on the hard in Anacortes, enclosure up, a tender on the gravel beside her.",
  39: "Coachroof from the mast, looking aft. Dodger and enclosure windows, mesh hatch covers.",
  40: "Foredeck from the bow, looking aft. Teak side decks, the pilot-saloon windows, the mast.",
  41: "Bow. Electric windlass, chain, and the bow roller. No anchor on the roller in this frame.",
  42: "Chain locker. Visible surface rust on the chain. Measure the length and look at the galvanising.",
  43: "Cockpit inside the enclosure. Teak sole and seats, the port wheel, a Lifesling 2 on the rail.",
  44: "Stern arch and the Hydrovane under its cover. The stainless frame is probably the 2022 solar and paddle-board rack in the listing. No panels show in this frame.",
  45: "Swim-step ladder and the Wauquiez name on the transom. Teak on the step.",
  46: "Shore power at the stern. Two inlets fed through a yellow Y-adapter.",
  47: "Swim platform and a Viking RescYou canister just below it. This frame was badly overexposed. It is corrected here as far as the file allows.",
  48: "Life raft aboard: a Viking RescYou, 6-person, in the cockpit locker. The last service stamp on the label reads 05/2018. The Rainman watermaker is stowed beside it.",
  49: "The tender. A Highfield aluminium-hull RIB in tan chaps (confirmed by Matt). The outboard is under a fitted cover. It appears to be the November 2023 Tohatsu on the upgrade list. The owner is to confirm horsepower.",
  50: "Victron MultiPlus 12/3000/120, installed. The listing still says Xantrex 3000. The cable run below it is the poor wiring the rewire line pays for.",
  51: "House batteries strapped in a locker. The listing calls them a Lifeline AGM bank, 800 Ah, November 2023. The label is not readable here.",
  52: "Generator under the saloon sole. Handwriting on the case reads MDKBL, which looks like a Cummins Onan model, not the Northern Lights in the 2024 print. Check the make plate.",
  53: "Engine space. Yanmar 4JH4-HTE, filters, and hoses.",
  54: "Hour meter on 26 August 2026: 766 hours, verified by Matt. The ad’s “530 reported” is wrong. The meter has barely moved since the 2024 listing photo. Ask for the service records.",
  55: "Wauquiez International builder’s plate. The phone’s reflection hides most of the text.",
  56: "Lazarette. Rudder stock, steering quadrant, and cables.",
  57: "Front-opening refrigerator in the galley.",
  58: "Nav-station locker. Power strips, manuals, binders.",
  59: "Locker and bilge sump under the sole. A pump and plumbing.",
  60: "A framed relief chart of the San Juan Islands. Probably the owner’s, not equipment.",
  61: "Bow-thruster tunnel. Barnacle scars and the prop.",
  62: "Hull and keel on stands.",
  63: "Max Prop and the shaft. The bottom needs a sand and antifoul.",
  64: "Spade rudder. Barnacle scars over old antifoul."
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
    ["Ceiling path", 340000, loR, "Low reserves. A new standing rig is in. No diesel heat. The optional tender, lithium, and second pilot stay at zero."],
    ["Midpoint of the file", 340000, midR, "Every line at the middle, including half of the heat and the optional rows."],
    ["Ask and the high column", 379000, hiR, "The ask holds. Rig, teak, canvas, heat, lithium, a second pilot, and a new tender all go to the top."]
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

function caption(i) {
  if (CAPTIONS[i]) return CAPTIONS[i];
  return i <= LISTING_COUNT
    ? `Listing photograph ${i} of ${LISTING_COUNT}. Seattle Yachts listing, carried by Denison. YachtWorld id 10191914.`
    : `Matt’s walk-through, 26 August 2026. Photo ${i - LISTING_COUNT} of ${PHOTO_COUNT - LISTING_COUNT}.`;
}

function renderGallery() {
  const fill = (id, from, to) => {
    const grid = document.getElementById(id);
    if (!grid) return;
    let html = "";
    for (let i = from; i <= to; i++) {
      html += `<button type="button" data-i="${i}" aria-label="Open photo ${i}"><img src="photos/${String(i).padStart(2,"0")}.jpg" alt="${caption(i).replace(/"/g, "&quot;")}" loading="lazy"></button>`;
    }
    grid.innerHTML = html;
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) openLightbox(Number(btn.dataset.i));
    });
  };
  fill("gridMatt", LISTING_COUNT + 1, PHOTO_COUNT);
  fill("grid", 1, LISTING_COUNT);
}

let current = 1;
function openLightbox(i) {
  current = i;
  const box = document.getElementById("lightbox");
  box.classList.add("open");
  box.querySelector("img").src = `photos/${String(i).padStart(2,"0")}.jpg`;
  box.querySelector("p").textContent = caption(i);
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
    "Paragon, 2008 Wauquiez Pilot Saloon 47, hull 34, Anacortes ask $379,000. Planning figures, not an offer. Revised 17 Oct 2026.",
    "Revised 17 Oct 2026 from Matt's 26 Aug 2026 walk-through. A Victron MultiPlus 12/3000/120 is aboard, poorly wired: rewire line, no inverter purchase. Starlink aboard. Viking RescYou 6-person raft aboard, last label stamp 05/2018: recert line. Standing rig replacement required in every plan. No diesel heat in the low plan. Canvas attention before Mexico.",
    "Negotiated price on the ceiling path is $340,000. Cash default $400,000 is the planning cap. Loan left blank.",
    "Insurance line is 2% of the price in use. The companion .tru file was saved at $7,000.",
    "Tax is $0 unless the Washington switch is on. That switch is about 8.9% if an Oregon buyer misses the 45-day exit. Not tax advice.",
    "Labor in the source file is hire. Delivery $1,500 is Anacortes to Sidney.",
    "Engine hours 766, verified on the meter by Matt (26 Aug 2026). The ad's '530 reported' is wrong. Service records still needed.",
    "Tender: Highfield aluminium RIB with chaps (confirmed by Matt). Outboard appears to be the 11/23 Tohatsu per the upgrade list (highlights say 8 hp Nissan). Owner to confirm hp.",
    "Solar: listing says 525 W Renogy (2021). Not seen in Matt's photos. Status unknown; confirm on the walk. Genset make (MDKBL handwriting vs Northern Lights) to be confirmed from the make plate."
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
