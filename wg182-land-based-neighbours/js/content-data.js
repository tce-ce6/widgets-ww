/* Widget content from en_geo_07_wg182.docx: India's land-based neighbours.
   The design (en_geo_07_wg182.xd) uses six of them; flags are listed in the
   order they appear in the flag panel.
   All positions are stage coordinates, taken from en_geo_07_wg182_layout.svg:
   pole:  [x, top, height] of the flag pole shown on the map once found
   flag:  [width, height] of the small flag at the top of the pole
   label: top-left of the country's name tag on the map
   color: highlight colour for the country once found (opacity: its fill opacity) */
window.COUNTRIES = [
  {
    key: 'bangladesh',
    name: 'Bangladesh',
    capital: 'Dhaka',
    clues: [
      'This country was born in 1971 as the outcome of a war between India and its another neighbour.',
      'This country\'s land border with India is even longer than India\'s border with China, running along West Bengal, Assam, Meghalaya, Tripura and Mizoram.',
      'This nations houses major portion of world\'s largest mangrove forest, home to the Bengal tiger.',
      'Bangla, a language shared with India\'s West Bengal, is the common tongue here.',
    ],
    pole: [845.2, 606, 31],
    flag: [27.6, 16],
    label: [714, 635],
    color: '#86ff00',
  },
  {
    key: 'bhutan',
    name: 'Bhutan',
    capital: 'Thimpu',
    clues: [
      'Known to its own people as \'Drukyul\', or Land of the Thunder Dragon, this kingdom\'s border with India touches Sikkim, West Bengal, Assam and Arunachal Pradesh.',
      'The dragon on this country\'s flag and emblem is said to symbolise the thunderous voice of the Buddha\'s teachings, introduced here in the 8<sup>th</sup> century CE.',
      'Rivers originating here flow into India and power joint hydroelectric projects, including one dedicated by both countries\' prime ministers in 2008.',
      'This country developed the Gross National Happiness Index as a more holistic measure of progress than Gross Domestic Product.',
    ],
    pole: [858.5, 535.7, 30],
    flag: [28, 16],
    label: [882, 550],
    color: '#6c0ee9',
  },
  {
    key: 'china',
    name: 'China',
    capital: 'Beijing',
    clues: [
      'In the 13<sup>th</sup> century, Hindu merchants built temples in one of this country\'s port cities, where carved pillars still show scenes from the Ramayana and the Puranas.',
      'Buddhism reached this country from India around the 1<sup>st</sup> century CE via trade and pilgrimage routes, and monks such as Faxian and Xuanzang later travelled to Indian centres of learning.',
      'Since 1950, this country and India have shared a long relationship, with their Himalaya-separated border running from Arunachal Pradesh in the east to Ladakh in the west.',
      'This country is about three times larger than India in area, and today India\'s chief exports to it include iron ore, chemicals and cotton yarn.',
    ],
    pole: [998.5, 435.5, 35.4],
    flag: [32, 18],
    label: [961, 469],
    color: '#fc0f47',
    opacity: 0.6,
  },
  {
    key: 'myanmar',
    name: 'Myanmar',
    capital: 'Naypyidaw',
    clues: [
      'India helped restore the Ananda temple in Bagan here, and gifted a 16-foot replica of the Sarnath Buddha statue to the Shwedagon Pagoda.',
      'A 2018 Land Border Crossing Agreement eased cross-border movement between India and this country.',
      'This country is connected to India by both a land border and a maritime boundary in the Bay of Bengal.',
      'India\'s northeastern states of Arunachal Pradesh, Nagaland, Manipur and Mizoram share a border with this country.',
    ],
    pole: [930, 626.5, 35.4],
    flag: [31.5, 18],
    label: [887, 662],
    color: '#c900d0',
  },
  {
    key: 'pakistan',
    name: 'Pakistan',
    capital: 'Islamabad',
    clues: [
      'Ancient Hindu and Sikh shrines survive here, including the Katas Raj temple complex linked to the Mahabharata and the Hinglaj Mata Mandir.',
      'This country\'s border with India runs across Gujarat, Rajasthan, Punjab, and the union territories of Jammu and Kashmir and Ladakh.',
      'Before the 1947 Partition, this country was part of India; since then the two nations have been through wars in 1948, 1965 and 1971, plus the Kargil conflict in 1999.',
      'A visa-free Kartarpur corridor lets Indian pilgrims cross into this country to visit a gurdwara that is the final resting place of Guru Nanak Dev.',
    ],
    pole: [607, 501.6, 29.8],
    flag: [28, 16],
    label: [531, 526],
    color: '#0dc000',
  },
  {
    key: 'nepal',
    name: 'Nepal',
    capital: 'Kathmandu',
    clues: [
      'A 1950 Treaty of Peace and Friendship lets citizens of this country and India cross the border freely without passports or visas.',
      'India is this country\'s largest trading partner, supplying petroleum, medicines and food items in exchange for agricultural produce, handicrafts and garments.',
      'The Pashupatinath temple in this country\'s capital draws thousands of Indian pilgrims every year.',
      'This country shares a long, open border with India across Uttarakhand, Uttar Pradesh, Bihar, West Bengal and Sikkim.',
    ],
    pole: [747.5, 516.7, 29.8],
    flag: [11.6, 14.8],
    label: [677, 548],
    color: '#ffa200',
  },
];
