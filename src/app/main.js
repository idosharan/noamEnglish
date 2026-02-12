// Main app logic for the interactive English prep site (Hebrew UI)
const letters = ['A','B','C','D','E','G','H','I','M','N','O','P','S','T'];

const vocabulary = [
  { en: 'dog', he: 'כלב', img: 'dog.png', audio: 'dog.mp3', example: 'The dog is on the mat.' },
  { en: 'cat', he: 'חתול', img: 'cat.png', audio: 'cat.mp3', example: 'The cat is in the box.' },
  { en: 'pig', he: 'חזיר', img: 'pig.png', audio: 'pig.mp3', example: 'The pig is big.' },
  { en: 'hen', he: 'תרנגול', img: 'hen.png', audio: 'hen.mp3', example: 'The hen is on the mat.' },
  { en: 'elephant', he: 'פיל', img: 'elephant.png', audio: 'elephant.mp3', example: 'The elephant has a big hat.' },
  { en: 'hat', he: 'כובע', img: 'hat.png', audio: 'hat.mp3', example: 'The hat is on the bed.' },
  { en: 'bag', he: 'תיק', img: 'bag.png', audio: 'bag.mp3', example: 'I have a big bag.' },
  { en: 'box', he: 'קופסה', img: 'box.png', audio: 'box.mp3', example: 'The cat is in the box.' },
  { en: 'bed', he: 'מיטה', img: 'bed.png', audio: 'bed.mp3', example: 'The dog is on the bed.' },
  { en: 'egg', he: 'ביצה', img: 'egg.png', audio: 'egg.mp3', example: 'The egg is on the mat.' },
  { en: 'mat', he: 'שטיח קטן', img: 'mat.png', audio: 'mat.mp3', example: 'The hen is on the mat.' },
  { en: 'igloo', he: 'איגלו', img: 'igloo.png', audio: 'igloo.mp3', example: 'The igloo is in the snow.' },
  { en: 'telephone', he: 'טלפון', img: 'telephone.png', audio: 'telephone.mp3', example: 'The telephone is in the bag.' },
  { en: 'pen', he: 'עט', img: 'pen.png', audio: 'pen.mp3', example: 'The pen is on the box.' },
  { en: 'man', he: 'איש', img: 'man.png', audio: 'man.mp3', example: 'The man has a hat.' },
  { en: 'dad', he: 'אבא', img: 'dad.png', audio: 'dad.mp3', example: 'Dad has a big bag.' },
  { en: 'test', he: 'מבחן', img: 'test.png', audio: 'test.mp3', example: 'The test is today.' },
  { en: 'picture', he: 'תמונה', img: 'picture.png', audio: 'picture.mp3', example: 'The picture is on the wall.' },
  { en: 'sofa', he: 'ספה', img: 'sofa.png', audio: 'sofa.mp3', example: 'The sofa is big.' },
  { en: 'like', he: 'אוהב', img: 'like.png', audio: 'like.mp3', example: 'I like the dog.' },
  { en: 'she', he: 'היא', img: 'she.png', audio: 'she.mp3', example: 'She has a big pen.' },
  { en: 'he', he: 'הוא', img: 'he.png', audio: 'he.mp3', example: 'He is in the box.' },
  { en: 'sad', he: 'עצוב', img: 'sad.png', audio: 'sad.mp3', example: 'The pig is sad.' },
  { en: 'big', he: 'גדול', img: 'big.png', audio: 'big.mp3', example: 'The elephant is big.' },
  { en: 'bad', he: 'רע', img: 'bad.png', audio: 'bad.mp3', example: 'The test was bad.' },
  { en: 'and', he: 'ו...', img: 'and.png', audio: 'and.mp3', example: 'Dad and mom have a cat.' },
  { en: 'the', he: 'ה...', img: 'the.png', audio: 'the.mp3', example: 'The cat is on the sofa.' },
  { en: 'has', he: 'יש', img: 'has.png', audio: 'has.mp3', example: 'She has a pen.' },
  { en: 'I have', he: 'יש לי', img: 'ihave.png', audio: 'ihave.mp3', example: 'I have a box.' },
  { en: 'ten', he: '10', img: 'ten.png', audio: 'ten.mp3', example: 'I have ten eggs.' },
  { en: 'in', he: 'בתוך', img: 'in.png', audio: 'in.mp3', example: 'The cat is in the box.' },
  { en: 'on', he: 'על', img: 'on.png', audio: 'on.mp3', example: 'The hat is on the bed.' },
  { en: 'iguana', he: 'איגואנה', img: 'iguana.png', audio: 'iguana.mp3', example: 'The iguana is on the mat.' },
  { en: 'play', he: 'לשחק', img: 'play.png', audio: 'play.mp3', example: 'We play at home.' },
  { en: 'pupil', he: 'תלמיד', img: 'pupil.png', audio: 'pupil.mp3', example: 'The pupil is happy.' },
  { en: 'hand', he: 'יד', img: 'hand.png', audio: 'hand.mp3', example: 'My hand is on the bag.' },
  { en: 'home', he: 'בית', img: 'home.png', audio: 'home.mp3', example: 'Dad is at home.' },
  { en: 'happy', he: 'שמח', img: 'happy.png', audio: 'happy.mp3', example: 'She is happy at home.' },
  { en: 'sun', he: 'שמש', img: 'sun.png', audio: 'sun.mp3', example: 'The sun is big.' },
  { en: 'sing', he: 'לשיר', img: 'sing.png', audio: 'sing.mp3', example: 'I like to sing.' },
  { en: 'melon', he: 'מלון', img: 'melon.png', audio: 'melon.mp3', example: 'The melon is in the box.' },
  { en: 'mouth', he: 'פה', img: 'mouth.png', audio: 'mouth.mp3', example: 'The mouth is open.' },
  { en: 'mouse', he: 'עכבר', img: 'mouse.png', audio: 'mouse.mp3', example: 'The mouse is in the box.' },
  { en: 'cow', he: 'פרה', img: 'cow.png', audio: 'cow.mp3', example: 'The cow is on the mat.' },
  { en: 'carrot', he: 'גזר', img: 'carrot.png', audio: 'carrot.mp3', example: 'The carrot is in the bag.' },
  { en: 'computer', he: 'מחשב', img: 'computer.png', audio: 'computer.mp3', example: 'The computer is on the desk.' },
];

