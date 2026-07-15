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
  active: false,
  done: false,
  index: 0,
  texts: {},
  status: "idle", // idle | thinking | ready | done | error
  error: null,
  audioErr: null,
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

  const tokenRef = useRef(0); // unieważnia stare operacje async po resecie
  const indexRef = useRef(0);
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
  };

  // Odtwarza głos w tle — NIE blokuje przechodzenia między kartami.
  const speakBg = (text, token) => {
    if (mutedRef.current || !text) return;
    stopAudio();
    fetchSpeech(text)
      .then((url) => {
        if (token !== tokenRef.current || mutedRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
        const a = new Audio(url);
        audioRef.current = a;
        a.onended = () => URL.revokeObjectURL(url);
        a.play().catch(() => {});
      })
      .catch((e) => {
        if (token === tokenRef.current) {
          setOracle((o) => ({ ...o, audioErr: e.message }));
        }
      });
  };

  const textAt = (i) => (i >= draw.length ? oracle.texts.closing : oracle.texts[i]);

  const runStep = useCallback(
    async (i) => {
      const token = tokenRef.current;
      indexRef.current = i;
      setOracle((o) => ({ ...o, active: true, index: i, status: "thinking", error: null, audioErr: null }));
      reveal(i);
      await wait(900);
      if (token !== tokenRef.current) return;
      let text;
      try {
        text = await fetchProphecy({
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
      } catch (e) {
        if (token === tokenRef.current) {
          setOracle((o) => ({ ...o, status: "error", error: e.message }));
        }
        return;
      }
      if (token !== tokenRef.current) return;
      setOracle((o) => ({ ...o, texts: { ...o.texts, [i]: text }, status: "ready" }));
      speakBg(text, token);
    },
    [draw, question, spread, reveal]
  );

  const runClosing = useCallback(async () => {
    const token = tokenRef.current;
    indexRef.current = draw.length;
    setOracle((o) => ({ ...o, index: draw.length, status: "thinking", audioErr: null }));
    await wait(300);
    if (token !== tokenRef.current) return;
    let text = "";
    try {
      text = await fetchProphecy({ question, closing: true, total: draw.length });
    } catch {
      setOracle((o) => ({ ...o, status: "done", done: true }));
      return;
    }
    if (token !== tokenRef.current) return;
    setOracle((o) => ({ ...o, texts: { ...o.texts, closing: text }, status: "done", done: true }));
    speakBg(text, token);
  }, [draw, question]);

  const startOracle = useCallback(() => {
    if (!oracleConfigured()) {
      setOracle({ ...initialOracle, active: true, error: "NOT_CONFIGURED", status: "error" });
      return;
    }
    tokenRef.current += 1;
    mutedRef.current = false;
    setOracle({ ...initialOracle, active: true, status: "thinking" });
    runStep(0);
  }, [runStep]);

  const nextCard = useCallback(() => {
    if (oracle.status === "thinking") return;
    stopAudio();
    if (oracle.done) return; // przycisk „zakończ" obsłużony osobno
    const i = indexRef.current;
    if (i < draw.length - 1) runStep(i + 1);
    else runClosing();
  }, [oracle.status, oracle.done, draw.length, runStep, runClosing]);

  const replay = useCallback(() => {
    const t = textAt(indexRef.current);
    if (t) speakBg(t, tokenRef.current);
  }, [oracle.texts, draw.length]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setOracle((o) => ({ ...o, muted: next }));
    if (next) stopAudio();
    else {
      const t = textAt(indexRef.current);
      if (t) speakBg(t, tokenRef.current);
    }
  }, [oracle.texts, draw.length]);

  const closeOracle = useCallback(() => {
    tokenRef.current += 1;
    stopAudio();
    setOracle(initialOracle);
  }, []);

  const reset = useCallback(() => {
    tokenRef.current += 1;
    stopAudio();
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
          oracleActive={oracle.active}
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

      {phase === "reading" && oracle.active && (
        <OraclePanel
          oracle={oracle}
          draw={draw}
          spread={spread}
          onNext={nextCard}
          onReplay={replay}
          onMute={toggleMute}
          onClose={closeOracle}
        />
      )}
    </div>
  );
}
