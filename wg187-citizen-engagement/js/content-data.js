// Content for "What Would You Do? - Citizen Engagement Explorer" (from en_ps_07_wg_187.docx).
window.TOOLS = [
  {
    "key": "rti",
    "name": "RTI",
    "desc": "Get official government records",
    "icon": "rti-icon.svg",
    "color": "#f8ba5e"
  },
  {
    "key": "grievance",
    "name": "Grievance",
    "desc": "File a formal complaint",
    "icon": "grievance-icon.svg",
    "color": "#d07fff"
  },
  {
    "key": "rep",
    "name": "Representative",
    "desc": "Approach your MLA or MP",
    "icon": "representative-icon.svg",
    "color": "#49ecdc"
  },
  {
    "key": "media",
    "name": "Media",
    "desc": "Use news and social media",
    "icon": "media-icon.svg",
    "color": "#f750ba"
  },
  {
    "key": "civil",
    "name": "Civil Society",
    "desc": "Organise community action",
    "icon": "civil-society-icon.svg",
    "color": "#5e82f8"
  },
  {
    "key": "vote",
    "name": "Vote",
    "desc": "Choose better leaders",
    "icon": "vote-icon.svg",
    "color": "#36fd99"
  }
];
// order of the cards on the intro screen (row by row) and in the tool column on the problem screen
window.INTRO_ORDER = ["rep", "media", "civil", "grievance", "rti", "vote"];
window.TRAY_ORDER = ["rep", "media", "civil", "vote", "rti", "grievance"];

