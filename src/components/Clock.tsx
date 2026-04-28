import { useEffect, useState } from "react";

export const Clock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  return (
    <div className="text-right leading-tight">
      <div className="text-4xl md:text-5xl font-serif tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
        {time}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] opacity-70">{date}</div>
    </div>
  );
};
