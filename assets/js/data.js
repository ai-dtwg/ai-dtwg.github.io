/*
==================================================================================
|| AI & Big Data, DTWG | Site content                                           ||
||                                                                              ||
|| Everything shown on the site: group, expertise, team, projects, contact.     ||
|| Edit this file only. There is no build step. TODO marks missing content.     ||
||                                                                              ||
|| Developed by : KONG Vungsovanreach                                           ||
|| Position     : Lead, AI & Big Data Sub Working Group, DTWG (MPTC)            ||
|| Date         : 20 November 2026                                              ||
|| Repository   : https://github.com/ai-dtwg/ai-dtwg.github.io                  ||
==================================================================================
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
    kind_km: "អនុក្រុមការងារ",
    tagline: "The AI and Big Data team of DTWG.",
    tagline_km: "ក្រុមការងារ AI និង Big Data របស់ DTWG។",
    // One string per paragraph.
    about: [
      "We are the AI & Big Data sub working group of the Digital Transformation Working Group (DTWG) at the Ministry of Post and Telecommunications (MPTC). Anything in DTWG that involves AI or Big Data comes to us.",
      "The team combines research and engineering: computer vision, Khmer language technology, LLM applications and data analytics.",
    ],
    // Khmer version of the same paragraphs, shown when the visitor switches language.
    about_km: [
      "យើងជាអនុក្រុមការងារបញ្ញាសិប្បនិម្មិត និងទិន្នន័យធំ នៃក្រុមការងារបរិវត្តកម្មឌីជីថល (DTWG) របស់ក្រសួងប្រៃសណីយ៍និងទូរគមនាគមន៍ (MPTC)។ រាល់ការងារក្នុង DTWG ដែលពាក់ព័ន្ធនឹង AI ឬ Big Data គឺជាការទទួលខុសត្រូវរបស់យើង។",
      "ក្រុមយើងធ្វើទាំងការស្រាវជ្រាវ និងការអភិវឌ្ឍ៖ ចក្ខុវិស័យកុំព្យូទ័រ បច្ចេកវិទ្យាភាសាខ្មែរ កម្មវិធីប្រើប្រាស់ LLM និងការវិភាគទិន្នន័យ។",
    ],
  },

  // The group's expertise
  focus: [
    { key: "vision", title: "Computer Vision", desc: "Detection, segmentation and image analysis with deep learning.",
      title_km: "ចក្ខុវិស័យកុំព្យូទ័រ", desc_km: "ការរកឃើញវត្ថុ ការបែងចែករូបភាព និងការវិភាគរូបភាព ដោយប្រើ Deep Learning។" },
    { key: "khmer", title: "Khmer Language", desc: "NLP, speech and OCR for Khmer.",
      title_km: "ភាសាខ្មែរ", desc_km: "NLP សំឡេង និង OCR សម្រាប់ភាសាខ្មែរ។" },
    { key: "llm", title: "LLM Applications", desc: "Text-to-SQL and AI agents.",
      title_km: "កម្មវិធីប្រើប្រាស់ LLM", desc_km: "Text-to-SQL និង AI Agent។" },
    { key: "data", title: "Big Data & Analytics", desc: "Data pipelines, dashboards and reporting.",
      title_km: "ទិន្នន័យធំ និងការវិភាគ", desc_km: "ការបញ្ជូន និងរៀបចំទិន្នន័យ ផ្ទាំងព័ត៌មាន និងរបាយការណ៍។" },
  ],

  // Any text field can have a Khmer version by adding the same key with "_km" at the end
  // (for example bio and bio_km). It is shown when the visitor switches to Khmer; without it the English is used.

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
      role_km: "ប្រធានអនុក្រុមការងារ AI និង Big Data",
      bio: "Postdoctoral researcher at Chungbuk National University, where he completed his PhD in Big Data in 2026. Has published 18 papers and was a software engineer before moving into research.",
      bio_km: "អ្នកស្រាវជ្រាវក្រោយបណ្ឌិតនៅសាកលវិទ្យាល័យជាតិ Chungbuk ជាកន្លែងដែលលោកបានបញ្ចប់ថ្នាក់បណ្ឌិតផ្នែក Big Data នៅឆ្នាំ ២០២៦។ លោកបានបោះពុម្ពផ្សាយអត្ថបទស្រាវជ្រាវចំនួន ១៨ និងធ្លាប់ជាវិស្វករកម្មវិធី មុនពេលងាកមកធ្វើការស្រាវជ្រាវ។",
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
      role_km: "វិស្វករ AI",
      bio: "AI engineer at DTWG and a former data analyst at MPTC. Builds AI for the Khmer language.",
      bio_km: "វិស្វករ AI នៅ DTWG និងជាអតីតអ្នកវិភាគទិន្នន័យនៅ MPTC។ លោកបង្កើត AI សម្រាប់ភាសាខ្មែរ។",
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
      name: "Mr. Khem Thay", km: "", role: "Member", role_km: "សមាជិក", group: "member", bio: "", expertise: [],
      linkedin: "https://www.linkedin.com/in/thay-khem-4811a4229/", website: "", github: "", email: "",
    },
    // TODO: replace with the intern's name. Add one entry per intern.
    { id: "intern", name: "Intern", name_km: "អ្នកហាត់ការ", km: "", role: "", group: "intern", bio: "", expertise: [], website: "", github: "", email: "" },
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
      name_km: "ចុះវត្តមានដោយស្កេនមុខ",
      summary_km: "អ្នកចូលរួមចុះវត្តមានក្នុងកម្មវិធីនៅលើ EventKH ដោយប្រើមុខរបស់ខ្លួន។",
      tags: ["Face recognition"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
    {
      id: "khmer-asr",
      name: "Khmer ASR",
      platform: "Chaktomuk (CTM)",
      summary: "Khmer speech recognition for the Chaktomuk (CTM) platform. It turns spoken Khmer into text.",
      name_km: "សម្គាល់សំឡេងភាសាខ្មែរ (ASR)",
      summary_km: "ការសម្គាល់សំឡេងភាសាខ្មែរ សម្រាប់ប្រព័ន្ធ Chaktomuk (CTM)។ វាបំប្លែងសំឡេងនិយាយភាសាខ្មែរទៅជាអត្ថបទ។",
      tags: ["Speech recognition", "Khmer"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
    {
      id: "global-search",
      name: "Global Search",
      platform: "Chaktomuk (CTM)",
      summary: "Search for the Chaktomuk (CTM) platform. OCR reads the Khmer text in documents and images so it can be searched.",
      name_km: "ការស្វែងរករួម (Global Search)",
      summary_km: "មុខងារស្វែងរកសម្រាប់ប្រព័ន្ធ Chaktomuk (CTM)។ OCR អានអក្សរខ្មែរក្នុងឯកសារ និងរូបភាព ដើម្បីឱ្យអាចស្វែងរកបាន។",
      tags: ["OCR", "Search", "Khmer"],
      team: [], status: "", year: "", details: "", owner: "", link: "",
    },
    {
      id: "face-attendance",
      name: "Student Face Attendance",
      platform: "University Management System (UMS)",
      summary: "Students are marked present by face in the University Management System (UMS).",
      name_km: "កត់វត្តមាននិស្សិតដោយស្កេនមុខ",
      summary_km: "និស្សិតត្រូវបានកត់វត្តមានដោយការស្កេនមុខ ក្នុងប្រព័ន្ធគ្រប់គ្រងសាកលវិទ្យាល័យ (UMS)។",
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
