import letters from './letters.js';
import vocabulary from './vocabulary.js';
import vowels from './vowels.js';
import sentences from './sentences.js';
import story from './story.js';
import spelling from './spelling.js';
import listening from './listening.js';
import builder from './builder.js';
import memory from './memory.js';
import boss from './boss.js';

export const MODES = [vocabulary, listening, spelling, letters, vowels, sentences, builder, story, memory, boss];
export const QUESTIONS_PER_ROUND = 10;

export const modeById = (id) => MODES.find((m) => m.id === id);

export const LEVEL_LABELS = { 1: 'קל', 2: 'בינוני', 3: 'קשה' };
