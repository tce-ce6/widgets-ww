/* ==========================================================================
   Population Lab (wg217) – Content Data
   All text content and data lives here. No logic.
   ========================================================================== */

window.WIDGET_DATA = {

  /* ---------- Insight overlay text ---------- */
  insight: {
    heading: 'Insight: the three stages',
    body: 'The birth rate is the number of babies born in a year for every 1,000 people. The death rate is the number of people who die in a year for every 1,000 people. As these two rates change, a country\'s population moves through three stages.',
    stages: [
      { label: 'Stage 1', key: 'High birth rate, high death rate',
        desc: 'Many babies are born, but many people also die. The population grows very slowly.' },
      { label: 'Stage 2', key: 'Death rate falls first, then birth rate',
        desc: 'Better healthcare helps people live longer, so deaths fall first. Families stay large for a while and then slowly get smaller. The population grows fast.' },
      { label: 'Stage 3', key: 'Birth rate and death rate are both low',
        desc: 'The two rates come close together. The population grows very slowly and may even start to shrink.' }
    ]
  },

  /* ---------- Stage "what to remember" characteristics ---------- */
  characteristics: {
    1: ['The birth rate and the death rate are both high.', 'Healthcare is poor, so the population grows very slowly.', 'India was in this stage from 1901 to 1921.'],
    2: ['The death rate falls first, because healthcare improves.', 'The birth rate stays high for a while and then starts to fall.', 'The gap between births and deaths is widest, so the population grows fast.'],
    3: ['The birth rate and the death rate are both low and close together.', 'Families are small and the population grows slowly.', 'The population may stop growing or even shrink, as in Italy, Japan and South Korea.']
  },

  /* ---------- Level 1: Read the graph ---------- */
  level1: {
    steps: [
      {
        kind: 'find',
        q: 'Move the marker to where the population grows fastest.',
        hint: 'Look at the shaded gap between the two lines. Where is it tallest?',
        good: 'The gap between the lines is widest here. Deaths have already fallen, but births have not started to fall yet, so the population grows fastest. This is Stage 2.',
        pos: 48,
        ok: function(v) { return window.WIDGET_HELPERS.gapAt(v) >= 0.62 && v <= 53; }
      },
      {
        kind: 'mcq',
        q: 'Look at the marker. How do the two lines compare here, and why is the shaded gap so big?',
        key: 1,
        opts: [
          { t: 'The birth rate has started to rise, while the death rate stays high',
            why: 'The birth rate does not rise. At this point it is still flat and high.' },
          { t: 'The death rate has already fallen, but the birth rate is still high',
            why: 'Deaths fell first because healthcare improved, while families stayed large. Many more people are born than die, so the gap is big.' },
          { t: 'Both rates have fallen, but the birth rate has fallen more slowly',
            why: 'The birth rate has not started to fall at this point. Only the death line has dropped.' },
          { t: 'The birth rate has fallen sharply, but the death rate is falling faster',
            why: 'The birth line is still flat here. It begins to fall only later.' }
        ]
      },
      {
        kind: 'find',
        q: 'Find where the population starts to shrink.',
        hint: 'A population shrinks when more people die than are born. Which line must be higher?',
        good: 'The death line is now above the birth line, so more people die than are born. This is the late part of Stage 3.',
        pos: 94,
        ok: function(v) { return window.WIDGET_HELPERS.gapAt(v) < 0; }
      },
      {
        kind: 'mcq',
        q: 'The two lines have crossed by the time the marker is here. What does this crossing tell us?',
        key: 2,
        opts: [
          { t: 'Births and deaths are equal here, so the population has stopped changing',
            why: 'Births and deaths are equal only at the exact point where the lines meet. Past that point deaths are higher than births.' },
          { t: 'The death rate has risen again because healthcare has become worse',
            why: 'Nothing shows the death rate rising. It is the birth rate that has fallen below it.' },
          { t: 'Births have fallen below deaths, so more people die than are born',
            why: 'Once the birth line is below the death line, the population loses people every year. It shrinks.' },
          { t: 'The birth rate has risen above the death rate, so the population grows again',
            why: 'It is the other way round. The birth line has fallen below the death line.' }
        ]
      },
      {
        kind: 'find',
        q: 'Find where the birth rate and death rate are both high and almost equal.',
        hint: 'Both lines must be near the top and very close together. Which end of the time line is that?',
        good: 'Both rates are high and almost equal, so the population hardly grows. This is Stage 1.',
        pos: 8,
        ok: function(v) { return v <= 14; }
      },
      {
        kind: 'mcq',
        q: 'Why is the shaded gap almost invisible at this position?',
        key: 3,
        opts: [
          { t: 'Births are very low, so very few people are added each year',
            why: 'Births are not low here. Both lines are near the top.' },
          { t: 'Both rates are low, so the population has settled and stays steady',
            why: 'Both lines are high here, not low.' },
          { t: 'Deaths are low and births are high, so growth is steady and slow',
            why: 'Deaths are not low here. If they were, the gap would be wide.' },
          { t: 'Both rates are high and almost equal, so deaths cancel out births',
            why: 'About as many people die as are born, so the population hardly grows.' }
        ]
      }
    ],
    summary: {
      badgeName: 'Graph Reader',
      max: 6,
      threshold: { badge: 1, gold: 5 },
      minAnswered: 5,
      msgs: {
        gold: 'Gold badge earned: Graph Reader.',
        badge: 'Badge earned: Graph Reader. Get 5 or more right on your own to make it gold.',
        none: 'Answer or reveal at least 5 of the 6 questions, and get at least one right, to earn the Graph Reader badge.'
      }
    }
  },

  /* ---------- Level 2: Name the stage ---------- */
  level2: {
    cases: [
      {
        name: 'Country P', pos: 36, answer: 2,
        ctx: 'Vaccines and clean water have arrived, so far fewer children die. Families are still large.',
        stats: [
          ['Births per 1,000 people', '38'],
          ['Deaths per 1,000 people', '11'],
          ['Fertility rate (children per woman)', '5.4'],
          ['Life expectancy (average years of life)', '61 years'],
          ['Median age (middle age of the people)', '18 years']
        ],
        key: 0,
        opts: [
          { t: 'Deaths are low (11) but births are still high (38)',
            why: 'Deaths fell first while births stayed high. That mismatch is the mark of Stage 2.' },
          { t: 'Life expectancy has risen to 61 years, a big improvement',
            why: 'True, but life expectancy keeps rising in later stages too, so it cannot tell Stage 2 from Stage 3.' },
          { t: 'The median age is only 18 years, so the people are young',
            why: 'A young population is found in Stage 1 and Stage 2, so age alone cannot place a country.' },
          { t: 'A death rate of 11 per 1,000 is still very high for any country',
            why: '11 is low when compared with the 30 to 40 of Stage 1. Deaths have already fallen.' }
        ]
      },
      {
        name: 'Country Q', pos: 92, answer: 3,
        ctx: 'The population has been falling for ten years, and the country is getting older.',
        stats: [
          ['Births per 1,000 people', '7'],
          ['Deaths per 1,000 people', '12'],
          ['Fertility rate (children per woman)', '1.3'],
          ['Life expectancy (average years of life)', '84 years'],
          ['Median age (middle age of the people)', '49 years']
        ],
        key: 1,
        opts: [
          { t: 'Life expectancy is 84 years, so people live very long lives',
            why: 'True, but long lives also appear in Stage 2, so this does not prove Stage 3.' },
          { t: 'Births (7) have fallen below deaths (12), and families are small',
            why: 'Stage 3 ends with births below deaths. Women have only 1.3 children, far below the 2.1 needed to keep a population steady.' },
          { t: 'The median age is 49, so the people are mostly old',
            why: 'An older population is a result of fewer births. It does not by itself prove the stage.' },
          { t: 'A death rate of 12 per 1,000 shows that healthcare is poor',
            why: 'Not correct. In an older population more people die each year, even when healthcare is very good.' }
        ]
      },
      {
        name: 'Country R', pos: 6, answer: 1,
        ctx: 'Diseases and food shortages are common. Few people can read and write.',
        stats: [
          ['Births per 1,000 people', '42'],
          ['Deaths per 1,000 people', '40'],
          ['Fertility rate (children per woman)', '6.2'],
          ['Life expectancy (average years of life)', '32 years'],
          ['Median age (middle age of the people)', '19 years']
        ],
        key: 2,
        opts: [
          { t: 'The fertility rate is 6.2 children per woman, which is very high',
            why: 'Families are large in Stage 2 as well, so this cannot tell the stages apart.' },
          { t: 'Births are very high, so the population is growing fast',
            why: 'Deaths are almost as high as births, so the gap is tiny and growth is very slow.' },
          { t: 'Births (42) and deaths (40) are both very high and almost equal',
            why: 'A tiny gap means the population hardly grows. This is Stage 1.' },
          { t: 'The median age is 19 years, so the people are young',
            why: 'A young population is also found in Stage 2, so age alone cannot place a country.' }
        ]
      },
      {
        name: 'Country S', pos: 86, answer: 3,
        ctx: 'The population is still growing, but more slowly with every decade.',
        stats: [
          ['Fertility rate (children per woman)', '1.9'],
          ['Life expectancy (average years of life)', '70 years'],
          ['Median age (middle age of the people)', '28 years'],
          ['Deaths of children under 5, per 1,000 births', '28 (it was 271)'],
          ['Population', 'Still growing']
        ],
        key: 0,
        opts: [
          { t: 'Families are small (1.9 children each) and child deaths are low',
            why: '1.9 is below the 2.1 needed to keep a population steady, and child deaths fell from 271 to 28 per 1,000. This is Stage 3.' },
          { t: 'The population is still growing every year, which points to Stage 2',
            why: 'Growth can go on for some time after families become smaller, so growth alone does not mean Stage 2.' },
          { t: 'Life expectancy is 70 years, which is quite a long life',
            why: 'It shows that deaths are low, but this also fits Stage 2.' },
          { t: 'The median age is 28 years, so the people are still young',
            why: 'True, but a young population does not decide the stage.' }
        ]
      }
    ],
    summary: {
      badgeName: 'Stage Detective',
      max: 8,
      threshold: { badge: 1, gold: 6 },
      minAnswered: 3,
      msgs: {
        gold: 'Gold badge earned: Stage Detective.',
        badge: 'Badge earned: Stage Detective. Score 6 or more on your own to make it gold.',
        none: 'Answer or reveal at least 3 of the 4 cases, and get at least one right, to earn the Stage Detective badge.'
      }
    }
  },

  /* ---------- Level 3: Advise the minister ---------- */
  level3: {
    rounds: [
      {
        at: 6, after: 36, key: 1,
        brief: 'Country X is in trouble. Many children die from diseases like malaria and diarrhoea. Few people can read, and the population hardly grows.',
        q: 'What should the government do first to help people live longer?',
        opts: [
          { t: 'Build more large hospitals in the biggest cities',
            why: 'Hospitals treat illness, but most of these deaths come from diseases that vaccines and clean water prevent.' },
          { t: 'Give vaccines and improve water and sanitation',
            why: 'Fewer children die of diseases like malaria and diarrhoea, so the death rate falls and Country X moves into Stage 2.' },
          { t: 'Open more schools in every district of the country',
            why: 'Education helps in the long run, but it does not quickly stop children dying of disease.' },
          { t: 'Run a nationwide campaign for smaller families',
            why: 'This aims at births. The question is about helping people live longer, and that depends on deaths falling first.' }
        ]
      },
      {
        at: 36, after: 70, key: 3,
        brief: 'Healthcare has improved and far fewer people die. But families are still large, the population is growing fast, and schools and jobs are stretched.',
        q: 'What will slowly bring the birth rate down?',
        opts: [
          { t: 'Give every family free healthcare for the year',
            why: 'Healthcare lowers deaths, not births. With births unchanged, the population grows even faster.' },
          { t: 'Create many more factory jobs for young men',
            why: 'Jobs help the economy, but they do not directly change how many children families decide to have.' },
          { t: 'Open more health clinics in remote villages',
            why: 'Clinics lower deaths. With births unchanged, the gap widens and growth speeds up.' },
          { t: 'Educate more girls and open up jobs for women',
            why: 'Women who study and work usually marry later and have fewer children, so the birth rate starts to fall.' }
        ]
      },
      {
        at: 70, after: 88, key: 2,
        brief: 'Births are falling and most people are now of working age. Many women work, but find it hard to manage both a job and housework.',
        q: 'How can Country X make the most of its large working-age group?',
        opts: [
          { t: 'Lower the retirement age to open up jobs for the young',
            why: 'This shrinks the workforce and adds to the number of people who depend on others.' },
          { t: 'Spend most of the budget on factories and machines',
            why: 'Machines help, but people need skills and good health to use them. A large workforce without these wastes the chance.' },
          { t: 'Invest in skills, health and childcare centres',
            why: 'A skilled, healthy workforce with childcare support lets more people work, and that turns a large working-age group into progress.' },
          { t: 'Encourage young workers to look for jobs abroad',
            why: 'Some migration is normal, but the gain comes from building skills and jobs at home.' }
        ]
      },
      {
        at: 88, after: 94, key: 0,
        brief: 'Many years later, few babies are born and people live much longer. Soon there will be fewer workers and more older people.',
        q: 'What should the country get ready for?',
        opts: [
          { t: 'Plan more care and pensions, and cover for fewer workers',
            why: 'Japan has done this, raising its retirement age and using technology. An ageing country must care for older people and still keep its economy productive.' },
          { t: 'Build many more schools and maternity wards for children',
            why: 'Few babies are being born, so the number of children is falling, not growing.' },
          { t: 'Cut healthcare and pension spending to save public money',
            why: 'Older people need more healthcare and pensions, not less.' },
          { t: 'Let older people leave work early to open up jobs for youth',
            why: 'This leaves fewer workers to support more older people, which makes the problem worse.' }
        ]
      }
    ],
    summary: {
      badgeName: 'Policy Advisor',
      max: 8,
      threshold: { badge: 1, gold: 6 },
      minAnswered: 3,
      msgs: {
        gold: 'Gold badge earned: Policy Advisor.',
        badge: 'Badge earned: Policy Advisor. Score 6 or more on your own to make it gold.',
        none: 'Answer or reveal at least 3 of the 4 rounds, and get at least one right, to earn the Policy Advisor badge.'
      }
    }
  }

};

/* Expose curve helpers used by content-data ok functions */
window.WIDGET_HELPERS = {
  smooth: function(x, a, b) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  },
  birth: function(t) {
    return 0.2 + 0.68 * (1 - window.WIDGET_HELPERS.smooth(t, 0.54, 0.94));
  },
  death: function(t) {
    return 0.24 + 0.62 * (1 - window.WIDGET_HELPERS.smooth(t, 0.16, 0.46));
  },
  gapAt: function(v) {
    var t = v / 100;
    return window.WIDGET_HELPERS.birth(t) - window.WIDGET_HELPERS.death(t);
  }
};