const vowelWords = [
  { masked: 'd_g', answer: 'o', full: 'dog', he: 'כלב', options: ['a','e','i','o'] },
  { masked: 'c_t', answer: 'a', full: 'cat', he: 'חתול', options: ['a','e','i','o'] },
  { masked: 'p_g', answer: 'i', full: 'pig', he: 'חזיר', options: ['a','e','i','o'] },
  { masked: 'h_n', answer: 'e', full: 'hen', he: 'תרנגול', options: ['a','e','i','o'] },
  { masked: '_lephant', answer: 'e', full: 'elephant', he: 'פיל', options: ['a','e','i','o'] },
  { masked: 'h_t', answer: 'a', full: 'hat', he: 'כובע', options: ['a','e','i','o'] },
  { masked: 'b_g', answer: 'a', full: 'bag', he: 'תיק', options: ['a','e','i','o'] },
  { masked: 'b_x', answer: 'o', full: 'box', he: 'קופסה', options: ['a','e','i','o'] },
  { masked: 'b_d', answer: 'e', full: 'bed', he: 'מיטה', options: ['a','e','i','o'] },
  { masked: '_gg', answer: 'e', full: 'egg', he: 'ביצה', options: ['a','e','i','o'] },
  { masked: 'm_t', answer: 'a', full: 'mat', he: 'שטיח קטן', options: ['a','e','i','o'] },
  { masked: '_gloo', answer: 'i', full: 'igloo', he: 'איגלו', options: ['a','e','i','o'] },
  { masked: 't_l_phon_', answer: 'e', full: 'telephone', he: 'טלפון', options: ['a','e','i','o'] },
  { masked: 'p_n', answer: 'e', full: 'pen', he: 'עט', options: ['a','e','i','o'] },
  { masked: 'm_n', answer: 'a', full: 'man', he: 'איש', options: ['a','e','i','o'] },
  { masked: 'd_d', answer: 'a', full: 'dad', he: 'אבא', options: ['a','e','i','o'] },
  { masked: 't_st', answer: 'e', full: 'test', he: 'מבחן', options: ['a','e','i','o'] },
  { masked: 'p_cture', answer: 'i', full: 'picture', he: 'תמונה', options: ['a','e','i','o'] },
  { masked: 's_fa', answer: 'o', full: 'sofa', he: 'ספה', options: ['a','e','i','o'] },
  { masked: 'l_ke', answer: 'i', full: 'like', he: 'אוהב', options: ['a','e','i','o'] },
  { masked: 'sh_', answer: 'e', full: 'she', he: 'היא', options: ['a','e','i','o'] },
  { masked: 'h_', answer: 'e', full: 'he', he: 'הוא', options: ['a','e','i','o'] },
  { masked: 's_d', answer: 'a', full: 'sad', he: 'עצוב', options: ['a','e','i','o'] },
  { masked: 'b_g', answer: 'i', full: 'big', he: 'גדול', options: ['a','e','i','o'] },
  { masked: 'b_d', answer: 'a', full: 'bad', he: 'רע', options: ['a','e','i','o'] },
  { masked: '_nd', answer: 'a', full: 'and', he: 'ו...', options: ['a','e','i','o'] },
  { masked: 'th_', answer: 'e', full: 'the', he: 'ה...', options: ['a','e','i','o'] },
  { masked: 'h_s', answer: 'a', full: 'has', he: 'יש', options: ['a','e','i','o'] },
  { masked: 'I h_ve', answer: 'a', full: 'I have', he: 'יש לי', options: ['a','e','i','o'] },
  { masked: 't_n', answer: 'e', full: 'ten', he: '10', options: ['a','e','i','o'] },
  { masked: '_n', answer: 'i', full: 'in', he: 'בתוך', options: ['a','e','i','o'] },
  { masked: '_n', answer: 'o', full: 'on', he: 'על', options: ['a','e','i','o'] },
  { masked: 'iguan_', answer: 'a', full: 'iguana', he: 'איגואנה', options: ['a','e','i','o'] },
  { masked: 'pl_y', answer: 'a', full: 'play', he: 'לשחק', options: ['a','e','i','o'] },
  { masked: 'pup_l', answer: 'i', full: 'pupil', he: 'תלמיד', options: ['a','e','i','o'] },
  { masked: 'h_nd', answer: 'a', full: 'hand', he: 'יד', options: ['a','e','i','o'] },
  { masked: 'h_me', answer: 'o', full: 'home', he: 'בית', options: ['a','e','i','o'] },
  { masked: 'h_ppy', answer: 'a', full: 'happy', he: 'שמח', options: ['a','e','i','o'] },
  { masked: 's_ng', answer: 'i', full: 'sing', he: 'לשיר', options: ['a','e','i','o'] },
  { masked: 'm_lon', answer: 'e', full: 'melon', he: 'מלון', options: ['a','e','i','o'] },
  { masked: 'm_uth', answer: 'o', full: 'mouth', he: 'פה', options: ['a','e','i','o'] },
  { masked: 'm_use', answer: 'o', full: 'mouse', he: 'עכבר', options: ['a','e','i','o'] },
  { masked: 'c_w', answer: 'o', full: 'cow', he: 'פרה', options: ['a','e','i','o'] },
  { masked: 'c_rrot', answer: 'a', full: 'carrot', he: 'גזר', options: ['a','e','i','o'] },
  { masked: 'c_mputer', answer: 'o', full: 'computer', he: 'מחשב', options: ['a','e','i','o'] },
];

