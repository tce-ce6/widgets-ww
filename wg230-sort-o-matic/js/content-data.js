/* Sort-O-Matic (wg230): the items, their properties and the text for each round.
   Each item:
     file    assets/svg/item-<file>.svg
     hf      height of the drawing as a fraction of its square box (from the art)
     floats  true / false, with rho (density against water) and why (the reason on the card)
     see     'tp' transparent, 'tl' translucent, 'op' opaque
     hard    true / false
     rounds  the rounds this item appears in, 14 per round as in the storyboard */
window.SORT_O_MATIC_CONTENT = {
  items: [
    { name: 'Plastic toy', file: 'toy', hf: 0.872, floats: true, rho: 0.25, why: 'It is light.', see: 'op', hard: true, rounds: ['float', 'see'] },
    { name: 'Wooden block', file: 'block', hf: 0.971, floats: true, rho: 0.6, why: 'Wood is light.', see: 'op', hard: true, rounds: ['float', 'hard'] },
    { name: 'Glass marble', file: 'marble', hf: 0.98, floats: false, rho: 2.5, why: 'Glass is heavy.', see: 'tp', hard: true, rounds: ['float', 'see', 'hard'] },
    { name: 'Sponge', file: 'sponge', hf: 0.747, floats: true, rho: 0.2, why: 'It is full of air.', see: 'op', hard: false, rounds: ['float', 'see', 'hard'] },
    { name: 'Wax candle', file: 'candle', hf: 0.976, floats: true, rho: 0.9, why: 'Wax is light.', see: 'op', hard: false, rounds: ['float', 'see', 'hard'] },
    { name: 'Stone', file: 'stone', hf: 0.764, floats: false, rho: 2.6, why: 'It is heavy.', see: 'op', hard: true, rounds: ['float', 'hard'] },
    { name: 'Cork', file: 'cork', hf: 0.973, floats: true, rho: 0.24, why: 'It is very light.', see: 'op', hard: false, rounds: ['float', 'see', 'hard'] },
    { name: 'Iron nail', file: 'nail', hf: 0.978, floats: false, rho: 7.8, why: 'It is heavy.', see: 'op', hard: true, rounds: ['float', 'see', 'hard'] },
    { name: 'Butter paper', file: 'butter', hf: 0.972, floats: true, rho: 0.7, why: 'It is thin and light.', see: 'tl', hard: false, rounds: ['float', 'see'] },
    { name: 'Glass slide', file: 'slide', hf: 0.984, floats: false, rho: 2.5, why: 'Glass is heavy.', see: 'tp', hard: true, rounds: ['float', 'see', 'hard'] },
    { name: 'Tissue paper', file: 'tissue', hf: 0.935, floats: true, rho: 0.5, why: 'It is thin and light.', see: 'tl', hard: false, rounds: ['float', 'see'] },
    { name: 'Frosted glass', file: 'frosted', hf: 0.971, floats: false, rho: 2.5, why: 'Glass is heavy.', see: 'tl', hard: true, rounds: ['float', 'see', 'hard'] },
    { name: 'Wax paper', file: 'waxpaper', hf: 0.972, floats: true, rho: 0.8, why: 'It is thin and light.', see: 'tl', hard: false, rounds: ['float', 'see'] },
    { name: 'Tracing paper', file: 'tracing', hf: 0.972, floats: true, rho: 0.8, why: 'It is thin and light.', see: 'tl', hard: false, rounds: ['float', 'see'] },
    { name: 'Cellophane paper', file: 'cello', hf: 0.974, see: 'tp', rounds: ['see'] },
    { name: 'Magnifying glass', file: 'lens', hf: 0.975, see: 'tp', rounds: ['see'] },
    { name: 'Brick', file: 'brick', hf: 0.646, hard: true, rounds: ['hard'] },
    { name: 'Wool', file: 'wool', hf: 0.84, hard: false, rounds: ['hard'] },
    { name: 'Cotton ball', file: 'cotton', hf: 0.855, hard: false, rounds: ['hard'] },
    { name: 'Jelly', file: 'jelly', hf: 0.709, hard: false, rounds: ['hard'] },
    { name: 'Eraser', file: 'eraser', hf: 0.462, hard: false, rounds: ['hard'] },
  ],

  rounds: {
    float: {
      label: 'Float or sink',
      ask: 'Floats or sinks?',
      icon: 'assets/svg/tile-float.svg',
      trays: [
        { key: 'floats', label: 'Floats', tone: 'light' },
        { key: 'sinks', label: 'Sinks', tone: 'dark' },
      ],
      answer: (item) => (item.floats ? 'floats' : 'sinks'),
      line: (item) => `${item.name} ${item.floats ? 'floats' : 'sinks'}. ${item.why}`,
    },
    see: {
      label: 'See-through',
      ask: 'Can light pass through?',
      icon: 'assets/svg/tile-see.svg',
      trays: [
        { key: 'tp', label: 'Transparent', tone: 'light' },
        { key: 'tl', label: 'Translucent', tone: 'light' },
        { key: 'op', label: 'Opaque', tone: 'light' },
      ],
      answer: (item) => item.see,
      line: (item) => {
        const name = item.name.toLowerCase();
        if (item.see === 'tp') return `Light passes through the ${name}. Transparent!`;
        if (item.see === 'tl') return `Light passes through the ${name}, but blurry. Translucent!`;
        return `No light passes through the ${name}. Opaque!`;
      },
    },
    hard: {
      label: 'Hard or soft',
      ask: 'Hard or soft?',
      icon: 'assets/svg/tile-hard.svg',
      trays: [
        { key: 'hard', label: 'Hard', tone: 'light' },
        { key: 'soft', label: 'Soft', tone: 'dark' },
      ],
      answer: (item) => (item.hard ? 'hard' : 'soft'),
      line: (item) => {
        const name = item.name.toLowerCase();
        return item.hard ? `The press can’t squash the ${name}. Hard!` : `The press squashes the ${name}. Soft!`;
      },
    },
  },
};
