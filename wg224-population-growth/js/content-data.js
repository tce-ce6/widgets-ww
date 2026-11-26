/* Population Growth with Unlimited and Limited Resources (wg224): all on-screen text. */
window.POP_CONTENT = {
  /* Example values the Help tour fills in on a card screen. */
  demo: {
    exp: { N: '10', r: '0.5' },
    log: { N: '10', r: '0.4', K: '200' }
  },

  instr: {
    exp: {
      step1: '<b>Step 1.</b> Enter the starting population size and the growth rate below.',
      step2: '<b>Step 2.</b> Tap &ldquo;Next year&rdquo; to move the population forward one year at a time.',
      good: '<b>Good.</b> The population grew by r &times; N this year. Keep tapping to watch the J-shape form.',
      notice: '<b>Notice</b> how the amount added each year keeps getting larger. This is exponential growth.',
      observe: '<b>Observe:</b> The curve keeps climbing with no ceiling. This is what happens when resources are unlimited.',
      tooBig: '<b>The population has grown beyond what can be shown.</b> Tap Reset to try new numbers.'
    },
    log: {
      step1: '<b>Step 1.</b> Enter the starting population, the growth rate, and the carrying capacity below.',
      step2: '<b>Step 2.</b> Tap &ldquo;Next year&rdquo; to move the population forward one year at a time.',
      notice: '<b>Notice</b> the braking term (K&minus;N)/K in the calculation below. It is close to 1 now, so growth is still fast.',
      fast: '<b>The population is growing quickly.</b> The braking term (K&minus;N)/K = {room}. There is still plenty of room.',
      slowing: '<b>Growth is slowing down.</b> The braking term is now {room}. Less room means less growth each year.',
      almost: '<b>Almost at K.</b> The braking term is nearly zero. Very little is added each year now.',
      reached: 'As the population has reached K, growth has stopped.'
    }
  },

  errors: {
    fillTwo: 'Fill in both boxes.',
    fillThree: 'Fill in all three boxes.',
    numbers: 'Please type numbers only.',
    n: 'Starting population must be a whole number of at least 1.',
    r: 'r must be between 0.01 and 2.',
    k: 'K must be between 20 and 5000.',
    nk: 'Starting N must be less than K.'
  },

  insights: [
    'When <b>resources are unlimited</b>, a population grows in an <b>exponential</b> or <b>geometric</b> fashion, producing a <b>J-shaped curve</b> when population density (N) is plotted against time.',
    'The rate of growth is described by <b>dN/dt = rN</b>, where <b>r</b> is the <b>intrinsic rate of natural increase</b> &mdash; the difference between the per capita birth rate and the per capita death rate.',
    '<b>r = b &minus; d</b>, where <b>b</b> is the per capita birth rate and <b>d</b> is the per capita death rate. A higher r means faster growth.',
    'No population can grow exponentially forever. In nature, food and space are <b>finite</b> and become <b>limiting</b> over time.',
    'When resources are limited, growth slows down as the population approaches the <b>carrying capacity (K)</b> &mdash; the maximum number of individuals the habitat can support.',
    'The rate of growth under limited resources is described by <b>dN/dt = rN(K&minus;N)/K</b>. The term <b>(K&minus;N)/K</b> acts as a <b>braking factor</b> &mdash; it gets smaller as N approaches K, slowing growth.',
    'A plot of N against time under limited resources produces an <b>S-shaped</b> or <b>sigmoid curve</b>, also called <b>Verhulst-Pearl Logistic Growth</b>.',
    'Growth is fastest when <b>N = K/2</b> &mdash; the midpoint of the S-curve. Above this point, the braking factor dominates and growth decelerates.',
    '<b>The logistic growth model</b> is considered more realistic because resources in nature are always finite and become limiting sooner or later.'
  ],

  /* Help tour. `sel` is what the spotlight covers; `demo` runs on that step during a first-visit demo. */
  tours: {
    start: [
      { sel: null, title: 'Welcome', text: 'This tour shows how the widget works.' },
      { sel: '.mode-card, .mode-icon', title: 'Choose a condition', text: 'Choose a condition to open its simulation.' },
      { sel: '#insightsBtn', title: 'Insights', text: '<b>Insights</b> gives a quick recap.' },
      { sel: '#helpBtn', title: 'Help', text: 'Tap <b>Help</b> to replay the tour for any screen.' }
    ],
    exp: [
      { sel: '#expInstr', title: 'Guide strip', text: 'This line tells you what to do next.' },
      { sel: '#expInputs .field', title: 'Enter values', text: 'Enter N₀ and r.', demoText: ' Example values are filled in.', demo: 'fill' },
      { sel: '#expPlot', title: 'Plot the graph', text: 'Tap <b>Plot graph</b>.' },
      { sel: '#expGraph', title: 'Read the graph', text: 'The dot shows the population each year.', demo: 'plot' },
      { sel: '#expCalc, #expSteps .pill-btn', title: 'Step through time', text: '<b>Next year</b> adds one year and shows the working. <b>Skip 5 years</b> jumps ahead. <b>Reset</b> starts over.', demo: 'advance' },
      { sel: '#homeBtn', title: 'Home', text: '<b>Home</b> takes you back to choose a condition.' }
    ],
    log: [
      { sel: '#logInstr', title: 'Guide strip', text: 'This line tells you what to do next.' },
      { sel: '#logInputs .field', title: 'Enter values', text: 'Enter N₀, r and K.', demoText: ' Example values are filled in.', demo: 'fill' },
      { sel: '#logPlot', title: 'Plot the graph', text: 'Tap <b>Plot graph</b>.' },
      { sel: '#logGraph', title: 'Read the graph', text: 'The dot shows the population each year. The dashed line is K.', demo: 'plot' },
      { sel: '#logCalc, #logSteps .pill-btn', title: 'Step through time', text: '<b>Next year</b> adds one year and shows the working. <b>Skip 5 years</b> jumps ahead. <b>Reset</b> starts over.', demo: 'advance' },
      { sel: '#logCalc', title: 'Braking term', text: '(K−N)/K is the braking term. It shrinks as N nears K.', demo: 'advance' },
      { sel: '#homeBtn', title: 'Home', text: '<b>Home</b> takes you back to choose a condition.' }
    ]
  }
};
