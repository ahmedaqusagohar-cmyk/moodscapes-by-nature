import { useMemo } from "react";
import type { MoodId } from "@/lib/moods";

interface Props { mood: MoodId }

// Deterministic pseudo-random for stable positions per mood render
const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const MoodScene = ({ mood }: Props) => {
  const scene = useMemo(() => {
    switch (mood) {
      case "calm":
        return (
          <>
            <div className="sun" style={{ bottom: "60%", opacity: 0.5 }} />
            {Array.from({ length: 8 }).map((_, i) => {
              const top = rand(i + 1) * 60;
              const size = 120 + rand(i + 2) * 160;
              const dur = 50 + rand(i + 3) * 60;
              const delay = -rand(i + 4) * dur;
              return (
                <div
                  key={i}
                  className="cloud"
                  style={{
                    top: `${top}%`,
                    width: `${size * 2}px`,
                    height: `${size * 0.5}px`,
                    animationDuration: `${dur}s`,
                    animationDelay: `${delay}s`,
                    opacity: 0.5 + rand(i + 5) * 0.3,
                  }}
                />
              );
            })}
          </>
        );
      case "rainy":
        return (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`c${i}`}
                className="cloud"
                style={{
                  top: `${rand(i + 10) * 30}%`,
                  width: `${250 + rand(i + 11) * 200}px`,
                  height: `${80 + rand(i + 12) * 40}px`,
                  background: "hsl(220 20% 20% / 0.7)",
                  animationDuration: `${80 + rand(i + 13) * 40}s`,
                  animationDelay: `${-rand(i + 14) * 80}s`,
                }}
              />
            ))}
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={`r${i}`}
                className="raindrop"
                style={{
                  left: `${rand(i + 20) * 100}%`,
                  animationDuration: `${0.5 + rand(i + 21) * 0.6}s`,
                  animationDelay: `${-rand(i + 22) * 2}s`,
                  opacity: 0.4 + rand(i + 23) * 0.5,
                }}
              />
            ))}
            <div className="flash" />
          </>
        );
      case "fresh":
        return (
          <>
            <div className="sun" style={{ bottom: "70%", opacity: 0.6 }} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`ray${i}`}
                className="ray"
                style={{
                  left: `${20 + i * 12}%`,
                  transform: `rotate(${-15 + i * 6}deg)`,
                  opacity: 0.3 + rand(i) * 0.3,
                }}
              />
            ))}
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={`l${i}`}
                className="leaf"
                style={{
                  left: `${rand(i + 30) * 100}%`,
                  animationDuration: `${8 + rand(i + 31) * 8}s`,
                  animationDelay: `${-rand(i + 32) * 12}s`,
                  background: `hsl(${60 + rand(i + 33) * 60} 70% 50%)`,
                  transform: `scale(${0.7 + rand(i + 34)})`,
                }}
              />
            ))}
          </>
        );
      case "sunset":
        return (
          <>
            <div className="sun" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="cloud"
                style={{
                  top: `${20 + i * 10}%`,
                  width: `${300 + rand(i) * 200}px`,
                  height: `${40 + rand(i + 1) * 30}px`,
                  background: "hsl(340 80% 75% / 0.6)",
                  animationDuration: `${100 + rand(i + 2) * 60}s`,
                  animationDelay: `${-rand(i + 3) * 100}s`,
                }}
              />
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`p${i}`}
                className="particle"
                style={{
                  left: `${rand(i + 50) * 100}%`,
                  width: `${2 + rand(i + 51) * 3}px`,
                  height: `${2 + rand(i + 51) * 3}px`,
                  animationDuration: `${10 + rand(i + 52) * 15}s`,
                  animationDelay: `${-rand(i + 53) * 20}s`,
                }}
              />
            ))}
          </>
        );
      case "ocean":
        return (
          <>
            <div className="sun" style={{ bottom: "55%", opacity: 0.7 }} />
            <div className="wave" style={{ animationDuration: "8s", opacity: 0.6 }} />
            <div className="wave" style={{ animationDuration: "11s", animationDelay: "-3s", bottom: "-25%", opacity: 0.8 }} />
            <div className="wave" style={{ animationDuration: "14s", animationDelay: "-6s", bottom: "-30%" }} />
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${rand(i + 60) * 100}%`,
                  width: "3px", height: "3px",
                  animationDuration: `${12 + rand(i + 61) * 10}s`,
                  animationDelay: `${-rand(i + 62) * 18}s`,
                }}
              />
            ))}
          </>
        );
      case "night":
        return (
          <>
            <div className="moon" />
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  top: `${rand(i + 70) * 100}%`,
                  left: `${rand(i + 71) * 100}%`,
                  width: `${1 + rand(i + 72) * 2.5}px`,
                  height: `${1 + rand(i + 72) * 2.5}px`,
                  animationDuration: `${2 + rand(i + 73) * 4}s`,
                  animationDelay: `${-rand(i + 74) * 5}s`,
                }}
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`p${i}`}
                className="particle"
                style={{
                  left: `${rand(i + 80) * 100}%`,
                  width: "2px", height: "2px",
                  animationDuration: `${18 + rand(i + 81) * 12}s`,
                  animationDelay: `${-rand(i + 82) * 25}s`,
                }}
              />
            ))}
          </>
        );
    }
  }, [mood]);

  return <div key={mood} className="scene">{scene}</div>;
};
