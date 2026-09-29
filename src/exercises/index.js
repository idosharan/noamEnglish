import hearletter from './hearletter.js';
import firstletter from './firstletter.js';
import missing from './missing.js';
import trace from './trace.js';
import digraph from './digraph.js';
import sort from './sort.js';
import translate from './translate.js';
import vocabulary from './vocabulary.js';
import listening from './listening.js';
import spelling from './spelling.js';
import order from './order.js';
import numbers from './numbers.js';
import reading from './reading.js';
import myname from './myname.js';
import boss from './boss.js';
import exam from './exam.js';

// The studio map: each world is a stop on the path, modes are its levels
export const WORLDS = [
  { id: 'letters', title: 'עולם האותיות', icon: '🔤', color: 'lime', modes: [hearletter, firstletter, missing, trace] },
  { id: 'sounds', title: 'צלילים ch sh th', icon: '🔊', color: 'sky', modes: [digraph, sort] },
  { id: 'words', title: 'עולם המילים', icon: '📚', color: 'sun', modes: [translate, vocabulary, listening, order, spelling] },
  { id: 'numbers', title: 'מספרים 1-12', icon: '🔟', color: 'coral', modes: [numbers] },
  { id: 'reading', title: 'קריאה וכתיבה', icon: '📖', color: 'mint', modes: [reading, myname] },
];

export const MODES = [...WORLDS.flatMap((w) => w.modes), boss, exam];
export const QUESTIONS_PER_ROUND = 10;
export const roundLength = (mode) => mode.count || QUESTIONS_PER_ROUND;

export const modeById = (id) => MODES.find((m) => m.id === id);
export const worldOf = (id) => WORLDS.find((w) => w.modes.some((m) => m.id === id));

export const LEVEL_LABELS = { 1: 'קל', 2: 'בינוני', 3: 'קשה' };
