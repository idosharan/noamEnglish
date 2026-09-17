// Word bank. Existing 46 words keep PNG images; new words use emoji.
// level: 1 = test basics, 2 = grade-4 core, 3 = harder / longer words
const L = (en, he, media, example, category, level = 1) => ({
  en, he, example, category, level,
  ...(media.endsWith('.png') ? { img: media } : { emoji: media }),
});

export const WORDS = [
  // ---- original test words (PNG) ----
  L('dog', 'כלב', 'dog.png', 'The dog is on the mat.', 'animals'),
  L('cat', 'חתול', 'cat.png', 'The cat is in the box.', 'animals'),
  L('pig', 'חזיר', 'pig.png', 'The pig is big.', 'animals'),
  L('hen', 'תרנגולת', 'hen.png', 'The hen is on the mat.', 'animals'),
  L('elephant', 'פיל', 'elephant.png', 'The elephant has a big hat.', 'animals', 2),
  L('hat', 'כובע', 'hat.png', 'The hat is on the bed.', 'things'),
  L('bag', 'תיק', 'bag.png', 'I have a big bag.', 'school'),
  L('box', 'קופסה', 'box.png', 'The cat is in the box.', 'things'),
  L('bed', 'מיטה', 'bed.png', 'The dog is on the bed.', 'home'),
  L('egg', 'ביצה', 'egg.png', 'The egg is on the mat.', 'food'),
  L('mat', 'שטיח קטן', 'mat.png', 'The hen is on the mat.', 'home'),
  L('igloo', 'איגלו', 'igloo.png', 'The igloo is in the snow.', 'things', 2),
  L('telephone', 'טלפון', 'telephone.png', 'The telephone is in the bag.', 'things', 2),
  L('pen', 'עט', 'pen.png', 'The pen is on the box.', 'school'),
  L('man', 'איש', 'man.png', 'The man has a hat.', 'people'),
  L('dad', 'אבא', 'dad.png', 'Dad has a big bag.', 'family'),
  L('test', 'מבחן', 'test.png', 'The test is today.', 'school'),
  L('picture', 'תמונה', 'picture.png', 'The picture is on the wall.', 'things', 2),
  L('sofa', 'ספה', 'sofa.png', 'The sofa is big.', 'home'),
  L('like', 'אוהב', 'like.png', 'I like the dog.', 'verbs'),
  L('she', 'היא', 'she.png', 'She has a big pen.', 'words'),
  L('he', 'הוא', 'he.png', 'He is in the box.', 'words'),
  L('sad', 'עצוב', 'sad.png', 'The pig is sad.', 'feelings'),
  L('big', 'גדול', 'big.png', 'The elephant is big.', 'adjectives'),
  L('bad', 'רע', 'bad.png', 'The test was bad.', 'adjectives'),
  L('and', 'ו...', 'and.png', 'Dad and mom have a cat.', 'words'),
  L('the', 'ה...', 'the.png', 'The cat is on the sofa.', 'words'),
  L('has', 'יש לו/לה', 'has.png', 'She has a pen.', 'words'),
  L('I have', 'יש לי', 'ihave.png', 'I have a box.', 'words'),
  L('ten', 'עשר', 'ten.png', 'I have ten eggs.', 'numbers'),
  L('in', 'בתוך', 'in.png', 'The cat is in the box.', 'words'),
  L('on', 'על', 'on.png', 'The hat is on the bed.', 'words'),
  L('iguana', 'איגואנה', 'Iguana.png', 'The iguana is on the mat.', 'animals', 2),
  L('play', 'לשחק', 'play.png', 'We play at home.', 'verbs'),
  L('pupil', 'תלמיד', 'pupil.png', 'The pupil is happy.', 'school', 2),
  L('hand', 'יד', 'hand.png', 'My hand is on the bag.', 'body'),
  L('home', 'בית', 'home.png', 'Dad is at home.', 'home'),
  L('happy', 'שמח', 'happy.png', 'She is happy at home.', 'feelings'),
  L('sun', 'שמש', 'sun.png', 'The sun is big.', 'nature'),
  L('sing', 'לשיר', 'sing.png', 'I like to sing.', 'verbs'),
  L('melon', 'מלון', 'melon.png', 'The melon is in the box.', 'food'),
  L('mouth', 'פה', 'mouth.png', 'The mouth is open.', 'body'),
  L('mouse', 'עכבר', 'mouse.png', 'The mouse is in the box.', 'animals'),
  L('cow', 'פרה', 'cow.png', 'The cow is on the mat.', 'animals'),
  L('carrot', 'גזר', 'carrot.png', 'The carrot is in the bag.', 'food'),
  L('computer', 'מחשב', 'computer.png', 'The computer is on the desk.', 'things', 2),

  // ---- colors ----
  L('red', 'אדום', '🔴', 'The apple is red.', 'colors'),
  L('blue', 'כחול', '🔵', 'The sky is blue.', 'colors'),
  L('green', 'ירוק', '🟢', 'The frog is green.', 'colors'),
  L('yellow', 'צהוב', '🟡', 'The sun is yellow.', 'colors', 2),
  L('black', 'שחור', '⚫', 'The cat is black.', 'colors'),
  L('white', 'לבן', '⚪', 'The snow is white.', 'colors'),
  L('orange', 'כתום', '🟠', 'I like orange juice.', 'colors', 2),
  L('purple', 'סגול', '🟣', 'The grape is purple.', 'colors', 2),
  L('pink', 'ורוד', '🌸', 'The pig is pink.', 'colors'),
  L('brown', 'חום', '🟤', 'The dog is brown.', 'colors', 2),

  // ---- numbers ----
  L('one', 'אחת', '1️⃣', 'I have one cat.', 'numbers'),
  L('two', 'שתיים', '2️⃣', 'I see two dogs.', 'numbers'),
  L('three', 'שלוש', '3️⃣', 'Three eggs are in the box.', 'numbers', 2),
  L('four', 'ארבע', '4️⃣', 'The dog has four legs.', 'numbers'),
  L('five', 'חמש', '5️⃣', 'I have five pens.', 'numbers'),
  L('six', 'שש', '6️⃣', 'Six hens are on the mat.', 'numbers'),
  L('seven', 'שבע', '7️⃣', 'Seven days in a week.', 'numbers', 2),
  L('eight', 'שמונה', '8️⃣', 'The spider has eight legs.', 'numbers', 2),
  L('nine', 'תשע', '9️⃣', 'Nine players are in the game.', 'numbers'),
  L('twenty', 'עשרים', '🔢', 'I have twenty coins.', 'numbers', 3),

  // ---- family & people ----
  L('mom', 'אמא', '👩', 'Mom has a red bag.', 'family'),
  L('brother', 'אח', '👦', 'My brother plays games.', 'family', 2),
  L('sister', 'אחות', '👧', 'My sister likes to sing.', 'family', 2),
  L('baby', 'תינוק', '👶', 'The baby is happy.', 'family'),
  L('grandma', 'סבתא', '👵', 'Grandma has a cat.', 'family', 2),
  L('grandpa', 'סבא', '👴', 'Grandpa is on the sofa.', 'family', 2),
  L('friend', 'חבר', '🧑‍🤝‍🧑', 'My friend has a computer.', 'people', 2),
  L('teacher', 'מורה', '👩‍🏫', 'The teacher has a big test.', 'school', 2),
  L('boy', 'ילד', '🧒', 'The boy has a hat.', 'people'),
  L('girl', 'ילדה', '👧', 'The girl likes the cat.', 'people'),

  // ---- school ----
  L('book', 'ספר', '📖', 'The book is on the desk.', 'school'),
  L('desk', 'שולחן כתיבה', '🪑', 'The computer is on the desk.', 'school'),
  L('pencil', 'עיפרון', '✏️', 'I have a yellow pencil.', 'school', 2),
  L('school', 'בית ספר', '🏫', 'I go to school.', 'school', 2),
  L('read', 'לקרוא', '📚', 'I read a book.', 'verbs'),
  L('write', 'לכתוב', '📝', 'I write with a pen.', 'verbs', 2),
  L('clock', 'שעון', '⏰', 'The clock is on the wall.', 'things', 2),
  L('door', 'דלת', '🚪', 'The door is open.', 'home'),
  L('wall', 'קיר', '🧱', 'The picture is on the wall.', 'home', 2),
  L('chair', 'כיסא', '💺', 'The bag is on the chair.', 'home', 2),

  // ---- food ----
  L('apple', 'תפוח', '🍎', 'The apple is red.', 'food'),
  L('banana', 'בננה', '🍌', 'The banana is yellow.', 'food', 2),
  L('pizza', 'פיצה', '🍕', 'I like pizza!', 'food'),
  L('milk', 'חלב', '🥛', 'The cat likes milk.', 'food'),
  L('bread', 'לחם', '🍞', 'Mom has bread and eggs.', 'food', 2),
  L('water', 'מים', '💧', 'I drink water.', 'food', 2),
  L('cake', 'עוגה', '🎂', 'The cake is big.', 'food'),
  L('ice cream', 'גלידה', '🍦', 'I like ice cream.', 'food', 2),
  L('cheese', 'גבינה', '🧀', 'The mouse likes cheese.', 'food', 2),
  L('eat', 'לאכול', '🍽️', 'I eat an apple.', 'verbs'),

  // ---- animals ----
  L('fish', 'דג', '🐟', 'The fish is in the water.', 'animals'),
  L('bird', 'ציפור', '🐦', 'The bird can sing.', 'animals'),
  L('frog', 'צפרדע', '🐸', 'The frog is green.', 'animals'),
  L('lion', 'אריה', '🦁', 'The lion is big.', 'animals'),
  L('monkey', 'קוף', '🐵', 'The monkey likes bananas.', 'animals', 2),
  L('rabbit', 'ארנב', '🐰', 'The rabbit eats a carrot.', 'animals', 2),
  L('horse', 'סוס', '🐴', 'The horse can run.', 'animals', 2),
  L('duck', 'ברווז', '🦆', 'The duck is in the water.', 'animals'),
  L('snake', 'נחש', '🐍', 'The snake is long.', 'animals', 2),
  L('bear', 'דוב', '🐻', 'The bear is brown.', 'animals'),

  // ---- body ----
  L('eye', 'עין', '👁️', 'I see with my eye.', 'body'),
  L('nose', 'אף', '👃', 'The elephant has a big nose.', 'body'),
  L('ear', 'אוזן', '👂', 'I hear with my ear.', 'body'),
  L('leg', 'רגל', '🦵', 'The dog has four legs.', 'body'),
  L('head', 'ראש', '🙂', 'The hat is on my head.', 'body', 2),
  L('hair', 'שיער', '💇', 'She has long hair.', 'body', 2),

  // ---- adjectives / feelings ----
  L('small', 'קטן', '🐜', 'The mouse is small.', 'adjectives'),
  L('hot', 'חם', '🔥', 'The sun is hot.', 'adjectives'),
  L('cold', 'קר', '🧊', 'The igloo is cold.', 'adjectives'),
  L('fast', 'מהיר', '🏎️', 'The car is fast.', 'adjectives', 2),
  L('slow', 'איטי', '🐢', 'The turtle is slow.', 'adjectives', 2),
  L('angry', 'כועס', '😠', 'The lion is angry.', 'feelings', 2),
  L('tired', 'עייף', '😴', 'I am tired.', 'feelings', 2),
  L('funny', 'מצחיק', '🤣', 'The video is funny.', 'feelings', 2),

  // ---- verbs / actions ----
  L('run', 'לרוץ', '🏃', 'I run fast.', 'verbs'),
  L('jump', 'לקפוץ', '🦘', 'The frog can jump.', 'verbs'),
  L('swim', 'לשחות', '🏊', 'The fish can swim.', 'verbs', 2),
  L('sleep', 'לישון', '🛌', 'The cat likes to sleep.', 'verbs', 2),
  L('dance', 'לרקוד', '💃', 'We dance and sing.', 'verbs', 2),
  L('look', 'להסתכל', '👀', 'Look at the picture!', 'verbs'),

  // ---- nature / days ----
  L('moon', 'ירח', '🌙', 'The moon is white.', 'nature'),
  L('star', 'כוכב', '⭐', 'I see a star.', 'nature'),
  L('tree', 'עץ', '🌳', 'The bird is in the tree.', 'nature'),
  L('flower', 'פרח', '🌸', 'The flower is pink.', 'nature', 2),
  L('rain', 'גשם', '🌧️', 'I like the rain.', 'nature'),
  L('today', 'היום', '📅', 'The test is today.', 'time', 2),
  L('Monday', 'יום שני', '🗓️', 'On Monday I go to school.', 'time', 3),
  L('Friday', 'יום שישי', '🎉', 'On Friday we play games.', 'time', 3),

  // ---- gaming / YouTube ----
  L('game', 'משחק', '🎮', 'I play a new game.', 'gaming'),
  L('level', 'רמה / שלב', '🆙', 'I am on level five.', 'gaming', 2),
  L('win', 'לנצח', '🏆', 'I win the game!', 'gaming'),
  L('lose', 'להפסיד', '💀', 'I do not like to lose.', 'gaming', 2),
  L('player', 'שחקן', '🕹️', 'The player has ten coins.', 'gaming', 2),
  L('video', 'סרטון', '📹', 'I like the funny video.', 'gaming', 2),
  L('subscribe', 'להירשם לערוץ', '🔔', 'Subscribe to my channel!', 'gaming', 3),
  L('channel', 'ערוץ', '📺', 'My channel has many videos.', 'gaming', 3),
  L('screen', 'מסך', '🖥️', 'The game is on the screen.', 'gaming', 2),
  L('keyboard', 'מקלדת', '⌨️', 'The keyboard is on the desk.', 'gaming', 3),
  L('headphones', 'אוזניות', '🎧', 'I have new headphones.', 'gaming', 3),
  L('camera', 'מצלמה', '📷', 'The camera is on.', 'gaming', 2),
  L('coin', 'מטבע', '💰', 'The player has a gold coin.', 'gaming'),
  L('gold', 'זהב', '✨', 'The gold button is big.', 'gaming', 2),
  L('speed', 'מהירות', '💨', 'The car has speed.', 'gaming', 2),
  L('power', 'כוח', '💪', 'The player has power.', 'gaming', 2),
  L('robot', 'רובוט', '🤖', 'The robot can dance.', 'gaming'),
  L('rocket', 'רקטה / טיל', '🚀', 'The rocket is fast.', 'gaming', 2),
  L('map', 'מפה', '🗺️', 'The map is in the game.', 'gaming'),
  L('team', 'קבוצה', '👥', 'My team wins the game.', 'gaming', 2),
  L('start', 'להתחיל', '▶️', 'Press start to play.', 'gaming'),
  L('stop', 'לעצור', '⏹️', 'Stop the video.', 'gaming'),
];

export const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// Words that can be used for exercises needing a real picture/emoji (excludes function words)
export const PICTURE_WORDS = WORDS.filter((w) => !['words'].includes(w.category));

// Spelling / vowel exercises: single lowercase tokens only
export const SPELLABLE = WORDS.filter((w) => /^[a-z]+$/.test(w.en) && w.en.length >= 3);

export const byLevel = (list, level) => {
  const out = list.filter((w) => w.level <= level);
  return out.length >= 6 ? out : list;
};

export const wordByEn = (en) => WORDS.find((w) => w.en.toLowerCase() === String(en).toLowerCase());

export function mediaHtml(word, cls = 'media') {
  if (word.img) {
    return `<img class="${cls}" src="./assets/img/${word.img}" alt="${word.en}" loading="lazy" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'${cls} emoji',textContent:'❓'}))" />`;
  }
  return `<span class="${cls} emoji" role="img" aria-label="${word.en}">${word.emoji}</span>`;
}