const sentencePool = [
  { en: 'The cat is in the box.', he: 'החתול בתוך הקופסה', distractors: ['החתול על השטיח', 'הכלב בתוך הקופסה'] },
  { en: 'The dog is on the bed.', he: 'הכלב על המיטה', distractors: ['הכלב בתוך המיטה', 'החתול על המיטה'] },
  { en: 'She has a red hat.', he: 'יש לה כובע אדום', distractors: ['יש לו כובע אדום', 'אין לה כובע'] },
  { en: 'I like the big elephant.', he: 'אני אוהב את הפיל הגדול', distractors: ['אני אוהב את הכלב הקטן', 'אני מפחד מהפיל הגדול'] },
  { en: 'The hen is on the mat.', he: 'התרנגול על השטיח', distractors: ['התרנגול בתוך הקופסה', 'התרנגול על המיטה'] },
  { en: 'The pig is sad.', he: 'החזיר עצוב', distractors: ['החזיר שמח', 'החזיר רעב'] },
  { en: 'The telephone is in the bag.', he: 'הטלפון בתוך התיק', distractors: ['הטלפון על השולחן', 'הטלפון על המיטה'] },
  { en: 'The pen is on the box.', he: 'העט על הקופסה', distractors: ['העט בתוך הקופסה', 'העט על המיטה'] },
  { en: 'Dad has a big test.', he: 'לאבא יש מבחן גדול', distractors: ['לאמא יש מבחן גדול', 'לאבא אין מבחן'] },
  { en: 'The bag is in the box.', he: 'התיק בתוך הקופסה', distractors: ['התיק על המיטה', 'התיק על השולחן'] },
  { en: 'The picture is on the wall.', he: 'התמונה על הקיר', distractors: ['התמונה בתוך הקופסה', 'התמונה על המיטה'] },
  { en: 'The sofa is big.', he: 'הספה גדולה', distractors: ['הספה קטנה', 'הספה שבורה'] },
  { en: 'I like the cat.', he: 'אני אוהב את החתול', distractors: ['אני מפחד מהחתול', 'אני לא אוהב חתולים'] },
  { en: 'He is on the mat.', he: 'הוא על השטיח', distractors: ['הוא בתוך הקופסה', 'הוא על המיטה'] },
  { en: 'She is in the igloo.', he: 'היא בתוך האיגלו', distractors: ['היא על האיגלו', 'היא בתוך התיק'] },
  { en: 'The man has a hat.', he: 'לאיש יש כובע', distractors: ['לאיש אין כובע', 'לאשה יש כובע'] },
  { en: 'I have ten eggs.', he: 'יש לי עשר ביצים', distractors: ['יש לי שתי ביצים', 'אין לי ביצים'] },
  { en: 'The test is bad.', he: 'המבחן רע', distractors: ['המבחן טוב', 'אין מבחן'] },
  { en: 'The hen and the pig are on the bed.', he: 'התרנגול והחזיר על המיטה', distractors: ['התרנגול בתוך הקופסה', 'החזיר מתחת למיטה'] },
  { en: 'The iguana is on the mat.', he: 'האיגואנה על השטיח', distractors: ['האיגואנה בתוך הקופסה', 'האיגואנה על המיטה'] },
  { en: 'The pupil is happy at home.', he: 'התלמיד שמח בבית', distractors: ['התלמיד עצוב בבית', 'התלמיד שמח בבית הספר'] },
  { en: 'The computer is on the desk.', he: 'המחשב על השולחן', distractors: ['המחשב בתוך התיק', 'המחשב על המיטה'] },
  { en: 'The cow is on the mat.', he: 'הפרה על השטיח', distractors: ['הפרה בתוך הקופסה', 'הפרה מתחת למיטה'] },
  { en: 'The mouse is in the box.', he: 'העכבר בתוך הקופסה', distractors: ['העכבר על השטיח', 'העכבר על המיטה'] },
  { en: 'The carrot is in the bag.', he: 'הגזר בתוך התיק', distractors: ['הגזר על השולחן', 'הגזר על המיטה'] },
];

