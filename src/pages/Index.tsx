import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Focus, X } from "lucide-react";
import { MOODS, getMood, type MoodId } from "@/lib/moods";
import { startMoodAudio, type StopFn } from "@/lib/ambient";
import { MoodScene } from "@/components/MoodScene";
import { Clock } from "@/components/Clock";
import { Slider } from "@/components/ui/slider";

const STORAGE_KEY = "nature-mood:last";

const Index = () => {
  const [mood, setMood] = useState<MoodId>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as MoodId | null) : null;
    return saved && MOODS.some((m) => m.id === saved) ? saved : "calm";
  });
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [focus, setFocus] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopRef = useRef<StopFn | null>(null);

  const current = useMemo(() => getMood(mood), [mood]);

  useEffect(() => {
    document.documentElement.setAttribute("data-mood", mood);
    localStorage.setItem(STORAGE_KEY, mood);
    document.title = `Nature Mood — ${current.name}`;
  }, [mood, current.name]);

  // Start/stop ambient audio
  useEffect(() => {
    if (!playing) {
      stopRef.current?.();
      stopRef.current = null;
      return;
    }
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!ctxRef.current) {
      ctxRef.current = new Ctx();
      const master = ctxRef.current.createGain();
      master.gain.value = muted ? 0 : volume;
      master.connect(ctxRef.current.destination);
      masterRef.current = master;
    }
    ctxRef.current.resume();
    stopRef.current?.();
    stopRef.current = startMoodAudio(ctxRef.current, masterRef.current!, mood);
    return () => { stopRef.current?.(); stopRef.current = null; };
  }, [playing, mood]); // eslint-disable-line

  // Volume control
  useEffect(() => {
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(muted ? 0 : volume, ctxRef.current.currentTime, 0.05);
    }
  }, [volume, muted]);

  return (
    <main className="relative h-screen w-screen overflow-hidden" style={{ color: `hsl(${current.ink})` }}>
      {/* Photoreal backdrop */}
      <div
        key={mood}
        className="absolute inset-0 animate-[fade-in_1.2s_ease]"
        style={{
          backgroundImage: `url(${current.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 1.2s ease",
        }}
      />
      <div className="absolute inset-0" style={{ background: `hsl(${current.overlay})` }} />
      <MoodScene mood={mood} />

      {!focus && (
        <header className="fade-swap absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, hsl(var(--mood-glow)), hsl(var(--mood-accent)))",
                boxShadow: "0 0 30px hsl(var(--mood-glow) / 0.5)",
              }}
            />
            <div>
              <h1 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                Nature Mood
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] opacity-80">{current.tagline}</p>
            </div>
          </div>
          <Clock />
        </header>
      )}

      {!focus && (
        <section
          key={mood + "-q"}
          className="fade-swap pointer-events-none absolute left-1/2 top-1/2 z-10 w-[88%] max-w-2xl -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ textShadow: "0 2px 24px hsl(0 0% 0% / 0.4)" }}
        >
          <div className="text-7xl md:text-8xl mb-4 select-none" aria-hidden>{current.emoji}</div>
          <blockquote className="text-xl md:text-3xl leading-relaxed" style={{ fontFamily: "'Fraunces', serif" }}>
            “{current.quote}”
          </blockquote>
          <div className="mt-4 text-xs uppercase tracking-[0.3em] opacity-80">— {current.name} mood</div>
        </section>
      )}

      {focus && (
        <button onClick={() => setFocus(false)} className="icon-btn absolute right-6 top-6 z-30" aria-label="Exit focus mode">
          <X className="h-5 w-5" />
        </button>
      )}

      {!focus && (
        <div className="fade-swap absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 md:px-10 md:pb-8">
          <div className="glass mx-auto flex max-w-5xl flex-col gap-4 rounded-3xl p-4 md:p-5" style={{ color: `hsl(${current.ink})` }}>
            <div className="flex gap-2 overflow-x-auto pb-1 md:justify-center md:overflow-visible">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  data-active={mood === m.id}
                  className="mood-chip min-w-[96px] shrink-0"
                  aria-pressed={mood === m.id}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t pt-4" style={{ borderColor: "hsl(0 0% 100% / 0.15)" }}>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="icon-btn"
                aria-label={playing ? "Pause audio" : "Play audio"}
                style={{ background: "hsl(var(--mood-accent) / 0.85)" }}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>

              <button onClick={() => setMuted((m) => !m)} className="icon-btn" aria-label={muted ? "Unmute" : "Mute"}>
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <div className="flex min-w-[140px] flex-1 items-center gap-3">
                <Slider
                  value={[muted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(v) => {
                    setVolume(v[0] / 100);
                    if (muted && v[0] > 0) setMuted(false);
                  }}
                  aria-label="Volume"
                />
                <span className="w-10 text-right text-xs tabular-nums opacity-80">
                  {Math.round((muted ? 0 : volume) * 100)}%
                </span>
              </div>

              <div className="hidden text-sm opacity-80 md:block">
                Ambience: <span className="font-medium">{current.name}</span>
              </div>

              <button onClick={() => setFocus(true)} className="icon-btn" aria-label="Enter focus mode" title="Focus mode">
                <Focus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;
