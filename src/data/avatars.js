// Avatars: free ones have cost 0; others unlock by likes (cost) or by player level
export const AVATARS = [
  { id: 'gamer', emoji: '😎', name: 'גיימר', cost: 0 },
  { id: 'cat', emoji: '🐱', name: 'חתול', cost: 0 },
  { id: 'robot', emoji: '🤖', name: 'רובוט', cost: 0 },
  { id: 'ninja', emoji: '�', name: 'גיבור-על', cost: 50 },
  { id: 'alien', emoji: '👽', name: 'חייזר', cost: 80 },
  { id: 'unicorn', emoji: '🦄', name: 'חד-קרן', cost: 100 },
  { id: 'dragon', emoji: '🐲', name: 'דרקון', cost: 150 },
  { id: 'astronaut', emoji: '🧑‍🚀', name: 'אסטרונאוט', cost: 200 },
  { id: 'wizard', emoji: '🧙', name: 'קוסם', cost: 250 },
  { id: 'ghost', emoji: '👻', name: 'רוח', cost: 0, level: 4 },
  { id: 'fox', emoji: '🦊', name: 'שועל', cost: 0, level: 7 },
  { id: 'crown', emoji: '👑', name: 'מלך היוטיוב', cost: 0, level: 10 },
];

export const avatarById = (id) => AVATARS.find((a) => a.id === id) || AVATARS[0];
