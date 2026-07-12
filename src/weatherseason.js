// weatherSeason.js
// Auto-detects the current season (Summer/Monsoon/Winter) for Step 1,
// using the browser's geolocation + Open-Meteo (free, no API key required).
// Falls back to a month-based guess if location/weather fetch fails.

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 5000 }
    );
  });
}

function seasonFromMonth() {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 6) return "Summer";
  if (month >= 7 && month <= 9) return "Monsoon";
  return "Winter";
}

export async function detectSeason() {
  const monthGuess = seasonFromMonth();

  try {
    const { lat, lon } = await getLocation();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather fetch failed");

    const data = await response.json();
    const temp = data.current?.temperature_2m;
    const precipitation = data.current?.precipitation;

    if (precipitation !== undefined && precipitation > 2) {
      return "Monsoon";
    }
    if (temp !== undefined && temp >= 32 && (precipitation ?? 0) < 1) {
      return "Summer";
    }
    return monthGuess;
  } catch (err) {
    console.warn("Weather auto-detect failed, using month fallback:", err);
    return monthGuess;
  }
}