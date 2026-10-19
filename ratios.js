/* Design-ratio bands for the boats on this site.
   Scales are the ones Sailing Totem prints in Boat Design Ratios.
   Speed and Roomy Ratio follow Jamie's presentation (formulas below).
   Real Feel and Kerr speed are omitted. Their formulas are not published. */

const MUTED = "#5c6b76";
const BAND = ["rgba(22,32,41,0.05)", "rgba(154,103,50,0.18)", "rgba(12,82,124,0.13)", "rgba(154,103,50,0.18)", "rgba(22,32,41,0.07)"];

const BOATS = {
  saralynn: { name: "Sara Lynn", color: "#0c527c", symbol: "circle" },
  paragon: { name: "Paragon", color: "#9a6732", symbol: "diamond" },
  eden: { name: "Eden", color: "#5f7d2e", symbol: "diamond" },
  phoenix: { name: "Phoenix", color: "#b0452c", symbol: "diamond" },
  mariana: { name: "Mariana", color: "#1a6cb8", symbol: "triangle" },
  secondwind: { name: "Second Wind", color: "#1f7a5a", symbol: "rect" },
  pegasus: { name: "Pegasus", color: "#7a3e6d", symbol: "roundRect" },
  silverpearl: { name: "Silver Pearl", color: "#8a8f98", symbol: "pin" },
  unicorn: { name: "Unicorn", color: "#2a8a8a", symbol: "arrow" },
  majestic: { name: "Majestic", color: "#c9952b", symbol: "diamond" }
};

function fmt(n, digits) {
  return Number(n).toFixed(digits).replace(/\.0$/, "").replace(/(\.\d)0$/, "$1");
}

const pct = (n) => Math.round(n * 10) / 10;

/* Inputs for Jamie's speed and the Roomy Ratio. Same sheets as the charts:
   LOA, LWL, beam in feet, D/L as charted. Transom factor is an estimate,
   0.8 for a narrow canoe stern up to 1.3 for beam carried fully aft. */
const DIMS = {
  saralynn: { loa: 58.40, lwl: 49.25, beam: 16.17, dl: 181.71, transom: 1.1, src: "Jamie doc (Beneteau 57)" },
  paragon: { loa: 47.08, lwl: 41.83, beam: 14.8, dl: 188, transom: 1.0, src: "Jamie doc (Wauquiez PS47)" },
  eden: { loa: 47.08, lwl: 41.83, beam: 14.8, dl: 188, transom: 1.0, src: "Jamie doc (Wauquiez PS47)" },
  phoenix: { loa: 47.08, lwl: 41.83, beam: 14.8, dl: 188, transom: 1.0, src: "Jamie doc (Wauquiez PS47)" },
  mariana: { loa: 47 + 8 / 12, lwl: 38.75, beam: 14 + 5 / 12, dl: 259, transom: 0.9, src: "Jamie doc factor (Moody 47 Mk II); site dimensions" },
  secondwind: { loa: 46.32, lwl: 42.42, beam: 14.53, dl: 152.14, transom: 1.3, src: "Jamie doc (Sense 46)" },
  pegasus: { loa: 49.92, lwl: 43.83, beam: 14.75, dl: 196, transom: 1.1, src: "Jamie doc factor (Hunter 50 CC); shoal sheet" },
  silverpearl: { loa: 45, lwl: 42.42, beam: 15, dl: 180.5, transom: 1.2, src: "Jamie doc factor (Moody 45 DS); site dimensions" },
  unicorn: { loa: 44.17, lwl: 34.87, beam: 13.5, dl: 235.01, transom: 0.85, src: "Estimated here (Hylas 44, not in the doc)" },
  majestic: { loa: 54.92, lwl: 48.5, beam: 15.92, dl: 146.66, transom: 1.2, src: "Jamie doc (Jeanneau 54 DS)" }
};
const AVG_FACTOR = 17.2;
const classicKn = (d) => 1.34 * Math.sqrt(d.lwl);
const gerrKn = (d) => 8.26 / Math.pow(d.dl, 0.311) * Math.sqrt(d.lwl);
const jamieKn = (d) => (classicKn(d) + gerrKn(d)) / 2;
const roomy = (d) => ((d.lwl / d.loa) * 0.5 + (d.beam / d.loa) * (d.lwl / d.loa) * d.transom) * 100;
const roomyBand = (r) => (r < 55 ? "Small" : r < 65 ? "Moderate" : r < 75 ? "Spacious" : "Huge");
const perBoat = (fn, digits) => Object.fromEntries(Object.keys(DIMS).map((id) => [id, Math.round(fn(DIMS[id]) * 10 ** digits) / 10 ** digits]));

