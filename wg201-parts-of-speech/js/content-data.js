/* Content for wg201 Parts of Speech (from reference/en_en_03_wg201.docx).
   Card colours are the ones drawn in the XD layout. */

// Data Table 1 — the eight parts of speech, in card order.
window.POS = {
  noun: { label: 'Noun', one: 'noun', many: 'nouns', color: '#f25770', what: 'Names a person, place, animal or thing', examples: 'farmer, Mumbai, kitten, cup' },
  pron: { label: 'Pronoun', one: 'pronoun', many: 'pronouns', color: '#a244c4', what: 'Used in place of a noun', examples: 'he, she, they, him, us' },
  verb: { label: 'Verb', one: 'verb', many: 'verbs', color: '#e742c0', what: 'Shows an action', examples: 'carried, ran, won, smiled' },
  adj: { label: 'Adjective', one: 'adjective', many: 'adjectives', color: '#7b58db', what: 'Describes a noun', examples: 'young, noisy, tiny, green' },
  adv: { label: 'Adverb', one: 'adverb', many: 'adverbs', color: '#2fbee2', what: 'Tells how, when or where it happened', examples: 'loudly, slowly, outside' },
  prep: { label: 'Preposition', one: 'preposition', many: 'prepositions', color: '#51c97d', what: 'Shows where or when something is', examples: 'on, into, near, from' },
  conj: { label: 'Conjunction', one: 'conjunction', many: 'conjunctions', color: '#afc73b', what: 'Joins words or parts of a sentence', examples: 'and, but, or, because' },
  intj: { label: 'Interjection', one: 'interjection', many: 'interjections', color: '#f2a135', what: 'Shows a sudden, strong feeling', examples: 'Oh! Wow! Alas! Hurray!' },
};
window.POS_ORDER = ['noun', 'pron', 'verb', 'adj', 'adv', 'prep', 'conj', 'intj'];

// Data Table 3 — wrong-tap messages ("<word> " is prepended).
window.WHY = {
  noun: 'names something, so it is a noun.',
  pron: 'stands in for a noun, so it is a pronoun.',
  verb: 'shows an action, so it is a verb.',
  adj: 'describes a noun, so it is an adjective.',
  adv: 'tells us how the action happened, so it is an adverb.',
  prep: 'shows where something is, so it is a preposition.',
  conj: 'joins two parts of the sentence, so it is a conjunction.',
  intj: 'shows a sudden feeling, so it is an interjection.',
};

