// Dziwkarot Oracle — Cloudflare Worker (proxy).
// Klucze API jako SEKRETY (nigdy w repo):
//   npx wrangler secret put GEMINI_API_KEY
//   npx wrangler secret put ELEVENLABS_API_KEY
// Zmienne jawne w wrangler.toml [vars]: GEMINI_MODEL, ELEVEN_MODEL, ALLOWED_ORIGINS,
//   VOICE_MISTYCZNY, VOICE_SZEPT.

const VOICE_IDS = (env) => ({
  mistyczny: env.VOICE_MISTYCZNY || "HH3kybY6uEJ2ebSa9Vy3",
  szept: env.VOICE_SZEPT || "fNmw8sukfGuvWVOp33Ge",
});

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
      return json({ error: String((e && e.message) || e) }, 500, cors);
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
    Vary: "Origin",
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
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.0, topP: 0.95, maxOutputTokens: 3072 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `Gemini ${res.status}`, detail: detail.slice(0, 500) }, 502, cors);
  }
  const data = await res.json();
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) {
    return json(
      {
        text: "Karta milczy… mgła nie chce się rozstąpić. Spróbuj jeszcze raz.",
        finishReason: cand?.finishReason || null,
        blocked: data.promptFeedback?.blockReason || null,
      },
      200,
      cors
    );
  }
  return json({ text }, 200, cors);
}

function buildPrompt(body) {
  const { question, card, position, orient_label, closing } = body || {};
  const q = (question || "").trim();
  const qLine = q
    ? "„" + q + "”"
    : "(klient nie zadał pytania wprost — potraktuj to jako pytanie o najbliższą przyszłość)";
  const persona =
    "Jesteś Madame Dziwina — wytrawna wróżka czytająca karty z powagą i skupieniem. " +
    "Mówisz PO POLSKU, w drugiej osobie, ciepłym lecz poważnym, mistycznym i obrazowym tonem, " +
    "jak prawdziwa wróżbitka pochylona nad kryształową kulą. " +
    "Bez żartów, ironii, wulgaryzmów, list i nagłówków. " +
    "Interpretujesz SYMBOLICZNE znaczenie karty — nie powtarzasz jej dosłownej nazwy.";

  if (closing) {
    return [
      persona,
      "Pytanie klienta: " + qLine + ".",
      "Odsłoniłaś już wszystkie karty. Wypowiedz 1-2 zdania (maksymalnie ~45 słów), " +
        "które spinają cały rozkład w jedną mistyczną odpowiedź na to pytanie, " +
        "zakończoną krótkim błogosławieństwem.",
    ].join("\n\n");
  }

  const orient = card?.reversed ? "odwrócona" : "prosta";
  return [
    persona,
    "Pytanie klienta: " + qLine + ".",
    "Pozycja w rozkładzie: „" + position + "” (" + (orient_label || position) + ").",
    "Symboliczne znaczenie karty (pozycja " + orient + "): " + (card?.meaning || ""),
    "Wygłoś krótką, mistyczną przepowiednię — 1 do 2 zdań, maksymalnie ~45 słów — " +
      "która łączy pytanie klienta, sens tej pozycji i przesłanie karty. " +
      "Skup się na symbolice i radzie, nie na nazwie karty. Ton poważny, obrazowy, wróżbiarski.",
  ].join("\n\n");
}

// ---- ElevenLabs: głos ----
async function handleSpeak(request, env, cors) {
  if (!env.ELEVENLABS_API_KEY) return json({ error: "Brak ELEVENLABS_API_KEY" }, 500, cors);
  const { text, voice } = await request.json();
  if (!text) return json({ error: "Brak text" }, 400, cors);

  const voices = VOICE_IDS(env);
  const voiceId = voices[voice] || voices.mistyczny;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: env.ELEVEN_MODEL || "eleven_multilingual_v2",
      voice_settings: { stability: 0.45, similarity_boost: 0.8 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `ElevenLabs ${res.status}`, detail: detail.slice(0, 400) }, 502, cors);
  }
  return new Response(res.body, {
    status: 200,
    headers: { ...cors, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}
