// Word bank for the mapping test (15/10/2026). PNG images where they exist, emoji otherwise.
// level: 1 = exam core, 2 = extra practice, 3 = longer words
const L = (en, he, media, example, category, level = 1, extra = {}) => ({
  en, he, example, category, level, ...extra,
  ...(media.endsWith('.png') ? { img: media } : media ? { emoji: media } : {}),
});
// P = word that appears in the exam sheet — picked ~3x more often
const P = (en, he, media, example, category, extra = {}) => ({ ...L(en, he, media, example, category, 1, extra), priority: true });
// Words that can't be shown as a clear picture (adjectives, function words)
const NP = { noPic: true };

export const CATEGORIES = {
  animals: 'חיות', food: 'אוכל', people: 'אנשים', actions: 'פעולות', describing: 'תיאורים',
  things: 'חפצים', numbers: 'מספרים', body: 'גוף', words: 'מילים קטנות',
};

export const WORDS = [
  // ---- exam vocabulary: read & understand ----
  P('milk', 'חלב', '🥛', 'The cat has milk.', 'food'),
  P('run', 'לרוץ', '🏃', 'I run fast.', 'actions'),
  P('sing', 'לשיר', 'sing.png', 'I sing a song.', 'actions'),
  P('mad', 'כועס', '😡', 'Dad is mad.', 'describing'),
  P('test', 'מבחן', 'test.png', 'I have a test.', 'things'),
  P('fat', 'שמן', '', 'The cat is fat.', 'describing', NP),
  P('cut', 'לחתוך', '✂️', 'Cut the cheese.', 'actions'),
  P('tall', 'גבוה', '', 'The boy is tall.', 'describing', NP),
  P('bed', 'מיטה', 'bed.png', 'The dog is on the bed.', 'things'),
  P('fast', 'מהיר', '', 'The dog is fast.', 'describing', NP),
  P('bag', 'תיק', 'bag.png', 'I have a big bag.', 'things'),
  P('not', 'לא (שלילה)', '', 'The cat is not sad.', 'words', NP),
  P('desk', 'שולחן כתיבה', '', 'The bag is on the desk.', 'things', NP),
  P('swim', 'לשחות', '🏊', 'The fish can swim.', 'actions'),
  P('big', 'גדול', 'big.png', 'The cow is big.', 'describing'),
  P('egg', 'ביצה', 'egg.png', 'The egg is small.', 'food'),
  P('mother', 'אמא', '👩', 'My mother is tall.', 'people'),
  P('cow', 'פרה', 'cow.png', 'The cow has milk.', 'animals'),
  P('boy', 'ילד', '👦', 'The boy can run.', 'people'),
  P('small', 'קטן', '', 'The egg is small.', 'describing', NP),
  P('have', 'יש (לי)', 'ihave.png', 'I have a dog.', 'words', NP),
  P('has', 'יש (לו / לה)', 'has.png', 'She has a cat.', 'words', NP),
  P('dog', 'כלב', 'dog.png', 'The dog is big.', 'animals'),
  P('name', 'שם', '', 'My name is Noam.', 'words', NP),
  P('cat', 'חתול', 'cat.png', 'The cat is fat.', 'animals'),
  P('chicken', 'תרנגול / עוף', '🐔', 'The chicken has an egg.', 'animals'),
  P('sad', 'עצוב', 'sad.png', 'The boy is sad.', 'describing'),
  P('the', 'ה- (הידיעה)', '', 'The dog is on the bed.', 'words', NP),

  // ---- exam: ch / sh / th ----
  P('chair', 'כסא', '🪑', 'The cat is on the chair.', 'things'),
  P('cheese', 'גבינה', '🧀', 'I have cheese and milk.', 'food'),
  P('ship', 'ספינה', '🚢', 'The ship is big.', 'things'),
  P('fish', 'דג', '🐟', 'The fish can swim.', 'animals'),
  P('short', 'נמוך', '', 'The boy is short.', 'describing', NP),
  P('this', 'זה / זו', '', 'This is my dog.', 'words', { ...NP, display: 'This is' }),
  P('birthday', 'יום הולדת', '🎂', 'Happy birthday!', 'things'),
  P('teeth', 'שיניים', '🦷', 'The dog has big teeth.', 'body'),

  // ---- exam: numbers 1-12 ----
  P('one', 'אחת', '', 'I have one cat.', 'numbers', { digit: 1 }),
  P('two', 'שתיים', '', 'I have two eggs.', 'numbers', { digit: 2 }),
  P('three', 'שלוש', '', 'Three fish can swim.', 'numbers', { digit: 3 }),
  P('four', 'ארבע', '', 'The dog has four legs.', 'numbers', { digit: 4 }),
  P('five', 'חמש', '', 'I have five pens.', 'numbers', { digit: 5 }),
  P('six', 'שש', '', 'Six hens are on the mat.', 'numbers', { digit: 6 }),
  P('seven', 'שבע', '', 'I have seven eggs.', 'numbers', { digit: 7 }),
  P('eight', 'שמונה', '', 'The boy is eight.', 'numbers', { digit: 8 }),
  P('nine', 'תשע', '', 'Nine cats sing.', 'numbers', { digit: 9 }),
  P('ten', 'עשר', '', 'I have ten fish.', 'numbers', { digit: 10 }),
  P('eleven', 'אחת-עשרה', '', 'Eleven boys run.', 'numbers', { digit: 11 }),
  P('twelve', 'שתים-עשרה', '', 'I have twelve eggs.', 'numbers', { digit: 12 }),

  // ---- more ch / sh / th (practice) ----
  L('cherry', 'דובדבן', '🍒', 'The cherry is red.', 'food', 2),
  L('chips', "צ'יפס", '🍟', 'I like chips.', 'food', 2),
  L('lunch', 'ארוחת צהריים', '🥪', 'I have lunch at school.', 'food', 2),
  L('watch', 'שעון יד', '⌚', 'Dad has a watch.', 'things', 2),
  L('shoe', 'נעל', '👟', 'The shoe is big.', 'things', 2),
  L('sheep', 'כבשה', '🐑', 'The sheep is small.', 'animals', 2),
  L('shell', 'צדף', '🐚', 'The shell is in the sand.', 'things', 2),
  L('shirt', 'חולצה', '👕', 'I have a red shirt.', 'things', 2),
  L('shark', 'כריש', '🦈', 'The shark can swim fast.', 'animals', 2),
  L('thumb', 'אגודל', '👍', 'I have a thumb.', 'body', 2),
  L('bath', 'אמבטיה', '🛁', 'The dog is in the bath.', 'things', 2),
  L('think', 'לחשוב', '🤔', 'I think it is a cat.', 'actions', 2),
  L('father', 'אבא', '👨', 'My father is tall.', 'people', 2),

  // ---- basics: short a ----
  L('hat', 'כובע', 'hat.png', 'The hat is on the bed.', 'things'),
  L('man', 'איש', 'man.png', 'The man has a hat.', 'people'),
  L('dad', 'אבא', 'dad.png', 'Dad has a big bag.', 'people'),
  L('mat', 'שטיחון', 'mat.png', 'The cat is on the mat.', 'things'),
  L('van', 'טנדר', '🚐', 'The van is fast.', 'things'),
  L('can', 'פחית', '🥫', 'The can is on the desk.', 'things'),
  L('hand', 'יד', 'hand.png', 'I have a hand.', 'body'),
  L('lamp', 'מנורה', '💡', 'The lamp is on the desk.', 'things'),
  L('ant', 'נמלה', '🐜', 'The ant is small.', 'animals'),
  L('apple', 'תפוח', '🍎', 'The apple is red.', 'food'),

  // ---- basics: short e ----
  L('pen', 'עט', 'pen.png', 'The pen is on the desk.', 'things'),
  L('hen', 'תרנגולת', 'hen.png', 'The hen has an egg.', 'animals'),
  L('jet', 'מטוס סילון', '✈️', 'The jet is fast.', 'things'),
  L('leg', 'רגל', '🦵', 'The dog has four legs.', 'body'),
  L('red', 'אדום', '🔴', 'The apple is red.', 'describing'),
  L('web', 'רשת עכביש', '🕸️', 'The web is big.', 'things'),
  L('pet', 'חיית מחמד', '🐹', 'My pet is a cat.', 'animals'),
  L('elephant', 'פיל', 'elephant.png', 'The elephant is big.', 'animals', 2),

  // ---- basics: short i ----
  L('pig', 'חזיר', 'pig.png', 'The pig is fat.', 'animals'),
  L('kid', 'ילד / ילדה', '🧒', 'The kid can swim.', 'people'),
  L('lip', 'שפה', '👄', 'I have a lip.', 'body'),
  L('ink', 'דיו', '🖋️', 'The ink is on the desk.', 'things'),
  L('igloo', 'איגלו', 'igloo.png', 'The igloo is cold.', 'things', 2),
  L('iguana', 'איגואנה', 'Iguana.png', 'The iguana is on the bed.', 'animals', 2),

  // ---- basics: short o ----
  L('box', 'קופסה', 'box.png', 'The cat is in the box.', 'things'),
  L('fox', 'שועל', '🦊', 'The fox is fast.', 'animals'),
  L('pot', 'סיר', '🍲', 'The egg is in the pot.', 'things'),
  L('clock', 'שעון', '⏰', 'The clock is on the desk.', 'things', 2),
  L('octopus', 'תמנון', '🐙', 'The octopus can swim.', 'animals', 2),

  // ---- basics: short u ----
  L('sun', 'שמש', 'sun.png', 'The sun is big.', 'things'),
  L('bus', 'אוטובוס', '🚌', 'The bus is big.', 'things'),
  L('cup', 'כוס', '☕', 'The milk is in the cup.', 'things'),
  L('up', 'למעלה', '⬆️', 'The cat is up.', 'words', 1, NP),
  L('duck', 'ברווז', '🦆', 'The duck can swim.', 'animals'),
  L('bug', 'חרק', '🐛', 'The bug is small.', 'animals'),
  L('drum', 'תוף', '🥁', 'I have a drum.', 'things'),
  L('hug', 'חיבוק', '🤗', 'Mother has a hug for me.', 'actions'),
  L('umbrella', 'מטרייה', '☂️', 'The umbrella is big.', 'things', 2),

  // ---- first-letter coverage ----
  L('banana', 'בננה', '🍌', 'The banana is in the bag.', 'food'),
  L('ball', 'כדור', '⚽', 'The boy has a ball.', 'things'),
  L('girl', 'ילדה', '👧', 'The girl can sing.', 'people'),
  L('goat', 'עז', '🐐', 'The goat is small.', 'animals'),
  L('jeep', "ג'יפ", '🚙', 'The jeep is fast.', 'things'),
  L('juice', 'מיץ', '🧃', 'I have juice.', 'food'),
  L('key', 'מפתח', '🔑', 'The key is in the bag.', 'things'),
  L('king', 'מלך', '👑', 'The king is tall.', 'people'),
  L('kangaroo', 'קנגורו', '🦘', 'The kangaroo can run.', 'animals', 2),
  L('lemon', 'לימון', '🍋', 'The lemon is small.', 'food'),
  L('lion', 'אריה', '🦁', 'The lion is big.', 'animals'),
  L('mouse', 'עכבר', 'mouse.png', 'The mouse is small.', 'animals'),
  L('moon', 'ירח', '🌙', 'The moon is big.', 'things'),
  L('nose', 'אף', '👃', 'The dog has a big nose.', 'body'),
  L('orange', 'תפוז', '🍊', 'I have an orange.', 'food', 2),
  L('queen', 'מלכה', '👸', 'The queen has a hat.', 'people', 2),
  L('rabbit', 'ארנב', '🐰', 'The rabbit is fast.', 'animals'),
  L('robot', 'רובוט', '🤖', 'The robot can sing.', 'things'),
  L('snake', 'נחש', '🐍', 'The snake is long.', 'animals'),
  L('star', 'כוכב', '⭐', 'The star is small.', 'things'),
  L('tree', 'עץ', '🌳', 'The tree is tall.', 'things'),
  L('tiger', 'נמר', '🐯', 'The tiger can run fast.', 'animals'),
  L('violin', 'כינור', '🎻', 'I have a violin.', 'things', 2),
  L('whale', 'לווייתן', '🐳', 'The whale is big.', 'animals', 2),
  L('yo-yo', 'יו-יו', '🪀', 'The boy has a yo-yo.', 'things'),
  L('zebra', 'זברה', '🦓', 'The zebra can run.', 'animals'),
];

