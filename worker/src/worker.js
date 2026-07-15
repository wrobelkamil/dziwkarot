// Dziwkarot Oracle — Cloudflare Worker (proxy).
// Trzyma klucze API jako SEKRETY (nigdy w kodzie ani w repo):
//   wrangler secret put GEMINI_API_KEY
//   wrangler secret put ELEVENLABS_API_KEY
// Zmienne jawne (w wrangler.toml [vars]): GEMINI_MODEL, ELEVEN_VOICE_ID, ALLOWED_ORIGINS.

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Use POST" }, 405, cors);

    const { pathname } = new URL(request.url);
    try {
      if (pathname === "/prophecy") return await handleProphecy(request, env, cors);
      if (pathname === "/speak") return await handleSpeak(request, env, cors);
      return json({ error: "Not found" }, 404, cors);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500, cors);
    }
  },
};

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowAll = allowed.includes("*");
  const ok = allowAll || allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? (allowAll ? "*" : origin) : allowed[0] || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// ---- Gemini: przepowiednia ----
async function handleProphecy(request, env, cors) {
  if (!env.GEMINI_API_KEY) return json({ error: "Brak GEMINI_API_KEY" }, 500, cors);
  const body = await request.json();
  const prompt = buildPrompt(body);

  const model = env.GEMINI_MODEL || "gemini-3-flash-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.05, topP: 0.95, maxOutputTokens: 500 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `Gemini ${res.status}`, detail: detail.slice(0, 500) }, 502, cors);
  }
  const data = await res.json();
  const text =
    (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("")
      .trim() || "Karta milczy… ale jej cisza też jest odpowiedzią.";
  return json({ text }, 200, cors);
}

function buildPrompt(body) {
  const { question, card, position, index, total, closing } = body || {};
  const q = (question || "").trim();
  const persona =
    "Jesteś Madame Dziwina — ekscentryczną, charyzmatyczną wróżką czytającą satyryczny tarot „Dziwkarot”. " +
    "Mówisz PO POLSKU, w drugiej osobie, tajemniczo, obrazowo i z przymrużeniem oka. " +
    "Masz humor, ale NIE jesteś wulgarna i nikogo nie poniżasz — nazwy kart traktujesz z komediowym dystansem. " +
    "Nie tłumaczysz mechaniki tarota, nie używasz nagłówków ani list — mówisz płynnie, jak przy stoliku z kryształową kulą.";

  if (closing) {
    return (
      persona +
      "\n\nTo domknięcie seansu. Pytanie klienta: " +
      (q ? `„${q}"` : "(nie zadano wprost — potraktuj to jako pytanie o najbliższą przyszłość)") +
      ".\nWłaśnie odsłoniłaś wszystkie karty. Wypowiedz krótką, spójną klamrę-przepowiednię (3–4 zdania), " +
      "która łączy wymowę całego rozkładu i daje klientowi jedną myśl na drogę. Zakończ ciepłym, lekko przewrotnym błogosławieństwem."
    );
  }

  const orient = card?.reversed ? "odwrócona" : "prosta";
  return (
    persona +
    "\n\nPytanie klienta: " +
    (q ? `„${q}"` : "(nie zadano wprost — potraktuj to jako pytanie o najbliższą przyszłość)") +
    `.\nWłaśnie odsłaniasz kartę ${index + 1} z ${total} na pozycji „${position}".` +
    `\nKarta: „${card?.name}" (pozycja ${orient}).` +
    `\nJej wymowa: ${card?.meaning}` +
    "\n\nWypowiedz przepowiednię dotyczącą tej jednej karty i jej pozycji (3–5 zdań), " +
    "wplatając nawiązanie do pytania. Mów jak wróżka na żywo — bez wstępów typu „oto twoja karta”, od razu do rzeczy."
  );
}

// ---- ElevenLabs: głos ----
async function handleSpeak(request, env, cors) {
  if (!env.ELEVENLABS_API_KEY) return json({ error: "Brak ELEVENLABS_API_KEY" }, 500, cors);
  const { text } = await request.json();
  if (!text) return json({ error: "Brak text" }, 400, cors);

  const voice = env.ELEVEN_VOICE_ID || "7NsaqHdLuKNFvEfjpUno";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: env.ELEVEN_MODEL || "eleven_multilingual_v2",
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `ElevenLabs ${res.status}`, detail: detail.slice(0, 300) }, 502, cors);
  }
  return new Response(res.body, {
    status: 200,
    headers: { ...cors, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}
