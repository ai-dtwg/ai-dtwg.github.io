/*
 * Site content. Edit this file only. There is no build step.
 * Anything marked TODO is a placeholder to replace.
 */
window.SWG = {
  // Public address of the site, used for shared links and search engines
  site: "https://ai-dtwg.com",

  org: {
    short: "DTWG",
    name: "Digital Transformation Working Group",
    km: "ក្រុមការងារបរិវត្តកម្មឌីជីថល",
    // The ministry DTWG belongs to
    parent: {
      short: "MPTC",
      name: "Ministry of Post and Telecommunications",
      km: "ក្រសួងប្រៃសណីយ៍និងទូរគមនាគមន៍",
      url: "https://mptc.gov.kh",
      logo: "assets/img/mptc-logo.png",
    },
  },

  group: {
    name: "AI & Big Data",
    kind: "Sub Working Group",
    km: "អនុក្រុមការងារបញ្ញាសិប្បនិម្មិត និងទិន្នន័យធំ",
    host: "ai-bigdata", // shown in the prompt: guest@ai-bigdata:~$
    tagline: "The AI and Big Data team of DTWG.",
    // One string per paragraph.
    about: [
      "We are the AI & Big Data sub working group of the Digital Transformation Working Group (DTWG) at the Ministry of Post and Telecommunications (MPTC). Anything in DTWG that involves AI or Big Data comes to us.",
      "The team combines research and engineering: computer vision, Khmer language technology, LLM applications and data analytics.",
    ],
  },

  // The group's expertise
  focus: [
    { key: "vision", title: "Computer Vision", desc: "Detection, segmentation and image analysis with deep learning." },
    { key: "khmer", title: "Khmer Language", desc: "NLP, speech and OCR for Khmer." },
    { key: "llm", title: "LLM Applications", desc: "Text-to-SQL and AI agents." },
    { key: "data", title: "Big Data & Analytics", desc: "Data pipelines, dashboards and reporting." },
  ],

  // The team. Clicking a card (or running `member <id>`) shows the full entry.
  //   id:         short slug used by the `member <id>` command
  //   group:      "lead" | "member" | "intern" (each group gets its own block)
  //   bio:        one or two short sentences (optional)
  //   expertise:  list of short tags (optional)
  //   experience, education, work: lists of { title, place, years } shown in the detail view (optional)
  //   website, linkedin, scholar, huggingface: full URLs (optional)
  //   github:     username only (optional)   email: optional   km: Khmer name (optional)
  //   photo:      path to a square photo, e.g. "assets/img/team/sobon.jpg" (optional, initials are shown without it)
  team: [
    {
      id: "sovanreach",
      name: "Dr. Kong Vungsovanreach", km: "", role: "Lead, AI & Big Data", group: "lead",
      bio: "Postdoctoral researcher at Chungbuk National University, where he completed his PhD in Big Data in 2026. Has published 18 papers and was a software engineer before moving into research.",
      expertise: ["Computer vision", "Deep learning", "Medical AI", "LLM applications", "Big data"],
      experience: [
        { title: "Postdoctoral Researcher", place: "AI Convergence Lab, Chungbuk National University", years: "2026 to now" },
        { title: "Research Assistant", place: "Chungbuk National University", years: "2020 to 2026" },
        { title: "IT Instructor", place: "Korea Software HRD Center, Cambodia", years: "2019 to 2020" },
      ],
      education: [
        { title: "PhD in Big Data", place: "Chungbuk National University", years: "2022 to 2026" },
        { title: "MSc in Big Data", place: "Chungbuk National University", years: "2020 to 2022" },
        { title: "BSc in Computer Science", place: "The University of Cambodia", years: "2014 to 2019" },
      ],
      work: [
        { title: "Fall detection in video from body pose angles", place: "PLoS One", years: "2025" },
        { title: "Super-resolution for periodontal bone loss segmentation in dental X-rays", place: "Bioengineering", years: "2024" },
        { title: "QA-SQL: text-to-SQL generation with few-shot prompting", place: "PeerJ Computer Science", years: "2026" },
        { title: "Detecting motorcycle riders without helmets from surveillance cameras", place: "KMIS Conference", years: "2023" },
      ],
      website: "https://sovanreach.com", github: "kvsovanreach",
      scholar: "https://scholar.google.com/citations?user=qZqSMicAAAAJ&hl=en",
      linkedin: "https://www.linkedin.com/in/kvsovanreach/",
      email: "",
    },
    {
      id: "sobon",
      name: "Mr. Phon Sobon", km: "", role: "AI Engineer", group: "member",
      bio: "AI engineer at DTWG and a former data analyst at MPTC. Builds AI for the Khmer language.",
      expertise: ["NLP", "Speech", "Computer vision", "Data analytics"],
      experience: [
        { title: "AI Engineer", place: "Digital Transformation Working Group, MPTC", years: "2025 to now" },
        { title: "Researcher, Computer Vision", place: "BoxDataLab Fellowship", years: "2026 to now" },
        { title: "Data Analyst", place: "Ministry of Post and Telecommunications", years: "2024 to 2026" },
      ],
      education: [
        { title: "Professional Certificate in Artificial Intelligence", place: "American University of Phnom Penh", years: "2026" },
        { title: "BSc in Computer Science", place: "Royal University of Phnom Penh", years: "2021 to 2025" },
        { title: "IT Expert Program", place: "ISTAD", years: "" },
      ],
      work: [
        { title: "Khmer captions for Cambodian tourism images", place: "khmer_Captioning", years: "" },
        { title: "Small Khmer OCR", place: "mini-kh-ocr", years: "" },
      ],
      website: "https://phonsobon.github.io", github: "PhonSobon",
      linkedin: "https://www.linkedin.com/in/sobon-phon-619a14264",
      huggingface: "https://huggingface.co/phonsobon",
      email: "",
    },
    // TODO: add a bio, expertise, experience and education for Mr. Khem Thay.
    {
      id: "thay",
      name: "Mr. Khem Thay", km: "", role: "Member", group: "member", bio: "", expertise: [],
      linkedin: "https://www.linkedin.com/in/thay-khem-4811a4229/", website: "", github: "", email: "",
    },
    // TODO: replace with the intern's name. Add one entry per intern.
    { id: "intern", name: "Intern", km: "", role: "", group: "intern", bio: "", expertise: [], website: "", github: "", email: "" },
  ],

  // Projects.
  //   id:       short slug, used by the `project <id>` command
  //   platform: the product or system the work is for
  //   tags:     short labels for the kind of work
  //   status:   "active" | "planned" | "done" (optional)   year: optional
  //   details, owner, link: optional, shown when the project is opened
  //   team:     ids of the members working on it, e.g. ["sovanreach", "sobon"]. Links projects and profiles both ways.
  //   image:    path to a screenshot or diagram, e.g. "assets/img/projects/khmer-asr.png" (optional)
  projects: [
    {
      id: "face-checkin",
      name: "Face Check-in",
      platform: "EventKH",
      summary: "Attendees check in to events on EventKH with their face.",
      tags: ["Face recognition"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
    {
      id: "khmer-asr",
      name: "Khmer ASR",
      platform: "Chaktomuk (CTM)",
      summary: "Khmer speech recognition for the Chaktomuk (CTM) platform. It turns spoken Khmer into text.",
      tags: ["Speech recognition", "Khmer"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
    {
      id: "global-search",
      name: "Global Search",
      platform: "Chaktomuk (CTM)",
      summary: "Search for the Chaktomuk (CTM) platform. OCR reads the Khmer text in documents and images so it can be searched.",
      tags: ["OCR", "Search", "Khmer"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
    {
      id: "face-attendance",
      name: "Student Face Attendance",
      platform: "University Management System (UMS)",
      summary: "Students are marked present by face in the University Management System (UMS).",
      tags: ["Face recognition"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
  ],

  // TODO: add more contact details. Empty values are hidden.
  contact: {
    lead: "Dr. Kong Vungsovanreach",
    website: "https://sovanreach.com",
    email: "",
    github: "https://github.com/ai-dtwg",
    telegram: "",
    address: "",
  },
};
