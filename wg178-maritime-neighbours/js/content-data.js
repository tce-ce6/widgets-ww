/* Widget content from en_geo_07_wg178.docx: India's six maritime neighbours.
   Flags are listed in the order they appear in the flag panel (as in the layout).
   pin:   where the flag pole stands on the map (stage coordinates, pole bottom)
   label: top-left of the country's name tag on the map
   color: highlight colour for the country once found (different for each country) */
window.COUNTRIES = [
  {
    key: 'srilanka',
    name: 'Sri Lanka',
    capital: 'Colombo',
    clues: [
      'In the 3<sup>rd</sup> century BCE, Buddhism was introduced to this country by Mahendra and Sanghamitrā.',
      'Hindu traditions reached this country through the epics Ramayana and Mahabharata.',
      'During a civil war, many people from this country migrated to South India.',
      'Sinhala is the language spoken by the majority of people in this country.',
    ],
    pin: [375.1, 615.5],
    label: [397, 609],
    color: '#3fd65a',
  },
  {
    key: 'maldives',
    name: 'Maldives',
    capital: 'Male',
    clues: [
      'This country is a member of the International Solar Alliance, an initiative launched by India.',
      'Its official language, Dhivehi, and traditional boat-building techniques show strong South Indian influences.',
      'India provided rapid assistance to this country during the 2004 tsunami, the 2014 water crisis in Malé, and the COVID-19 pandemic.',
      'Many of its low-lying islands are threatened by rising sea levels caused by climate change.',
    ],
    pin: [296.7, 712],
    label: [203, 712],
    color: '#ff2b2b',
  },
  {
    key: 'malaysia',
    name: 'Malaysia',
    capital: 'Kuala Lumpur',
    clues: [
      'Around the 4<sup>th</sup> century CE, this region adopted a writing system based on India\'s Brāhmī script.',
      'Ancient Indian influence can still be seen in this country\'s art, literature, and the name of the Srivijaya Kingdom.',
      'During the 19<sup>th</sup> and 20<sup>th</sup> centuries, many workers from South India migrated here to work on rubber plantations.',
      'Today, about 9% of this country\'s population is of Indian origin, reflecting its long-standing ties with India.',
    ],
    pin: [858, 690],
    label: [866, 690],
    color: '#e83ee8',
  },
  {
    key: 'indonesia',
    name: 'Indonesia',
    capital: 'Jakarta',
    clues: [
      'India and this country have shared maritime trade and cultural ties that date back more than 2,000 years.',
      'India and this country are strategic partners, working together in maritime security, defence, and disaster relief.',
      'This country is the world\'s largest archipelago, made up of over 17,000 islands.',
      'Frequent earthquakes and volcanic eruptions make this one of the most earthquake-prone countries in the world.',
    ],
    pin: [746.9, 826.5],
    label: [653.2, 826.7],
    color: '#ff9100',
  },
  {
    key: 'singapore',
    name: 'Singapore',
    capital: 'Singapore',
    clues: [
      'This country became an independent nation in 1965 after being a British colony and later part of a neighbouring country.',
      'Known for its clean streets, this country imposes heavy fines for littering, jaywalking, and breaking traffic rules.',
      'This island nation is home to the famous neighbourhood called "Little India."',
      'The name of this country comes from the Sanskrit word which means "Lion City."',
    ],
    pin: [721, 731.6],
    label: [579, 704],
    color: '#e3f000',
  },
  {
    key: 'thailand',
    name: 'Thailand',
    capital: 'Bangkok',
    clues: [
      'The names of several ancient kingdoms in this country were influenced by Indian culture.',
      'Theravāda Buddhism is practised by the majority of people in this country.',
      'Stories from the Ramayana and Hindu deities are reflected in this country\'s royal ceremonies, dance traditions, and literature.',
      'India is working with this country and another neighbouring nation to improve road connectivity across mainland.',
    ],
    pin: [658.3, 527.5],
    label: [601, 528],
    color: '#ff6c7e',
  },
];