const stories = [
  {
    title: 'The Little Hen',
    lines: [
      'The little hen has a red hat.',
      'She has a small bag.',
      'She likes the big egg.',
      'The hen is on the mat.',
      'She is happy.',
    ],
    questions: [
      { q: 'האם לחזיר יש כובע?', answer: false },
      { q: 'האם התרנגול על השטיח?', answer: true },
      { q: 'האם היא שמחה?', answer: true },
    ],
  },
  {
    title: 'The Busy Cat',
    lines: [
      'The cat is in the box.',
      'She has a red pen.',
      'She likes the big picture.',
      'The cat is on the mat.',
      'She is not sad.',
    ],
    questions: [
      { q: 'האם החתול בתוך הקופסה?', answer: true },
      { q: 'האם היא עצובה?', answer: false },
      { q: 'האם יש לה עט אדום?', answer: true },
    ],
  },
  {
    title: 'Dad and the Telephone',
    lines: [
      'Dad has a big bag.',
      'The telephone is in the bag.',
      'The man is on the sofa.',
      'He has a test today.',
      'He is not sad.',
    ],
    questions: [
      { q: 'האם הטלפון בתוך התיק?', answer: true },
      { q: 'האם האיש על הספה?', answer: true },
      { q: 'האם הוא עצוב?', answer: false },
    ],
  },
  {
    title: 'Pig in the Igloo',
    lines: [
      'The pig is in the igloo.',
      'He has a small hat.',
      'He likes the big bed.',
      'The igloo is on the mat.',
      'He is happy.',
    ],
    questions: [
      { q: 'האם החזיר בתוך האיגלו?', answer: true },
      { q: 'האם האיגלו על השטיח?', answer: true },
      { q: 'האם הוא עצוב?', answer: false },
    ],
  },
];