const CHARTS = [
  {
    key: "lwl",
    title: "Waterline / overall length",
    min: 72, max: 98, unit: "%", digits: 1,
    bands: [
      { from: 72, to: 75, name: "Very short" },
      { from: 75, to: 85, name: "Moderate" },
      { from: 85, to: 95, name: "Long" },
      { from: 95, to: 98, name: "Very long" }
    ],
    values: { saralynn: pct(49.25 / 58.40 * 100), paragon: pct(41.83 / 47.08 * 100), eden: pct(41.83 / 47.08 * 100), phoenix: pct(41.83 / 47.08 * 100), mariana: pct(38.75 / (47 + 8 / 12) * 100), secondwind: pct(42.42 / 46.32 * 100), pegasus: pct(43.83 / 49.92 * 100), silverpearl: pct(42.42 / 45 * 100), unicorn: pct(34.87 / 44.17 * 100), majestic: pct(48.5 / 54.92 * 100) },
    note: "Longer is more of the waterline, which is the speed side of this ratio. Shorter is more of the pitching they warn about. Sara Lynn uses 58.40 ft overall, the specification, not the 57.0 ft header. On 57.0 ft she would read about 86.4 and sit in the long band. Mariana’s waterline is the borrowed 38.75 ft, so her dot moves right if the real waterline is longer. Second Wind’s waterline is the class card’s 42.42 ft. The listing does not print one. Pegasus uses the shoal Hunter 50 CC sheet, 43.83 ft on 49.92 ft. She is off the market. The dot stays. Eden and Phoenix are Paragon’s class sheet, so the three dots share a value. Majestic uses the Sun Odyssey 54 DS sheet, 48.50 ft on 54.92 ft."
  },
  {
    key: "beam",
    title: "Beam / overall length",
    min: 26, max: 35, unit: "%", digits: 1,
    bands: [
      { from: 27, to: 29, name: "Narrow" },
      { from: 29, to: 31, name: "Moderate" },
      { from: 31, to: 33, name: "Wide" },
      { from: 33, to: 35, name: "Very wide" }
    ],
    values: { saralynn: pct(16.17 / 58.40 * 100), paragon: pct(14.8 / 47.08 * 100), eden: pct(14.8 / 47.08 * 100), phoenix: pct(14.8 / 47.08 * 100), mariana: pct((14 + 5 / 12) / (47 + 8 / 12) * 100), secondwind: pct(14.53 / 46.32 * 100), pegasus: pct(14.75 / 49.92 * 100), silverpearl: pct(15 / 45 * 100), unicorn: pct(13.5 / 44.17 * 100), majestic: pct(15.92 / 54.92 * 100) },
    note: "Monohull scale. Wider is more form stability and, only roughly, more room. Sara Lynn at 27.7 is in the narrow band because the ratio uses 58.40 ft overall. Paragon’s listing beam is 15 ft 2 in. Her dot is the class beam, 14.8 ft. Second Wind uses the class beam, 14.53 ft. The listing specification also prints 14 ft 6 in. A Denison highlight prints 14 ft 0 in. Pegasus uses the class beam, 14.75 ft, on 49.92 ft overall. Eden uses the class beam, 14.8 ft. Her survey prints 15 ft 0 in."
  },
  {
    key: "dl",
    title: "Displacement / length",
    min: 80, max: 400, unit: "", digits: 0,
    bands: [
      { from: 80, to: 90, name: "Ultralight" },
      { from: 90, to: 175, name: "Light" },
      { from: 175, to: 270, name: "Moderate" },
      { from: 270, to: 370, name: "Heavy" },
      { from: 370, to: 400, name: "Very heavy" }
    ],
    values: { saralynn: 181.71, paragon: 188, eden: 188, phoenix: 188, mariana: 259, secondwind: 152.14, pegasus: 196, silverpearl: 180.5, unicorn: 235.01, majestic: 146.66 },
    note: "Sara Lynn’s dot is the published 181.71, which rounds to 182 on this scale. Moderate, near the light line at 175. Paragon is 188. Mariana’s 259 is near the heavy line only because the short borrowed waterline is in the denominator. Paragon’s listing displacement would move her toward 203, still moderate. Second Wind’s 152 is the published Sense 46 card, on the light side of light. The listing does not print a displacement. Pegasus is 196, the shoal-sheet figure. Her listing dry weight, 35,661 lb, is the deep-keel number and is not this dot. Eden’s 188 is the class sheet. Her survey prints 36,000 lb, which would move her to about 220, still moderate. Majestic’s 147 is the Sun Odyssey 54 DS sheet. Her listing weight, 39,584 lb, would move her to about 155, still light."
  },
  {
    key: "sad",
    title: "Sail area / displacement",
    min: 12, max: 24, unit: "", digits: 2,
    bands: [
      { from: 12, to: 15, name: "Tiny" },
      { from: 15, to: 17, name: "Small" },
      { from: 17, to: 19, name: "Moderate" },
      { from: 19, to: 22, name: "Big" },
      { from: 22, to: 24, name: "Huge" }
    ],
    values: { saralynn: 20.26, paragon: 18.5, eden: 18.5, phoenix: 18.5, mariana: 14.4, secondwind: 19.54, pegasus: 14.6, silverpearl: null, unicorn: 17.55, majestic: 17.42 },
    note: "Reported class sail area, not a triangle measured off the furling sails aboard. Sara Lynn’s 1,679 sq ft is that class figure, and the staysail is not on the boat. Paragon’s heavier listing weight would pull her toward 17.5. Second Wind’s 19.54 is the published card on 1,068 sq ft. The genoa was replaced in 2025. The main’s year is not stated. Pegasus is 14.6 on the 100% triangle, 1,013 sq ft. The furling plan publishes 1,131 sq ft, which would lift her to about 16.3. Eden’s survey prints the class 18.48. At her survey weight she would sit near 16.6."
  },
  {
    key: "bal",
    title: "Ballast ratio",
    min: 24, max: 52, unit: "%", digits: 2,
    bands: [],
    values: { saralynn: 35.18, paragon: 28.9, eden: 28.9, phoenix: 28.9, mariana: 30.7, secondwind: 29.31, pegasus: 33.8, silverpearl: 30.7, unicorn: 49.37, majestic: 29.41 },
    note: "No color bands. Totem’s own note is that ballast ratio misleads unless the draft and the keel are similar. Sara Lynn is the deep keel. Paragon, Mariana, and Pegasus are the shoal boats. Second Wind’s 29.31 is the one ballast figure on the Sense 46 card. The listing draft is the shallow number, and the card does not print a separate shallow ballast. Pegasus’s 33.8 is the shoal sheet. Her listing weight matches the deep keel, and that conflict stays on her page. Eden’s keel is unmeasured. The owner says deep, the survey says bulb or wing, and the class ballast may not be hers. Majestic’s 29.41 is the class weight. She is the deep keel, and on her listing weight the same 11,023 lb is about 27.8."
  },
  {
    key: "comfort",
    title: "Comfort ratio",
    min: 15, max: 65, unit: "", digits: 2,
    bands: [
      { from: 15, to: 20, name: "Very low" },
      { from: 20, to: 30, name: "Low" },
      { from: 30, to: 45, name: "Moderate" },
      { from: 45, to: 60, name: "High" },
      { from: 60, to: 65, name: "Very high" }
    ],
    values: { saralynn: 35.51, paragon: 30.4, eden: 30.4, phoenix: 30.4, mariana: 35.4, secondwind: 26.13, pegasus: 34.7, silverpearl: 29.7, unicorn: 28.61, majestic: 28.82 },
    note: "Brewer’s number. Moderate is 30 to 45. Totem’s warning stands: high is softer in some seas and worse at anchor. Sara Lynn’s 35.51 is the published Beneteau 57 figure and is not recomputed. Mariana’s 35.4 is the fin-keel sheet, not a shoal recomputation. Second Wind’s 26.13 is the published Sense 46 figure. It sits in the low band. Pegasus’s 34.7 is the shoal-class figure from the study. Eden’s 30.4 is the class figure and is not recomputed on her survey weight."
  },
  {
    key: "csf",
    title: "Capsize screening",
    min: 1.5, max: 2.25, unit: "", digits: 2,
    bands: [],
    mark: 2,
    values: { saralynn: 1.78, paragon: 1.89, eden: 1.89, phoenix: 1.89, mariana: 1.78, secondwind: 1.97, pegasus: 1.77, silverpearl: 1.91, unicorn: 1.92, majestic: 1.91 },
    note: "The line is 2.0, the old offshore screen. Under it is not a stability certificate. Second Wind’s published 1.97 is the closest of the six. Pegasus is 1.77 on the shoal sheet. Paragon’s listing beam is wider than the class beam used here. Eden sits on Paragon’s class figure."
  },
  {
    key: "jamie",
    title: "Jamie speed",
    min: 8, max: 11.2, unit: " kn", digits: 2,
    bands: [],
    values: perBoat(jamieKn, 2),
    note: "Jamie’s cruiser speed, the midpoint of classic hull speed (1.34 × √LWL) and Gerr’s lighter-boat allowance (8.26 ÷ D/L^0.311 × √LWL). A theoretical pace for a well-sailed boat, not a day’s run. Classic / Gerr in knots: " + Object.keys(DIMS).map((id) => `${BOATS[id].name} ${fmt(classicKn(DIMS[id]), 1)} / ${fmt(gerrKn(DIMS[id]), 1)}`).join(", ") + ". Light boats gain most from Gerr, so Majestic and Second Wind move up and Mariana and Unicorn stay close to their classic number. Paragon at her listing weight (D/L about 203) would read about 9.45; Eden and Phoenix at their survey weight (about 220) about 9.32."
  },
  {
    key: "roomy",
    title: "Roomy Ratio",
    min: 50, max: 90, unit: "", digits: 1,
    bands: [
      { from: 50, to: 55, name: "Small" },
      { from: 55, to: 65, name: "Moderate" },
      { from: 65, to: 75, name: "Spacious" },
      { from: 75, to: 90, name: "Huge" }
    ],
    values: perBoat(roomy, 1),
    note: "Jamie’s monohull scale: under 55 small, 55–65 moderate, 65–75 spacious, over 75 huge. It rewards a long waterline for the length and beam carried aft, so it measures usable volume, not layout. A deck saloon and an aft-cockpit boat can score the same. The transom factor is an estimate for every boat: " + Object.keys(DIMS).map((id) => `${BOATS[id].name} ${DIMS[id].transom % 1 ? DIMS[id].transom : DIMS[id].transom.toFixed(1)}`).join(", ") + ". Silver Pearl scores highest: a 42.42 ft waterline on 45 ft overall, the 15 ft beam the site uses, and an estimated 1.2 transom. On the doc’s 14.5 ft beam she would read about 83.6."
  }
];


