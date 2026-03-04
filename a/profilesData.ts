// profilesData.ts

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  town: string;
  image: string;
  isOnline: boolean;
}

export const ALL_PROFILES: UserProfile[] = Array.from({ length: 400 }, (_, i) => ({
  id: i.toString(),
  name: ["Sofija", "Mila", "Emma", "Valentina", "Luka", "Mateo"][i % 6] + " " + (i + 1),
  age: 18 + (i % 25),
  town: ["Budva", "Miami", "London", "Paris", "Tokyo"][i % 5],
  image: `https://picsum.photos/id/${(i + 10) % 70}/400/600`,
  isOnline: i % 3 === 0,
}));

export const STICKERS: string[] = ["❤️", "🔥", "🌹", "👋", "✨", "👑"];