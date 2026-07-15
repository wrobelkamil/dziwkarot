import { useState, useCallback, useRef } from "react";
import cards from "./data/cards.js";
import { getSpread } from "./data/spreads.js";
import { oracleConfigured } from "./config.js";
import { fetchProphecy, fetchSpeech } from "./lib/oracle.js";
import Starfield from "./components/Starfield.jsx";
import Intro from "./components/Intro.jsx";
import ShuffleOverlay from "./components/ShuffleOverlay.jsx";
import Board from "./components/Board.jsx";
import CardReveal from "./components/CardReveal.jsx";
import DeckGallery from "./components/DeckGallery.jsx";
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
  status: "idle", // idle | thinking | voicing | ready | done | error
  error: null,
  audioErr: null,
  muted: false,
};

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [question, setQuestion] = useState("");
  const [spreadId, setSpreadId] = useState("three");
  const [voiceKey, setVoiceKey] = useState("mistyczny");
  const [draw, setDraw] = useState([]);
  const [modal, setModal] = useState(null); // { index, rect }
  const [showDeck, setShowDeck] = useState(false);
  const [oracle, setOracle] = useState(initialOracle);

  const spread = getSpread(spreadId);

  const tokenRef = useRef(0);
  const speakSeqRef = useRef(0);
  const indexRef = useRef(0);
  const mutedRef = useRef(false);
  const audioRef = useRef(null);
  const textsRef = useRef({});
  const voiceRef = useRef("mistyczny");

  const chooseVoice = useCallback((v) => {
    voiceRef.current = v;
    setVoiceKey(v);
  }, []);

  const beginReading = useCallback(() => {
    setDraw(drawCards(spread.positions.length));
    textsRef.current = {};
    setOracle(initialOracle);
    setPhase("shuffle");
  }, [spread]);

  const onShuffleDone = useCallback(() => setPhase("reading"), []);

  const reveal = useCallback((index) => {
    setDraw((prev) => prev.map((c, i) => (i === index ? { ...c, revealed: true } : c)));
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

  // Dokładnie jeden głos na raz — każde wywołanie unieważnia poprzednie.
  const playVoice = (text, onReadyToShow) => {
    const seq = ++speakSeqRef.current;
    const token = tokenRef.current;
    stopAudio();
    const stale = () => seq !== speakSeqRef.current || token !== tokenRef.current;

    if (mutedRef.current || !text) {
      if (onReadyToShow) onReadyToShow();
      return;
    }
    fetchSpeech(text, voiceRef.current)
      .then((url) => {
        if (stale() || mutedRef.current) {
          URL.revokeObjectURL(url);
          if (onReadyToShow && !stale()) onReadyToShow();
          return;
        }
        stopAudio();
        const a = new Audio(url);
        audioRef.current = a;
        a.onended = () => URL.revokeObjectURL(url);
        if (onReadyToShow) onReadyToShow();
        a.play().catch(() => {});
      })
      .catch((e) => {
        if (!stale()) {
          if (onReadyToShow) onReadyToShow(e.message);
          else setOracle((o) => ({ ...o, audioErr: e.message }));
        }
      });
  };

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
        if (token === tokenRef.current) setOracle((o) => ({ ...o, status: "error", error: e.message }));
        return;
      }
      if (token !== tokenRef.current) return;
      textsRef.current[i] = text;
      setOracle((o) => ({ ...o, status: "voicing" }));
      playVoice(text, (audioErr) =>
        setOracle((o) => ({ ...o, texts: { ...o.texts, [i]: text }, status: "ready", audioErr: audioErr || null }))
      );
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
    } catch (e) {
      setOracle((o) => ({ ...o, status: "error", error: e.message }));
      return;
    }
    if (token !== tokenRef.current) return;
    textsRef.current.closing = text;
    setOracle((o) => ({ ...o, status: "voicing" }));
    playVoice(text, (audioErr) =>
      setOracle((o) => ({ ...o, texts: { ...o.texts, closing: text }, status: "done", done: true, audioErr: audioErr || null }))
    );
  }, [draw, question]);

  const startOracle = useCallback(() => {
    if (!oracleConfigured()) {
      setOracle({ ...initialOracle, active: true, error: "NOT_CONFIGURED", status: "error" });
      return;
    }
    tokenRef.current += 1;
    speakSeqRef.current += 1;
    mutedRef.current = false;
    textsRef.current = {};
    setOracle({ ...initialOracle, active: true, status: "thinking" });
    runStep(0);
  }, [runStep]);

  const nextCard = useCallback(() => {
    if (oracle.status === "thinking" || oracle.status === "voicing") return;
    stopAudio();
    speakSeqRef.current += 1;
    if (oracle.done) return;
    const i = indexRef.current;
    if (i < draw.length - 1) runStep(i + 1);
    else runClosing();
  }, [oracle.status, oracle.done, draw.length, runStep, runClosing]);

  const currentText = () =>
    indexRef.current >= draw.length ? textsRef.current.closing : textsRef.current[indexRef.current];

  const replay = useCallback(() => {
    const t = currentText();
    if (t) playVoice(t);
  }, [draw.length]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setOracle((o) => ({ ...o, muted: next }));
    if (next) {
      speakSeqRef.current += 1;
      stopAudio();
    } else {
      const t = currentText();
      if (t) playVoice(t);
    }
  }, [draw.length]);

  const closeOracle = useCallback(() => {
    tokenRef.current += 1;
    speakSeqRef.current += 1;
    stopAudio();
    setOracle(initialOracle);
  }, []);

  const reset = useCallback(() => {
    tokenRef.current += 1;
    speakSeqRef.current += 1;
    stopAudio();
    setModal(null);
    setDraw([]);
    textsRef.current = {};
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
          voiceKey={voiceKey}
          onVoice={chooseVoice}
          onShowDeck={() => setShowDeck(true)}
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
          onOpen={(index, rect) => setModal({ index, rect })}
          onRevealAll={revealAll}
          onReset={reset}
          onStartOracle={startOracle}
          oracleActive={oracle.active}
          allRevealed={allRevealed}
        />
      )}

      {modal && draw[modal.index] && (
        <CardReveal
          entry={draw[modal.index]}
          position={spread.positions[modal.index]?.label}
          rect={modal.rect}
          onClose={() => setModal(null)}
        />
      )}

      {showDeck && <DeckGallery cards={cards} onClose={() => setShowDeck(false)} />}

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
