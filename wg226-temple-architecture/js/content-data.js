// Content for "Temple Architecture" (from en_his_08_wg226.docx, Tables A to E).

// Table A + C: tower levels, bottom to top.
// tag   body part (the right answer); part/term  tower part and temple term
window.LEVELS = [
  { key: 'feet', tag: 'Feet', part: 'Platform', term: 'pīṭham', title: 'Platform and feet',
    sub: 'Platform of the tower, feet of Puruṣha',
    text: 'The whole temple rests on a raised platform. In the Puruṣha idea, this platform matches the feet of the cosmic being.',
    look: 'The Bṛihadīśhvara vimāna rises over 60 metres above its platform. You are about to climb a tower like it, level by level.' },
  { key: 'knees', tag: 'Knees', part: 'Walls', term: 'jaṅghā', title: 'Walls and knees',
    sub: 'Walls of the tower, knees of Puruṣha',
    text: 'Above the platform stand the walls of the shrine, with the garbhagṛiha inside. This part lines up with the knees of the figure.',
    look: 'Just as legs hold up the body, these walls carry the whole weight of the tower above.' },
  { key: 'arms', tag: 'Arms', part: 'Lower tiers', term: '', title: 'Lower tiers and arms',
    sub: 'Lower tiers of the tower, arms of Puruṣha',
    text: 'The tower climbs in stepped tiers, each a little smaller than the one below. The lower tiers line up with the arms of the figure.',
    look: 'Count the tiers as you climb. Each one is a little narrower than the one below it.' },
  { key: 'shoulders', tag: 'Shoulders', part: 'Upper tiers', term: '', title: 'Upper tiers and shoulders',
    sub: 'Upper tiers of the tower, shoulders of Puruṣha',
    text: 'Higher up, the tiers keep drawing in, and line up with the shoulders of the figure.',
    look: 'These tiers give the Bṛihadīśhvara vimāna its pyramid shape. North Indian śhikharas have a curved outline (like the two towers).' },
  { key: 'neck', tag: 'Neck', part: 'Neck', term: 'grīva', title: 'Neck and neck',
    sub: 'Neck of the tower, neck of Puruṣha',
    text: 'Near the top, the tower narrows into a slim neck just below the crowning dome. It matches the neck of the figure.',
    look: 'You need not remember the temple terms for each part. What matters is how the tower follows the shape of a body.' },
  { key: 'face', tag: 'Face', part: 'Dome', term: '', title: 'Dome and face',
    sub: 'Dome of the tower, face of Puruṣha',
    text: 'Above the neck sits a rounded dome. It lines up with the face of the figure.',
    look: 'The head of the deity and the top of each tower sit at the same height.' },
  { key: 'tuft', tag: 'Tuft of hair', part: 'Finial', term: 'kalaśa', title: 'Finial and tuft of hair',
    sub: 'Finial of the tower, tuft of hair of Puruṣha',
    text: 'At the very top is the pointed finial. It matches the tuft of hair (śikhā) on the head of Puruṣha.',
    look: 'From head to feet, the temple becomes a symbol of our own being and also of the cosmos.' }
];

