# Dziwkarot Oracle — Cloudflare Worker

Proxy trzymający klucze API po stronie serwera, żeby NIE trafiły do publicznej strony.
Front (GitHub Pages) woła tego Workera; klucze pozostają niewidoczne.

## Wdrożenie (jednorazowo)

Wymagany darmowy [Node.js](https://nodejs.org). Wrangler uruchamiamy przez `npx` — nic nie trzeba instalować globalnie.

```bash
cd worker

# 1) zaloguj się do Cloudflare (otworzy przeglądarkę)
npx wrangler login

# 2) ustaw KLUCZE jako sekrety (wklejasz po zapytaniu — nie trafiają do repo)
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put ELEVENLABS_API_KEY

# 3) wdróż
npx wrangler deploy
```

Po `deploy` dostaniesz adres w stylu:
`https://dziwkarot-oracle.<twoja-subdomena>.workers.dev`

## Podłączenie do strony

Wklej ten adres do `src/config.js` w głównym projekcie:

```js
export const ORACLE_URL = "https://dziwkarot-oracle.<twoja-subdomena>.workers.dev";
```

potem przebuduj i wypchnij stronę (`git push`) — GitHub Actions zdeployuje nową wersję.

## Zmiana głosu / modelu

Edytuj `[vars]` w `wrangler.toml` (`ELEVEN_VOICE_ID`, `GEMINI_MODEL`, `ELEVEN_MODEL`)
i ponownie `npx wrangler deploy`.

## Uwaga o bezpieczeństwie

Worker jest publiczny — `ALLOWED_ORIGINS` ogranicza wywołania z przeglądarki do Twojej domeny,
ale nie chroni w 100% przed wywołaniami spoza przeglądarki. Ustaw w panelach Google i ElevenLabs
limity wydatków/użycia. Sekrety w tym repo NIE są przechowywane.
