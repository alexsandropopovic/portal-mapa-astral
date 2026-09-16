import * as Astronomy from "astronomy-engine";

const ZODIAC_SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", 
  "Leão", "Virgem", "Libra", "Escorpião", 
  "Sagitário", "Capricórnio", "Aquário", "Peixes"
];

export interface PlanetData {
  sign: string;
  degree: string;
  rawLongitude: number;
}

export interface ChartCalculations {
  sun: PlanetData;
  moon: PlanetData;
  mercury: PlanetData;
  venus: PlanetData;
  mars: PlanetData;
  jupiter: PlanetData;
  saturn: PlanetData;
}

function getSignData(longitude: number): PlanetData {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const degree = (norm % 30).toFixed(1);
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: `${degree}°`,
    rawLongitude: norm,
  };
}

export function calculateBirthChart(birthDate: string, birthTime: string, timezoneOffsetHours: number = -3): ChartCalculations {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);
  
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour - timezoneOffsetHours, minute));
  const astroTime = Astronomy.MakeTime(utcDate);

  const sunPos = Astronomy.SunPosition(astroTime);
  const moonPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true));
  const mercuryPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, astroTime, true));
  const venusPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Venus, astroTime, true));
  const marsPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mars, astroTime, true));
  const jupiterPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Jupiter, astroTime, true));
  const saturnPos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Saturn, astroTime, true));

  return {
    sun: getSignData(sunPos.elon),
    moon: getSignData(moonPos.elon),
    mercury: getSignData(mercuryPos.elon),
    venus: getSignData(venusPos.elon),
    mars: getSignData(marsPos.elon),
    jupiter: getSignData(jupiterPos.elon),
    saturn: getSignData(saturnPos.elon),
  };
}