const state = {
  progress: loadProgress(),
  teacherMode: false,
  currentExercise: null,
  session: { answered: 0, correct: 0, max: 10 },
};

const dom = {};

document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheDom();
  bindTopActions();
  buildTopicGrid();
  updateProgressSummary();
  showHome();
}

function cacheDom() {
  dom.topicGrid = document.getElementById('topic-grid');
  dom.exercisePanel = document.getElementById('exercise-panel');
  dom.exerciseContainer = document.getElementById('exercise-container');
  dom.exerciseTitle = document.getElementById('exercise-title');
  dom.exerciseKicker = document.getElementById('exercise-kicker');
  dom.feedback = document.getElementById('feedback');
  dom.progressSummary = document.getElementById('progress-summary');
  dom.lastScore = document.getElementById('last-score');
  dom.hero = document.getElementById('hero');
  dom.teacherPanel = document.getElementById('teacher-panel');
  dom.toast = document.getElementById('toast');
}

function bindTopActions() {
  document.getElementById('start-btn').addEventListener('click', () => startExercise('vocabulary'));
  document.getElementById('story-btn').addEventListener('click', () => startExercise('story'));
  document.getElementById('btn-home').addEventListener('click', showHome);
  document.getElementById('btn-teacher').addEventListener('click', toggleTeacherMode);
  document.getElementById('back-btn').addEventListener('click', showHome);
  document.getElementById('repeat-btn').addEventListener('click', repeatExercise);

  const teacherForm = document.getElementById('teacher-form');
  teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('teacher-exercise').value;
    const count = Number(document.getElementById('teacher-count').value) || 6;
    const words = document.getElementById('teacher-words').value
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    startExercise(type, { count, words, fromTeacher: true });
  });
  document.getElementById('teacher-close').addEventListener('click', () => setTeacherMode(false));
}

