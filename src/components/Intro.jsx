import spreads from "../data/spreads.js";

export default function Intro({
  question,
  setQuestion,
  spreadId,
  setSpreadId,
  onBegin,
}) {
  return (
    <div className="intro">
      <div className="intro__inner">
        <div className="sigil" aria-hidden="true">✶</div>
        <h1 className="title">Dziwkarot</h1>
        <p className="subtitle">
          Wyrocznia trzydziestu siedmiu kart. Wycisz myśli, zadaj pytanie
          i pozwól, by karty odsłoniły to, co ukryte.
        </p>

        <label className="field">
          <span className="field__label">Twoje pytanie</span>
          <textarea
            className="field__input"
            rows={2}
            maxLength={160}
            placeholder="O co chcesz zapytać wszechświat?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>

        <div className="spread-select">
          <span className="field__label">Wybierz rozkład</span>
          <div className="spread-grid">
            {spreads.map((s) => (
              <button
                key={s.id}
                type="button"
                className={
                  "spread-card" + (s.id === spreadId ? " is-active" : "")
                }
                onClick={() => setSpreadId(s.id)}
              >
                <span className="spread-card__count">
                  {s.positions.length}
                  <em>{s.positions.length === 1 ? "karta" : "kart"}</em>
                </span>
                <span className="spread-card__name">{s.name}</span>
                <span className="spread-card__sub">{s.subtitle}</span>
                <span className="spread-card__desc">{s.description}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="begin-btn" onClick={onBegin}>
          <span>Postaw karty</span>
        </button>
        <p className="disclaimer">projekt satyryczny · nie traktuj poważnie</p>
      </div>
    </div>
  );
}