// level: high | medium | low; the text explains why, and is shown as feedback.
window.PROBLEMS = [
  {
    "icon": "rti",
    "short": "Park money missing",
    "text": "Park promised but never built. Where did the money go?",
    "tools": {
      "rti": [
        "high",
        "Government must legally share how the money was spent."
      ],
      "grievance": [
        "medium",
        "A complaint is registered but does not get you the spending records."
      ],
      "rep": [
        "medium",
        "MLA can ask questions but cannot get the official records for you."
      ],
      "media": [
        "medium",
        "Media can create pressure but the actual figures may still not come out."
      ],
      "civil": [
        "low",
        "Groups work on community issues, not tracking government funds."
      ],
      "vote": [
        "low",
        "Voting picks leaders, not finds out where money went."
      ]
    }
  },
  {
    "icon": "grievance",
    "short": "Wrong electricity bill",
    "text": "Electricity bill shows double the actual usage.",
    "tools": {
      "rti": [
        "medium",
        "RTI can get your official meter records but cannot correct the bill itself."
      ],
      "grievance": [
        "high",
        "A formal complaint starts the correction process for your bill."
      ],
      "rep": [
        "low",
        "A single wrong bill is too small for an MLA to take up."
      ],
      "media": [
        "low",
        "One wrong bill is not a news story."
      ],
      "civil": [
        "low",
        "Groups work on community issues, not individual billing errors."
      ],
      "vote": [
        "low",
        "Voting picks leaders, not fixes individual service errors."
      ]
    }
  },
  {
    "icon": "rep",
    "short": "Road approved, not started",
    "text": "Road approved two years ago. Funds allocated but construction has not started.",
    "tools": {
      "rti": [
        "medium",
        "RTI can find out why construction has not started but cannot move the work."
      ],
      "grievance": [
        "low",
        "No service exists yet to file a complaint about."
      ],
      "rep": [
        "high",
        "MLA can push the Public Works Department to start the allocated work."
      ],
      "media": [
        "high",
        "Public exposure of unused allocated funds puts pressure to start construction."
      ],
      "civil": [
        "low",
        "A group can petition but cannot start government construction."
      ],
      "vote": [
        "low",
        "Allocated funds need action now, not after elections."
      ]
    }
  },
  {
    "icon": "media",
    "short": "Hospital turning patients",
    "text": "Government hospital turning away patients at night.",
    "tools": {
      "rti": [
        "medium",
        "RTI can get hospital records later but cannot help patients right now."
      ],
      "grievance": [
        "medium",
        "Formal process is too slow for an emergency."
      ],
      "rep": [
        "high",
        "MLA can call the hospital authority directly and force immediate action."
      ],
      "media": [
        "high",
        "Public exposure forces the hospital to act immediately."
      ],
      "civil": [
        "medium",
        "A group takes time to mobilise. Patients need help right now."
      ],
      "vote": [
        "low",
        "Voting happens once in five years. This needs action now."
      ]
    }
  },
  {
    "icon": "civil",
    "short": "Elderly need food/medicine",
    "text": "Elderly people need daily food and medicine. No scheme covers this.",
    "tools": {
      "rti": [
        "low",
        "No government scheme exists, so there is nothing to RTI about."
      ],
      "grievance": [
        "low",
        "No scheme exists, so there is nothing to complain about."
      ],
      "rep": [
        "high",
        "MLA can direct local resources and push for emergency relief immediately."
      ],
      "media": [
        "medium",
        "Coverage can highlight the issue but cannot provide daily help."
      ],
      "civil": [
        "high",
        "Community groups can organise daily food and medicine delivery for the elderly."
      ],
      "vote": [
        "low",
        "Daily help for the elderly cannot wait for elections."
      ]
    }
  },
  {
    "icon": "vote",
    "short": "Bad roads, water, schools",
    "text": "Bad roads, no clean water, poor schools for years. Nothing improves.",
    "tools": {
      "rti": [
        "low",
        "Data on one issue will not fix years of neglect across many problems."
      ],
      "grievance": [
        "low",
        "One complaint cannot fix multiple problems at once."
      ],
      "rep": [
        "low",
        "Years of inaction show the current leader is not working."
      ],
      "media": [
        "medium",
        "Coverage helps but one story cannot fix years of neglect."
      ],
      "civil": [
        "medium",
        "A group can campaign but cannot change who governs the area."
      ],
      "vote": [
        "high",
        "Choose better leaders who will fix the roads, water, and schools."
      ]
    }
  },
  {
    "icon": "grievance",
    "short": "Landlord evicting families",
    "text": "A landlord is illegally evicting poor families from their homes.",
    "tools": {
      "rti": [
        "medium",
        "RTI can get land records to prove the families' right to stay."
      ],
      "grievance": [
        "high",
        "A formal complaint to the housing authority can legally stop the eviction."
      ],
      "rep": [
        "medium",
        "MLA can intervene but legal action through proper channels is faster."
      ],
      "media": [
        "medium",
        "Coverage can create pressure but cannot stop an eviction legally."
      ],
      "civil": [
        "high",
        "NGOs can provide legal aid and support families through the process."
      ],
      "vote": [
        "low",
        "Families need protection now, not after elections."
      ]
    }
  },
  {
    "icon": "media",
    "short": "Ration shop black market",
    "text": "Ration shop selling supplies in black market. Poor families turned away.",
    "tools": {
      "rti": [
        "medium",
        "RTI can expose stock records later but families lose rations today."
      ],
      "grievance": [
        "medium",
        "A complaint takes time while families continue to go hungry."
      ],
      "rep": [
        "medium",
        "Leader might warn but corruption often ignores quiet warnings."
      ],
      "media": [
        "high",
        "Video evidence creates public pressure and forces immediate action."
      ],
      "civil": [
        "medium",
        "A protest helps but cannot shut the shop officially."
      ],
      "vote": [
        "low",
        "Right to food is a daily need, not an election issue."
      ]
    }
  },
  {
    "icon": "vote",
    "short": "Leader not meeting residents",
    "text": "Elected leader has not held a single public meeting in three years. Residents have no way to raise issues.",
    "tools": {
      "rti": [
        "low",
        "Data will not make a leader accessible to residents."
      ],
      "grievance": [
        "low",
        "No government complaint box exists for an inaccessible leader."
      ],
      "rep": [
        "low",
        "The leader is the representative. Approaching them again will not help."
      ],
      "media": [
        "medium",
        "Coverage can shame the leader but cannot force them to meet residents."
      ],
      "civil": [
        "high",
        "Community groups can organise their own forums and raise issues collectively."
      ],
      "vote": [
        "high",
        "Replace the inaccessible leader with someone who serves residents directly."
      ]
    }
  },
  {
    "icon": "media",
    "short": "Contaminated water supply",
    "text": "Drinking water supply to the area is contaminated. Government test confirms it but no action taken.",
    "tools": {
      "rti": [
        "medium",
        "Test results are already confirmed. RTI will not add new information."
      ],
      "grievance": [
        "high",
        "A formal complaint with the test results forces the water authority to act."
      ],
      "rep": [
        "medium",
        "MLA can apply pressure but the water authority handles technical action."
      ],
      "media": [
        "high",
        "Public exposure of confirmed contamination forces immediate government response."
      ],
      "civil": [
        "medium",
        "A group can organise awareness but cannot fix the water supply."
      ],
      "vote": [
        "low",
        "Contaminated water needs action today, not after elections."
      ]
    }
  },
  {
    "icon": "grievance",
    "short": "Garbage truck missing",
    "text": "Garbage truck missing for two weeks. Waste piling up.",
    "tools": {
      "rti": [
        "low",
        "Past records will not get the garbage removed today."
      ],
      "grievance": [
        "high",
        "A formal complaint forces the sanitation department to send a truck."
      ],
      "rep": [
        "medium",
        "A councillor can follow up but this is a direct service failure, not a policy issue."
      ],
      "media": [
        "low",
        "Media coverage cannot force the garbage truck to arrive today."
      ],
      "civil": [
        "high",
        "Collective pressure from organised residents forces the municipality to act."
      ],
      "vote": [
        "low",
        "Garbage on the street needs action today, not after elections."
      ]
    }
  },
  {
    "icon": "civil",
    "short": "Children dropped out",
    "text": "Many children dropped out of school. No one helping them get back.",
    "tools": {
      "rti": [
        "low",
        "No government programme exists to seek information about."
      ],
      "grievance": [
        "low",
        "No scheme means nothing to complain about."
      ],
      "rep": [
        "medium",
        "MLA can propose a programme but that takes time."
      ],
      "media": [
        "medium",
        "Coverage raises awareness but cannot tutor children daily."
      ],
      "civil": [
        "high",
        "Community groups can run study sessions and bring dropouts back to learning."
      ],
      "vote": [
        "low",
        "Children need help today, not after elections."
      ]
    }
  }
];

