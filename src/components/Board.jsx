import TarotCard from "./TarotCard.jsx";

export default function Board({
  spread,
  question,
  draw,
  onReveal,
  onOpen,
  onRevealAll,
  onReset,
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
        {!allRevealed ? (
          <>
            <p className="hint">
              Dotknij karty, by ją odsłonić · dotknij ponownie, by poznać
              znaczenie
            </p>
            <button type="button" className="ghost-btn" onClick={onRevealAll}>
              Odsłoń wszystkie
            </button>
          </>
        ) : (
          <p className="hint">
            Dotknij dowolnej karty, by przeczytać jej znaczenie
          </p>
        )}
        <button type="button" className="ghost-btn ghost-btn--soft" onClick={onReset}>
          Nowe rozdanie
        </button>
      </footer>
    </div>
  );
}
