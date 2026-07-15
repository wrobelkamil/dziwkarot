import { useState, useCallback, useRef } from "react";
import cards from "./data/cards.js";
import { getSpread } from "./data/spreads.js";
import { oracleConfigured } from "./config.js";
import { fetchProphecy, fetchSpeech } from "./lib/oracle.js";
import Starfield from "./components/Starfield.jsx";
import Intro from "./components/Intro.jsx";
import ShuffleOverlay from "./components/ShuffleOverlay.jsx";
import Board from "./components/Board.jsx";
import CardModal from "./components/CardModal.jsx";
import OraclePanel from "./components/OraclePanel.jsx";

function drawCards(n) {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n).map((card) => ({
    card,
    reversed: Math.random() < 0.35,
    revealed: false,
  }));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const initialOracle = {
  running: false,
  done: false,
  index: 0,
  texts: {},
  status: "idle", // idle | thinking | speaking | done | error
  error: null,
  muted: false,
};

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [question, setQuestion] = useState("");
  const [spreadId, setSpreadId] = useState("three");
  const [draw, setDraw] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);
  const [oracle, setOracle] = useState(initialOracle);

  const spread = getSpread(spreadId);

  const runningRef = useRef(false);
  const cancelRef = useRef(false);
  const mutedRef = useRef(false);
  const audioRef = useRef(null);
  const resolveRef = useRef(null);

  const beginReading = useCallback(() => {
    setDraw(drawCards(spread.positions.length));
    setOracle(initialOracle);
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

  const stopAudio = () => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current = null;
    }
    if (resolveRef.current) {
      const r = resolveRef.current;
      resolveRef.current = null;
      r();
    }
  };

  const playUrl = (url) =>
    new Promise((resolve) => {
      const a = new Audio(url);
      audioRef.current = a;
      resolveRef.current = resolve;
      const done = () => {
        resolveRef.current = null;
        resolve();
      };
      a.onended = done;
      a.onerror = done;
      a.play().catch(done);
    });

  const skip = useCallback(() => stopAudio(), []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setOracle((o) => ({ ...o, muted: next }));
    if (next) stopAudio();
  }, []);

  const cardPayload = (i) => ({
    question,
    position: spread.positions[i].label,
    index: i,
    total: draw.length,
    card: {
      name: draw[i].card.name,
      reversed: draw[i].reversed,
      meaning: draw[i].reversed ? draw[i].card.reversed : draw[i].card.upright,
    },
  });

  const startOracle = useCallback(async () => {
    if (runningRef.current) return;
    if (!oracleConfigured()) {
      setOracle({ ...initialOracle, error: "NOT_CONFIGURED", status: "error" });
      return;
    }
    runningRef.current = true;
    cancelRef.current = false;
    mutedRef.current = false;
    setOracle({ ...initialOracle, running: true, status: "thinking" });

    for (let i = 0; i < draw.length; i++) {
      if (cancelRef.current) break;
      setOracle((o) => ({ ...o, index: i, status: "thinking" }));
      reveal(i);
      await wait(950);
      let text;
      try {
        text = await fetchProphecy(cardPayload(i));
      } catch (e) {
        setOracle((o) => ({ ...o, error: e.message, running: false, status: "error" }));
        runningRef.current = false;
        return;
      }
      if (cancelRef.current) break;
      setOracle((o) => ({ ...o, texts: { ...o.texts, [i]: text }, status: "speaking" }));
      if (!mutedRef.current) {
        try {
          const url = await fetchSpeech(text);
          if (cancelRef.current) { URL.revokeObjectURL(url); break; }
          await playUrl(url);
          URL.revokeObjectURL(url);
        } catch {
          await wait(1800);
        }
      } else {
        await wait(1900);
      }
      await wait(400);
    }

    if (!cancelRef.current) {
      setOracle((o) => ({ ...o, index: draw.length, status: "thinking" }));
      try {
        const text = await fetchProphecy({ question, closing: true, total: draw.length });
        setOracle((o) => ({ ...o, texts: { ...o.texts, closing: text }, status: "speaking" }));
        if (!mutedRef.current) {
          try {
            const url = await fetchSpeech(text);
            if (!cancelRef.current) { await playUrl(url); }
            URL.revokeObjectURL(url);
          } catch { await wait(1600); }
        }
      } catch {}
    }

    setOracle((o) => ({ ...o, running: false, done: true, status: "done" }));
    runningRef.current = false;
  }, [draw, question, spread, reveal]);

  const closeOracle = useCallback(() => {
    cancelRef.current = true;
    stopAudio();
    runningRef.current = false;
    setOracle(initialOracle);
  }, []);

  const reset = useCallback(() => {
    cancelRef.current = true;
    stopAudio();
    runningRef.current = false;
    setModalIndex(null);
    setDraw([]);
    setOracle(initialOracle);
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
          onStartOracle={startOracle}
          oracleActive={oracle.running || oracle.done}
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

      {phase === "reading" && (oracle.running || oracle.done || oracle.error) && (
        <OraclePanel
          oracle={oracle}
          draw={draw}
          spread={spread}
          onMute={toggleMute}
          onSkip={skip}
          onClose={closeOracle}
        />
      )}
    </div>
  );
}
