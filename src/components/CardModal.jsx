import { useEffect } from "react";

export default function CardModal({ entry, position, onClose }) {
  const { card, reversed } = entry;
  const meaning = reversed ? card.reversed : card.upright;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Zamknij">
          ✕
        </button>
        <div className="modal__img-wrap">
          <img
            className={"modal__img" + (reversed ? " is-reversed" : "")}
            src={`./karty/${card.file}`}
            alt={card.name}
          />
        </div>
        <div className="modal__body">
          <span className="modal__position">{position.label}</span>
          <h2 className="modal__name">{card.name}</h2>
          <span className={"modal__orient" + (reversed ? " rev" : "")}>
            {reversed ? "pozycja odwrócona" : "pozycja prosta"}
          </span>
          <div className="modal__keywords">
            {card.keywords.map((k) => (
              <span key={k} className="kw">{k}</span>
            ))}
          </div>
          <p className="modal__meaning">{meaning}</p>
        </div>
      </div>
    </div>
  );
}
