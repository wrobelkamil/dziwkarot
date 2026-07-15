import { useState } from "react";
import CardReveal from "./CardReveal.jsx";

// Przeglądarka pełnej talii (37 kart) dostępna z menu.
export default function DeckGallery({ cards, onClose }) {
  const [sel, setSel] = useState(null); // { card, rect }

  return (
    <div className="deck">
      <div className="deck__bar">
        <span className="deck__title">Pełna talia — {cards.length} kart</span>
        <button className="ghost-btn ghost-btn--soft" onClick={onClose}>Zamknij</button>
      </div>

      <div className="deck__grid">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="deck__tile"
            onClick={(e) => setSel({ card, rect: e.currentTarget.getBoundingClientRect() })}
          >
            <img src={`./karty/${card.file}`} alt={card.name} loading="lazy" draggable="false" />
            <span className="deck__name">{card.name}</span>
          </button>
        ))}
      </div>

      {sel && (
        <CardReveal
          entry={{ card: sel.card, reversed: false }}
          rect={sel.rect}
          browse
          onClose={() => setSel(null)}
        />
      )}
    </div>
  );
}