// Table B: route stops. The right answer is listed first; options are shuffled on screen.
window.STOPS = [
  { id: 'gopuram', name: 'Gopuram', sub: 'The ceremonial entrance',
    body: 'Your journey begins at the gopuram, the grand gateway. In south India the temple entrance is called a gopuram; some north Indian temples have a toraṇa instead. Once you cross it, you leave the busy outer world behind.',
    q: 'You are walking in from the east. Which way does the garbhagṛiha face?',
    options: ['East', 'West', 'North'],
    expl: 'A temple’s main alignment is generally east–west, with the garbhagṛiha facing east.' },
  { id: 'prakara', name: 'Prākāra', sub: 'The enclosure wall',
    body: 'The prākāra is the wall that encloses the whole temple complex. Until the 8th or 9th century, temples were modest in size. From the 10th century onward they grew larger, adding more shrines, amenities and enclosures, until they became vast complexes.',
    q: 'Inside these walls, a temple was more than a place of worship. What else was it?',
    options: ['A centre of learning, art and economic life', 'Only a royal residence', 'Only a fort for soldiers'],
    expl: 'A temple was also a centre of learning, literature, art, social life and economic life.' },
  { id: 'nandi', name: 'Nandi pavilion', sub: 'Home of the sacred bull',
    body: 'This pavilion holds a massive statue of Nandi, the sacred bull, carved from a single stone. It sits facing the main shrine.',
    q: 'Which way does Nandi face?',
    options: ['Towards the garbhagṛiha', 'Towards the gopuram', 'Towards the secondary shrines'],
    expl: 'Nandi sits in a pavilion facing the main shrine, straight towards the garbhagṛiha, where the deity is kept.' },
  { id: 'shrines', name: 'Secondary shrines', sub: 'Smaller shrines for other deities',
    body: 'From the 10th century onward, temples grew in scale and began to include several shrines. The main temple here is dedicated to Śhiva. Around it stand secondary shrines, dedicated to goddess Pārvati and other deities.',
    q: 'To whom are the secondary shrines dedicated?',
    options: ['Goddess Pārvati and other deities', 'Only Śhiva', 'The kings who built the temple'],
    expl: 'The main temple is dedicated to Śhiva. The secondary shrines around it are dedicated to goddess Pārvati and other deities. Can you find the other small shrines in the corners of the courtyard?' },
  { id: 'mandapa', name: 'Maṇḍapa', sub: 'The pillared hall',
    body: 'Climb the steps into the maṇḍapas, large halls held up by rows of pillars. The Bṛihadīśhvara Temple is renowned for its vast maṇḍapas. Temples were places for sculpture, dance and music as well as worship.',
    q: 'The carved walls of this temple are made of which stone?',
    options: ['Granite', 'White marble', 'Terracotta'],
    expl: 'The Bṛihadīśhvara Temple is known for the intricate granite carvings and sculptures that adorn its walls, like the panel of Mahālakṣhmī with attendants and other deities.' },
  { id: 'corridor', name: 'Pradakṣhiṇa corridor', sub: 'The path around the shrine.',
    body: 'This corridor runs all the way around the innermost chamber. Worshippers walk around it in a clockwise direction, a custom called pradakṣhiṇa. Watch the red dot take the path.',
    replay: 'Watch the walk again',
    q: 'Walking around a sacred centre is older than temples. Where else did people do this?',
    options: ['Around stupas, like the one at Sanchi', 'Around the gopuram', 'Around the Nandi pavilion'],
    expl: 'Worshippers walked around stupas like the one at Sanchi, and monks walked around the stupa in Ellora’s Cave no. 10.' },
  { id: 'garbha', name: 'Garbhagṛiha', sub: 'The innermost chamber.',
    body: 'You have reached the garbhagṛiha, where the mūrti (image) of the deity is kept. This is the heart of the temple, and the end of your journey inward.',
    arrival: ['You have reached the centre', 'Temple worship can be understood as a journey from the outer world, left behind at the gateway, to the inner world waiting in the garbhagṛiha. It mirrors our own spiritual journey.'],
    q: 'What rises directly above the garbhagṛiha?',
    options: ['The vimāna', 'The gopuram', 'The maṇḍapa'],
    expl: 'The vimāna, the tower of south Indian temples, rises directly above the garbhagṛiha. In north Indian temples this tower is called a śhikhara. Climb it next, and check your guess from the start.' },
  { id: 'vimana', name: 'Vimāna', sub: 'The tower above the shrine.' }
];

// Table D: clues as [text, hint if placed on a wrong temple]
window.TEMPLES = [
  { id: 'brihadishvara', name: 'Bṛihadīśhvara Temple', img: 'temple-brihadishvara.png', flip: true,
    clues: [
      ['Tamil Nadu', 'Not this one. The model temple you walked through was in this state.'],
      ['Built by Rājarāja Chola I of Chola Dynasty in early 11th century CE.', 'Not this one. This Chola king built the temple your walk was based on.'],
      ['Granite', 'Not this one. This temple has granite carvings.']
    ],
    standout: 'A huge pyramid-shaped vimāna over 60 metres high, and a Nandi carved from a single stone.' },
  { id: 'lingaraja', name: 'Lingarāja Temple', img: 'temple-lingaraja.png',
    clues: [
      ['Odisha', 'Not this one. Look for the temple in Bhubaneswar.'],
      ['Built by Jajati Keshari of Somavamshi Dynasty in early 11th century CE.', 'Not this one. The temple in Bhubaneswar was built in this period.'],
      ['Sandstone and laterite', 'Not this one. These local stones were used in Bhubaneswar.']
    ],
    standout: 'Three large maṇḍapas used for different purposes, and a tall śhikhara rich in ornate carvings.' },
  { id: 'dilwara', name: 'Dilwara Temples', img: 'temple-dilwara.png', flip: true,
    clues: [
      ['Rajasthan', 'Not this one. Mount Abu is in this state.'],
      ['Built by Solanki (Chaulukya) Dynasty between 11th–13th centuries CE.', 'Not this one. This dynasty built a group of five Jain temples.'],
      ['White marble from the Aravalli hills', 'Not this one. The Aravalli hills are close to Mount Abu.']
    ],
    standout: 'A group of five Jain temples, with delicate carvings of tīrthankaras, deities, dancers and musicians on every surface.' },
  { id: 'bishnupur', name: 'Temples of Bishnupur', img: 'temple-bishnupur.png',
    clues: [
      ['West Bengal', 'Not this one. Find the temples in Bishnupur.'],
      ['Built by Malla Kings during 17th and 18th centuries CE.', 'Not this one. These are the most recent of the four temples.'],
      ['Brick with terracotta panels', 'Not this one. Look for the temples made of fired clay.']
    ],
    standout: 'Square panels showing Rādhā, Kṛiṣhṇa, Rāma and scenes from everyday life, carved by hand and then fired in a kiln.' }
];

window.ITEXT = {
  mystery: 'Tap the human body parts matching them to the part of the temple tower. Lock your guess when all seven parts are placed.',
  mysteryLocked: 'Your guess is locked. Start the temple walk to check it.',
  walkIntro: 'Tap the arrow to walk from the gateway to the innermost shrine.',
  walkStop: 'Read about this stop, then tap the correct answer to the Quick look question.',
  climb: 'Climb the tower level by level and check your guess.',
  sort: 'Sort by tapping the information and tapping the correct temple to which it belongs.',
  sorted: 'Look at the dashed lines on each temple, then open the insights.'
};
