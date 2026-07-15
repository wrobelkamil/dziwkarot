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

const VOICE = "szept"; // jedyny głos wróżki

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
  const urlsRef = useRef({}); // cache audio (mp3) per karta — bez ponownej generacji

  const keyForIndex = (i) => (i >= draw.length ? "closing" : i);

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

  const revokeAll = () => {
    Object.values(urlsRef.current).forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = {};
  };

  // Odtwórz JUŻ wygenerowany dźwięk z cache (bez zapytania do API).
  const playFromUrl = (url) => {
    speakSeqRef.current += 1;
    stopAudio();
    if (mutedRef.current) return;
    const a = new Audio(url);
    audioRef.current = a;
    a.play().catch(() => {});
  };

  // Wygeneruj głos raz, zapamiętaj w cache, odtwórz. onReady pokazuje tekst.
  const speakNew = (key, text, onReady) => {
    const seq = ++speakSeqRef.current;
    const token = tokenRef.current;
    stopAudio();
    const stale = () => seq !== speakSeqRef.current || token !== tokenRef.current;

    if (mutedRef.current || !text) {
      if (onReady) onReady();
      return;
    }
    fetchSpeech(text, VOICE)
      .then((url) => {
        if (stale() || mutedRef.current) {
          URL.revokeObjectURL(url);
          if (onReady && !stale()) onReady();
          return;
        }
        urlsRef.current[key] = url; // cache
        stopAudio();
        const a = new Audio(url);
        audioRef.current = a;
        if (onReady) onReady();
        a.play().catch(() => {});
      })
      .catch((e) => {
        if (!stale()) {
          if (onReady) onReady(e.message);
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
      speakNew(i, text, (audioErr) =>
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
    speakNew("closing", text, (audioErr) =>
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
    revokeAll();
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

  // Ponowne czytanie: odtwórz z cache, a jeśli brak — wygeneruj raz.
  const replay = useCallback(() => {
    const key = keyForIndex(indexRef.current);
    const url = urlsRef.current[key];
    if (url) playFromUrl(url);
    else {
      const t = currentText();
      if (t) speakNew(key, t);
    }
  }, [draw.length]);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setOracle((o) => ({ ...o, muted: next }));
    if (next) {
      speakSeqRef.current += 1;
      stopAudio();
    } else {
      const key = keyForIndex(indexRef.current);
      const url = urlsRef.current[key];
      if (url) playFromUrl(url);
      else {
        const t = currentText();
        if (t) speakNew(key, t);
      }
    }
  }, [draw.length]);

  const closeOracle = useCallback(() => {
    tokenRef.current += 1;
    speakSeqRef.current += 1;
    stopAudio();
    revokeAll();
    setOracle(initialOracle);
  }, []);

  const reset = useCallback(() => {
    tokenRef.current += 1;
    speakSeqRef.current += 1;
    stopAudio();
    revokeAll();
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
