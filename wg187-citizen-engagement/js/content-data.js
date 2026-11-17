// Content for "What Would You Do? - Citizen Engagement Explorer" (from en_ps_07_wg_187.docx, updated storyboard).
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
        "Government is legally bound to share records of public spending."
      ],
      "grievance": [
        "low",
        "This tool is for personal service complaints, not for tracing public funds."
      ],
      "rep": [
        "medium",
        "An MLA can raise the question, but a response depends on political will and assembly procedures."
      ],
      "media": [
        "high",
        "Reporting on missing public funds creates public pressure on the government to explain."
      ],
      "civil": [
        "low",
        "Community groups work on local mobilisation, not government financial records."
      ],
      "vote": [
        "low",
        "Voting decides future leadership, not accountability for past spending."
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
        "Official meter records can be accessed but RTI cannot correct the bill itself."
      ],
      "grievance": [
        "high",
        "Filing a formal complaint directly with the electricity department triggers an official investigation into the billing error."
      ],
      "rep": [
        "low",
        "A single wrong bill is too small for an MLA to take up."
      ],
      "media": [
        "low",
        "A billing error affecting one household is not a story that media will cover."
      ],
      "civil": [
        "low",
        "Community groups work on shared local problems, not individual billing errors."
      ],
      "vote": [
        "low",
        "Voting decides future leadership, not individual service errors."
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
        "RTI can reveal why construction has stalled but knowing the reason alone does not get the work started."
      ],
      "grievance": [
        "low",
        "Grievance handles complaints about a running service. Construction that has not started is not a running service."
      ],
      "rep": [
        "high",
        "An MLA can directly push the concerned department to use the allocated funds and start the work."
      ],
      "media": [
        "medium",
        "Reporting on unused funds creates pressure but cannot directly start construction."
      ],
      "civil": [
        "low",
        "A community group can petition but has no authority to order a government department to begin construction."
      ],
      "vote": [
        "low",
        "The funds are already approved. This needs action now, not after elections."
      ]
    }
  },
  {
    "icon": "media",
    "short": "Hospital turning patients away",
    "text": "Government hospital turning away patients at night.",
    "tools": {
      "rti": [
        "low",
        "RTI works on a week's long timeline. It cannot help patients who need care tonight."
      ],
      "grievance": [
        "medium",
        "A formal complaint creates an official record, but the grievance process is too slow for a medical emergency."
      ],
      "rep": [
        "high",
        "An MLA can directly call the hospital authority and demand immediate action."
      ],
      "media": [
        "high",
        "Public exposure of a hospital turning away patients at night creates immediate pressure on authorities to act."
      ],
      "civil": [
        "medium",
        "A community group can apply pressure, but mobilising people takes time in an emergency."
      ],
      "vote": [
        "low",
        "Voting happens once in five years. A medical emergency needs action tonight."
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
        "No government scheme exists here so there are no records to request."
      ],
      "grievance": [
        "low",
        "No service has been set up so there is nothing to file a complaint about."
      ],
      "rep": [
        "high",
        "An MLA can directly redirect local resources and activate emergency relief for the elderly."
      ],
      "media": [
        "medium",
        "Coverage can bring the issue to public attention but cannot deliver food and medicine daily."
      ],
      "civil": [
        "high",
        "Community organisations can set up daily food and medicine delivery immediately without waiting for government action."
      ],
      "vote": [
        "low",
        "Elderly people need daily support now. Voting changes leadership, not daily care."
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
        "Records from one department cannot fix years of neglect across multiple services."
      ],
      "grievance": [
        "low",
        "A single complaint cannot address systemic neglect across an entire area."
      ],
      "rep": [
        "medium",
        "An MLA can be approached but years of inaction suggest little will change."
      ],
      "media": [
        "medium",
        "Coverage can highlight years of neglect but cannot remove or replace the elected leadership."
      ],
      "civil": [
        "medium",
        "An organised campaign can apply sustained pressure but cannot remove or replace the elected leadership."
      ],
      "vote": [
        "high",
        "Years of neglect means the leader has failed. Only the vote can bring in a leader who will act."
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
        "Official land and tenancy records help establish the families' right to stay but cannot stop the eviction."
      ],
      "grievance": [
        "high",
        "A formal complaint to the housing authority can initiate direct action against the illegal eviction."
      ],
      "rep": [
        "high",
        "An MLA can directly intervene with the housing authority to stop the eviction."
      ],
      "media": [
        "medium",
        "Public attention can shame the landlord but cannot legally stop the eviction."
      ],
      "civil": [
        "high",
        "NGOs and legal aid groups can support families and fight the illegal eviction."
      ],
      "vote": [
        "low",
        "Families need legal protection now, not after elections."
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
        "Stock records can expose the diversion but getting them takes time while families go hungry."
      ],
      "grievance": [
        "medium",
        "A formal complaint starts an inquiry, but the shop continues operating while the investigation proceeds."
      ],
      "rep": [
        "high",
        "An MLA can directly pressure the food department to act against the corrupt shop."
      ],
      "media": [
        "high",
        "Video evidence of ration diversion made public creates strong pressure on authorities to act."
      ],
      "civil": [
        "medium",
        "A community protest creates pressure, but the shop can only be officially stopped by the authorities."
      ],
      "vote": [
        "low",
        "Families losing rations need action today, not after elections."
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
        "RTI gets government records. It cannot make an elected leader meet resident."
      ],
      "grievance": [
        "low",
        "There is no grievance system for reporting an unresponsive elected leader."
      ],
      "rep": [
        "low",
        "The leader is the problem. Approaching the same person again will not help."
      ],
      "media": [
        "medium",
        "Coverage can embarrass the leader and create pressure to meet residents but does not guarantee action."
      ],
      "civil": [
        "high",
        "Community groups can organise their own forums and give residents a platform to raise issues."
      ],
      "vote": [
        "high",
        "A leader who has not met residents in three years has failed. The vote can replace them."
      ]
    }
  },
  {
    "icon": "media",
    "short": "Contaminated water supply",
    "text": "Drinking water supply contaminated. Government test confirms it but no action taken.",
    "tools": {
      "rti": [
        "medium",
        "The test results are already confirmed. RTI cannot add new information to what is already known."
      ],
      "grievance": [
        "high",
        "A formal complaint filed with the confirmed test results puts official pressure on the water authority to act."
      ],
      "rep": [
        "high",
        "An MLA can directly escalate the matter to the minister and push the water department to act."
      ],
      "media": [
        "high",
        "Confirmed government data on contamination reported publicly creates strong pressure on authorities to act."
      ],
      "civil": [
        "medium",
        "Community pressure can push authorities to act but cannot directly repair the water supply."
      ],
      "vote": [
        "low",
        "Contaminated water is a health emergency. It cannot wait for an election cycle."
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
        "Past records cannot get the garbage collected today."
      ],
      "grievance": [
        "high",
        "A formal complaint to the sanitation department triggers immediate action to send the truck."
      ],
      "rep": [
        "high",
        "A local councillor can directly call the sanitation department and get the truck sent."
      ],
      "media": [
        "low",
        "A missing garbage truck in one area is unlikely to be a story that media will cover."
      ],
      "civil": [
        "high",
        "Organised residents raising the issue together put strong pressure on the municipality to act quickly."
      ],
      "vote": [
        "low",
        "Waste piling up needs action today, not after elections."
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
        "No government programme exists here so there are no records to request."
      ],
      "grievance": [
        "low",
        "No service exists so there is nothing to complain about."
      ],
      "rep": [
        "medium",
        "An MLA can push for a programme but setting one up takes considerable time."
      ],
      "media": [
        "medium",
        "Coverage raises awareness but cannot bring children back to school or provide daily support."
      ],
      "civil": [
        "high",
        "Community organisations can locate dropout children and support them back into learning."
      ],
      "vote": [
        "low",
        "Children need help now, not after elections."
      ]
    }
  }
];

