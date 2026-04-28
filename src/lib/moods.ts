export type MoodId = "calm" | "rainy" | "fresh" | "sunset" | "ocean" | "night";

export interface Mood {
  id: MoodId;
  name: string;
  emoji: string;
  tagline: string;
  quote: string;
  /** Free, CORS-friendly ambient loops */
  audio: string;
}

export const MOODS: Mood[] = [
  {
    id: "calm",
    name: "Calm",
    emoji: "☁️",
    tagline: "Slow clouds, soft sky",
    quote: "Within you, there is a stillness to which you can retreat at any time.",
    audio: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1718e0f139.mp3",
  },
  {
    id: "rainy",
    name: "Rainy",
    emoji: "🌧️",
    tagline: "Rain on rooftops, distant thunder",
    quote: "Some people feel the rain. Others just get wet.",
    audio: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5bdb1ae0c7.mp3",
  },
  {
    id: "fresh",
    name: "Fresh",
    emoji: "🌿",
    tagline: "Forest birds, sunlit leaves",
    quote: "In every walk with nature, one receives far more than they seek.",
    audio: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c610232c4c.mp3",
  },
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    tagline: "Golden hour, warm haze",
    quote: "Every sunset is an opportunity to reset.",
    audio: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc3ebfc.mp3",
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    tagline: "Rolling waves, salt breeze",
    quote: "The cure for anything is salt water — sweat, tears, or the sea.",
    audio: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_2d4f5e3d32.mp3",
  },
  {
    id: "night",
    name: "Night",
    emoji: "🌙",
    tagline: "Starlight, quiet moon",
    quote: "The night is the hardest time to be alive, and 4am knows all my secrets.",
    audio: "https://cdn.pixabay.com/download/audio/2022/08/23/audio_5c8f3d4ab0.mp3",
  },
];

export const getMood = (id: MoodId) => MOODS.find((m) => m.id === id)!;
