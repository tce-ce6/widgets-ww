/* Find the Market Price (wg184): all on-screen text that changes while the widget runs. */
window.MARKET_PRICE_CONTENT = {
  sub: {
    short: (gap) => `Excess demand: shortage of ${gap}`,
    surplus: (gap) => `Excess supply: surplus of ${gap}`,
    eq: 'Market equilibrium',
  },

  find: {
    newPrice: 'New price set. Open the market to run the next day.',
    dayCount: (days) => `Market days run: ${days}`,
    cleared: (day, p, qd, qs) => `Day ${day}: the market clears at ₹${p}. Qd = ${qd} and Qs = ${qs}. No excess demand, no excess supply, and no pressure on the price to move.`,
    short: (day, p, qd, qs, gap) => `Day ${day}: Qs < Qd at ₹${p} (Qd = ${qd}, Qs = ${qs}). Excess demand of ${gap}. Buyers competing for scarce plates would bid the price up. Try a higher price tomorrow.`,
    surplus: (day, p, qd, qs, gap) => `Day ${day}: Qs > Qd at ₹${p} (Qs = ${qs}, Qd = ${qd}). Excess supply of ${gap}. Sellers left with unsold momos would cut the price. Try a lower price tomorrow.`,
    settled: (p) => `Watch what happened: wherever the price starts, excess demand pulls it up and excess supply pushes it down, until it comes to rest at ₹${p}, where Qs = Qd. That is why economists call it equilibrium.`,
  },

  explain: {
    answer: 'down',
    options: [
      { id: 'up', text: 'The price keeps rising' },
      { id: 'down', text: 'The price gets pushed down' },
      { id: 'stay', text: 'The price stays at ₹90' },
    ],
    right: { head: 'Correct.', text: 'At ₹90, Qs is 90 but Qd is only 30: Qs > Qd, excess supply of 60. Sellers left with unsold momos undercut each other, and the price falls back towards ₹70.' },
    wrong: { head: 'Not quite.', text: 'At ₹90, Qs is 90 but Qd is only 30: Qs > Qd, excess supply of 60. Sellers undercut each other, so the price gets pushed down towards ₹70.' },
  },

  news: {
    edition: (n, total) => `Edition ${n} of ${total}`,
    /* The order here is fixed: the correct answers land on all four positions. */
    shifts: [
      { id: 'dR', text: 'Demand shifts right', side: 'demand' },
      { id: 'dL', text: 'Demand shifts left', side: 'demand' },
      { id: 'sR', text: 'Supply shifts right', side: 'supply' },
      { id: 'sL', text: 'Supply shifts left', side: 'supply' },
    ],
    prices: [
      { id: 'up', text: 'It rises', side: 'demand' },
      { id: 'down', text: 'It falls', side: 'supply' },
    ],
    rightCall: 'Right call.\nNow, before the graph prints, one more prediction.',
    wrongPrice: {
      up: 'Think about the gap at the old price of ₹70: the shift creates excess demand there, and excess demand bids the price up. Choose again.',
      down: 'Think about the gap at the old price of ₹70: the shift creates excess supply there, and excess supply pushes the price down. Choose again.',
    },
    nextText: 'Next headline',
    lastText: 'Close the news desk',
    cards: [
      {
        head: 'Momo video goes viral:\nqueues down the street',
        stand: 'A famous food vlogger posts a late-night video of this street’s momos. By morning, everyone in the city wants a plate. Nothing has changed for the sellers.',
        shift: 'dR',
        toDemand: 30,
        toSupply: 0,
        price: 'up',
        newEq: { p: 80, q: 70 },
        why: {
          dL: 'The video makes momos more popular, not less. Fewer buyers would mean demand falling, which is the opposite of a viral craze.',
          sR: 'The video changes what buyers want. Sellers’ costs, machines, and numbers are untouched, so the supply curve has no reason to move.',
          sL: 'Nothing became harder or dearer to produce. Sellers can make exactly as many momos as before, so supply does not shift.',
        },
        reveal: 'Demand shifts right by 30 plates at every price. The old price ₹70 now has excess demand, so the price is bid up until the market clears again at E′: ₹80 and 70 plates. Price up, quantity up.',
      },
      {
        head: 'Flour and cooking gas prices double overnight',
        stand: 'Every stall on the street pays more for its ingredients and fuel from today. Buyers’ tastes and incomes are unchanged.',
        shift: 'sL',
        toDemand: 0,
        toSupply: -30,
        price: 'up',
        newEq: { p: 80, q: 40 },
        why: {
          dR: 'Buyers’ appetite for momos has not changed. Costs hit the sellers’ side of the market, not the buyers’ willingness to buy.',
          dL: 'No buyer wants momos less because flour costs the stall more. The change lands on sellers, so it is the supply curve that moves.',
          sR: 'Higher input costs make each plate less profitable, so sellers offer fewer plates at every price, not more. Supply moves left, not right.',
        },
        reveal: 'Supply shifts left by 30 plates at every price. At the old ₹70 there is now excess demand, so the price rises until the market clears at E′: ₹80 and 40 plates. Price up, quantity down.',
      },
      {
        head: 'Ten new momo stalls open on the same street',
        stand: 'A cooking institute’s graduates all set up stalls here this month. Buyers are the same people with the same tastes as before.',
        shift: 'sR',
        toDemand: 0,
        toSupply: 30,
        price: 'down',
        newEq: { p: 60, q: 60 },
        why: {
          dR: 'The number of buyers and their tastes are unchanged. More sellers is a supply-side change, so the demand curve stays put.',
          dL: 'Nothing has made buyers want fewer momos. The change is on the sellers’ side of the market.',
          sL: 'More stalls means more plates offered at every price, not fewer. Supply moves right, not left.',
        },
        reveal: 'Supply shifts right by 30 plates at every price. At the old ₹70 there is now excess supply, so sellers undercut each other until the market clears at E′: ₹60 and 60 plates. Price down, quantity up.',
      },
      {
        head: 'Health scare rumour spreads about street food',
        stand: 'A rumour, later proven false, makes many buyers avoid street food this week. The stalls’ costs and capacity are unchanged.',
        shift: 'dL',
        toDemand: -30,
        toSupply: 0,
        price: 'down',
        newEq: { p: 60, q: 30 },
        why: {
          dR: 'A scare makes buyers want fewer momos at every price, not more. Demand moves left, not right.',
          sR: 'Sellers can produce exactly as before; nothing became cheaper or easier. The change is in buyers’ willingness to buy.',
          sL: 'The stalls’ costs and capacity are unchanged, so supply has no reason to move. The rumour works on the buyers.',
        },
        reveal: 'Demand shifts left by 30 plates at every price. At the old ₹70 there is now excess supply, so the price falls until the market clears at E′: ₹60 and 30 plates. Price down, quantity down.',
      },
    ],
  },
};
