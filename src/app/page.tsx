"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Circle } from "lucide-react";

function useMuyuSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      const ctx = ctxRef.current ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (!ctxRef.current) ctxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  }, []);

  return play;
}

interface FloatText {
  id: number;
  key: number;
}

export default function CyberMuyuPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [animating, setAnimating] = useState(false);
  const floatIdRef = useRef(0);
  const playSound = useMuyuSound();

  const fetchTotal = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (res.ok && typeof data.total_clicks === "number") {
        setTotal(data.total_clicks);
      } else {
        setTotal(0);
      }
    } catch {
      setTotal(0);
    }
  }, []);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  const handleClick = useCallback(async () => {
    setAnimating(true);
    playSound();
    floatIdRef.current += 1;
    const id = floatIdRef.current;
    setFloats((prev) => [...prev, { id, key: id }]);
    setTimeout(() => setAnimating(false), 180);

    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1000);

    try {
      const res = await fetch("/api/click", { method: "POST" });
      const data = await res.json();
      if (res.ok && typeof data.total_clicks === "number") {
        setTotal(data.total_clicks);
      } else {
        setTotal((prev) => (prev ?? 0) + 1);
      }
    } catch {
      setTotal((prev) => (prev ?? 0) + 1);
    }
  }, [playSound, fetchTotal]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative bg-black text-stone-100">
      <header className="absolute top-8 left-0 right-0 text-center">
        <p className="text-gold-400/90 text-lg tracking-wide">
          全球累计功德：<span className="font-semibold text-gold-300">{total ?? "—"}</span>
        </p>
      </header>

      <button
        type="button"
        onClick={handleClick}
        disabled={animating}
        className="relative flex items-center justify-center w-56 h-56 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 focus-visible:ring-offset-4 focus-visible:ring-offset-black disabled:pointer-events-none select-none"
        aria-label="敲木鱼"
      >
        <span
          className={`absolute inset-0 rounded-full bg-gradient-to-b from-gold-600/30 to-gold-900/50 border-2 border-gold-500/80 shadow-[0_0_40px_rgba(212,175,55,0.15)] flex items-center justify-center ${animating ? "animate-scale-tap" : ""}`}
        >
          <Circle className="w-32 h-32 text-gold-400/90" strokeWidth={1.5} fill="currentColor" />
        </span>
        <span className="sr-only">木鱼</span>
      </button>

      {floats.map(({ id, key }) => (
        <span
          key={key}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-400 font-medium text-xl animate-float-up text-shadow-gold"
          style={{ textShadow: "0 0 12px rgba(212,175,55,0.8)" }}
        >
          功德 +1
        </span>
      ))}
    </main>
  );
}
