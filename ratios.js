/* Design-ratio bands for the three boats on this site.
   Scales are the ones Sailing Totem prints in Boat Design Ratios.
   Custom indexes (Real Feel, roomy ratio, Kerr speed) are omitted.
   Their formulas are not published. */

const MUTED = "#5c6b76";
const BAND = ["rgba(22,32,41,0.05)", "rgba(154,103,50,0.18)", "rgba(12,82,124,0.13)", "rgba(154,103,50,0.18)", "rgba(22,32,41,0.07)"];

const BOATS = {
  saralynn: { name: "Sara Lynn", color: "#0c527c", symbol: "circle" },
  paragon: { name: "Paragon", color: "#9a6732", symbol: "diamond" },
  mariana: { name: "Mariana", color: "#1a6cb8", symbol: "triangle" }
};

const pct = (n) => Math.round(n * 10) / 10;

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
    values: { saralynn: pct(49.25 / 58.40 * 100), paragon: pct(41.83 / 47.08 * 100), mariana: pct(38.75 / (47 + 8 / 12) * 100) },
    note: "Longer is more of the waterline, which is the speed side of this ratio. Shorter is more of the pitching they warn about. Sara Lynn uses 58.40 ft overall, the specification, not the 57.0 ft header. On 57.0 ft she would read about 86.4 and sit in the long band. Mariana’s waterline is the borrowed 38.75 ft, so her dot moves right if the real waterline is longer."
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
    values: { saralynn: pct(16.17 / 58.40 * 100), paragon: pct(14.8 / 47.08 * 100), mariana: pct((14 + 5 / 12) / (47 + 8 / 12) * 100) },
    note: "Monohull scale. Wider is more form stability and, only roughly, more room. Sara Lynn at 27.7 is in the narrow band because the ratio uses 58.40 ft overall. Paragon’s listing beam is 15 ft 2 in. Her dot is the class beam, 14.8 ft."
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
    values: { saralynn: 181.71, paragon: 188, mariana: 259 },
    note: "Sara Lynn’s dot is the published 181.71, which rounds to 182 on this scale. Moderate, near the light line at 175. Paragon is 188. Mariana’s 259 is near the heavy line only because the short borrowed waterline is in the denominator. Paragon’s listing displacement would move her toward 203, still moderate."
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
    values: { saralynn: 20.26, paragon: 18.5, mariana: 14.4 },
    note: "Reported class sail area, not a triangle measured off the furling sails aboard. Sara Lynn’s 1,679 sq ft is that class figure, and the staysail is not on the boat. Paragon’s heavier listing weight would pull her toward 17.5."
  },
  {
    key: "bal",
    title: "Ballast ratio",
    min: 24, max: 42, unit: "%", digits: 2,
    bands: [],
    values: { saralynn: 35.18, paragon: 28.9, mariana: 30.7 },
    note: "No color bands. Totem’s own note is that ballast ratio misleads unless the draft and the keel are similar. Sara Lynn is the deep keel. Paragon and Mariana are the shoal boats. The lead is in a different shape on each."
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
    values: { saralynn: 35.51, paragon: 30.4, mariana: 35.4 },
    note: "Brewer’s number. Moderate is 30 to 45. Totem’s warning stands: high is softer in some seas and worse at anchor. Sara Lynn’s 35.51 is the published Beneteau 57 figure and is not recomputed. Mariana’s 35.4 is the fin-keel sheet, not a shoal recomputation."
  },
  {
    key: "csf",
    title: "Capsize screening",
    min: 1.5, max: 2.25, unit: "", digits: 2,
    bands: [],
    mark: 2,
    values: { saralynn: 1.78, paragon: 1.89, mariana: 1.78 },
    note: "The line is 2.0, the old offshore screen. Under it is not a stability certificate. Paragon is the closest of the three. Her listing beam is wider than the class beam used here."
  },
  {
    key: "hull",
    title: "Hull speed",
    min: 7.6, max: 9.7, unit: " kn", digits: 2,
    bands: [],
    values: { saralynn: 9.40, paragon: 8.7, mariana: 8.34 },
    note: "1.34 × √LWL. A displacement ceiling, not a day’s run. Sara Lynn’s 9.40 uses the 49.25 ft waterline. Mariana’s number rises if her real waterline is longer than 38.75 ft."
  }
];

function fmt(n, digits) {
  return Number(n).toFixed(digits).replace(/\.0$/, "").replace(/(\.\d)0$/, "$1");
}

function renderCards() {
  const grid = document.getElementById("chartGrid");
  CHARTS.forEach((spec) => {
    const card = document.createElement("article");
    card.className = "chart-card";
    const nums = Object.keys(BOATS).map((id) => `${BOATS[id].name} ${fmt(spec.values[id], spec.digits)}${spec.unit}`).join(" · ");
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
    data: [[spec.values[id], [0.42, 0, -0.42][i]]],
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

renderCards();
const charts = CHARTS.map(draw);
window.addEventListener("resize", () => charts.forEach((c) => c.resize()));