function buildTopicGrid() {
  const topics = [
    { id: 'letters', title: 'זיהוי אותיות', desc: 'לחיצה על תמונה, הדגשת אות והגייה', badge: 'Aa Bb Cc' },
    { id: 'vocabulary', title: 'כרטיסיות מילים', desc: 'מילה באנגלית + תרגום ותמונה', badge: 'אוצר מילים' },
    { id: 'vowels', title: 'השלמת תנועות', desc: 'בחר/י את התנועה החסרה (A/E/I/O)', badge: 'קריאה' },
    { id: 'sentences', title: 'משפטים קצרים', desc: 'בחירת משפט מתאים או תרגום', badge: 'הבנת הנקרא' },
    { id: 'story', title: 'סיפור קצר', desc: '5 שורות + שאלות כן/לא', badge: 'האזנה והבנה' },
  ];

  dom.topicGrid.innerHTML = '';
  topics.forEach((topic) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="badge">${topic.badge}</div>
      <h3>${topic.title}</h3>
      <p>${topic.desc}</p>
      <button class="primary" data-topic="${topic.id}">התחל/י</button>
    `;
    card.querySelector('button').addEventListener('click', () => startExercise(topic.id));
    dom.topicGrid.appendChild(card);
  });
}

function showHome() {
  dom.hero.hidden = false;
  dom.exercisePanel.hidden = true;
  dom.teacherPanel.hidden = !state.teacherMode;
  dom.feedback.textContent = '';
  dom.exerciseContainer.innerHTML = '';
  dom.exerciseTitle.textContent = 'כאן יוצג התרגיל';
  dom.exerciseKicker.textContent = 'תרגיל';
}

function scrollToExercise() {
  requestAnimationFrame(() => {
    dom.exercisePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function toggleTeacherMode() {
  setTeacherMode(!state.teacherMode);
}

function setTeacherMode(enabled) {
  state.teacherMode = enabled;
  const btn = document.getElementById('btn-teacher');
  btn.setAttribute('aria-pressed', enabled);
  dom.teacherPanel.hidden = !enabled;
  showToast(enabled ? 'מצב מורה הופעל' : 'מצב מורה כבוי');
}

function startExercise(type, options = {}) {
  state.currentExercise = { type, options };
  state.session = {
    answered: 0,
    correct: 0,
    max: options.count || 10,
  };
  dom.hero.hidden = true;
  dom.exercisePanel.hidden = false;
  dom.feedback.textContent = '';

  renderCurrentExercise();
  scrollToExercise();
}

function repeatExercise() {
  if (!state.currentExercise) return;
  startExercise(state.currentExercise.type, state.currentExercise.options || {});
}

function renderCurrentExercise() {
  const { type, options = {} } = state.currentExercise || {};
  switch (type) {
    case 'letters':
      renderLetterMatch(options);
      break;
    case 'vocabulary':
      renderVocabularyMatch(options);
      break;
    case 'vowels':
      renderVowelFill(options);
      break;
    case 'sentences':
      renderSentenceTranslate(options);
      break;
    case 'story':
    default:
      renderStoryQuiz();
      break;
  }
}

function renderLetterMatch(options = {}) {
  dom.exerciseKicker.textContent = 'הקפה וזיהוי אותיות';
  dom.exerciseTitle.textContent = 'לחץ/י על התמונה שמתחילה באות המתאימה';
  const samplePool = filterByTeacherWords(vocabulary, options.words);

  // בוחרים רק אות שיש לה לפחות תשובה נכונה אחת ועוד 3 הסחות (סה"כ 4 אפשרויות)
  const lettersWithOptions = letters.filter((ltr) => {
    const correctCount = samplePool.filter((w) => w.en.toLowerCase().startsWith(ltr.toLowerCase())).length;
    const wrongCount = samplePool.filter((w) => !w.en.toLowerCase().startsWith(ltr.toLowerCase())).length;
    return correctCount >= 1 && wrongCount >= 3; // 1 נכונה + 3 הסחות
  });

  if (!lettersWithOptions.length) {
    dom.exerciseContainer.innerHTML = '';
    dom.exerciseTitle.textContent = 'אין מספיק אפשרויות לאותיות זמינות';
    dom.feedback.textContent = 'אין מספיק מילים להצגת תרגיל אותיות (צריך לפחות 4 אפשרויות). התרגיל דולג.';
    dom.feedback.className = 'feedback error';
    return;
  }

  const target = pickRandom(lettersWithOptions);
  const correctPool = samplePool.filter((w) => w.en.toLowerCase().startsWith(target.toLowerCase()));
  const wrongPool = samplePool.filter((w) => !w.en.toLowerCase().startsWith(target.toLowerCase()));

  const correctPick = pickRandom(correctPool);
  const wrongPicks = pickMany(wrongPool, 3);
  const picks = shuffle([correctPick, ...wrongPicks]);

  dom.exerciseContainer.innerHTML = `
    <p>לחץ/י על התמונה שמתחילה באות <strong>${target}</strong></p>
    <div class="exercise-grid" role="group" aria-label="בחירת תמונה לפי אות">
      ${picks
        .map(
          (item, idx) => `
          <div class="tile" tabindex="0" data-index="${idx}" data-word="${item.en}" aria-label="${item.he}">
            <img src="assets/img/${item.img}" alt="${item.en}" onerror="this.onerror=null;this.src='assets/img/placeholder.svg'" />
            <span class="sr-only">${item.en} — ${item.he}</span>
          </div>`
        )
        .join('')}
    </div>
  `;

  dom.exerciseContainer.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      const word = tile.dataset.word;
      const correct = word.toLowerCase().startsWith(target.toLowerCase());
      handleAnswer('letters', correct, correct ? `${word} מתחיל ב-${target}` : 'לא נכון, נסה שוב');
      speakWord(word);
      const img = tile.querySelector('img');
      if (img) bounceImage(img);
      flashTile(tile, correct);
    });
  });
}

function renderVocabularyMatch(options = {}) {
  dom.exerciseKicker.textContent = 'התאמת מילה לתמונה';
  dom.exerciseTitle.textContent = 'בחר/י את המילה באנגלית שמתאימה לתמונה';
  const pool = filterByTeacherWords(vocabulary, options.words);
  const target = pickRandom(pool);
  const distractors = pickMany(pool.filter((w) => w.en !== target.en), 3);
  const choices = shuffle([target, ...distractors]);

  dom.exerciseContainer.innerHTML = `
    <div class="tile">
      <p class="badge warn">${target.he}</p>
      <img src="assets/img/${target.img}" alt="${target.en}" onerror="this.onerror=null;this.src='assets/img/placeholder.svg'" />
      <p>לחץ על המילה באנגלית שמתאימה לתמונה</p>
      <div class="inline-options en-text" role="list">
        ${choices
          .map(
            (c) => `<button class="secondary" data-word="${c.en}">${c.en}</button>`
          )
          .join('')}
      </div>
      <small class="en-text">Example: ${target.example}</small>
    </div>
  `;

  dom.exerciseContainer.querySelectorAll('button[data-word]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.word === target.en;
      handleAnswer('vocabulary', correct, correct ? 'נכון! כל הכבוד' : 'לא נכון, נסה שוב');
      speakWord(btn.dataset.word);
      const img = dom.exerciseContainer.querySelector('img');
      if (img) bounceImage(img);
    });
  });
}

function renderVowelFill(options = {}) {
  dom.exerciseKicker.textContent = 'השלמת תנועות A/E/I/O';
  dom.exerciseTitle.textContent = 'בחר/י את התנועה החסרה במילה';
  const pool = options.words && options.words.length ? vowelWords.filter((w) => options.words.includes(w.full)) : vowelWords;
  const target = pickRandom(pool);
  const opts = shuffle(target.options);
  const vocabEntry = vocabulary.find((v) => v.en.toLowerCase() === target.full.toLowerCase());

  dom.exerciseContainer.innerHTML = `
    <div class="tile">
      <p class="badge">${target.he}</p>
      ${vocabEntry ? `<img src="assets/img/${vocabEntry.img}" alt="${vocabEntry.en}" onerror="this.onerror=null;this.src='assets/img/placeholder.svg'" />` : ''}
      <div class="ltr">
        <h3>${target.masked}</h3>
        <div class="inline-options">
          ${opts.map((o) => `<button class="secondary" data-letter="${o}">${o.toUpperCase()}</button>`).join('')}
        </div>
      </div>
      <small>לחיצה תשמיע את המילה ותציג אותה מלאה</small>
    </div>
  `;

  dom.exerciseContainer.querySelectorAll('button[data-letter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.letter.toLowerCase() === target.answer;
      handleAnswer('vowels', correct, correct ? `${target.full} — ${target.he}` : 'נסו שוב');
      speakWord(target.full);
      const img = dom.exerciseContainer.querySelector('img');
      if (img) bounceImage(img);
    });
  });
}

function renderSentenceTranslate(options = {}) {
  dom.exerciseKicker.textContent = 'תרגום משפטים קצרים';
  dom.exerciseTitle.textContent = 'בחר/י את התרגום בעברית';
  const pool = options.words && options.words.length ? sentencePool.filter((s) => options.words.some((w) => s.en.includes(w))) : sentencePool;
  const target = pickRandom(pool);
  const choices = shuffle([target.he, ...target.distractors]);

  dom.exerciseContainer.innerHTML = `
    <div class="tile">
      <p class="badge">משפט באנגלית</p>
      <button class="listen-btn" data-speak="${encodeURIComponent(target.en)}">הקשבה למשפט</button>
      <div class="en-text"><strong>${target.en}</strong></div>
      <div class="exercise-grid">
        ${choices
          .map((c) => `<button class="secondary" data-choice="${c}">${c}</button>`)
          .join('')}
      </div>
    </div>
  `;

  dom.exerciseContainer.querySelectorAll('button[data-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.choice === target.he;
      handleAnswer('sentences', correct, correct ? 'מעולה! הבנת נכון' : 'בדקו שוב');
      speakSentence(target.en);
    });
  });

  const speakBtn = dom.exerciseContainer.querySelector('button[data-speak]');
  if (speakBtn) {
    speakBtn.addEventListener('click', () => speakSentence(target.en));
  }
}

function renderStoryQuiz() {
  dom.exerciseKicker.textContent = 'סיפור קצר ושאלות כן/לא';
  const story = pickRandom(stories);
  dom.exerciseTitle.textContent = story.title;
  const q = pickRandom(story.questions);

  dom.exerciseContainer.innerHTML = `
    <div class="story-block">
      <button class="listen-btn" data-speak-story="true">הקשבה לסיפור</button>
      <ol class="en-text">
        ${story.lines.map((line) => `<li>${line}</li>`).join('')}
      </ol>
    </div>
    <div class="tile">
      <p class="badge">שאלה</p>
      <p>${q.q}</p>
      <div class="inline-options">
        <button class="secondary" data-answer="true">כן</button>
        <button class="secondary" data-answer="false">לא</button>
      </div>
    </div>
  `;

  dom.exerciseContainer.querySelectorAll('button[data-answer]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.answer === 'true';
      const correct = val === q.answer;
      handleAnswer('story', correct, correct ? 'נכון!' : 'לא נכון, נסה שוב');
      speakSentence(story.title);
    });
  });

  const speakStoryBtn = dom.exerciseContainer.querySelector('button[data-speak-story]');
  if (speakStoryBtn) {
    speakStoryBtn.addEventListener('click', () => speakSentence(story.lines.join(' ')));
  }
}

function handleAnswer(kind, correct, message) {
  const entry = state.progress[kind] || { correct: 0, total: 0 };
  entry.total += 1;
  if (correct) entry.correct += 1;
  state.progress[kind] = entry;
  saveProgress();
  updateProgressSummary();
  dom.feedback.textContent = message;
  dom.feedback.className = `feedback ${correct ? 'success' : 'error'}`;

  state.session.answered += 1;
  if (correct) state.session.correct += 1;

  if (state.session.answered >= state.session.max) {
    showSessionSummary();
  } else {
    setTimeout(() => renderCurrentExercise(), 500);
  }
}

function showSessionSummary() {
  dom.exerciseKicker.textContent = 'סיכום סשן';
  dom.exerciseTitle.textContent = '10 שאלות הושלמו';
  const { answered, correct } = state.session;
  const percent = answered ? Math.round((correct / answered) * 100) : 0;
  dom.exerciseContainer.innerHTML = `
    <div class="tile">
      <h3>סיימת ${answered} שאלות</h3>
      <p>נכונות: ${correct} / ${answered} (${percent}%)</p>
      <div class="inline-options">
        <button class="primary" id="session-retry">תרגל/י שוב</button>
        <button class="ghost" id="session-home">דף הבית</button>
      </div>
    </div>
  `;
  document.getElementById('session-retry').addEventListener('click', repeatExercise);
  document.getElementById('session-home').addEventListener('click', showHome);
}

function updateProgressSummary() {
  const entries = Object.values(state.progress);
  const total = entries.reduce((sum, e) => sum + e.total, 0);
  const correct = entries.reduce((sum, e) => sum + e.correct, 0);
  const percent = total ? Math.round((correct / total) * 100) : 0;
  dom.progressSummary.textContent = `התקדמות: ${percent}% (${correct}/${total})`;
  dom.lastScore.textContent = total ? `נענו ${total} שאלות, ${percent}% הצלחה` : 'עדיין לא נמדד ציון';
}

function flashTile(tile, success) {
  tile.style.borderColor = success ? 'var(--success)' : 'var(--danger)';
  setTimeout(() => (tile.style.borderColor = 'rgba(255,255,255,0.08)'), 600);
}

function bounceImage(img) {
  img.classList.remove('pop');
  // force reflow to restart animation
  void img.offsetWidth;
  img.classList.add('pop');
  setTimeout(() => img.classList.remove('pop'), 350);
}

function speakWord(word) {
  if (!word) return;
  const entry = vocabulary.find((v) => v.en.toLowerCase() === word.toLowerCase());
  const audioPath = entry ? `assets/audio/${entry.audio}` : '';
  if (entry && entry.audio) {
    playAudio(audioPath, () => speakSentence(word));
  } else {
    speakSentence(word);
  }
}

function speakSentence(text) {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function playAudio(src, fallback) {
  const audio = new Audio(src);
  audio.play().catch(() => fallback && fallback());
}

function filterByTeacherWords(pool, words = []) {
  if (!words || words.length === 0) return pool;
  const lower = words.map((w) => w.toLowerCase());
  const filtered = pool.filter((item) => lower.some((w) => item.en.toLowerCase().includes(w)));
  return filtered.length ? filtered : pool;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem('noam_english_progress');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem('noam_english_progress', JSON.stringify(state.progress));
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function pickMany(arr, count) { return shuffle(arr).slice(0, Math.max(0, Math.min(count, arr.length))); }

function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.hidden = false;
  setTimeout(() => (dom.toast.hidden = true), 1600);
}
