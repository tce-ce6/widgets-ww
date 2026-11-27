window.WIDGET_DATA = {
  categories: [
    { id: 'all',               label: 'All',                color: '#F5A623', textColor: '#fff' },
    { id: 'nonpolar-aliphatic',label: 'Nonpolar aliphatic', color: '#7ED321', textColor: '#fff' },
    { id: 'nonpolar-aromatic', label: 'Aromatic',           color: '#4A90E2', textColor: '#fff' },
    { id: 'polar-uncharged',   label: 'Polar uncharged',    color: '#00BCD4', textColor: '#fff' },
    { id: 'polar-basic',       label: 'Polar basic',        color: '#F5D020', textColor: '#222' },
    { id: 'polar-acidic',      label: 'Polar acidic',       color: '#9B59B6', textColor: '#fff' },
    { id: 'essential',         label: 'Essential',          color: '#E91E8C', textColor: '#fff' },
    { id: 'non-essential',     label: 'Non-essential',      color: '#E91E63', textColor: '#fff' }
  ],

  aminoAcids: [
    {
      id: 'glycine', name: 'Glycine',
      categories: ['nonpolar-aliphatic', 'non-essential'],
      badges: ['Nonpolar aliphatic', 'Non-essential'],
      badgeColors: ['#7ED321', '#E91E63'],
      insights: [
        'Simplest amino acid with just a hydrogen atom as its R group',
        'The only amino acid that is not optically active'
      ],
      rGroup: { type: 'simple', label: 'H' }
    },
    {
      id: 'alanine', name: 'Alanine',
      categories: ['nonpolar-aliphatic', 'non-essential'],
      badges: ['Nonpolar aliphatic', 'Non-essential'],
      badgeColors: ['#7ED321', '#E91E63'],
      insights: [
        'R group is a small methyl group (−CH₃)',
        'One of the most common amino acids found in proteins'
      ],
      rGroup: {
        type: 'chain',
        nodes: [{ label: 'CH₃', x: 0, y: 0 }],
        bonds: []
      }
    },
    {
      id: 'valine', name: 'Valine',
      categories: ['nonpolar-aliphatic', 'essential'],
      badges: ['Nonpolar aliphatic', 'Essential'],
      badgeColors: ['#7ED321', '#E91E8C'],
      insights: [
        'R group is a branched hydrocarbon chain',
        'An essential amino acid that must be obtained from diet'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH',  x: 0,   y: 0  },
          { label: 'H₃C', x: -50, y: 60 },
          { label: 'CH₃', x: 50,  y: 60 }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
      }
    },
    {
      id: 'leucine', name: 'Leucine',
      categories: ['nonpolar-aliphatic', 'essential'],
      badges: ['Nonpolar aliphatic', 'Essential'],
      badgeColors: ['#7ED321', '#E91E8C'],
      insights: [
        'R group is a longer branched hydrocarbon chain',
        'An essential amino acid important for muscle protein synthesis'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0,   y: 0   },
          { label: 'CH',  x: 0,   y: 55  },
          { label: 'CH₃', x: -50, y: 110 },
          { label: 'CH₃', x: 50,  y: 110 }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }]
      }
    },
    {
      id: 'isoleucine', name: 'Isoleucine',
      categories: ['nonpolar-aliphatic', 'essential'],
      badges: ['Nonpolar aliphatic', 'Essential'],
      badgeColors: ['#7ED321', '#E91E8C'],
      insights: [
        'R group is a branched hydrocarbon chain similar to leucine',
        'An essential amino acid'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH',  x: 0,   y: 0   },
          { label: 'CH₂', x: 50,  y: 50  },
          { label: 'CH₃', x: 50,  y: 105 },
          { label: 'CH₃', x: -50, y: 50  }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 3 }]
      }
    },
    {
      id: 'proline', name: 'Proline',
      categories: ['nonpolar-aliphatic', 'non-essential'],
      badges: ['Nonpolar aliphatic', 'Non-essential'],
      badgeColors: ['#7ED321', '#E91E63'],
      insights: [
        'R group loops back and bonds to the backbone nitrogen, forming a ring',
        'Creates bends and kinks in protein chains'
      ],
      rGroup: {
        type: 'ring-chain',
        nodes: [
          { label: 'CH₂', x: 30,  y: 0   },
          { label: 'CH₂', x: 70,  y: 50  },
          { label: 'CH₂', x: 50,  y: 105 },
          { label: 'N',   x: 0,   y: 80, color: '#7B68EE' }
        ],
        bonds: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 0, dashed: true }
        ]
      }
    },
    {
      id: 'methionine', name: 'Methionine',
      categories: ['nonpolar-aliphatic', 'essential'],
      badges: ['Nonpolar aliphatic', 'Essential'],
      badgeColors: ['#7ED321', '#E91E8C'],
      insights: [
        'R group contains a sulphur atom',
        'An essential amino acid and the first amino acid added during translation (start codon AUG)'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0   },
          { label: 'CH₂', x: 0, y: 55  },
          { label: 'S',   x: 0, y: 110, color: '#F5A623' },
          { label: 'CH₃', x: 0, y: 165 }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }]
      }
    },
    {
      id: 'phenylalanine', name: 'Phenylalanine',
      categories: ['nonpolar-aromatic', 'essential'],
      badges: ['Aromatic', 'Essential'],
      badgeColors: ['#4A90E2', '#E91E8C'],
      insights: [
        'R group contains a benzene ring',
        'An essential amino acid',
        'Its accumulation causes the genetic disorder phenylketonuria (PKU)'
      ],
      rGroup: { type: 'benzene', stemLabel: 'CH₂' }
    },
    {
      id: 'tryptophan', name: 'Tryptophan',
      categories: ['nonpolar-aromatic', 'essential'],
      badges: ['Aromatic', 'Essential'],
      badgeColors: ['#4A90E2', '#E91E8C'],
      insights: [
        'R group contains the largest ring structure among amino acids',
        'An essential amino acid',
        'A precursor of the plant hormone IAA (auxin)'
      ],
      rGroup: { type: 'indole', stemLabel: 'CH₂' }
    },
    {
      id: 'tyrosine', name: 'Tyrosine',
      categories: ['nonpolar-aromatic', 'non-essential'],
      badges: ['Aromatic', 'Non-essential'],
      badgeColors: ['#4A90E2', '#E91E63'],
      insights: [
        'R group contains a ring with a hydroxyl (−OH) group',
        'A precursor for thyroid hormones and the pigment melanin'
      ],
      rGroup: { type: 'phenol', stemLabel: 'CH₂' }
    },
    {
      id: 'serine', name: 'Serine',
      categories: ['polar-uncharged', 'non-essential'],
      badges: ['Polar uncharged', 'Non-essential'],
      badgeColors: ['#00BCD4', '#E91E63'],
      insights: [
        'R group carries a hydroxyl (−OH) group',
        'Plays a role in enzyme active sites and cell signalling through phosphorylation'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0  },
          { label: 'OH',  x: 0, y: 55, color: '#00BCD4' }
        ],
        bonds: [{ from: 0, to: 1 }]
      }
    },
    {
      id: 'threonine', name: 'Threonine',
      categories: ['polar-uncharged', 'essential'],
      badges: ['Polar uncharged', 'Essential'],
      badgeColors: ['#00BCD4', '#E91E8C'],
      insights: [
        'R group carries a hydroxyl (−OH) group on a slightly longer chain',
        'An essential amino acid'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH',  x: 0,  y: 0  },
          { label: 'OH',  x: 55, y: 30, color: '#00BCD4' },
          { label: 'CH₃', x: 0,  y: 55 }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
      }
    },
    {
      id: 'cysteine', name: 'Cysteine',
      categories: ['polar-uncharged', 'non-essential'],
      badges: ['Polar uncharged', 'Non-essential'],
      badgeColors: ['#00BCD4', '#E91E63'],
      insights: [
        'R group carries a sulphydryl (−SH) group',
        'Two cysteines can form disulphide bonds (−S−S−) that stabilise the 3D shape of proteins'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0  },
          { label: 'SH',  x: 0, y: 55, color: '#F5A623' }
        ],
        bonds: [{ from: 0, to: 1 }]
      }
    },
    {
      id: 'asparagine', name: 'Asparagine',
      categories: ['polar-uncharged', 'non-essential'],
      badges: ['Polar uncharged', 'Non-essential'],
      badgeColors: ['#00BCD4', '#E91E63'],
      insights: [
        'R group carries an amide group',
        'Commonly found at sites where sugar chains attach to proteins (glycosylation)'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0   },
          { label: 'C=O', x: 0, y: 55  },
          { label: 'NH₂', x: 0, y: 110, color: '#7B68EE' }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }]
      }
    },
    {
      id: 'glutamine', name: 'Glutamine',
      categories: ['polar-uncharged', 'non-essential'],
      badges: ['Polar uncharged', 'Non-essential'],
      badgeColors: ['#00BCD4', '#E91E63'],
      insights: [
        'R group carries a longer amide group',
        'The most abundant free amino acid in the blood',
        'Important nitrogen carrier'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0   },
          { label: 'CH₂', x: 0, y: 55  },
          { label: 'C=O', x: 0, y: 110 },
          { label: 'NH₂', x: 0, y: 165, color: '#7B68EE' }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }]
      }
    },
    {
      id: 'lysine', name: 'Lysine',
      categories: ['polar-basic', 'essential'],
      badges: ['Polar basic', 'Essential'],
      badgeColors: ['#F5D020', '#E91E8C'],
      insights: [
        'R group ends in a protonated amino group (−NH₃⁺) that carries a positive charge',
        'An essential amino acid'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0   },
          { label: 'CH₂', x: 0, y: 50  },
          { label: 'CH₂', x: 0, y: 100 },
          { label: 'CH₂', x: 0, y: 150 },
          { label: 'NH₂', x: 0, y: 200, color: '#7B68EE' }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }]
      }
    },
    {
      id: 'arginine', name: 'Arginine',
      categories: ['polar-basic', 'non-essential'],
      badges: ['Polar basic', 'Non-essential'],
      badgeColors: ['#F5D020', '#E91E63'],
      insights: [
        'R group ends in a guanidinium group that carries a strong positive charge',
        'Conditionally essential — required from diet during growth and stress',
        'Involved in the urea cycle for ammonia removal'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0,   y: 0   },
          { label: 'CH₂', x: 0,   y: 50  },
          { label: 'CH₂', x: 0,   y: 100 },
          { label: 'NH',  x: 0,   y: 150 },
          { label: 'C',   x: 0,   y: 200 },
          { label: 'NH₂', x: -55, y: 250, color: '#7B68EE' },
          { label: 'NH₂', x: 55,  y: 250, color: '#7B68EE' }
        ],
        bonds: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
          { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 4, to: 6 }
        ]
      }
    },
    {
      id: 'histidine', name: 'Histidine',
      categories: ['polar-basic', 'essential'],
      badges: ['Polar basic', 'Essential'],
      badgeColors: ['#F5D020', '#E91E8C'],
      insights: [
        'R group contains an imidazole ring that can gain or lose a proton near body pH',
        'This makes it useful in enzyme active sites as a proton shuttle',
        'An essential amino acid'
      ],
      rGroup: { type: 'imidazole', stemLabel: 'CH₂' }
    },
    {
      id: 'aspartic-acid', name: 'Aspartic acid',
      categories: ['polar-acidic', 'non-essential'],
      badges: ['Polar acidic', 'Non-essential'],
      badgeColors: ['#9B59B6', '#E91E63'],
      insights: [
        'R group carries a carboxyl group (−COO⁻) with a negative charge',
        'Plays a role in the urea cycle and as a neurotransmitter'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂',  x: 0, y: 0  },
          { label: 'COO⁻', x: 0, y: 55, color: '#9B59B6' }
        ],
        bonds: [{ from: 0, to: 1 }]
      }
    },
    {
      id: 'glutamic-acid', name: 'Glutamic acid',
      categories: ['polar-acidic', 'non-essential'],
      badges: ['Polar acidic', 'Non-essential'],
      badgeColors: ['#9B59B6', '#E91E63'],
      insights: [
        'R group carries a longer carboxyl group (−COO⁻) with a negative charge',
        'Functions as the major excitatory neurotransmitter in the brain'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂',  x: 0, y: 0   },
          { label: 'CH₂',  x: 0, y: 55  },
          { label: 'COO⁻', x: 0, y: 110, color: '#9B59B6' }
        ],
        bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }]
      }
    },
    {
      id: 'selenocysteine', name: 'Selenocysteine',
      categories: ['polar-uncharged', 'non-essential'],
      badges: ['Polar uncharged', 'Non-essential'],
      badgeColors: ['#00BCD4', '#E91E63'],
      insights: [
        'Similar to cysteine but with selenium replacing sulphur',
        'Called the 21st amino acid',
        'Inserted during translation at special UGA codons'
      ],
      rGroup: {
        type: 'chain',
        nodes: [
          { label: 'CH₂', x: 0, y: 0  },
          { label: 'SeH', x: 0, y: 55, color: '#F5A623' }
        ],
        bonds: [{ from: 0, to: 1 }]
      }
    }
  ],

  generalInsights: [
    '<b>Amino acids</b> are the <b>building blocks of proteins.</b>',
    'All amino acids share the same <b>basic structure</b>: an <b>amino group (NH<sub>2</sub>)</b>, a <b>carboxyl group (COOH)</b>, a <b>hydrogen atom (H)</b>, and a variable <b>R group</b>, all attached to a <b>central carbon atom.</b>',
    '<span class="insight-figure"><svg viewBox="0 0 340 200" role="img" aria-label="General structure of an amino acid, showing the amino group, central carbon with R group and hydrogen, and carboxyl group" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="340" height="200" rx="8" fill="#fff"/><text x="180" y="16" text-anchor="middle" font-size="12" fill="#2266AA">Variable group</text><rect x="10" y="30" width="115" height="120" rx="10" fill="#FBC9A0"/><rect x="205" y="30" width="125" height="120" rx="10" fill="#D9A6E6"/><g stroke="#1a1a1a" stroke-width="2"><line x1="40" y1="95" x2="66" y2="95"/><line x1="78" y1="63" x2="78" y2="83"/><line x1="90" y1="95" x2="166" y2="95"/><line x1="180" y1="54" x2="180" y2="81"/><line x1="180" y1="109" x2="180" y2="136"/><line x1="194" y1="95" x2="229" y2="95"/><line x1="235" y1="61" x2="235" y2="83"/><line x1="245" y1="61" x2="245" y2="83"/><line x1="252" y1="95" x2="272" y2="95"/></g><rect x="166" y="26" width="28" height="28" rx="5" fill="#6ED3DF"/><rect x="166" y="81" width="28" height="28" rx="5" fill="#F26B6B"/><rect x="166" y="136" width="28" height="28" rx="5" fill="#7DCB7D"/><g font-size="20" font-weight="700" fill="#1a1a1a" text-anchor="middle" dominant-baseline="central"><text x="78" y="52">H</text><text x="30" y="95">H</text><text x="78" y="95">N</text><text x="180" y="40">R</text><text x="180" y="95">C</text><text x="180" y="150">H</text><text x="240" y="50">O</text><text x="240" y="95">C</text><text x="292" y="95">OH</text></g><text x="67" y="138" text-anchor="middle" font-size="12" fill="#A0522D">Amino group</text><text x="267" y="138" text-anchor="middle" font-size="12" fill="#7B2D8E">Carboxyl group</text></svg></span>',
    'The <b>R group</b> is the <b>only part that differs</b> between amino acids; it determines the <b>identity</b>, <b>properties</b>, and <b>behaviour</b> of each amino acid.',
    'There are <b>20 standard amino acids</b> found in living organisms, plus <b>selenocysteine</b>, the 21st amino acid.',
    'Amino acids are classified by their <b>R group chemistry</b> into five categories: <b>nonpolar aliphatic</b>, <b>aromatic</b>, <b>polar uncharged</b>, <b>polar basic</b>, and <b>polar acidic.</b>',
    'They are also classified by <b>dietary requirement</b>: <b>9 are essential</b> (must be obtained from food) and the rest are <b>non-essential</b> (the body can synthesise them).'
  ]
};
