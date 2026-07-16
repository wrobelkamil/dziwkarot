import { useEffect, useMemo, useRef, useState } from "react";

// Podgląd karty: kliknięta karta „unosi się ze stołu" do centrum,
// a obok/pod spodem pojawia się tło z opisem.
export default function CardReveal({ entry, position, rect, browse = false, onClose }) {
  const { card, reversed } = entry;
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);

  // Docelowe położenie uniesionej karty (px, fixed).
  const target = useMemo(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio = 826 / 1418;
    const mobile = vw < 760;
    const h = mobile ? Math.min(vh * 0.4, 300) : Math.min(vh * 0.66, 540);
    const w = h * ratio;
    const left = mobile ? (vw - w) / 2 : Math.max(24, vw * 0.30 - w / 2);
    const top = mobile ? vh * 0.035 : (vh - h) / 2;
    return { left, top, w, h };
  }, []);

  const start = rect
    ? { left: rect.left, top: rect.top, w: rect.width, h: rect.height }
    : { left: target.left, top: target.top + 40, w: target.w * 0.6, h: target.h * 0.6 };

  const pos = open ? target : start;

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setOpen(false);
    setTimeout(onClose, 520);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cardStyle = {
    left: pos.left + "px",
    top: pos.top + "px",
    width: pos.w + "px",
    height: pos.h + "px",
  };

  return (
    <div className={"card-reveal" + (open ? " is-open" : "")} onClick={close}>
      <div className="card-reveal__backdrop" />

      <div
        className={"card-reveal__card" + (reversed && !browse ? " is-reversed" : "")}
        style={cardStyle}
      >
        <img src={`./karty/${card.file}`} alt={card.name} draggable="false" />
      </div>

      <div className="card-reveal__info" onClick={(e) => e.stopPropagation()}>
        <button className="card-reveal__x" onClick={close} aria-label="Zamknij">✕</button>
        {position && <span className="card-reveal__pos">{position}</span>}
        <h2 className="card-reveal__name">{card.name}</h2>
        {!browse && (
          <span className={"card-reveal__orient" + (reversed ? " rev" : "")}>
            {reversed ? "pozycja odwrócona" : "pozycja prosta"}
          </span>
        )}
        <div className="card-reveal__kw">
          {card.keywords.map((k) => (
            <span key={k} className="kw">{k}</span>
          ))}
        </div>

        {browse ? (
          <div className="card-reveal__both">
            <p><span className="mlabel">Pozycja prosta</span>{card.upright}</p>
            <p><span className="mlabel rev">Pozycja odwrócona</span>{card.reversed}</p>
          </div>
        ) : (
          <p className="card-reveal__meaning">{reversed ? card.reversed : card.upright}</p>
        )}
      </div>
    </div>
  );
}
