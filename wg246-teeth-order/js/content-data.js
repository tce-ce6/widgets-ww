/* Set the Teeth in the Correct Order (wg246): the jaws, the tooth types and all on-screen text. */
window.TEETH_CONTENT = {
  // Label for the child's grinding teeth. The textbook formula (2, 1, 0, 2) counts them as molars.
  childGrinderLabel: 'Molar',

  types: {
    incisor: { name: 'Incisor', key: 'i' },
    canine: { name: 'Canine', key: 'c' },
    premolar: { name: 'Premolar', key: 'pm' },
    molar: { name: 'Molar', key: 'm' },
    wisdom: { name: 'Wisdom tooth', key: 'm' },
  },

  // One half of each lower jaw, from the midline to the back of the mouth.
  // Sizes in millimetres: [width along the arch, width across the arch, crown height].
  jaws: {
    adult: {
      title: 'Adult lower jaw',
      resultTitle: 'Adult jaw',
      seq: ['incisor', 'incisor', 'canine', 'premolar', 'premolar', 'molar', 'molar', 'wisdom'],
      dims: [[5.4, 5.8, 9], [5.9, 6.2, 9.2], [6.9, 7.6, 10.4], [7.0, 7.8, 8.2], [7.2, 8.2, 7.8], [11.0, 10.4, 7.2], [10.4, 10.1, 6.8], [9.8, 9.6, 6.2]],
      s: 3.0, R: 14, gap: 0.5,
      formula: { i: 2, c: 1, pm: 2, m: 3 },
      panel: ['incisor', 'canine', 'premolar', 'molar'],
      done: 'You have placed all 16 teeth of the adult lower jaw correctly.',
      doneTitle: 'Full set of adult teeth',
      doneLede: 'Each tooth in the lower jaw has a matching tooth in the upper jaw. So an adult has 32 permanent teeth, including 4 wisdom teeth.',
    },
    child: {
      title: 'Child’s lower jaw',
      resultTitle: 'Child’s jaw',
      seq: ['incisor', 'incisor', 'canine', 'molar', 'molar'],
      dims: [[4.2, 4.2, 6], [4.6, 4.4, 6.2], [5.6, 5.6, 7], [7.6, 7.2, 5.6], [9.4, 8.6, 5.4]],
      s: 2.6, R: 11, gap: 0.5,
      formula: { i: 2, c: 1, pm: 0, m: 2 },
      panel: ['incisor', 'canine', 'premolar', 'molar'],
      done: 'You have placed all 10 teeth of the child’s lower jaw correctly.',
      doneTitle: 'Full set of a child’s milk teeth',
      doneLede: 'Each tooth in the lower jaw has a matching tooth in the upper jaw. So a child has 20 milk teeth.',
    },
  },

  formulaLabels: { i: 'Incisors', c: 'Canines', pm: 'Premolars', m: 'Molars' },

  feedback: {
    start: ['Get started', 'Drag a tooth into an empty socket.'],
    selected: ['{tooth} selected', 'Now tap a socket.'],
    chooseFirst: ['Choose a tooth first', 'Tap a tooth, then tap a socket.'],
    dropOnSocket: ['Drop it on a socket', 'Let go over an empty socket.'],
    correct: ['Correct', 'This is the place of the {tooth}.'],
    wrong: ['Not correct', 'Try again.'],
    complete: 'Well done!',
    cleared: ['Jaw cleared', 'All the sockets are empty again.'],
  },

  // How to use: one entry per step, for each screen (storyboard: exact text for each screen)
  tours: {
    start: [
      { sel: '#startCards .jaw-card', text: 'Choose a jaw to begin.' }, // the cards, since their row has no height of its own
      { sel: '#insightsBtn', text: 'Tap Insights for a quick summary of human teeth.' },
      { sel: '#helpBtn', text: 'Tap How to use to see these steps again.' },
    ],
    jaw: [
      { sel: '#jawView', text: 'This is the lower jaw. Rotate it to see it in 3D.' },
      { sel: '#tiles', text: 'Drag a tooth into an empty socket. Or tap a tooth, then tap a socket.' },
      { sel: '#tiles .view-btn', text: 'Tap View to see a tooth in 3D.' },
      { sel: '#feedback', text: 'Correct teeth stay in place. Wrong teeth go back.' },
      { sel: '#counter', text: 'The count goes up to {total} as you place each tooth.' },
      { sel: '#formula', text: 'The formula fills in as you finish each type of tooth.' },
      { sel: '#stageTools', text: 'Show answer fills in the correct teeth, and Hide answer takes them away. Reset jaw clears the jaw.' },
    ],
    done: [
      { sel: '#doneView', text: 'Rotate the model to see the upper and lower jaws.' },
      { sel: '#doneFormula', text: 'This is the dental formula for the full set of teeth.' },
      { sel: '#redoBtn, #homeBtn', text: 'Redo this jaw, or go back to choose a jaw.' },
    ],
  },
};
