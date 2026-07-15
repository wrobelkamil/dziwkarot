// Adres wdrożonego Cloudflare Workera (patrz worker/README.md).
// Po `npx wrangler deploy` wklej tu swój adres *.workers.dev i przebuduj stronę.
// Dopóki jest placeholder, przycisk wróżki pokaże instrukcję zamiast wywołań AI.
export const ORACLE_URL = "https://dziwkarot-oracle.dziwkarot.workers.dev";

export const oracleConfigured = () =>
  !!ORACLE_URL && !ORACLE_URL.includes("TWOJ-WORKER");
