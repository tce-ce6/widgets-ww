const width = 1920;
const height = 1080;

const challenges = [
  {
    screen: "act-02",
    num: 1,
    item1: "Rice",
    item2: "Clothes",
    item1Val: 2,
    item2Val: 4,
    item1Max: 10,
    item2Max: 10,
  },
  {
    screen: "act-02",
    num: 2,
    item1: "Pot",
    item2: "Medical treatment",
    item1Val: 1,
    item2Val: 3,
    item1Max: 15,
    item2Max: 15,
  },
  {
    screen: "act-02",
    num: 3,
    item1: "Fish basket",
    item2: "Plough",
    item1Val: 3,
    item2Val: 4,
    item1Max: 15,
    item2Max: 15,
  },
];

// Instead of reading coordinates, we will use JS on the actual page to find placeholder bounding boxes, OR we can just manually put approx percentages.
// However, the best way to handle dropdowns in SVG without fighting is to define a UI-layer div and absolutely position 2 HTML `<select>` elements per challenge.
