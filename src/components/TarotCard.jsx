const BACK = "./karty/rewers.png";

// Pojedyncza karta na stole. Klik odsłania (obrót 3D z rewersu).
// Ponowny klik na odsłoniętą kartę otwiera szczegóły ze znaczeniem.
export default function TarotCard({
  entry,
  position,
  index,
  onReveal,
  onOpen,
}) {
  const { card, reversed, revealed } = entry;
  const face = `./karty/${card.file}`;

  const handleClick = () => {
    if (!revealed) onReveal(index);
    else onOpen(index);
  };

  const style = {
    left: position.x + "%",
    top: position.y + "%",
    "--delay": index * 0.09 + "s",
    "--rot": (position.rot || 0) + "deg",
  };

  return (
    <div className="slot" style={style}>
      <button
        type="button"
        className={
          "card3d" +
          (revealed ? " is-revealed" : "") +
          (reversed ? " is-reversed" : "")
        }
        onClick={handleClick}
        aria-label={
          revealed ? `${card.name} — pokaż znaczenie` : "Odsłoń kartę"
        }
      >
        <span className="card3d__inner">
          <span className="card3d__face card3d__back">
            <img src={BACK} alt="" draggable="false" />
          </span>
          <span className="card3d__face card3d__front">
            <img src={face} alt={card.name} draggable="false" />
            {reversed && <span className="rev-badge">odwrócona</span>}
          </span>
        </span>
      </button>
      <span className="slot__label">{position.label}</span>
      {revealed && <span className="slot__name">{card.name}</span>}
    </div>
  );
}
