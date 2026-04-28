import calmImg from "@/assets/mood-calm.jpg";
import rainyImg from "@/assets/mood-rainy.jpg";
import freshImg from "@/assets/mood-fresh.jpg";
import sunsetImg from "@/assets/mood-sunset.jpg";
import oceanImg from "@/assets/mood-ocean.jpg";
import nightImg from "@/assets/mood-night.jpg";

export type MoodId = "calm" | "rainy" | "fresh" | "sunset" | "ocean" | "night";

export interface Mood {
  id: MoodId;
  name: string;
  emoji: string;
  tagline: string;
  quote: string;
  image: string;
  /** Tint overlay (HSL values) applied on top of the image for theming */
  overlay: string;
  /** Ink color on top of the image */
  ink: string;
  /** CORS-friendly looping ambient audio */
  audio: string;
}

/* Audio sources: archive.org CC0 loops (permit direct hotlinking & CORS). */
export const MOODS: Mood[] = [
  {
    id: "calm",
    name: "Calm",
    emoji: "☁️",
    tagline: "Slow clouds, open sky",
    quote: "Within you, there is a stillness to which you can retreat at any time.",
    image: calmImg,
    overlay: "200 70% 60% / 0.15",
    ink: "215 40% 15%",
    audio: "https://archive.org/download/relaxing-ambient-music_202310/relaxing-ambient.mp3",
  },
  {
    id: "rainy",
    name: "Rainy",
    emoji: "🌧️",
    tagline: "Rain on leaves, distant thunder",
    quote: "Some people feel the rain. Others just get wet.",
    image: rainyImg,
    overlay: "220 40% 15% / 0.35",
    ink: "210 40% 98%",
    audio: "https://archive.org/download/rain-thunder_202309/rain-thunder.mp3",
  },
  {
    id: "fresh",
    name: "Fresh",
    emoji: "🌿",
    tagline: "Forest birds, sunlit leaves",
    quote: "In every walk with nature, one receives far more than they seek.",
    image: freshImg,
    overlay: "120 50% 25% / 0.2",
    ink: "0 0% 100%",
    audio: "https://archive.org/download/forest-birds-ambience/forest-birds.mp3",
  },
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    tagline: "Golden hour, warm haze",
    quote: "Every sunset is an opportunity to reset.",
    image: sunsetImg,
    overlay: "20 80% 40% / 0.15",
    ink: "0 0% 100%",
    audio: "https://archive.org/download/calm-meditation-music/calm-meditation.mp3",
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    tagline: "Rolling waves, salt breeze",
    quote: "The cure for anything is salt water — sweat, tears, or the sea.",
    image: oceanImg,
    overlay: "200 70% 30% / 0.18",
    ink: "0 0% 100%",
    audio: "https://archive.org/download/ocean-waves-loop/ocean-waves.mp3",
  },
  {
    id: "night",
    name: "Night",
    emoji: "🌙",
    tagline: "Starlight, quiet moon",
    quote: "The night is the hardest time to be alive, and 4am knows all my secrets.",
    image: nightImg,
    overlay: "240 50% 8% / 0.45",
    ink: "240 30% 95%",
    audio: "https://archive.org/download/night-ambient-sounds/night-ambient.mp3",
  },
];

export const getMood = (id: MoodId) => MOODS.find((m) => m.id === id)!;
