/*
 * Site content. Edit this file only. There is no build step.
 * Anything marked TODO is a placeholder to replace.
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
    tagline: "The AI and Big Data team of DTWG.",
    // One string per paragraph.
    about: [
      "We are the AI & Big Data sub working group of the Digital Transformation Working Group (DTWG). Anything in DTWG that involves AI or Big Data comes to us.",
      "This page shows who is on the team, what we are working on, and how to reach us.",
    ],
  },

  // What the group works on
  focus: [
    { key: "ai", title: "AI", desc: "Machine learning models, including Khmer language and vision." },
    { key: "data", title: "Big Data", desc: "Collecting, storing and processing large datasets." },
    { key: "analytics", title: "Analytics", desc: "Reports and dashboards built on that data." },
    { key: "ops", title: "Operations", desc: "Running models and pipelines in production and keeping the data clean." },
  ],

  // TODO: replace the placeholder members.
  //   group:   "lead" | "member"
  //   website: full URL (optional)   github: username only (optional)
  //   email:   optional              km: Khmer name (optional)
  team: [
    { name: "KONG Vungsovanreach", km: "", role: "Lead, AI & Big Data", group: "lead", focus: "", website: "https://sovanreach.com", github: "", email: "" },
    { name: "Member Name 01", km: "", role: "AI Engineer", group: "member", focus: "NLP", website: "", github: "", email: "" },
    { name: "Member Name 02", km: "", role: "Data Engineer", group: "member", focus: "Data pipelines", website: "", github: "", email: "" },
    { name: "Member Name 03", km: "", role: "Data Scientist", group: "member", focus: "Analytics", website: "", github: "", email: "" },
    { name: "Member Name 04", km: "", role: "ML Engineer", group: "member", focus: "Deployment", website: "", github: "", email: "" },
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
      owner: "Member Name 01",
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
      owner: "Member Name 02",
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
      owner: "Member Name 03",
      link: "",
    },
  ],

  // TODO: add more contact details. Empty values are hidden.
  contact: {
    lead: "KONG Vungsovanreach",
    website: "https://sovanreach.com",
    email: "",
    github: "https://github.com/ai-dtwg",
    telegram: "",
    address: "",
  },
};
