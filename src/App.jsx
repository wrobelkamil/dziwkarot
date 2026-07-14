import { useState, useCallback } from "react";
import cards from "./data/cards.js";
import { getSpread } from "./data/spreads.js";
import Starfield from "./components/Starfield.jsx";
import Intro from "./components/Intro.jsx";
import ShuffleOverlay from "./components/ShuffleOverlay.jsx";
import Board from "./components/Board.jsx";
import CardModal from "./components/CardModal.jsx";

// Losowe potasowanie i dobranie n kart, każda z losową orientacją.
function drawCards(n) {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n).map((card) => ({
    card,
    reversed: Math.random() < 0.35, // ~1/3 kart odwróconych
    revealed: false,
  }));
}

export default function App() {
  const [phase, setPhase] = useState("intro"); // intro | shuffle | reading
  const [question, setQuestion] = useState("");
  const [spreadId, setSpreadId] = useState("three");
  const [draw, setDraw] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);

  const spread = getSpread(spreadId);

  const beginReading = useCallback(() => {
    const n = spread.positions.length;
    setDraw(drawCards(n));
    setPhase("shuffle");
  }, [spread]);

  const onShuffleDone = useCallback(() => setPhase("reading"), []);

  const reveal = useCallback((index) => {
    setDraw((prev) =>
      prev.map((c, i) => (i === index ? { ...c, revealed: true } : c))
    );
  }, []);

  const revealAll = useCallback(() => {
    setDraw((prev) => prev.map((c) => ({ ...c, revealed: true })));
  }, []);

  const reset = useCallback(() => {
    setModalIndex(null);
    setDraw([]);
    setPhase("intro");
  }, []);

  const allRevealed = draw.length > 0 && draw.every((c) => c.revealed);

  return (
    <div className="app">
      <Starfield />
      <div className="vignette" />

      {phase === "intro" && (
        <Intro
          question={question}
          setQuestion={setQuestion}
          spreadId={spreadId}
          setSpreadId={setSpreadId}
          onBegin={beginReading}
        />
      )}

      {phase === "shuffle" && (
        <ShuffleOverlay count={spread.positions.length} onDone={onShuffleDone} />
      )}

      {phase === "reading" && (
        <Board
          spread={spread}
          question={question}
          draw={draw}
          onReveal={reveal}
          onOpen={setModalIndex}
          onRevealAll={revealAll}
          onReset={reset}
          allRevealed={allRevealed}
        />
      )}

      {modalIndex !== null && draw[modalIndex] && (
        <CardModal
          entry={draw[modalIndex]}
          position={spread.positions[modalIndex]}
          onClose={() => setModalIndex(null)}
        />
      )}
    </div>
  );
}
