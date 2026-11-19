/*
 * Site content. Edit this file only. There is no build step.
 * Anything marked TODO is a placeholder to replace.
 */
window.SWG = {
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

  // The team.
  //   group:     "lead" | "member" | "intern" (each group gets its own block)
  //   bio:       one or two short sentences (optional)
  //   expertise: list of short tags (optional)
  //   website:   full URL (optional)   github: username only (optional)
  //   linkedin:  full profile URL (optional)
  //   email:     optional              km: Khmer name (optional)
  team: [
    {
      name: "Dr. Kong Vungsovanreach", km: "", role: "Lead, AI & Big Data", group: "lead",
      bio: "Postdoctoral researcher at Chungbuk National University, where he completed his PhD in Big Data in 2026. Has published 18 papers and was a software engineer before moving into research.",
      expertise: ["Computer vision", "Deep learning", "Medical AI", "LLM applications", "Big data"],
      website: "https://sovanreach.com", github: "kvsovanreach", email: "",
    },
    {
      name: "Mr. Phon Sobon", km: "", role: "AI Engineer", group: "member",
      bio: "AI engineer at DTWG and a former data analyst at MPTC. Builds AI for the Khmer language.",
      expertise: ["NLP", "Speech", "Computer vision", "Data analytics"],
      website: "https://phonsobon.github.io", github: "PhonSobon", email: "",
    },
    // TODO: add a bio and expertise for Mr. Khem Thay.
    { name: "Mr. Khem Thay", km: "", role: "Member", group: "member", bio: "", expertise: [], website: "", linkedin: "https://www.linkedin.com/in/thay-khem-4811a4229/", github: "", email: "" },
    // TODO: replace with the intern's name. Add one line per intern.
    { name: "Intern", km: "", role: "", group: "intern", bio: "", expertise: [], website: "", github: "", email: "" },
  ],

  // TODO: replace with the real projects.
  //   status: "active" | "planned" | "done"
  //   id:     short slug, used by the `project <id>` command
  projects: [
    {
      id: "sample-ai",
      name: "Sample AI Project",
      status: "active",
      year: "2026",
      summary: "Placeholder. One line on what this AI project does.",
      details: "Placeholder. Goals, scope and where the project stands now.",
      stack: ["Python", "PyTorch"],
      owner: "",
      link: "",
    },
    {
      id: "sample-data",
      name: "Sample Big Data Project",
      status: "planned",
      year: "2026",
      summary: "Placeholder. One line on what this data project does.",
      details: "Placeholder. Goals, scope and where the project stands now.",
      stack: ["Spark", "Airflow", "PostgreSQL"],
      owner: "",
      link: "",
    },
    {
      id: "sample-dashboard",
      name: "Sample Dashboard",
      status: "done",
      year: "2025",
      summary: "Placeholder. One line on what this dashboard shows.",
      details: "Placeholder. Goals, scope and what came out of it.",
      stack: ["dbt", "Superset"],
      owner: "",
      link: "",
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