// Priority (exam) words are repeated so random picks favour them
export const PRIORITY_WEIGHT = 3;
export const weighted = (list) => list.flatMap((w) => (w.priority ? Array(PRIORITY_WEIGHT).fill(w) : [w]));

export const VOWELS = ['a', 'e', 'i', 'o', 'u'];
export const DIGRAPHS = ['ch', 'sh', 'th'];
export const DIGRAPH_HE = { ch: "צ'", sh: 'ש', th: 'ת\' (ת\'ה)' };

export const label = (w) => w.display || w.en;
export const hasPicture = (w) => !w.noPic && !w.digit && (w.img || w.emoji);

export const PICTURE_WORDS = WORDS.filter(hasPicture);
export const NUMBER_WORDS = WORDS.filter((w) => w.digit).sort((a, b) => a.digit - b.digit);
export const EXAM_WORDS = WORDS.filter((w) => w.priority);

// Spelling / missing-letter exercises: single lowercase tokens only
export const SPELLABLE = WORDS.filter((w) => /^[a-z]+$/.test(w.en) && w.en.length >= 3);

export function digraphOf(w) {
  const s = w.en.toLowerCase();
  return DIGRAPHS.find((d) => s.includes(d)) || null;
}
export const DIGRAPH_WORDS = WORDS.filter((w) => digraphOf(w));

// Short vowel of a one-vowel word (cat → a), else null. Trailing e (the, name) is not a short vowel.
export function shortVowel(w) {
  if (!/^[a-z]+$/.test(w.en) || w.en.length > 5 || /e$/.test(w.en)) return null;
  const vs = [...w.en].filter((c) => VOWELS.includes(c));
  return vs.length === 1 ? vs[0] : null;
}

export const byLevel = (list, level) => {
  const out = list.filter((w) => w.level <= level);
  return out.length >= 6 ? out : list;
};

export const wordByEn = (en) => WORDS.find((w) => w.en.toLowerCase() === String(en).toLowerCase());

export function mediaHtml(word, cls = 'media') {
  if (word.digit) return `<span class="${cls} digit" role="img" aria-label="${word.en}">${word.digit}</span>`;
  if (word.img) {
    return `<img class="${cls}" src="./assets/img/${word.img}" alt="${word.en}" loading="lazy" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'${cls} emoji',textContent:'❓'}))" />`;
  }
  if (word.emoji) return `<span class="${cls} emoji" role="img" aria-label="${word.en}">${word.emoji}</span>`;
  return `<span class="${cls} word-card en">${label(word)}</span>`;
}
