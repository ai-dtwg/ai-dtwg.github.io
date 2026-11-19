/*
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file only; no build step required.
 *  Everything marked "TODO" is placeholder content to replace.
 * ─────────────────────────────────────────────────────────────
 */
window.SWG = {
  org: {
    short: "DTWG",
    name: "Digital Transformation Working Group",
    km: "ក្រុមការងារបរិវត្តកម្មឌីជីថល",
  },

  group: {
    name: "AI & Big Data",
    kind: "Sub Working Group",
    km: "អនុក្រុមការងារបញ្ញាសិប្បនិម្មិត និងទិន្នន័យធំ",
    host: "ai-bigdata", // shown in the prompt: guest@ai-bigdata:~$
    tagline: "We build the AI and Big Data features behind digital transformation.",
    // TODO: replace with your own introduction (one string per paragraph)
    about: [
      "The AI & Big Data Sub Working Group is part of the Digital Transformation Working Group (DTWG). We are responsible for the AI and Big Data features of DTWG initiatives — from data platforms and pipelines to machine-learning models and the services that put them to use.",
      "We work with the other sub working groups to turn data into reliable, practical and responsible digital services.",
    ],
    established: "TODO: year",
  },

  // What the group is responsible for
  focus: [
    { key: "ai", title: "Artificial Intelligence", desc: "Machine learning, NLP and computer vision models, with a focus on Khmer language support." },
    { key: "data", title: "Big Data", desc: "Data platforms, pipelines, storage and processing at scale." },
    { key: "analytics", title: "Analytics", desc: "Dashboards, reporting and insight for evidence-based decisions." },
    { key: "mlops", title: "MLOps & Governance", desc: "Deployment, monitoring, data quality, privacy and responsible AI." },
  ],

  // TODO: replace with the real team.
  //   group:  "lead" | "member"
  //   github: username only (optional)   email: optional   km: Khmer name (optional)
  team: [
    { name: "Lead Name", km: "ឈ្មោះ", role: "Sub Working Group Lead", group: "lead", focus: "Strategy & coordination", github: "", email: "" },
    { name: "Co-Lead Name", km: "", role: "Co-Lead / Technical Lead", group: "lead", focus: "Architecture", github: "", email: "" },
    { name: "Member Name 01", km: "", role: "AI Engineer", group: "member", focus: "NLP", github: "", email: "" },
    { name: "Member Name 02", km: "", role: "Data Engineer", group: "member", focus: "Data pipelines", github: "", email: "" },
    { name: "Member Name 03", km: "", role: "Data Scientist", group: "member", focus: "Analytics", github: "", email: "" },
    { name: "Member Name 04", km: "", role: "ML Engineer", group: "member", focus: "MLOps", github: "", email: "" },
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
      summary: "Placeholder — describe an AI feature the group is building.",
      details: "Placeholder — add goals, scope, current progress and outcomes here.",
      stack: ["Python", "PyTorch"],
      owner: "Member Name 01",
      link: "",
    },
    {
      id: "sample-data",
      name: "Sample Big Data Project",
      status: "planned",
      year: "2026",
      summary: "Placeholder — describe a data platform or pipeline project.",
      details: "Placeholder — add goals, scope, current progress and outcomes here.",
      stack: ["Spark", "Airflow", "PostgreSQL"],
      owner: "Member Name 02",
      link: "",
    },
    {
      id: "sample-dashboard",
      name: "Sample Analytics Dashboard",
      status: "done",
      year: "2025",
      summary: "Placeholder — describe a finished analytics or reporting project.",
      details: "Placeholder — add goals, scope, current progress and outcomes here.",
      stack: ["dbt", "Superset"],
      owner: "Member Name 03",
      link: "",
    },
  ],

  // TODO: replace with real contact details. Empty values are hidden.
  contact: {
    email: "",
    github: "https://github.com/ai-dtwg",
    telegram: "",
    website: "",
    address: "",
  },
};
