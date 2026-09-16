import { ChartCalculations } from "./astronomy";

const SIGNS = [
  { name: "Áries", glyph: "♈", color: "#f87171" },
  { name: "Touro", glyph: "♉", color: "#4ade80" },
  { name: "Gêmeos", glyph: "♊", color: "#facc15" },
  { name: "Câncer", glyph: "♋", color: "#60a5fa" },
  { name: "Leão", glyph: "♌", color: "#fb923c" },
  { name: "Virgem", glyph: "♍", color: "#a3e635" },
  { name: "Libra", glyph: "♎", color: "#38bdf8" },
  { name: "Escorpião", glyph: "♏", color: "#f43f5e" },
  { name: "Sagitário", glyph: "♐", color: "#c084fc" },
  { name: "Capricórnio", glyph: "♑", color: "#94a3b8" },
  { name: "Aquário", glyph: "♒", color: "#22d3ee" },
  { name: "Peixes", glyph: "♓", color: "#818cf8" },
];

export function generateChartWheelSvg(chart: ChartCalculations): string {
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 220;
  const signRingInnerRadius = 175;
  const innerRadius = 140;

  const polarToCartesian = (radius: number, angleDeg: number) => {
    const rad = ((180 - angleDeg) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  };

  let signArcsSvg = "";
  for (let i = 0; i < 12; i++) {
    const startAngle = i * 30;
    const midAngle = startAngle + 15;

    const p1 = polarToCartesian(outerRadius, startAngle);
    const p2 = polarToCartesian(signRingInnerRadius, startAngle);
    const textPos = polarToCartesian((outerRadius + signRingInnerRadius) / 2, midAngle);

    signArcsSvg += `
      <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="${textPos.x}" y="${textPos.y}" text-anchor="middle" dominant-baseline="central" 
            font-size="16" font-family="serif" fill="${SIGNS[i].color}">${SIGNS[i].glyph}</text>
    `;
  }

  const planetsList = [
    { glyph: "☉", color: "#f59e0b", data: chart.sun },
    { glyph: "☽", color: "#6366f1", data: chart.moon },
    { glyph: "☿", color: "#64748b", data: chart.mercury },
    { glyph: "♀", color: "#ec4899", data: chart.venus },
    { glyph: "♂", color: "#ef4444", data: chart.mars },
    { glyph: "♃", color: "#3b82f6", data: chart.jupiter },
    { glyph: "♄", color: "#8b5cf6", data: chart.saturn },
  ];

  let planetsSvg = "";
  const planetPoints: { x: number; y: number }[] = [];

  planetsList.forEach((p) => {
    const pos = polarToCartesian(innerRadius, p.data.rawLongitude);
    const textPos = polarToCartesian(innerRadius - 20, p.data.rawLongitude);
    planetPoints.push({ x: pos.x, y: pos.y });

    planetsSvg += `
      <circle cx="${pos.x}" cy="${pos.y}" r="4" fill="${p.color}" />
      <line x1="${pos.x}" y1="${pos.y}" x2="${textPos.x}" y2="${textPos.y}" stroke="${p.color}" stroke-dasharray="2,2" stroke-width="1" />
      <text x="${textPos.x}" y="${textPos.y}" text-anchor="middle" dominant-baseline="central" 
            font-size="14" font-weight="bold" fill="${p.color}">${p.glyph}</text>
    `;
  });

  let aspectsSvg = "";
  for (let i = 0; i < planetPoints.length; i++) {
    for (let j = i + 1; j < planetPoints.length; j++) {
      const diff = Math.abs(planetsList[i].data.rawLongitude - planetsList[j].data.rawLongitude);
      const angle = diff > 180 ? 360 - diff : diff;

      if (Math.abs(angle - 120) < 6 || Math.abs(angle - 90) < 6 || Math.abs(angle - 180) < 6) {
        const color = Math.abs(angle - 120) < 6 ? "#3b82f6" : "#ef4444";
        aspectsSvg += `
          <line x1="${planetPoints[i].x}" y1="${planetPoints[i].y}" 
                x2="${planetPoints[j].x}" y2="${planetPoints[j].y}" 
                stroke="${color}" stroke-width="0.8" opacity="0.4" />
        `;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="w-full max-w-[400px] mx-auto drop-shadow-md">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f8fafc" />
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${outerRadius}" fill="url(#bgGrad)" stroke="#1e1b4b" stroke-width="2.5" />
      <circle cx="${cx}" cy="${cy}" r="${signRingInnerRadius}" fill="none" stroke="#94a3b8" stroke-width="1.5" />
      <circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="none" stroke="#cbd5e1" stroke-dasharray="3,3" />
      <circle cx="${cx}" cy="${cy}" r="35" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
      ${aspectsSvg}
      ${signArcsSvg}
      ${planetsSvg}
      <circle cx="${cx}" cy="${cy}" r="3" fill="#1e1b4b" />
    </svg>
  `;
}