// Rozkłady (spready). Pozycje w procentach względem "stołu" (board).
// x/y = środek karty; rot = obrót karty (dla karty krzyżującej w Krzyżu Celtyckim).

export const spreads = [
  {
    id: "single",
    name: "Jedna karta",
    subtitle: "Karta dnia",
    description:
      "Jedna karta na jedno pytanie. Szybka, czysta odpowiedź wszechświata.",
    // pole gry o proporcjach zbliżonych do kwadratu
    aspect: 1.15,
    positions: [{ label: "Twoja karta", x: 50, y: 50 }],
  },
  {
    id: "three",
    name: "Trzy karty",
    subtitle: "Przeszłość · Teraźniejszość · Przyszłość",
    description:
      "Klasyczny rozkład osi czasu. Skąd przychodzisz, gdzie jesteś, dokąd zmierzasz.",
    aspect: 1.9,
    positions: [
      { label: "Przeszłość", x: 20, y: 50 },
      { label: "Teraźniejszość", x: 50, y: 50 },
      { label: "Przyszłość", x: 80, y: 50 },
    ],
  },
  {
    id: "horseshoe",
    name: "Podkowa",
    subtitle: "Siedem kart w łuku",
    description:
      "Rozkład w kształcie podkowy — szeroki obraz sytuacji od przeszłości po ostateczny wynik.",
    aspect: 1.85,
    positions: [
      { label: "Przeszłość", x: 9, y: 72 },
      { label: "Teraźniejszość", x: 23, y: 47 },
      { label: "Najbliższa przyszłość", x: 37, y: 30 },
      { label: "Rada / klucz", x: 50, y: 23 },
      { label: "Otoczenie", x: 63, y: 30 },
      { label: "Nadzieje i lęki", x: 77, y: 47 },
      { label: "Rezultat", x: 91, y: 72 },
    ],
  },
  {
    id: "celtic",
    name: "Krzyż Celtycki",
    subtitle: "Dziesięć kart",
    description:
      "Najbardziej rozbudowany rozkład. Pełna diagnoza sytuacji, wpływów i przeznaczenia.",
    aspect: 1.55,
    positions: [
      { label: "Sedno sprawy", x: 33, y: 50 },
      { label: "Wyzwanie", x: 33, y: 50, rot: 90 },
      { label: "Fundament", x: 33, y: 80 },
      { label: "Przeszłość", x: 16, y: 50 },
      { label: "Cel / korona", x: 33, y: 20 },
      { label: "Przyszłość", x: 50, y: 50 },
      { label: "Ty", x: 80, y: 82 },
      { label: "Otoczenie", x: 80, y: 60 },
      { label: "Nadzieje i lęki", x: 80, y: 38 },
      { label: "Rezultat", x: 80, y: 16 },
    ],
  },
];

export const getSpread = (id) => spreads.find((s) => s.id === id) || spreads[0];

export default spreads;
