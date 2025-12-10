export interface MovieStyle {
  id: string;
  name: string;
  emoji: string;
  promptAddon: string;
  color: string;
}

export interface PosterFormData {
  teamName: string;
  members: string;
  slogan: string;
  styleId: string;
  images: File[];
}

export interface GeneratedPoster {
  imageUrl: string;
}

export const MOVIE_STYLES: MovieStyle[] = [
  // --- International (10) ---
  { id: 'avengers', name: '어벤져스', emoji: '🦸‍♂️', promptAddon: 'Avengers Endgame marvel superhero style, epic cosmic background, glowing energy, heroic poses, metallic suits, purple and blue nebula', color: 'from-blue-600 to-purple-600' },
  { id: 'matrix', name: '매트릭스', emoji: '🕶️', promptAddon: 'The Matrix style, green cascading digital code rain background, black leather trench coats, dark sunglasses, cyberpunk sci-fi atmosphere', color: 'from-green-600 to-black' },
  { id: 'lalaland', name: '라라랜드', emoji: '💃', promptAddon: 'La La Land style, magical purple and blue twilight sky over city, vintage street lamp, romantic and dreamy atmosphere, silhouette dancing vibe', color: 'from-indigo-500 to-purple-700' },
  { id: 'harrypotter', name: '해리 포터', emoji: '🧙', promptAddon: 'Harry Potter wizarding world style, hogwarts castle background, holding wands, magical sparkles, dark blue and gold mystic atmosphere', color: 'from-amber-600 to-blue-900' },
  { id: 'starwars', name: '스타워즈', emoji: '⚔️', promptAddon: 'Star Wars space opera style, holding lightsabers, galaxy background with stars, jedi and sith robes, epic sci-fi composition', color: 'from-blue-500 to-red-600' },
  { id: 'mission', name: '미션 임파서블', emoji: '🧨', promptAddon: 'Mission Impossible spy action style, fuse burning, explosions in background, running poses, high contrast orange and black, intense thriller', color: 'from-orange-500 to-red-600' },
  { id: 'interstellar', name: '인터스텔라', emoji: '🚀', promptAddon: 'Interstellar space masterpiece style, black hole Gargantua background, astronauts in space suits, cosmic dust, vast scale, cinematic', color: 'from-slate-700 to-black' },
  { id: 'frozen', name: '겨울왕국', emoji: '❄️', promptAddon: 'Frozen disney animation style, ice castle background, snow particles, magical winter fantasy, light blue and white palette', color: 'from-cyan-400 to-blue-500' },
  { id: 'joker', name: '조커', emoji: '🤡', promptAddon: 'Joker movie poster style, clown makeup vibe, colorful suit, dancing on stairs, psychological thriller, gritty green and purple tones', color: 'from-green-600 to-purple-700' },
  { id: 'titanic', name: '타이타닉', emoji: '🚢', promptAddon: 'Titanic romance disaster style, ship bow, sunset over ocean, emotional and epic, blue ocean and warm sunset gradient', color: 'from-blue-800 to-orange-400' },

  // --- Korean (10) ---
  { id: 'parasite', name: '기생충', emoji: '🍑', promptAddon: 'Parasite movie poster style, black bars covering eyes, modern house garden background, suspenseful thriller vibe, sharp contrast, uncomfortable calm', color: 'from-gray-700 to-black' },
  { id: 'oldboy', name: '올드보이', emoji: '🔨', promptAddon: 'Oldboy Korean noir style, gritty texture, dark shadows, mystery, intense dramatic lighting, holding a hammer, purple and black tint', color: 'from-purple-900 to-black' },
  { id: 'roundup', name: '범죄도시', emoji: '👊', promptAddon: 'The Roundup (Crime City) style, Ma Dong-seok tough cop vibe, gritty urban street background, intense muscular action, cool blue and dark tones', color: 'from-slate-800 to-blue-900' },
  { id: 'busan', name: '부산행', emoji: '🧟', promptAddon: 'Train to Busan zombie apocalypse style, chaotic train station background, running from danger, intense survival horror, gritty texture', color: 'from-red-900 to-gray-800' },
  { id: 'host', name: '괴물', emoji: '🦑', promptAddon: 'The Host (Gwoemul) style, Han river bridge background in daylight but gloomy, giant monster lurking, suspenseful creature feature vibe', color: 'from-green-800 to-gray-700' },
  { id: 'newworld', name: '신세계', emoji: '🕴️', promptAddon: 'New World (Sinsegye) gangster noir style, wearing sharp suits, dark boardroom or elevator background, gold and black color scheme, serious faces', color: 'from-yellow-700 to-gray-900' },
  { id: 'wailing', name: '곡성', emoji: '👹', promptAddon: 'The Wailing horror style, dark misty mountains, shaman ritual elements, mysterious and occult atmosphere, grainy film look', color: 'from-stone-800 to-black' },
  { id: 'extremejob', name: '극한직업', emoji: '🍗', promptAddon: 'Extreme Job comedy action style, holding fried chicken and guns, bright yellow and orange background, energetic and funny police team', color: 'from-yellow-500 to-orange-600' },
  { id: 'assassination', name: '암살', emoji: '🔫', promptAddon: 'Assassination (Amsal) 1930s independence fighter style, vintage trench coats, fedoras, holding classic rifles, sepia tone, historical epic', color: 'from-amber-800 to-stone-800' },
  { id: 'admiral', name: '명량', emoji: '🌊', promptAddon: 'The Admiral: Roaring Currents style, Joseon dynasty armor, epic sea battle background, crashing waves, heroic historical war movie', color: 'from-blue-900 to-gray-800' },
];

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}