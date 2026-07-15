# 🔮 Dziwkarot — Wyrocznia 37 Kart

Mistyczna strona do losowania **Dziwkarota** — satyrycznej talii tarota złożonej z 37 kart. Zadaj pytanie, wybierz rozkład, potasuj karty i odsłaniaj je jedna po drugiej, dotykając palcem lub kursorem.

> _Projekt satyryczny · nie traktuj poważnie._

## ✨ Co potrafi

- **4 rozkłady:** Jedna karta · Trzy karty (przeszłość / teraźniejszość / przyszłość) · Podkowa (7 kart) · Krzyż Celtycki (10 kart)
- **Pytanie do wyroczni** wyświetlane nad rozkładem
- **Animacja tasowania** i eleganckie rozkładanie kart
- **Odsłanianie kliknięciem** — obrót 3D z rewersu na awers
- **Losowa orientacja** — karty odwrócone mają własne (odwrócone) znaczenie
- **Znaczenia** każdej karty (pozycja prosta i odwrócona) w oknie szczegółów
- Klimat: ciemne tło, złoto, migoczący gwiezdny pył, responsywność (mobile + desktop)

## 🚀 Uruchomienie

Wymagany [Node.js](https://nodejs.org) (18+).

```bash
npm install      # instalacja zależności
npm run dev      # tryb deweloperski (http://localhost:5173)
npm run build    # produkcyjny build do folderu dist/
npm run preview  # podgląd builda
```

## 🗂️ Struktura

```
tarot/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── karty/            ← 37 kart (card_00..card_36) + rewers.png
└── src/
    ├── main.jsx
    ├── App.jsx           ← maszyna stanów: intro → tasowanie → rozkład
    ├── styles.css        ← cały wygląd i animacje
    ├── data/
    │   ├── cards.js      ← 37 kart + znaczenia (prosta / odwrócona)
    │   └── spreads.js    ← definicje rozkładów i pozycji kart
    └── components/
        ├── Starfield.jsx     ← gwiezdny pył (canvas)
        ├── Intro.jsx         ← ekran startowy + wybór rozkładu
        ├── ShuffleOverlay.jsx← animacja tasowania
        ├── Board.jsx         ← stół z rozłożonymi kartami
        ├── TarotCard.jsx     ← pojedyncza karta z flipem 3D
        └── CardModal.jsx     ← okno ze znaczeniem karty
```

## ✏️ Jak zmienić znaczenia kart

Wszystkie teksty są w `src/data/cards.js` — edytuj pola `upright` (pozycja prosta) i `reversed` (odwrócona) dla dowolnej karty.

## 🌐 Deploy na GitHub Pages

Projekt ma ustawione `base: "./"`, więc build działa też w podkatalogu. Po `npm run build` wrzuć zawartość folderu `dist/` na branch `gh-pages` (lub użyj GitHub Actions dla Vite).

## 🔮 Wróżka AI (Gemini + ElevenLabs)

Po rozłożeniu kart pojawia się przycisk **„Poproś wróżkę o przepowiednię"**. Wróżka
(Madame Dziwina) odsłania karty po kolei, przy każdej wypowiada przepowiednię
generowaną przez **Gemini** i czyta ją na głos przez **ElevenLabs**, a na koniec
podsumowuje cały rozkład.

Klucze API **nie mogą** siedzieć w tej stronie (jest publiczna), więc obsługuje je
mały serwer-proxy: **Cloudflare Worker** w folderze [`worker/`](./worker). Kroki:

1. Wdróż Workera wg [`worker/README.md`](./worker/README.md) (ustawiasz klucze jako sekrety).
2. Wklej adres Workera do `src/config.js` → `ORACLE_URL`.
3. Zbuduj i wypchnij stronę (`git push`) — Actions zdeployuje nową wersję.

Dopóki `ORACLE_URL` to placeholder, przycisk pokaże krótką instrukcję zamiast wywołań AI.
Głos można wyciszyć (🔊/🔇), a lektora pominąć w trakcie seansu.