// Data Table 2 — twenty sentences: [word, tag] pairs + the part of speech to find.
// "plain" = articles and possessives, which are never asked for.
window.SENTENCES = [
  { find: 'noun', words: [['The', 'plain'], ['young', 'adj'], ['farmer', 'noun'], ['carried', 'verb'], ['a', 'plain'], ['heavy', 'adj'], ['bucket', 'noun'], ['into', 'prep'], ['the', 'plain'], ['shed.', 'noun']] },
  { find: 'adv', words: [['The', 'plain'], ['bell', 'noun'], ['rang', 'verb'], ['loudly', 'adv'], ['and', 'conj'], ['the', 'plain'], ['children', 'noun'], ['ran', 'verb'], ['outside.', 'adv']] },
  { find: 'pron', words: [['Hurray!', 'intj'], ['We', 'pron'], ['won', 'verb'], ['the', 'plain'], ['match', 'noun'], ['and', 'conj'], ['Sir', 'noun'], ['gave', 'verb'], ['us', 'pron'], ['sweets.', 'noun']] },
  { find: 'adj', words: [['A', 'plain'], ['small', 'adj'], ['brown', 'adj'], ['squirrel', 'noun'], ['climbed', 'verb'], ['onto', 'prep'], ['the', 'plain'], ['wooden', 'adj'], ['fence.', 'noun']] },
  { find: 'verb', words: [['He', 'pron'], ['shouted', 'verb'], ['angrily', 'adv'], ['but', 'conj'], ['she', 'pron'], ['answered', 'verb'], ['politely.', 'adv']] },
  { find: 'conj', words: [['Ravi', 'noun'], ['and', 'conj'], ['Meera', 'noun'], ['walked', 'verb'], ['to', 'prep'], ['the', 'plain'], ['market', 'noun'], ['and', 'conj'], ['bought', 'verb'], ['vegetables.', 'noun']] },
  { find: 'noun', words: [['Oh!', 'intj'], ['The', 'plain'], ['tiny', 'adj'], ['kitten', 'noun'], ['broke', 'verb'], ['my', 'plain'], ['favourite', 'adj'], ['cup.', 'noun']] },
  { find: 'verb', words: [['Amma', 'noun'], ['stirred', 'verb'], ['the', 'plain'], ['soup', 'noun'], ['slowly', 'adv'], ['and', 'conj'], ['tasted', 'verb'], ['it.', 'pron']] },
  { find: 'adj', words: [['The', 'plain'], ['noisy', 'adj'], ['parrot', 'noun'], ['sat', 'verb'], ['on', 'prep'], ['a', 'plain'], ['thick', 'adj'], ['branch.', 'noun']] },
  { find: 'adv', words: [['Wow!', 'intj'], ['They', 'pron'], ['danced', 'verb'], ['gracefully', 'adv'], ['and', 'conj'], ['sang', 'verb'], ['beautifully.', 'adv']] },
  { find: 'noun', words: [['The', 'plain'], ['gardener', 'noun'], ['carefully', 'adv'], ['planted', 'verb'], ['the', 'plain'], ['seeds', 'noun'], ['near', 'prep'], ['the', 'plain'], ['gate.', 'noun']] },
  { find: 'verb', words: [['Oh!', 'intj'], ['The', 'plain'], ['little', 'adj'], ['boy', 'noun'], ['dropped', 'verb'], ['the', 'plain'], ['glass', 'noun'], ['but', 'conj'], ['his', 'plain'], ['mother', 'noun'], ['smiled.', 'verb']] },
  { find: 'intj', words: [['Alas!', 'intj'], ['The', 'plain'], ['old', 'adj'], ['tree', 'noun'], ['fell', 'verb'], ['in', 'prep'], ['the', 'plain'], ['storm.', 'noun']] },
  { find: 'pron', words: [['He', 'pron'], ['gave', 'verb'], ['her', 'pron'], ['a', 'plain'], ['small', 'adj'], ['green', 'adj'], ['sweet.', 'noun']] },
  { find: 'prep', words: [['The', 'plain'], ['crow', 'noun'], ['sat', 'verb'], ['quietly', 'adv'], ['on', 'prep'], ['the', 'plain'], ['wall', 'noun'], ['and', 'conj'], ['stared', 'verb'], ['at', 'prep'], ['the', 'plain'], ['bread.', 'noun']] },
  { find: 'adj', words: [['The', 'plain'], ['old', 'adj'], ['fisherman', 'noun'], ['mended', 'verb'], ['his', 'plain'], ['torn', 'adj'], ['net', 'noun'], ['beside', 'prep'], ['the', 'plain'], ['quiet', 'adj'], ['river.', 'noun']] },
  { find: 'adv', words: [['The', 'plain'], ['rain', 'noun'], ['fell', 'verb'], ['suddenly', 'adv'], ['and', 'conj'], ['the', 'plain'], ['players', 'noun'], ['ran', 'verb'], ['indoors.', 'adv']] },
  { find: 'pron', words: [['She', 'pron'], ['called', 'verb'], ['him', 'pron'], ['twice', 'adv'], ['but', 'conj'], ['he', 'pron'], ['ignored', 'verb'], ['her.', 'pron']] },
  { find: 'prep', words: [['The', 'plain'], ['kitten', 'noun'], ['hid', 'verb'], ['under', 'prep'], ['the', 'plain'], ['chair', 'noun'], ['behind', 'prep'], ['the', 'plain'], ['door.', 'noun']] },
  { find: 'conj', words: [['Ravi', 'noun'], ['packed', 'verb'], ['his', 'plain'], ['bag', 'noun'], ['and', 'conj'], ['left', 'verb'], ['early', 'adv'], ['but', 'conj'], ['forgot', 'verb'], ['his', 'plain'], ['lunch.', 'noun']] },
];
