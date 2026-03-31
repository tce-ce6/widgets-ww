document.addEventListener("DOMContentLoaded", () => {
  // ===== DATA =====
  // const vowelTeams = {
  //   ai: {
  //     sound: "long A",
  //     soundDisplay: "ā",
  //     rule: "ai usually comes in the middle of words",
  //     partner: "ay",
  //     words: [
  //       { word: "rain", hint: "r__n", clue: "Falls from clouds" },
  //       { word: "train", hint: "tr__n", clue: "Runs on tracks" },
  //       { word: "paint", hint: "p__nt", clue: "Use with a brush" },
  //       { word: "tail", hint: "t__l", clue: "Dogs wag this" },
  //       { word: "mail", hint: "m__l", clue: "Letters you receive" },
  //       { word: "snail", hint: "sn__l", clue: "Slow with a shell" },
  //       { word: "wait", hint: "w__t", clue: "Stay and be patient" },
  //       { word: "brain", hint: "br__n", clue: "You think with this" },
  //       { word: "chain", hint: "ch__n", clue: "Metal links" },
  //       { word: "plain", hint: "pl__n", clue: "Simple, not fancy" },
  //     ],
  //     distractors: ["ran", "ten", "pin", "cat", "bed"],
  //   },
  //   ay: {
  //     sound: "long A",
  //     soundDisplay: "ā",
  //     rule: "ay usually comes at the end of words",
  //     partner: "ai",
  //     words: [
  //       { word: "play", hint: "pl__", clue: "Have fun" },
  //       { word: "day", hint: "d__", clue: "24 hours" },
  //       { word: "say", hint: "s__", clue: "Speak words" },
  //       { word: "way", hint: "w__", clue: "A path or method" },
  //       { word: "stay", hint: "st__", clue: "Remain here" },
  //       { word: "pay", hint: "p__", clue: "Give money" },
  //       { word: "may", hint: "m__", clue: "Perhaps" },
  //       { word: "hay", hint: "h__", clue: "Horses eat this" },
  //       { word: "tray", hint: "tr__", clue: "Carry plates on this" },
  //       { word: "gray", hint: "gr__", clue: "Color between black and white" },
  //     ],
  //     distractors: ["pal", "sad", "map", "bag", "ran"],
  //   },
  //   ea: {
  //     sound: "long E",
  //     soundDisplay: "ē",
  //     rule: "ea makes the long E sound",
  //     partner: "ee",
  //     words: [
  //       { word: "eat", hint: "__t", clue: "Chew and swallow food" },
  //       { word: "leaf", hint: "l__f", clue: "Grows on trees" },
  //       { word: "seat", hint: "s__t", clue: "A place to sit" },
  //       { word: "dream", hint: "dr__m", clue: "You have this when sleeping" },
  //       { word: "clean", hint: "cl__n", clue: "Not dirty" },
  //       { word: "peach", hint: "p__ch", clue: "A soft sweet fruit" },
  //       { word: "cheap", hint: "ch__p", clue: "Does not cost much" },
  //       { word: "steam", hint: "st__m", clue: "Hot water makes this" },
  //       { word: "feast", hint: "f__st", clue: "A big meal" },
  //       { word: "least", hint: "l__st", clue: "The smallest amount" },
  //     ],
  //     distractors: ["bed", "pet", "red", "leg", "hen"],
  //   },
  //   ee: {
  //     sound: "long E",
  //     soundDisplay: "ē",
  //     rule: "ee makes the long E sound",
  //     partner: "ea",
  //     words: [
  //       { word: "bee", hint: "b__", clue: "Makes honey" },
  //       { word: "tree", hint: "tr__", clue: "Has leaves and branches" },
  //       { word: "free", hint: "fr__", clue: "No cost" },
  //       { word: "green", hint: "gr__n", clue: "Color of grass" },
  //       { word: "sleep", hint: "sl__p", clue: "Rest at night" },
  //       { word: "keep", hint: "k__p", clue: "Hold onto" },
  //       { word: "deep", hint: "d__p", clue: "Far down" },
  //       { word: "creep", hint: "cr__p", clue: "Move slowly and quietly" },
  //       { word: "cheek", hint: "ch__k", clue: "Part of your face" },
  //       { word: "speed", hint: "sp__d", clue: "How fast you go" },
  //     ],
  //     distractors: ["set", "wet", "pen", "yes", "egg"],
  //   },
  //   oa: {
  //     buildAlt: "oo",
  //     sound: "long O",
  //     soundDisplay: "ō",
  //     rule: "oa usually comes in the middle of words",
  //     partner: null,
  //     words: [
  //       { word: "boat", hint: "b__t", clue: "Floats on water" },
  //       { word: "coat", hint: "c__t", clue: "Wear when cold" },
  //       { word: "goat", hint: "g__t", clue: 'Says "maa"' },
  //       { word: "road", hint: "r__d", clue: "Cars drive on this" },
  //       { word: "toad", hint: "t__d", clue: "Like a frog" },
  //       { word: "soap", hint: "s__p", clue: "Wash with this" },
  //       { word: "load", hint: "l__d", clue: "Heavy things to carry" },
  //       { word: "float", hint: "fl__t", clue: "Stay on top of water" },
  //       { word: "toast", hint: "t__st", clue: "Crispy bread" },
  //       { word: "coach", hint: "c__ch", clue: "Trains a team" },
  //     ],
  //     distractors: ["got", "hot", "dog", "top", "box"],
  //   },
  //   oo: {
  //     display: "oo",
  //     buildAlt: "oa",
  //     sound: "long OO",
  //     soundDisplay: "ōō",
  //     rule: 'oo makes the long "oo" sound like in moon',
  //     partner: null,
  //     words: [
  //       { word: "moon", hint: "m__n", clue: "Shines at night" },
  //       { word: "soon", hint: "s__n", clue: "In a short time" },
  //       { word: "food", hint: "f__d", clue: "What you eat" },
  //       { word: "cool", hint: "c__l", clue: "A bit cold" },
  //       { word: "pool", hint: "p__l", clue: "Swim in this" },
  //       { word: "school", hint: "sch__l", clue: "Where you learn" },
  //       { word: "room", hint: "r__m", clue: "Part of a house" },
  //       { word: "broom", hint: "br__m", clue: "Sweep the floor" },
  //       { word: "spoon", hint: "sp__n", clue: "Eat soup with this" },
  //       { word: "tooth", hint: "t__th", clue: "In your mouth" },
  //     ],
  //     distractors: ["book", "good", "foot", "wood", "cook"],
  //   },
  //   oo_short: {
  //     display: "oo",
  //     buildAlt: "oa",
  //     sound: "short OO",
  //     soundDisplay: "ʊ",
  //     rule: "oo can also make a short sound like in book",
  //     partner: null,
  //     words: [
  //       { word: "book", hint: "b__k", clue: "You read this" },
  //       { word: "cook", hint: "c__k", clue: "Make food" },
  //       { word: "good", hint: "g__d", clue: "Not bad" },
  //       { word: "foot", hint: "f__t", clue: "At the end of your leg" },
  //       { word: "wood", hint: "w__d", clue: "Trees are made of this" },
  //       { word: "look", hint: "l__k", clue: "Use your eyes" },
  //       { word: "took", hint: "t__k", clue: "Past tense of take" },
  //       { word: "hook", hint: "h__k", clue: "Hang things on this" },
  //       { word: "stood", hint: "st__d", clue: "Past tense of stand" },
  //       { word: "wool", hint: "w__l", clue: "Sheep give us this" },
  //     ],
  //     distractors: ["moon", "food", "pool", "cool", "soon"],
  //   },
  //   ue: {
  //     buildAlt: "ea",
  //     sound: "long U",
  //     soundDisplay: "ū",
  //     rule: "ue usually comes at the end of words",
  //     partner: null,
  //     words: [
  //       { word: "blue", hint: "bl__", clue: "Color of the sky" },
  //       { word: "true", hint: "tr__", clue: "Not false" },
  //       { word: "glue", hint: "gl__", clue: "Stick things together" },
  //       { word: "clue", hint: "cl__", clue: "Helps solve a mystery" },
  //       { word: "due", hint: "d__", clue: "Expected or owed" },
  //       { word: "cue", hint: "c__", clue: "A signal to start" },
  //       { word: "sue", hint: "s__", clue: "Take to court" },
  //       { word: "flue", hint: "fl__", clue: "Chimney pipe" },
  //     ],
  //     distractors: ["cup", "bus", "fun", "run", "sun"],
  //   },
  // };
  const vowelTeams = {
    ai: {
      sound: "long A",
      soundDisplay: "ā",
      rule: "ai usually comes in the middle of words",
      partner: "ay",
      words: [
        { word: "rain", hint: "r__n", clue: "Falls from clouds" },
        { word: "train", hint: "tr__n", clue: "Runs on tracks" },
        { word: "paint", hint: "p__nt", clue: "Use with a brush" },
        { word: "tail", hint: "t__l", clue: "Dogs wag this" },
        { word: "mail", hint: "m__l", clue: "Letters you receive" },
        { word: "snail", hint: "sn__l", clue: "Slow with a shell" },
        { word: "wait", hint: "w__t", clue: "Stay and be patient" },
        { word: "brain", hint: "br__n", clue: "You think with this" },
        { word: "chain", hint: "ch__n", clue: "Metal links" },
        { word: "plain", hint: "pl__n", clue: "Simple, not fancy" },
      ],
      distractors: ["ran", "ten", "pin", "cat", "bed"],
      // Phase-specific lists (for easy use in different sections)
      meet: ["rain", "train", "paint"],
      build: ["rain", "train", "paint", "tail", "mail"],
      spotTeam: ["rain", "train", "paint", "tail"],
      spotDistractors: ["ran", "ten", "pin"],
      compareSelf: ["rain", "train", "paint"],
      comparePartner: ["play", "day", "say"],
    },

    ay: {
      sound: "long A",
      soundDisplay: "ā",
      rule: "ay usually comes at the end of words",
      partner: "ai",
      words: [
        { word: "play", hint: "pl__", clue: "Have fun" },
        { word: "day", hint: "d__", clue: "24 hours" },
        { word: "say", hint: "s__", clue: "Speak words" },
        { word: "way", hint: "w__", clue: "A path or method" },
        { word: "stay", hint: "st__", clue: "Remain here" },
        { word: "pay", hint: "p__", clue: "Give money" },
        { word: "may", hint: "m__", clue: "Perhaps" },
        { word: "hay", hint: "h__", clue: "Horses eat this" },
        { word: "tray", hint: "tr__", clue: "Carry plates on this" },
        { word: "gray", hint: "gr__", clue: "Color between black and white" },
      ],
      distractors: ["pal", "sad", "map", "bag", "ran"],
      meet: ["play", "day", "say"],
      build: ["play", "day", "say", "way", "stay"],
      spotTeam: ["play", "day", "say", "way"],
      spotDistractors: ["pal", "sad", "map"],
      compareSelf: ["play", "day", "say"],
      comparePartner: ["rain", "train", "paint"],
    },

    ea: {
      sound: "long E",
      soundDisplay: "ē",
      rule: "ea makes the long E sound",
      partner: "ee",
      words: [
        { word: "eat", hint: "__t", clue: "Chew and swallow food" },
        { word: "leaf", hint: "l__f", clue: "Grows on trees" },
        { word: "seat", hint: "s__t", clue: "A place to sit" },
        { word: "dream", hint: "dr__m", clue: "You have this when sleeping" },
        { word: "clean", hint: "cl__n", clue: "Not dirty" },
        { word: "peach", hint: "p__ch", clue: "A soft sweet fruit" },
        { word: "cheap", hint: "ch__p", clue: "Does not cost much" },
        { word: "steam", hint: "st__m", clue: "Hot water makes this" },
        { word: "feast", hint: "f__st", clue: "A big meal" },
        { word: "least", hint: "l__st", clue: "The smallest amount" },
      ],
      distractors: ["bed", "pet", "red", "leg", "hen"],
      meet: ["eat", "leaf", "seat"],
      build: ["eat", "leaf", "seat", "dream", "clean"],
      spotTeam: ["eat", "leaf", "seat", "dream"],
      spotDistractors: ["bed", "pet", "red"],
      compareSelf: ["eat", "leaf", "seat"],
      comparePartner: ["bee", "tree", "free"],
    },

    ee: {
      sound: "long E",
      soundDisplay: "ē",
      rule: "ee makes the long E sound",
      partner: "ea",
      words: [
        { word: "bee", hint: "b__", clue: "Makes honey" },
        { word: "tree", hint: "tr__", clue: "Has leaves and branches" },
        { word: "free", hint: "fr__", clue: "No cost" },
        { word: "green", hint: "gr__n", clue: "Color of grass" },
        { word: "sleep", hint: "sl__p", clue: "Rest at night" },
        { word: "keep", hint: "k__p", clue: "Hold onto" },
        { word: "deep", hint: "d__p", clue: "Far down" },
        { word: "creep", hint: "cr__p", clue: "Move slowly and quietly" },
        { word: "cheek", hint: "ch__k", clue: "Part of your face" },
        { word: "speed", hint: "sp__d", clue: "How fast you go" },
      ],
      distractors: ["set", "wet", "pen", "yes", "egg"],
      meet: ["bee", "tree", "free"],
      build: ["bee", "tree", "free", "green", "sleep"],
      spotTeam: ["bee", "tree", "free", "green"],
      spotDistractors: ["set", "wet", "pen"],
      compareSelf: ["bee", "tree", "free"],
      comparePartner: ["eat", "leaf", "seat"],
    },

    oa: {
      buildAlt: "oo",
      sound: "long O",
      soundDisplay: "ō",
      rule: "oa usually comes in the middle of words",
      partner: null,
      words: [
        { word: "boat", hint: "b__t", clue: "Floats on water" },
        { word: "coat", hint: "c__t", clue: "Wear when cold" },
        { word: "goat", hint: "g__t", clue: 'Says "maa"' },
        { word: "road", hint: "r__d", clue: "Cars drive on this" },
        { word: "toad", hint: "t__d", clue: "Like a frog" },
        { word: "soap", hint: "s__p", clue: "Wash with this" },
        { word: "load", hint: "l__d", clue: "Heavy things to carry" },
        { word: "float", hint: "fl__t", clue: "Stay on top of water" },
        { word: "toast", hint: "t__st", clue: "Crispy bread" },
        { word: "coach", hint: "c__ch", clue: "Trains a team" },
      ],
      distractors: ["got", "hot", "dog", "top", "box"],
      meet: ["boat", "coat", "goat"],
      build: ["boat", "coat", "goat", "road", "toad"],
      spotTeam: ["boat", "coat", "goat", "road"],
      spotDistractors: ["got", "hot", "dog"],
      // No compare for oa
    },

    oo: {
      display: "oo",
      buildAlt: "oa",
      sound: "long OO",
      soundDisplay: "ōō",
      rule: 'oo makes the long "oo" sound like in moon',
      partner: null,
      words: [
        { word: "moon", hint: "m__n", clue: "Shines at night" },
        { word: "soon", hint: "s__n", clue: "In a short time" },
        { word: "food", hint: "f__d", clue: "What you eat" },
        { word: "cool", hint: "c__l", clue: "A bit cold" },
        { word: "pool", hint: "p__l", clue: "Swim in this" },
        { word: "school", hint: "sch__l", clue: "Where you learn" },
        { word: "room", hint: "r__m", clue: "Part of a house" },
        { word: "broom", hint: "br__m", clue: "Sweep the floor" },
        { word: "spoon", hint: "sp__n", clue: "Eat soup with this" },
        { word: "tooth", hint: "t__th", clue: "In your mouth" },
      ],
      distractors: ["book", "good", "foot", "wood", "cook"],
      meet: ["moon", "soon", "food"],
      build: ["moon", "soon", "food", "cool", "pool"],
      spotTeam: ["moon", "soon", "food", "cool"],
      spotDistractors: ["book", "good", "foot"],
      // No compare for long oo
    },

    oo_short: {
      display: "oo",
      buildAlt: "oa",
      sound: "short OO",
      soundDisplay: "ʊ",
      rule: "oo can also make a short sound like in book",
      partner: null,
      words: [
        { word: "book", hint: "b__k", clue: "You read this" },
        { word: "cook", hint: "c__k", clue: "Make food" },
        { word: "good", hint: "g__d", clue: "Not bad" },
        { word: "foot", hint: "f__t", clue: "At the end of your leg" },
        { word: "wood", hint: "w__d", clue: "Trees are made of this" },
        { word: "look", hint: "l__k", clue: "Use your eyes" },
        { word: "took", hint: "t__k", clue: "Past tense of take" },
        { word: "hook", hint: "h__k", clue: "Hang things on this" },
        { word: "stood", hint: "st__d", clue: "Past tense of stand" },
        { word: "wool", hint: "w__l", clue: "Sheep give us this" },
      ],
      distractors: ["moon", "food", "pool", "cool", "soon"],
      meet: ["book", "cook", "good"],
      build: ["book", "cook", "good", "foot", "wood"],
      spotTeam: ["book", "cook", "good", "foot"],
      spotDistractors: ["moon", "food", "pool"],
      // No compare for short oo
    },

    ue: {
      buildAlt: "ea",
      sound: "long U",
      soundDisplay: "ū",
      rule: "ue usually comes at the end of words",
      partner: null,
      words: [
        { word: "blue", hint: "bl__", clue: "Color of the sky" },
        { word: "true", hint: "tr__", clue: "Not false" },
        { word: "glue", hint: "gl__", clue: "Stick things together" },
        { word: "clue", hint: "cl__", clue: "Helps solve a mystery" },
        { word: "due", hint: "d__", clue: "Expected or owed" },
        { word: "cue", hint: "c__", clue: "A signal to start" },
        { word: "sue", hint: "s__", clue: "Take to court" },
        { word: "flue", hint: "fl__", clue: "Chimney pipe" },
      ],
      distractors: ["cup", "bus", "fun", "run", "sun"],
      meet: ["blue", "true", "glue"],
      build: ["blue", "true", "glue", "clue", "due"],
      spotTeam: ["blue", "true", "glue", "clue"],
      spotDistractors: ["cup", "bus", "fun"],
      // No compare for ue
    },
  };

  const teamColors = {
    ai: { bg: "#FFD1DC", border: "#FF85A2", glow: "#FF69B4", light: "#FFF0F3" },
    ay: { bg: "#FFECD2", border: "#FFB347", glow: "#FFA500", light: "#FFF8F0" },
    ea: { bg: "#C1FFC1", border: "#7CCD7C", glow: "#32CD32", light: "#F0FFF0" },
    ee: { bg: "#B0E0E6", border: "#5F9EA0", glow: "#20B2AA", light: "#F0FFFF" },
    oa: { bg: "#E6E6FA", border: "#9370DB", glow: "#8A2BE2", light: "#F8F0FF" },
    oo: { bg: "#FFDAB9", border: "#EE9A49", glow: "#FF8C00", light: "#FFF5E6" },
    oo_short: {
      bg: "#F5DEB3",
      border: "#D2691E",
      glow: "#CD853F",
      light: "#FFF8DC",
    },
    ue: { bg: "#d4d1ff", border: "#6683f2", glow: "#859cff", light: "#F0FFFF" },
  };

  // ===== STATE =====
  let state = {
    phase: "home",
    currentTeam: null,
    completedTeams: [],
    stars: 0,
    currentWordIndex: 0,
    buildAnswer: "",
    showResult: null,
    score: { correct: 0, total: 0 },
    spotWords: [],
    compareWords: [],
  };

  const bubbles = [];
  for (let i = 0; i < 12; i++) {
    bubbles.push({
      id: i,
      x: Math.random() * 100,
      size: 20 + Math.random() * 30,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.15,
    });
  }

  // ===== HELPER FUNCTIONS =====
  const disp = (t) => vowelTeams[t]?.display || t;
  const soundLabel = (t) =>
    `the <strong style="color:${teamColors[t].glow};font-size:20px">${vowelTeams[t].sound}</strong> sound`;

  // Audio file mappings
  const soundFolders = {
    ai: "assets/ai-sound/",
    ay: "assets/ay-sound/",
    ea: "assets/ea-sound/",
    ee: "assets/ee-sound/",
    oa: "assets/oa-sound/",
    oo: "assets/long-oo-sound/",
    oo_short: "assets/short-oo-sound/",
    ue: "assets/ue-sound/",
  };

  // Sound mapping for words in each team
  const soundMap = {};
  Object.entries(vowelTeams).forEach(([teamKey, team]) => {
    soundMap[teamKey] = {};
    team.words.forEach((word) => {
      soundMap[teamKey][word.word.toLowerCase()] =
        soundFolders[teamKey] + word.word.toLowerCase() + ".mp3";
    });
  });

  // Team-name pronunciation sounds
  soundMap["ai"]["ai"] = "assets/ai-sound/ai.mp3";
  soundMap["ay"]["ay"] = "assets/ay-sound/ay.mp3";
  soundMap["ea"]["ea"] = "assets/ea-sound/ea.mp3";
  soundMap["ee"]["ee"] = "assets/ee-sound/ee.mp3";
  soundMap["oa"]["oa"] = "assets/oa-sound/oa.mp3";
  soundMap["oo"]["oo"] = "assets/long-oo-sound/long-oo.mp3";
  soundMap["oo_short"]["oo_short"] = "assets/short-oo-sound/short-oo.mp3";
  soundMap["ue"]["ue"] = "assets/ue-sound/ue.mp3";

  let audioPlayer = null;

  function speak(text, team = null) {
    // Stop any currently playing audio
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    // Check if text is a word and we have an audio file for it
    const textLower = text.toLowerCase();

    // Try to find the word in soundMap if team is provided
    if (team && soundMap[team] && soundMap[team][textLower]) {
      console.log(
        "🚀 ~ speak ~ team && soundMap[team] && soundMap[team][textLower]:",
        team && soundMap[team] && soundMap[team][textLower],
      );
      audioPlayer = new Audio(soundMap[team][textLower]);
      audioPlayer
        .play()
        .catch((err) => console.log("Audio playback error:", err));
      return;
    }

    // Try to find word across all teams
    for (const t in soundMap) {
      if (soundMap[t][textLower]) {
        audioPlayer = new Audio(soundMap[t][textLower]);
        audioPlayer
          .play()
          .catch((err) => console.log("Audio playback error:", err));
        return;
      }
    }

    // Fallback to speech synthesis for other text
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 0.8;
    const v = speechSynthesis
      .getVoices()
      .find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN"));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  function shuffle(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  function hl(word, team, fs = "36px") {
    const d = disp(team);
    const i = word.indexOf(d);
    const c = teamColors[team];
    if (i === -1)
      return `<span style="font-size:${fs};font-weight:bold">${word}</span>`;
    return `<span style="font-size:${fs};font-weight:bold">${word.slice(0, i)}<span style="color:${c.glow};background:${c.light};padding:2px 6px;border-radius:6px;border:2px solid ${c.border}">${d}</span>${word.slice(i + d.length)}</span>`;
  }

  function rb(tint) {
    return bubbles
      .map((b) => {
        const bg = tint
          ? `radial-gradient(circle at 30% 30%,white,${tint})`
          : "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.8),rgba(200,200,255,0.3))";
        return `<div class="bubble" style="left:${b.x}%;width:${b.size}px;height:${b.size}px;background:${bg};opacity:${b.opacity};animation:floatUp ${b.duration}s linear infinite;animation-delay:${b.delay}s"></div>`;
      })
      .join("");
  }

  function getSteps(team) {
    const s = [
      { key: "meet", icon: "👋", label: "Meet" },
      { key: "build", icon: "🧱", label: "Build" },
      { key: "spot", icon: "🔍", label: "Spot" },
    ];
    if (vowelTeams[team].partner !== null)
      s.push({ key: "compare", icon: "⚖️", label: "Compare" });
    s.push({ key: "complete", icon: "⭐", label: "Done!" });
    return s;
  }

  function jp(team, phase, counter) {
    const c = teamColors[team];
    const steps = getSteps(team);
    const ci = steps.findIndex((s) => s.key === phase);

    let h = `<div class="journey-wrap">`;
    h += `<div class="journey-team-bubble" style="background:linear-gradient(135deg,${c.bg},${c.border});border:3px solid ${c.border};box-shadow:0 3px 12px ${c.glow}40">${disp(team)}</div>`;
    h += `<div class="journey-bar">`;

    steps.forEach((step, i) => {
      const done = i < ci;
      const active = i === ci;
      const future = i > ci;
      let bg, bdr, content, shadow, lc;

      if (done) {
        bg = c.glow;
        bdr = `3px solid ${c.border}`;
        content = "✓";
        shadow = `0 2px 8px ${c.glow}50`;
        lc = c.glow;
      } else if (active) {
        bg = `linear-gradient(135deg,${c.bg},${c.border})`;
        bdr = `3px solid ${c.glow}`;
        content = step.icon;
        shadow = `0 0 16px ${c.glow}70,0 3px 10px ${c.glow}40`;
        lc = c.glow;
      } else {
        bg = "#E8E8E8";
        bdr = "3px solid #D0D0D0";
        content = step.icon;
        shadow = "none";
        lc = "#BBB";
      }

      h += `<div class="journey-node"><div class="dot ${active ? "active" : ""}" style="background:${bg};border:${bdr};box-shadow:${shadow};color:${done ? "white" : "#333"}">${content}</div><span class="label" style="color:${lc}">${step.label}</span></div>`;
      if (i < steps.length - 1) {
        const cc = done ? c.glow : active ? c.bg : "#E0E0E0";
        h += `<div class="journey-connector" style="background:${cc};${future ? "opacity:0.5" : ""}"></div>`;
      }
    });

    h += `</div>`;
    if (counter)
      h += `<div class="journey-counter" style="color:${c.glow}">${counter}</div>`;
    h += `</div>`;
    return h;
  }

  function renderButtons(containerId, buttons) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="flexItem flexItemFirst">';
    buttons.forEach((btn) => {
      const bgColor = btn.color || "#1e6bef";
      const borderColor = btn.borderColor || bgColor;
      const disabled = btn.disabled ? "disabled" : "";
      const cursor = btn.disabled ? "not-allowed" : "pointer";
      html += `
        <button class="btn" id="${btn.id}" style="background:${bgColor}; color:white; cursor:${cursor};" 
          onclick="${btn.onclick}"
          ${disabled}
          onfocus="
            document.querySelectorAll('.btn').forEach(b => {
              b.style.outline = 'none';
              b.style.outlineOffset = '0';
            });
            this.style.outline = '3px solid ${borderColor}';
            this.style.outlineOffset = '3px';
          " 
          onblur="this.style.outline='none'; this.style.outlineOffset='0';">
          ${btn.label}
        </button>`;
    });
    html += "</div>";
    container.innerHTML = html;
  }

  // ===== CORE FUNCTIONS =====
  function renderBubbles(containerId) {
    const container = document.getElementById(containerId);
    if (container)
      container.innerHTML = rb(
        state.currentTeam ? teamColors[state.currentTeam].bg : null,
      );
  }

  function renderJourney(elementId, phase) {
    const el = document.getElementById(elementId);
    if (el && state.currentTeam) {
      el.innerHTML = jp(state.currentTeam, phase, null);
      const c = teamColors[state.currentTeam];
      el.parentElement.style.background = `linear-gradient(180deg,${c.light} 0%,#F0E6FF 50%,${c.bg}50 100%)`;
    }
  }

  function startTeam(t) {
    state.currentTeam = t;
    state.phase = "meet";
    state.currentWordIndex = 0;
    state.score = { correct: 0, total: 0 };
    state.buildAnswer = "";
    state.showResult = null;
    render();
    // Play the team sound after a short delay
    setTimeout(() => speak(disp(t), t), 300);
  }

  function nextPhase() {
    const tm = state.currentTeam;
    if (state.phase === "meet") {
      state.phase = "build";
      state.currentWordIndex = 0;
      state.buildAnswer = "";
      state.showResult = null;
    } else if (state.phase === "build") {
      genSpot();
      state.phase = "spot";
      state.currentWordIndex = 0;
      state.showResult = null;
    } else if (state.phase === "spot") {
      const p = vowelTeams[tm].partner;
      if (
        p &&
        (state.completedTeams.includes(p) || state.completedTeams.includes(tm))
      ) {
        genCompare();
        state.phase = "compare";
        state.currentWordIndex = 0;
        state.showResult = null;
      } else {
        done();
      }
    } else if (state.phase === "compare") {
      done();
    }
    render();
  }

  function done() {
    if (!state.completedTeams.includes(state.currentTeam)) {
      state.completedTeams.push(state.currentTeam);
      state.stars++;
    }
    state.phase = "complete";
  }

  function genSpot() {
    const tm = state.currentTeam;
    const tw = vowelTeams[tm].words
      .slice(0, 4)
      .map((w) => ({ word: w.word, hasTeam: true }));
    const d = vowelTeams[tm].distractors
      .slice(0, 3)
      .map((w) => ({ word: w, hasTeam: false }));
    state.spotWords = shuffle([...tw, ...d]);
  }

  function genCompare() {
    const tm = state.currentTeam;
    const p = vowelTeams[tm].partner;
    if (!p) return;
    const qs = [];
    vowelTeams[tm].words
      .slice(0, 3)
      .forEach((w) => qs.push({ word: w.word, clue: w.clue, correctTeam: tm }));
    vowelTeams[p].words
      .slice(0, 3)
      .forEach((w) => qs.push({ word: w.word, clue: w.clue, correctTeam: p }));
    state.compareWords = shuffle(qs);
  }

  function checkBuild() {
    if (!state.buildAnswer) return;
    const tm = state.currentTeam;
    const ok = state.buildAnswer.toLowerCase() === tm;
    state.showResult = ok ? "correct" : "wrong";
    state.score.total++;
    if (ok) {
      state.score.correct++;
      speak(vowelTeams[tm].words[state.currentWordIndex].word, tm);
    }
    updateBuild();
  }

  function checkSpot(a) {
    const q = state.spotWords[state.currentWordIndex];
    const ok = a === q.hasTeam;
    state.showResult = ok ? "correct" : "wrong";
    state.score.total++;
    if (ok) state.score.correct++;
    speak(ok ? "Correct!" : q.word, state.currentTeam);
    updateSpot();
  }

  function checkCompare(t) {
    const q = state.compareWords[state.currentWordIndex];
    const ok = t === q.correctTeam;
    state.showResult = ok ? "correct" : "wrong";
    state.score.total++;
    if (ok) {
      state.score.correct++;
      speak("Correct!");
    }
    updateCompare();
  }

  function nextQuestion() {
    state.showResult = null;
    state.buildAnswer = "";
    if (state.phase === "build") {
      if (state.currentWordIndex < 4) {
        state.currentWordIndex++;
        updateBuild();
      } else {
        nextPhase();
      }
    } else if (state.phase === "spot") {
      if (state.currentWordIndex < state.spotWords.length - 1) {
        state.currentWordIndex++;
        updateSpot();
      } else {
        nextPhase();
      }
    } else if (state.phase === "compare") {
      if (state.currentWordIndex < state.compareWords.length - 1) {
        state.currentWordIndex++;
        updateCompare();
      } else {
        nextPhase();
      }
    }
  }

  function goHome() {
    state.phase = "home";
    render();
  }

  // ===== RENDER FUNCTIONS =====
  function renderHome() {
    renderBubbles("bubbles-home");
    document.getElementById("stars-counter").textContent = state.stars;

    const islands = Object.keys(vowelTeams)
      .map((t) => {
        const c = teamColors[t];
        const d = state.completedTeams.includes(t);
        return `<button class="island-btn" onclick="window.vowelTwinsApp.startTeam('${t}')" style="background:linear-gradient(180deg,${c.bg} 0%,${c.border} 100%);border:${d ? "4px solid #FFD700" : "4px solid " + c.border};box-shadow:${d ? "0 0 20px rgba(255,215,0,0.5)" : "0 6px 20px " + c.glow + "40"}">${d ? '<span style="position:absolute;top:-8px;right:-8px;font-size:20px">⭐</span>' : ""}<span style="font-size:28px;font-weight:bold;color:#333">${disp(t)}</span><span style="font-size:11px;color:#555;margin-top:4px">${vowelTeams[t].sound}</span><span style="font-size:20px;margin-top:5px">${vowelTeams[t].soundDisplay}</span></button>`;
      })
      .join("");

    document.getElementById("islands-container").innerHTML = islands;
  }

  function updateMeet() {
    const tm = state.currentTeam;
    const c = teamColors[tm];
    const words = vowelTeams[tm].words;
    const wi = state.currentWordIndex;
    const content = document.getElementById("meet-content");

    renderBubbles("bubbles-meet");
    renderJourney("journey-meet", "meet");

    const letters = tm.split("");
    const l1 = letters[0];
    const l2 = letters[1] || "";
    let html = "";
    if (wi === 0) {
      html = `
        <div style="display:flex;gap:24px;justify-content:center;align-items:flex-end;margin-bottom:18px;margin-top: 28px">
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:95px;height:95px;border-radius:50%;background:radial-gradient(circle at 30% 30%,white,${c.bg});border:4px solid ${c.border};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px ${c.glow}50;animation:float 3s ease-in-out infinite;font-size:44px;font-weight:bold;color:#333;position:relative">
              ${l1}<span style="position:absolute;top:-8px;right:-6px;font-size:18px">👋</span>
            </div>
            <span style="font-size:13px;color:#999;margin-top:8px">talks!</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:82px;height:82px;border-radius:50%;background:radial-gradient(circle at 30% 30%,white,${c.bg}88);border:4px solid ${c.border}66;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 15px ${c.glow}30;animation:float 3s ease-in-out infinite 0.6s;font-size:38px;font-weight:bold;color:#aaa;position:relative">
              ${l2}<span style="position:absolute;top:-10px;right:-4px;font-size:16px">💤</span>
            </div>
            <span style="font-size:13px;color:#999;margin-top:8px">sleeps</span>
          </div>
        </div>
        <div style="background:white;border-radius:20px;padding:22px 30px;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:320px;width:100%;margin-bottom:4px">
          <p style="font-size:20px;font-weight:bold;color:#333;margin-bottom:10px">Meet <span style="color:${c.border}">${l1}</span>${l2 ? ` and <span style="color:${c.border}">${l2}</span>` : ""}!</p>
          <p style="font-size:16px;color:#555;margin-bottom:14px">Together they say <strong style="color:${c.border};font-size:20px">${vowelTeams[tm].soundDisplay}</strong></p>
          <button onclick="window.vowelTwinsApp.speak('${tm}', '${tm}')" style="background:#2196F3;color:#fff;border:none;padding:8px 22px;border-radius:25px;font-size:14px;cursor:pointer;font-family:inherit;font-weight:700;margin-bottom:14px;">🔊 Hear "${tm}"</button>
          <p style="font-size:13px;color:#999;font-style:italic;margin:0">⚡ ${vowelTeams[tm].rule}</p>
        </div>
        <button onclick="window.vowelTwinsApp.nextWordMeet()" class="btn-main" style="margin-top:20px;">NEXT →</button>`;
    } else if (wi >= 1 && wi <= 3) {
      const w = words[wi - 1];
      html = `<p style="font-size:14px;color:#666;margin-bottom:10px;margin-top: 12px;">Word ${wi} of 3</p>
              <div onclick="window.vowelTwinsApp.speak('${w.word}', '${tm}')" style="width:min(75vw,260px);height:min(75vw,260px);border-radius:50%;background:radial-gradient(circle at 30% 30%,white 0%,${c.bg} 50%,${c.border} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 15px 50px ${c.glow}50;border:6px solid ${c.border};cursor:pointer;animation:float 3s ease-in-out infinite">${hl(w.word, tm, "clamp(36px,12vw,52px)")}<span style="font-size:18px;color:#666;margin-top:18px">🔊 tap to hear</span></div>
              <p style="margin-top:15px;font-size:14px;color:#666;background:white;padding:10px 20px;border-radius:15px">💡 ${w.clue}</p>
              <button onclick="window.vowelTwinsApp.nextMeetWord()" class="btn-main" style="margin-top:20px;">${wi < 3 ? "NEXT →" : "BUILD →"}</button>`;
    }
    content.innerHTML = html;
  }

  function nextMeetWord() {
    const tm = state.currentTeam;
    const words = vowelTeams[tm].words;
    if (state.currentWordIndex < 3) {
      state.currentWordIndex++;
      if (state.currentWordIndex > 0)
        setTimeout(
          () => speak(words[state.currentWordIndex - 1].word, tm),
          300,
        );
      updateMeet();
    } else {
      nextPhase();
    }
  }

  function updateBuild() {
    const tm = state.currentTeam;
    const c = teamColors[tm];
    const cw = vowelTeams[tm].words[state.currentWordIndex];
    const parts = cw.hint.split("__");
    const sr = state.showResult;
    const bc = sr === "correct" ? "#32CD32" : c.glow;
    const bv = sr === "correct" ? disp(tm) : state.buildAnswer ? disp(state.buildAnswer) : "";
    const brc =
      sr === "correct" ? "#32CD32" : sr === "wrong" ? "#FF6B6B" : "transparent";

    const content = document.getElementById("build-content");
    renderBubbles("bubbles-build");
    renderJourney("journey-build", "build");

    let hh = "";
    for (let i = 0; i < parts.length; i++) {
      hh += `<span>${parts[i]}</span>`;
      if (i < parts.length - 1)
        hh += `<span style="display:inline-block;min-width:60px;border-bottom:4px solid ${bc};margin:0 5px;text-align:center;color:${bc}">${bv}</span>`;
    }

    const altTeam =
      vowelTeams[tm].partner ||
      vowelTeams[tm].buildAlt ||
      Object.keys(vowelTeams).find((k) => k !== tm);
    const opts = [tm, altTeam].filter(Boolean);

    let oh = "";
    if (!sr) {
      oh = `<p style="font-size:24px;color:#888;margin-bottom:10px">Which vowel team completes this word?</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">${opts
              .map((t) => {
                const tc = teamColors[t];
                const sel = state.buildAnswer === t;
                return `<button class="team-btn" onclick="window.vowelTwinsApp.selectBuild('${t}')" style="width:80px;height:80px;font-size:24px;background:${sel ? tc.glow : `radial-gradient(circle at 30% 30%,white,${tc.bg})`};border:4px solid ${tc.border};color:${sel ? "white" : "#333"};box-shadow:${sel ? `0 0 25px ${tc.glow}` : `0 4px 15px ${tc.glow}30`};transform:${sel ? "scale(1.1)" : "scale(1)"}">${disp(t)}</button>`;
              })
              .join("")}</div>`;
      renderButtons("build-buttons", [
        {
          id: "btn-check-build",
          label: "CHECK",
          onclick: "window.vowelTwinsApp.checkBuild()",
          color: state.buildAnswer ? "#4CAF50" : "#DDD",
          borderColor: "#4CAF50",
          disabled: !state.buildAnswer,
        },
      ]);
    } else {
      oh = `<div style="text-align:center"><p class="result-text" style="color:${sr === "correct" ? "#32CD32" : "#FF6B6B"}">${sr === "correct" ? "✓ Correct!" : "✗ Not quite!"}</p>${sr === "correct" ? `<p style="font-size:28px;font-weight:bold;color:#333;margin-bottom:15px">${hl(cw.word, tm, "28px")}</p>` : ""}</div>`;
      renderButtons("build-buttons", [
        {
          id: "btn-next-build",
          label: state.currentWordIndex < 4 ? "NEXT →" : "SPOT →",
          onclick: "window.vowelTwinsApp.nextQuestion()",
          color: "#4CAF50",
          borderColor: "#4CAF50",
        },
      ]);
    }

    content.innerHTML = `<p style="font-size: 24px;color:#666;margin-bottom: 20px;margin-top: 20px;">Complete the word:</p>
                        <div style="background:white;padding:25px 40px;border-radius:25px;box-shadow:0 8px 30px ${c.glow}30;margin-bottom:15px;border:4px solid ${brc}"><span style="font-size:42px;font-weight:bold;color:#333;letter-spacing:3px">${hh}</span></div>
                        <p style="font-size:14px;color:#666;margin-bottom:20px;background:rgba(255,255,255,0.8);padding:8px 16px;border-radius:15px">Hint: ${cw.clue}</p>${oh}`;
  }

  function updateSpot() {
    const tm = state.currentTeam;
    const c = teamColors[tm];
    const q = state.spotWords[state.currentWordIndex];
    if (!q) return;

    const sr = state.showResult;
    const content = document.getElementById("spot-content");
    renderBubbles("bubbles-spot");
    renderJourney("journey-spot", "spot");

    let body = "";
    if (!sr) {
      body = `<div onclick="window.vowelTwinsApp.speak('${q.word}', '${tm}')" style="width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,${c.bg} 0%,${c.border} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 10px 40px ${c.glow}50;border:5px solid white;cursor:pointer;margin-bottom:25px;animation:pulse 2s ease-in-out infinite"><span style="font-size:50px">🔊</span><span style="font-size:12px;color:#333;margin-top:5px">tap to hear</span></div>`;
      renderButtons("spot-buttons", [
        {
          id: "btn-yes-spot",
          label: "YES ✓",
          onclick: "window.vowelTwinsApp.checkSpot(true)",
          color: "#2ECC71",
          borderColor: "#27AE60",
        },
        {
          id: "btn-no-spot",
          label: "NO ✗",
          onclick: "window.vowelTwinsApp.checkSpot(false)",
          color: "#E74C3C",
          borderColor: "#C0392B",
        },
      ]);
    } else {
      const wd = q.hasTeam
        ? hl(q.word, tm, "42px")
        : `<span style="font-size:42px;font-weight:bold;color:#333">${q.word}</span>`;
      const il = state.currentWordIndex >= state.spotWords.length - 1;
      body = `<div onclick="window.vowelTwinsApp.speak('${q.word}', '${tm}')" style="background:white;padding:25px 40px;border-radius:25px;box-shadow:0 8px 30px ${c.glow}30;margin-bottom:20px;cursor:pointer;border:4px solid ${sr === "correct" ? "#32CD32" : "#FF6B6B"}">${wd}</div>
              <div style="text-align:center"><p class="result-text" style="color:${sr === "correct" ? "#32CD32" : "#FF6B6B"}">${sr === "correct" ? "✓ Correct!" + (q.hasTeam ? " 🎯" : "") : "✗ Not quite!"}</p><p style="font-size:14px;color:#666;margin-bottom:15px">${q.hasTeam ? `"${q.word}" has the ${vowelTeams[tm].sound} sound!` : `"${q.word}" does NOT have the ${vowelTeams[tm].sound} sound`}</p></div>`;
      renderButtons("spot-buttons", [
        {
          id: "btn-next-spot",
          label: il
            ? vowelTeams[tm].partner
              ? "COMPARE →"
              : "⭐ Finish"
            : "NEXT →",
          onclick: "window.vowelTwinsApp.nextQuestion()",
          color: "#4CAF50",
          borderColor: "#4CAF50",
        },
      ]);
    }

    content.innerHTML = `<p style="font-size:15px;color:#666;margin-bottom:15px;text-align:center">Does this word have ${soundLabel(tm)}?</p>${body}`;
  }

  function updateCompare() {
    const tm = state.currentTeam;
    const partner = vowelTeams[tm].partner;
    const q = state.compareWords[state.currentWordIndex];
    if (!q) return;

    const sr = state.showResult;
    const content = document.getElementById("compare-content");
    renderBubbles("bubbles-compare");
    renderJourney("journey-compare", "compare");

    let body = "";
    if (!sr) {
      body = `<div style="display:flex;gap:15px">${[tm, partner]
        .map((t) => {
          const tc = teamColors[t];
          return `<button class="team-btn" onclick="window.vowelTwinsApp.checkCompare('${t}')" style="width:100px;height:100px;font-size:28px;background:radial-gradient(circle at 30% 30%,white,${tc.bg});border:5px solid ${tc.border};color:#333;box-shadow:0 6px 20px ${tc.glow}40">${disp(t)}</button>`;
        })
        .join("")}</div>`;
      renderButtons("compare-buttons", [
        {
          id: "btn-hear-compare",
          label: "🔊 Hear",
          onclick: `window.vowelTwinsApp.speak('${q.word}', '${state.compareWords[state.currentWordIndex]?.correctTeam}')`,
          color: "#2196F3",
          borderColor: "#2196F3",
        },
      ]);
    } else {
      const il = state.currentWordIndex >= state.compareWords.length - 1;
      body = `<div style="text-align:center"><p class="result-text" style="color:${sr === "correct" ? "#32CD32" : "#FF6B6B"}">${sr === "correct" ? "✓ Correct!" : "✗ Not quite!"}</p><p style="font-size:32px;font-weight:bold;color:#333;margin-bottom:15px">${hl(q.word, q.correctTeam, "32px")}</p><p style="font-size:13px;color:#666;margin-bottom:15px">"${q.word}" uses <strong>${disp(q.correctTeam)}</strong>${q.correctTeam === tm ? " (in the middle)" : " (at the end)"}</p></div>`;
      renderButtons("compare-buttons", [
        {
          id: "btn-next-compare",
          label: il ? "⭐ Finish" : "NEXT →",
          onclick: "window.vowelTwinsApp.nextQuestion()",
          color: "#4CAF50",
          borderColor: "#4CAF50",
        },
      ]);
    }

    content.innerHTML = `<p style="font-size:13px;color:#666;margin-bottom:10px;background:rgba(255,255,255,0.8);padding:8px 16px;border-radius:15px">🤔 Both make the same sound! Both say <strong>${vowelTeams[tm].soundDisplay}</strong>!</p>
                        <p style="font-size:15px;color:#666;margin-bottom:10px">Which spelling is correct?</p>
                        <div style="background:white;padding:15px 25px;border-radius:15px;margin-bottom:15px;box-shadow:0 4px 15px rgba(0,0,0,0.1)"><span style="font-size:16px">💡 ${q.clue}</span></div>
                        ${body}`;
  }

  function updateComplete() {
    const tm = state.currentTeam;
    const c = teamColors[tm];
    const content = document.getElementById("complete-content");

    renderBubbles("bubbles-complete");
    renderJourney("journey-complete", "complete");

    const c_screen = document.getElementById("screen-complete");
    c_screen.style.background = `linear-gradient(180deg,${c.light} 0%,#FFF9C4 50%,${c.bg}50 100%)`;

    content.innerHTML = `<div style="font-size:80px;margin-bottom:20px">🎉</div>
                        <h2 style="font-size:28px;color:${c.glow};margin-bottom:10px">Team Complete!</h2>
                        <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,${c.bg} 0%,${c.border} 100%);display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:bold;color:#333;box-shadow:0 0 30px ${c.glow}60;border:5px solid #FFD700;margin:20px auto">${disp(tm)}</div>
                        <p style="font-size:18px;color:#666;margin-bottom:15px">You earned a star! ⭐</p>
                        <div style="background:white;padding:15px 30px;border-radius:20px;margin-bottom:25px;box-shadow:0 4px 15px rgba(0,0,0,0.1)"><p style="font-size:16px;color:#333;margin:0">Score: <strong style="color:${c.glow}">${state.score.correct}</strong> / ${state.score.total}</p></div>
                        <button onclick="window.vowelTwinsApp.goHome()" class="btn-main" style="background:linear-gradient(135deg,#9370DB 0%,#7B68EE 100%);box-shadow:0 6px 20px rgba(147,112,219,0.4)">CONTINUE →</button>`;
  }

  function render() {
    const screens = [
      "screen-home",
      "screen-meet",
      "screen-build",
      "screen-spot",
      "screen-compare",
      "screen-complete",
    ];
    screens.forEach((s) => (document.getElementById(s).style.display = "none"));

    if (state.phase === "home") {
      document.getElementById("screen-home").style.display = "flex";
      document.getElementById("screen-home").style.background =
        "linear-gradient(180deg,#E8F4FF 0%,#F0E6FF 50%,#FFE6F0 100%)";
      renderHome();
    } else if (state.phase === "meet") {
      document.getElementById("screen-meet").style.display = "flex";
      updateMeet();
    } else if (state.phase === "build") {
      document.getElementById("screen-build").style.display = "flex";
      updateBuild();
    } else if (state.phase === "spot") {
      document.getElementById("screen-spot").style.display = "flex";
      updateSpot();
    } else if (state.phase === "compare") {
      document.getElementById("screen-compare").style.display = "flex";
      updateCompare();
    } else if (state.phase === "complete") {
      document.getElementById("screen-complete").style.display = "flex";
      updateComplete();
    }
  }

  // ===== EXPOSE API =====
  window.vowelTwinsApp = {
    startTeam,
    nextPhase,
    nextQuestion,
    checkBuild,
    checkSpot,
    checkCompare,
    goHome,
    speak,
    nextMeetWord,
    selectBuild: (t) => {
      state.buildAnswer = t;
      updateBuild();
    },
    nextWordMeet: () => {
      state.currentWordIndex = 1;
      updateMeet();
    },
  };

  // ===== INIT =====
  render();
});
