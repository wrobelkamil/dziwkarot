import { ORACLE_URL } from "../config.js";

const base = () => ORACLE_URL.replace(/\/$/, "");

// Pobierz tekst przepowiedni dla jednej karty (lub domknięcia seansu).
export async function fetchProphecy(payload) {
  const res = await fetch(base() + "/prophecy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = "Wróżka zamilkła (" + res.status + ").";
    try {
      const e = await res.json();
      if (e.error) msg = e.error + (e.detail ? " — " + e.detail : "");
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  return data.text;
}

// Pobierz audio (mp3) z przeczytaną przepowiednią; zwraca obiekt URL.
export async function fetchSpeech(text) {
  const res = await fetch(base() + "/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Głos wróżki nie nadszedł (" + res.status + ").");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
