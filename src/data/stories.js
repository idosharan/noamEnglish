// Stories: yesNo = {q, answer}, mcq = {q, options[], answer(index)}
export const STORIES = [
  {
    id: 'hen', title: 'The Little Hen', icon: '🐔', level: 1,
    lines: ['The little hen has a red hat.', 'She has a small bag.', 'She likes the big egg.', 'The hen is on the mat.', 'She is happy.'],
    yesNo: [
      { q: 'האם לתרנגולת יש כובע אדום?', answer: true },
      { q: 'האם התרנגולת על השטיח?', answer: true },
      { q: 'האם היא עצובה?', answer: false },
      { q: 'האם יש לה תיק גדול?', answer: false },
    ],
    mcq: [
      { q: 'איזה צבע הכובע של התרנגולת?', options: ['אדום', 'כחול', 'ירוק', 'צהוב'], answer: 0 },
      { q: 'מה התרנגולת אוהבת?', options: ['את התיק', 'את הביצה הגדולה', 'את השטיח', 'את הכובע'], answer: 1 },
      { q: 'איפה התרנגולת?', options: ['על המיטה', 'בתוך הקופסה', 'על השטיח', 'בבית הספר'], answer: 2 },
      { q: 'איך התרנגולת מרגישה?', options: ['עצובה', 'עייפה', 'כועסת', 'שמחה'], answer: 3 },
    ],
  },
  {
    id: 'cat', title: 'The Busy Cat', icon: '🐱', level: 1,
    lines: ['The cat is in the box.', 'She has a red pen.', 'She likes the big picture.', 'The cat is on the mat.', 'She is not sad.'],
    yesNo: [
      { q: 'האם החתול בתוך הקופסה?', answer: true },
      { q: 'האם היא עצובה?', answer: false },
      { q: 'האם יש לה עט אדום?', answer: true },
    ],
    mcq: [
      { q: 'מה יש לחתולה?', options: ['עט אדום', 'כובע אדום', 'תיק אדום', 'ספר אדום'], answer: 0 },
      { q: 'מה החתולה אוהבת?', options: ['את המיטה', 'את התמונה הגדולה', 'את העכבר', 'את הביצה'], answer: 1 },
      { q: 'איפה החתולה בהתחלה?', options: ['על השטיח', 'על המיטה', 'בתוך הקופסה', 'בעץ'], answer: 2 },
    ],
  },
  {
    id: 'dad', title: 'Dad and the Telephone', icon: '📞', level: 1,
    lines: ['Dad has a big bag.', 'The telephone is in the bag.', 'The man is on the sofa.', 'He has a test today.', 'He is not sad.'],
    yesNo: [
      { q: 'האם הטלפון בתוך התיק?', answer: true },
      { q: 'האם האיש על הספה?', answer: true },
      { q: 'האם הוא עצוב?', answer: false },
    ],
    mcq: [
      { q: 'איפה הטלפון?', options: ['על הספה', 'בתוך התיק', 'על המיטה', 'בבית הספר'], answer: 1 },
      { q: 'מה יש לאבא היום?', options: ['מבחן', 'משחק', 'עוגה', 'סרטון'], answer: 0 },
      { q: 'איפה האיש יושב?', options: ['על הכיסא', 'על המיטה', 'על השטיח', 'על הספה'], answer: 3 },
    ],
  },
  {
    id: 'pig', title: 'Pig in the Igloo', icon: '🐷', level: 1,
    lines: ['The pig is in the igloo.', 'He has a small hat.', 'He likes the big bed.', 'The igloo is on the mat.', 'He is happy.'],
    yesNo: [
      { q: 'האם החזיר בתוך האיגלו?', answer: true },
      { q: 'האם האיגלו על השטיח?', answer: true },
      { q: 'האם הוא עצוב?', answer: false },
    ],
    mcq: [
      { q: 'איזה כובע יש לחזיר?', options: ['גדול', 'אדום', 'קטן', 'כחול'], answer: 2 },
      { q: 'מה החזיר אוהב?', options: ['את המיטה הגדולה', 'את השלג', 'את הכובע', 'את השטיח'], answer: 0 },
      { q: 'איפה האיגלו?', options: ['על המיטה', 'בבית', 'על השטיח', 'במים'], answer: 2 },
    ],
  },
  {
    id: 'channel', title: 'My New Channel', icon: '📺', level: 2,
    lines: [
      'I have a new channel.', 'My channel has five videos.', 'The videos are funny.',
      'My friend likes the videos.', 'He is on my team.', 'Subscribe to my channel!',
    ],
    yesNo: [
      { q: 'האם יש בערוץ חמישה סרטונים?', answer: true },
      { q: 'האם הסרטונים עצובים?', answer: false },
      { q: 'האם החבר בקבוצה שלי?', answer: true },
    ],
    mcq: [
      { q: 'כמה סרטונים יש בערוץ?', options: ['שניים', 'חמישה', 'עשרה', 'שלושה'], answer: 1 },
      { q: 'איך הסרטונים?', options: ['ארוכים', 'עצובים', 'מצחיקים', 'מפחידים'], answer: 2 },
      { q: 'מי אוהב את הסרטונים?', options: ['אבא', 'המורה', 'סבתא', 'החבר שלי'], answer: 3 },
      { q: 'מה מבקשים בסוף הסיפור?', options: ['להירשם לערוץ', 'לעצור את הסרטון', 'לשחק במשחק', 'לאכול פיצה'], answer: 0 },
    ],
  },
  {
    id: 'game', title: 'The Big Game', icon: '🎮', level: 2,
    lines: [
      'I play a new game with my brother.', 'The game has a big map.', 'I am on level three.',
      'My player has ten coins and a gold hat.', 'A fast robot is on the map.', 'I jump and I win!',
    ],
    yesNo: [
      { q: 'האם אני משחק עם אחותי?', answer: false },
      { q: 'האם במשחק יש מפה גדולה?', answer: true },
      { q: 'האם ניצחתי בסוף?', answer: true },
    ],
    mcq: [
      { q: 'באיזה שלב אני?', options: ['שלב אחד', 'שלב שלוש', 'שלב חמש', 'שלב עשר'], answer: 1 },
      { q: 'מה יש לשחקן שלי?', options: ['עשר מטבעות וכובע זהב', 'שני מטבעות', 'מפה קטנה', 'אוזניות'], answer: 0 },
      { q: 'מי נמצא על המפה?', options: ['אריה איטי', 'רובוט מהיר', 'חתול שחור', 'אח שלי'], answer: 1 },
      { q: 'עם מי אני משחק?', options: ['עם המורה', 'עם החבר', 'עם אבא', 'עם אחי'], answer: 3 },
    ],
  },
  {
    id: 'school', title: 'A Day at School', icon: '🏫', level: 2,
    lines: [
      'On Monday I go to school.', 'I have a blue bag and a yellow pencil.', 'The teacher has a big book.',
      'We read and we write.', 'My friend eats an apple.', 'At home I am tired but happy.',
    ],
    yesNo: [
      { q: 'האם יש לי עיפרון צהוב?', answer: true },
      { q: 'האם החבר שלי אוכל בננה?', answer: false },
      { q: 'האם אני הולך לבית הספר ביום שני?', answer: true },
    ],
    mcq: [
      { q: 'איזה צבע התיק שלי?', options: ['אדום', 'ירוק', 'כחול', 'צהוב'], answer: 2 },
      { q: 'מה יש למורה?', options: ['ספר גדול', 'שעון קטן', 'מחשב', 'מבחן'], answer: 0 },
      { q: 'מה עושים בכיתה?', options: ['שרים ורוקדים', 'קוראים וכותבים', 'רצים וקופצים', 'אוכלים ושותים'], answer: 1 },
      { q: 'איך אני מרגיש בבית?', options: ['כועס', 'עצוב', 'רעב', 'עייף אבל שמח'], answer: 3 },
    ],
  },
  {
    id: 'zoo', title: 'Animals in the Rain', icon: '🌧️', level: 3,
    lines: [
      'It is cold and the rain is big.', 'The green frog likes the rain.', 'The brown bear is slow and tired.',
      'The monkey eats a banana in the tree.', 'The duck swims in the water.', 'The lion is angry. He does not like the rain!',
    ],
    yesNo: [
      { q: 'האם הצפרדע אוהבת את הגשם?', answer: true },
      { q: 'האם האריה אוהב את הגשם?', answer: false },
      { q: 'האם הדוב מהיר?', answer: false },
    ],
    mcq: [
      { q: 'איזה צבע הדוב?', options: ['שחור', 'חום', 'לבן', 'ירוק'], answer: 1 },
      { q: 'מה הקוף אוכל?', options: ['תפוח', 'גזר', 'בננה', 'פיצה'], answer: 2 },
      { q: 'איפה הברווז?', options: ['במים', 'בעץ', 'על השטיח', 'באיגלו'], answer: 0 },
      { q: 'איך האריה מרגיש?', options: ['שמח', 'עייף', 'עצוב', 'כועס'], answer: 3 },
    ],
  },
];