function renderCards() {
  const grid = document.getElementById("chartGrid");
  CHARTS.forEach((spec) => {
    const card = document.createElement("article");
    card.className = "chart-card";
    const nums = Object.keys(BOATS).map((id) => `${BOATS[id].name} ${spec.values[id] == null ? "n/a" : fmt(spec.values[id], spec.digits) + spec.unit}`).join(" · ");
    card.innerHTML = `<h3>${spec.title}</h3><p class="fine">${nums}</p><div class="chart" id="chart-${spec.key}"></div><p>${spec.note}</p>`;
    grid.appendChild(card);
  });
}

function draw(spec) {
  const el = document.getElementById("chart-" + spec.key);
  const chart = echarts.init(el, null, { renderer: "svg" });
  const bands = spec.bands.map((b, i) => [
    { xAxis: b.from, itemStyle: { color: BAND[i % BAND.length] } },
    { xAxis: b.to }
  ]);
  const series = [{
    type: "line",
    data: [[spec.min, 0], [spec.max, 0]],
    symbol: "none",
    silent: true,
    lineStyle: { color: "rgba(22,32,41,0.18)", width: 8, cap: "round" },
    z: 1
  }].concat(Object.keys(BOATS).map((id, i) => ({
    name: BOATS[id].name,
    type: "scatter",
    data: spec.values[id] == null ? [] : [[spec.values[id], [0.9, 0.7, 0.5, 0.3, 0.1, -0.1, -0.3, -0.5, -0.7, -0.9][i]]],
    symbol: BOATS[id].symbol,
    symbolSize: 16,
    itemStyle: { color: BOATS[id].color, borderColor: "#fbf8f2", borderWidth: 1.5 },
    label: { show: false },
    z: 4,
    markArea: i === 0 && bands.length ? { silent: true, data: bands } : undefined,
    markLine: i === 0 && spec.mark ? {
      silent: true,
      symbol: "none",
      label: { formatter: "2.0", color: MUTED, fontSize: 11 },
      lineStyle: { color: "#8d4314", type: "dashed", width: 1.5 },
      data: [{ xAxis: spec.mark }]
    } : undefined
  })));
  chart.setOption({
    animationDuration: 600,
    grid: { left: 8, right: 12, top: 32, bottom: 32 },
    tooltip: {
      trigger: "item",
      backgroundColor: "#162029",
      borderWidth: 0,
      textStyle: { color: "#f3efe6", fontFamily: "Outfit, sans-serif" },
      formatter: (p) => (p.value ? `${p.seriesName}: ${fmt(p.value[0], spec.digits)}${spec.unit}` : "")
    },
    xAxis: {
      type: "value",
      min: spec.min,
      max: spec.max,
      axisLine: { lineStyle: { color: "rgba(22,32,41,0.35)" } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: MUTED, fontFamily: "IBM Plex Mono, monospace", fontSize: 11 }
    },
    yAxis: { type: "value", min: -1, max: 1, show: false },
    series
  });
  return chart;
}

