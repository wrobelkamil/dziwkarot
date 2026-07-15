import { ORACLE_URL } from "../config.js";

const base = () => ORACLE_URL.replace(/\/$/, "");

// Przepowiednia (tekst) dla jednej karty lub domknięcia seansu.
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

// Audio (mp3) z przeczytaną przepowiednią; voice: "mistyczny" | "szept".
export async function fetchSpeech(text, voice) {
  const res = await fetch(base() + "/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice: voice || "mistyczny" }),
  });
  if (!res.ok) {
    let msg = "Głos (" + res.status + ")";
    try {
      const e = await res.json();
      if (e.error) msg = e.error + (e.detail ? " — " + e.detail : "");
    } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
