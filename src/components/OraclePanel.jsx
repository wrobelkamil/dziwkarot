export default function OraclePanel({ oracle, draw, spread, onNext, onReplay, onMute, onClose }) {
  const { index, texts, status, error, audioErr, muted, done } = oracle;
  const busy = status === "thinking" || status === "voicing";

  if (error === "NOT_CONFIGURED") {
    return (
      <div className="oracle">
        <div className="oracle__panel">
          <button className="oracle__x" onClick={onClose} aria-label="Zamknij">✕</button>
          <p className="oracle__who">Madame Dziwina śpi…</p>
          <p className="oracle__text">
            Wróżka nie ma jeszcze połączenia z zaświatami. Wdróż Cloudflare
            Workera wg <code>worker/README.md</code> i wpisz jego adres w{" "}
            <code>src/config.js</code> (<code>ORACLE_URL</code>), potem przebuduj stronę.
          </p>
          <div className="oracle__controls">
            <button className="ghost-btn" onClick={onClose}>Rozumiem</button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="oracle">
        <div className="oracle__panel">
          <button className="oracle__x" onClick={onClose} aria-label="Zamknij">✕</button>
          <p className="oracle__who">Zaświaty milczą</p>
          <p className="oracle__text oracle__text--err">{error}</p>
          <div className="oracle__controls">
            <button className="ghost-btn" onClick={onClose}>Zamknij seans</button>
          </div>
        </div>
      </div>
    );
  }

  const isClosing = index >= draw.length;
  const entry = !isClosing ? draw[index] : null;
  const label = !isClosing ? spread.positions[index]?.label : "Klamra seansu";
  const name = !isClosing ? entry?.card.name : "✦ Podsumowanie";
  const text = isClosing ? texts.closing : texts[index];

  const statusLabel =
    status === "thinking"
      ? "wpatruje się w karty…"
      : status === "voicing"
      ? "przywołuje głos…"
      : done
      ? "seans zakończony"
      : muted
      ? "głos wyciszony"
      : "🔊 czyta…";

  const nextLabel = done
    ? "Zakończ seans"
    : index === draw.length - 1
    ? "Podsumowanie ✦"
    : "Następna karta →";

  const onPrimary = done ? onClose : onNext;

  return (
    <div className="oracle">
      <div className="oracle__panel">
        <button className="oracle__x" onClick={onClose} aria-label="Zakończ seans">✕</button>

        <div className="oracle__head">
          <span className="oracle__who">🔮 Madame Dziwina</span>
          <span className="oracle__status">
            {statusLabel}
            {busy && <span className="dots"><i/><i/><i/></span>}
          </span>
        </div>

        <div className="oracle__card">
          <span className="oracle__pos">{label}</span>
          <span className="oracle__name">
            {name}
            {entry?.reversed && <em className="oracle__rev"> (odwrócona)</em>}
          </span>
          {!isClosing && (
            <span className="oracle__count">karta {index + 1} / {draw.length}</span>
          )}
        </div>

        <p className={"oracle__text" + (text ? "" : " is-loading")}>
          {text || "…"}
        </p>

        {audioErr && !muted && (
          <p className="oracle__audioerr">🔇 głos niedostępny — {audioErr}</p>
        )}

        <div className="oracle__controls">
          <button type="button" className="oracle-next" onClick={onPrimary} disabled={busy}>
            {nextLabel}
          </button>
          <button type="button" className="ghost-btn ghost-btn--soft" onClick={onMute}>
            {muted ? "🔇 Głos wył." : "🔊 Głos wł."}
          </button>
          {text && !muted && (
            <button type="button" className="ghost-btn ghost-btn--soft" onClick={onReplay}>
              ↻ Przeczytaj
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