function renderTables() {
  const ids = Object.keys(DIMS);
  const dist = document.getElementById("distTable");
  if (dist) {
    const rows = ids.slice().sort((a, b) => jamieKn(DIMS[b]) - jamieKn(DIMS[a])).map((id) => {
      const d = DIMS[id], j = jamieKn(d);
      return `<tr><td>${BOATS[id].name}</td><td>${d.lwl.toFixed(2)}</td><td>${Math.round(d.dl)}</td><td>${classicKn(d).toFixed(1)}</td><td>${gerrKn(d).toFixed(1)}</td><td><b>${j.toFixed(1)}</b></td><td><b>${Math.round(j * 24)}</b></td><td>${Math.round(j * AVG_FACTOR)}</td></tr>`;
    }).join("");
    dist.innerHTML = `<thead><tr><th>Boat</th><th>LWL ft</th><th>D/L</th><th>Classic kn</th><th>Gerr kn</th><th>Jamie kn</th><th>Max 24 h nm</th><th>Avg 24 h nm</th></tr></thead><tbody>${rows}</tbody>`;
  }
  const rt = document.getElementById("roomyTable");
  if (rt) {
    const rows = ids.slice().sort((a, b) => roomy(DIMS[b]) - roomy(DIMS[a])).map((id) => {
      const d = DIMS[id], r = roomy(d);
      return `<tr><td>${BOATS[id].name}</td><td>${d.loa.toFixed(2)}</td><td>${d.lwl.toFixed(2)}</td><td>${d.beam.toFixed(2)}</td><td>${d.transom.toFixed(2)}</td><td><b>${r.toFixed(1)}</b></td><td>${roomyBand(r)}</td><td class="src">${d.src}</td></tr>`;
    }).join("");
    rt.innerHTML = `<thead><tr><th>Boat</th><th>LOA ft</th><th>LWL ft</th><th>Beam ft</th><th>Transom, est.</th><th>Roomy</th><th>Band</th><th>Transom source</th></tr></thead><tbody>${rows}</tbody>`;
  }
}

renderCards();
renderTables();
const charts = CHARTS.map(draw);
window.addEventListener("resize", () => charts.forEach((c) => c.resize()));
