import { useEffect, useRef } from "react";

// Lekki, migoczący gwiezdny pył na tle. Czysty canvas, bez zależności.
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let stars = [];
    let w, h, dpr;

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        base: Math.random() * 0.5 + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.004,
        drift: Math.random() * 0.15 + 0.02,
        gold: Math.random() < 0.25,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.tw += s.sp;
        s.y += s.drift;
        if (s.y > h + 2) s.y = -2;
        const a = s.base + Math.sin(s.tw) * 0.35;
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = s.gold ? "#e9c46a" : "#e8e6f5";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
