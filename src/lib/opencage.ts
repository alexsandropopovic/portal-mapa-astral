export interface GeoData {
  formattedCity: string;
  lat: number;
  lng: number;
  timezoneOffsetHours: number;
}

export async function getCityCoordinatesAndTimezone(city: string): Promise<GeoData> {
  const apiKey = process.env.OPENCAGE_API_KEY;
  if (!apiKey) {
    console.warn("OPENCAGE_API_KEY ausente. Usando fallback UTC-3.");
    return { formattedCity: city, lat: -23.55, lng: -46.63, timezoneOffsetHours: -3 };
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}&language=pt&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao consultar a API OpenCage.");

  const data = await res.json();
  const first = data.results?.[0];
  if (!first) throw new Error(`Cidade "${city}" não encontrada.`);

  const offsetSec = first.annotations?.timezone?.offset_sec ?? -10800;
  return {
    formattedCity: first.formatted || city,
    lat: first.geometry.lat,
    lng: first.geometry.lng,
    timezoneOffsetHours: offsetSec / 3600,
  };
}