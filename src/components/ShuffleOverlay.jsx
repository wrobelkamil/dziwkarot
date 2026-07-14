import { useEffect, useState } from "react";

const BACK = "./karty/rewers.png";

// Krótka, elegancka animacja tasowania przed rozłożeniem kart.
export default function ShuffleOverlay({ count, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2200);
    const t2 = setTimeout(() => onDone(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  const fan = Array.from({ length: 7 });

  return (
    <div className={"shuffle" + (leaving ? " is-leaving" : "")}>
      <div className="shuffle__deck">
        {fan.map((_, i) => (
          <img
            key={i}
            src={BACK}
            alt=""
            className="shuffle__card"
            style={{ "--i": i, "--n": fan.length }}
          />
        ))}
      </div>
      <p className="shuffle__text">Tasuję karty przeznaczenia…</p>
      <p className="shuffle__sub">Rozkładam {count} {count === 1 ? "kartę" : "kart"}</p>
    </div>
  );
}
