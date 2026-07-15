import TarotCard from "./TarotCard.jsx";

export default function Board({
  spread,
  question,
  draw,
  onReveal,
  onOpen,
  onRevealAll,
  onReset,
  onStartOracle,
  oracleActive,
  allRevealed,
}) {
  return (
    <div className="reading">
      <header className="reading__head">
        <div className="reading__meta">
          <span className="reading__spread">{spread.name}</span>
          {question.trim() && (
            <p className="reading__question">„{question.trim()}"</p>
          )}
        </div>
      </header>

      <div className="board-wrap">
        <div
          className="board"
          style={{ "--aspect": spread.aspect }}
          data-spread={spread.id}
        >
          {draw.map((entry, i) => (
            <TarotCard
              key={i}
              entry={entry}
              position={spread.positions[i]}
              index={i}
              onReveal={onReveal}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>

      <footer className="reading__foot">
        {!oracleActive && (
          <button type="button" className="oracle-btn" onClick={onStartOracle}>
            <span className="oracle-btn__icon">🔮</span>
            <span>Poproś wróżkę o przepowiednię</span>
          </button>
        )}

        {!oracleActive && (
          <div className="foot-row">
            {!allRevealed && (
              <button type="button" className="ghost-btn" onClick={onRevealAll}>
                Odsłoń wszystkie
              </button>
            )}
            <button
              type="button"
              className="ghost-btn ghost-btn--soft"
              onClick={onReset}
            >
              Nowe rozdanie
            </button>
          </div>
        )}

        {!oracleActive && (
          <p className="hint">
            Możesz też sam dotykać kart, by je odsłaniać i czytać znaczenia
          </p>
        )}
      </footer>
    </div>
  );
}
