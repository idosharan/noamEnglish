// Reading passages built from the exam word list. yesNo = {q, answer}, mcq = {q, options[], answer(index)}
export const PASSAGES = [
  {
    id: 'dog', title: 'My Dog', icon: '🐶', level: 1,
    lines: ['My name is Noam.', 'I have a dog.', 'The dog is big and fat.', 'His name is Max.', 'Max can run fast.', 'Max is not sad.'],
    yesNo: [
      { q: 'לנועם יש כלב?', answer: true },
      { q: 'הכלב קטן?', answer: false },
      { q: 'הכלב יכול לרוץ מהר?', answer: true },
      { q: 'הכלב עצוב?', answer: false },
    ],
    mcq: [
      { q: 'מה השם של הכלב?', options: ['Max', 'Noam', 'Tom', 'Sam'], answer: 0 },
      { q: 'איך נראה הכלב?', options: ['big and fat', 'small and sad', 'tall and short', 'small and fast'], answer: 0 },
      { q: 'מה הכלב יכול לעשות?', options: ['sing', 'swim', 'run fast', 'cut'], answer: 2 },
    ],
  },
  {
    id: 'cat', title: 'The Cat and the Fish', icon: '🐱', level: 1,
    lines: ['This is a cat.', 'The cat is small.', 'The cat has a fish.', 'The fish is in a cup.', 'The cat is mad.', 'The fish can swim!'],
    yesNo: [
      { q: 'החתול קטן?', answer: true },
      { q: 'לחתול יש כלב?', answer: false },
      { q: 'הדג בתוך כוס?', answer: true },
      { q: 'החתול שמח?', answer: false },
    ],
    mcq: [
      { q: 'מה יש לחתול?', options: ['a dog', 'a fish', 'an egg', 'a bag'], answer: 1 },
      { q: 'איפה הדג?', options: ['on the bed', 'in the bag', 'in a cup', 'on the desk'], answer: 2 },
      { q: 'איך מרגיש החתול?', options: ['mad', 'sad', 'tall', 'fast'], answer: 0 },
    ],
  },
  {
    id: 'farm', title: 'The Cow and the Chicken', icon: '🐄', level: 1,
    lines: ['This is a cow.', 'The cow is big.', 'The cow has milk.', 'This is a chicken.', 'The chicken is small.', 'The chicken has an egg.'],
    yesNo: [
      { q: 'הפרה גדולה?', answer: true },
      { q: 'לפרה יש ביצה?', answer: false },
      { q: 'התרנגול קטן?', answer: true },
      { q: 'לתרנגול יש חלב?', answer: false },
    ],
    mcq: [
      { q: 'למי יש חלב?', options: ['the chicken', 'the cow', 'the dog', 'the fish'], answer: 1 },
      { q: 'איך התרנגול?', options: ['big', 'tall', 'small', 'fat'], answer: 2 },
      { q: 'מה יש לתרנגול?', options: ['an egg', 'milk', 'cheese', 'a chair'], answer: 0 },
    ],
  },
  {
    id: 'test', title: 'Tom Has a Test', icon: '📝', level: 1,
    lines: ['Tom is a boy.', 'Tom has a test.', 'His bag is on the desk.', 'The pen is in the bag.', 'Tom is not sad.'],
    yesNo: [
      { q: 'לטום יש מבחן?', answer: true },
      { q: 'התיק על המיטה?', answer: false },
      { q: 'העט בתוך התיק?', answer: true },
      { q: 'טום עצוב?', answer: false },
    ],
    mcq: [
      { q: 'מה יש לטום?', options: ['a dog', 'a ship', 'a test', 'a fish'], answer: 2 },
      { q: 'איפה התיק?', options: ['on the desk', 'on the bed', 'on the chair', 'in the box'], answer: 0 },
      { q: 'מה בתוך התיק?', options: ['a cat', 'a pen', 'an egg', 'cheese'], answer: 1 },
    ],
  },
  {
    id: 'birthday', title: 'My Birthday', icon: '🎂', level: 1,
    lines: ['It is my birthday.', 'I am ten.', 'Mother has a bag for me.', 'In the bag is a ship.', 'I sing a song.', 'I am not sad!'],
    yesNo: [
      { q: 'היום יום ההולדת?', answer: true },
      { q: 'הילד בן תשע?', answer: false },
      { q: 'בתוך התיק יש ספינה?', answer: true },
      { q: 'הילד עצוב?', answer: false },
    ],
    mcq: [
      { q: 'בן כמה הילד?', options: ['nine', 'ten', 'twelve', 'three'], answer: 1 },
      { q: 'מה יש בתיק?', options: ['a fish', 'a chair', 'a test', 'a ship'], answer: 3 },
      { q: 'למי יש תיק בשביל הילד?', options: ['mother', 'the dog', 'the boy', 'the cat'], answer: 0 },
    ],
  },
  {
    id: 'tall', title: 'Tall and Short', icon: '📏', level: 2,
    lines: ['Dan is tall.', 'Sam is short.', 'Dan can run fast.', 'Sam can swim.', 'Sam has a hat.', 'Dan and Sam sing a song.'],
    yesNo: [
      { q: 'דן גבוה?', answer: true },
      { q: 'סם גבוה?', answer: false },
      { q: 'סם יכול לשחות?', answer: true },
      { q: 'לדן יש כובע?', answer: false },
    ],
    mcq: [
      { q: 'מי נמוך?', options: ['Dan', 'Sam', 'the cat', 'mother'], answer: 1 },
      { q: 'מה דן יכול לעשות?', options: ['swim', 'cut the cheese', 'run fast', 'sit'], answer: 2 },
      { q: 'מה יש לסם?', options: ['a hat', 'a shirt', 'a fish', 'a desk'], answer: 0 },
    ],
  },
  {
    id: 'lunch', title: 'Cheese and Milk', icon: '🧀', level: 2,
    lines: ['Mother has cheese and an egg.', 'She cuts the cheese.', 'I have milk in a cup.', 'The cat is on the chair.', 'The cat has a fish.'],
    yesNo: [
      { q: 'אמא חותכת את הגבינה?', answer: true },
      { q: 'החלב בתוך כוס?', answer: true },
      { q: 'החתול על המיטה?', answer: false },
      { q: 'לחתול יש גבינה?', answer: false },
    ],
    mcq: [
      { q: 'מה אמא חותכת?', options: ['the egg', 'the cheese', 'the fish', 'the milk'], answer: 1 },
      { q: 'איפה החלב?', options: ['on the desk', 'in the bag', 'in a cup', 'on the chair'], answer: 2 },
      { q: 'איפה החתול?', options: ['on the chair', 'on the bed', 'in the box', 'on the ship'], answer: 0 },
    ],
  },
  {
    id: 'ship', title: 'The Big Ship', icon: '🚢', level: 2,
    lines: ['This is a big ship.', 'Twelve boys are on the ship.', 'The ship is fast.', 'Three fish swim.', 'A boy has a hat.', 'He is not mad.'],
    yesNo: [
      { q: 'הספינה קטנה?', answer: false },
      { q: 'על הספינה יש 12 ילדים?', answer: true },
      { q: 'הספינה מהירה?', answer: true },
      { q: 'הילד כועס?', answer: false },
    ],
    mcq: [
      { q: 'כמה ילדים על הספינה?', options: ['two', 'ten', 'twelve', 'eleven'], answer: 2 },
      { q: 'כמה דגים שוחים?', options: ['three', 'five', 'one', 'eight'], answer: 0 },
      { q: 'מה יש לילד?', options: ['a bag', 'a hat', 'a fish', 'a chair'], answer: 1 },
    ],
  },
  {
    id: 'teeth', title: 'Big Teeth', icon: '🦷', level: 3,
    lines: ['I have a dog and a cat.', 'The dog has big teeth.', 'The dog is not fat. He is fast.', 'He can run and swim.', 'The cat is small and sad.', 'The cat has milk. Now she is not sad!'],
    yesNo: [
      { q: 'לכלב יש שיניים גדולות?', answer: true },
      { q: 'הכלב שמן?', answer: false },
      { q: 'החתול גדול?', answer: false },
      { q: 'בסוף החתול עצוב?', answer: false },
    ],
    mcq: [
      { q: 'מה יש לכלב?', options: ['big teeth', 'a hat', 'milk', 'a fish'], answer: 0 },
      { q: 'מה הכלב יכול לעשות?', options: ['sing and cut', 'run and swim', 'sit and sing', 'cut and run'], answer: 1 },
      { q: 'מה מקבל החתול?', options: ['cheese', 'an egg', 'milk', 'a fish'], answer: 2 },
      { q: 'איך מרגיש החתול בהתחלה?', options: ['mad', 'sad', 'fast', 'tall'], answer: 1 },
    ],
  },
  {
    id: 'numbers', title: 'Count with Me', icon: '🔢', level: 3,
    lines: ['I have one bag.', 'In the bag are two eggs and three pens.', 'On the desk are five fish.', 'My mother has eleven chickens.', 'The cow has four legs.'],
    yesNo: [
      { q: 'בתיק יש שתי ביצים?', answer: true },
      { q: 'על השולחן יש שבעה דגים?', answer: false },
      { q: 'לאמא יש 11 תרנגולים?', answer: true },
      { q: 'לפרה יש שש רגליים?', answer: false },
    ],
    mcq: [
      { q: 'כמה עטים בתיק?', options: ['two', 'three', 'five', 'one'], answer: 1 },
      { q: 'כמה דגים על השולחן?', options: ['four', 'nine', 'five', 'twelve'], answer: 2 },
      { q: 'כמה תרנגולים יש לאמא?', options: ['eleven', 'seven', 'ten', 'six'], answer: 0 },
      { q: 'כמה רגליים יש לפרה?', options: ['two', 'four', 'eight', 'six'], answer: 1 },
    ],
  },
];
