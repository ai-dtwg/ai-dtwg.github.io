/*
==================================================================================
|| AI & Big Data, DTWG | Terminal                                               ||
||                                                                              ||
|| Commands, popups, language switch and everything the visitor interacts       ||
|| with. Content comes from data.js; the 3D background lives in scene.js.       ||
||                                                                              ||
|| Developed by : KONG Vungsovanreach                                           ||
|| Position     : Lead, AI & Big Data Sub Working Group, DTWG (MPTC)            ||
|| Date         : 20 November 2026                                              ||
|| Repository   : https://github.com/ai-dtwg/ai-dtwg.github.io                  ||
==================================================================================
*/
(() => {
  "use strict";

  /* ----------------------------------------------------------------------
   * 1. Setup and state
   * ---------------------------------------------------------------------- */

  const D = window.SWG; // all site content, defined in data.js
  const $ = (s) => document.querySelector(s);

  // Page elements
  const out = $("#out");
  const form = $("#prompt");
  const input = $("#cmd");
  const screen = $("#screen");
  const tabs = [...document.querySelectorAll(".tabs button:not(.lang-toggle)")];
  const root = document.documentElement;

  // Effects (typing, motion, 3D background) can be switched off with the `fx` command.
  const still = () => root.dataset.fx === "off";
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  // Options the visitor can change
  const THEMES = ["green", "amber", "ice", "paper"];
  const LANGS = { en: "English", km: "ខ្មែរ" };
  let lang = "en";            // current language code
  let lastSection = "about";  // last section shown, reprinted when the language changes

  // Prompt state
  const history = [];  // commands typed so far (note: this hides window.history inside this file)
  let histPos = 0;     // position in history while pressing the up and down keys
  let busy = false;    // true while a command is being typed out or printed

  /* ----------------------------------------------------------------------
   * 2. Language
   * Interface text is translated here. Content is translated in data.js
   * with "_km" fields.
   * ---------------------------------------------------------------------- */

  // Interface text in Khmer, keyed by the English text. Anything missing falls back to English.
  const KM = {
    "list commands": "បង្ហាញបញ្ជីពាក្យបញ្ជា",
    "about the group": "អំពីក្រុមការងារ",
    "who is on the team": "សមាជិកក្រុម",
    "show one team member": "បង្ហាញសមាជិកម្នាក់",
    "what we are working on": "គម្រោងដែលយើងកំពុងធ្វើ",
    "show one project": "បង្ហាញគម្រោងមួយ",
    "contact details": "ព័ត៌មានទំនាក់ទំនង",
    "show everything": "បង្ហាញទាំងអស់",
    "show the banner": "បង្ហាញបដា",
    "change colors": "ប្តូរពណ៌",
    "turn animation on or off": "បើក ឬបិទចលនា",
    "switch language": "ប្តូរភាសា",
    "clear the screen": "សម្អាតអេក្រង់",
    "history, auto-complete": "ប្រវត្តិពាក្យបញ្ជា និងការបំពេញស្វ័យប្រវត្តិ",
    "expertise": "ជំនាញ",
    "lead": "ប្រធានក្រុម",
    "leads": "ប្រធានក្រុម",
    "members": "សមាជិក",
    "intern": "អ្នកហាត់ការ",
    "interns": "អ្នកហាត់ការ",
    "experience": "បទពិសោធន៍ការងារ",
    "education": "ការសិក្សា",
    "selected work": "ស្នាដៃ",
    "projects": "គម្រោង",
    "team": "ក្រុមការងារ",
    "links": "តំណភ្ជាប់",
    "details": "ព័ត៌មានលម្អិត",
    "type of work": "ប្រភេទការងារ",
    "view profile": "មើលប្រវត្តិរូប",
    "view project": "មើលគម្រោង",
    "Click a card to open the full profile.": "ចុចលើកាតដើម្បីមើលប្រវត្តិរូបពេញលេញ។",
    "Click a project to open it.": "ចុចលើគម្រោងដើម្បីមើលលម្អិត។",
    "No details added yet.": "មិនទាន់មានព័ត៌មានលម្អិតនៅឡើយទេ។",
    "No contact details yet.": "មិនទាន់មានព័ត៌មានទំនាក់ទំនងនៅឡើយទេ។",
    "Back to ": "ត្រឡប់ទៅ ",
    "for ": "សម្រាប់ ",
    "close": "បិទ",
    "copy link": "ចម្លងតំណ",
    "copied": "បានចម្លង",
    "copy failed": "ចម្លងមិនបាន",
    "website": "គេហទំព័រ",
    "email": "អ៊ីមែល",
    "address": "អាសយដ្ឋាន",
    "status": "ស្ថានភាព",
    "year": "ឆ្នាំ",
    "owner": "អ្នកទទួលខុសត្រូវ",
    "link": "តំណ",
    "language": "ភាសា",
    "animation": "ចលនា",
    "theme": "ពណ៌",
  };
  // Translate a piece of interface text.
  const t = (text) => (lang === "km" && KM[text]) || text;
  // Content from data.js: uses the "_km" version of a field when Khmer is on and one exists.
  const L = (obj, key) => (lang === "km" && obj[key + "_km"]) || obj[key];

  // Switch language and update the button in the tab bar.
  function setLang(code) {
    lang = code;
    root.lang = code;
    const toggle = $("#lang-toggle");
    if (toggle) {
      // The button shows the language you would switch to.
      toggle.replaceChildren(...(code === "km"
        ? [h("span", { class: "full" }, "English"), h("span", { class: "short" }, "EN")]
        : ["ខ្មែរ"]));
      toggle.lang = code === "km" ? "en" : "km";
      toggle.setAttribute("aria-label", code === "km" ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ");
    }
  }

  // The line under the first screen that tells visitors what to do next.
  const hint = () => (lang === "km"
    ? h("p", { class: "dim" }, "វាយ ", cmd("help"), " ដើម្បីមើលពាក្យបញ្ជា ឬចុចផ្ទាំងខាងលើ។")
    : h("p", { class: "dim" }, "Type ", cmd("help"), " to see the commands, or tap a tab above."));

  /* ----------------------------------------------------------------------
   * 3. Small helpers
   * Elements are built with h(), never with innerHTML.
   * ---------------------------------------------------------------------- */

  // Build an element: h("p", { class: "dim" }, "text", childNode, ...).
  // Children are added as text nodes or elements, never as HTML, so data cannot inject markup.
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false || kid === "") continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  // A link. Only http, https, mailto and tel addresses become links; anything else is shown as text.
  function link(href, label) {
    if (!/^(https?:|mailto:|tel:)/i.test(href || "")) return document.createTextNode(label || href || "");
    const ext = /^https?:/i.test(href);
    return h("a", { href, target: ext ? "_blank" : null, rel: ext ? "noopener noreferrer" : null }, label || href);
  }

  // A clickable command, e.g. cmd("team") → runs `team` when clicked.
  const cmd = (text) => h("button", { type: "button", class: "kbd", "data-cmd": text }, text);

  // Section heading: the command name with its Khmer label beside it.
  const heading = (title, km) => h("h2", { class: "h" }, title, km && h("span", { class: "km", lang: "km" }, km));

  // The prompt, e.g. guest@ai-bigdata:~$
  function ps1() {
    return h("span", { class: "ps1" },
      h("span", { class: "long" }, "guest@" + D.group.host, h("span", { class: "sep" }, ":")),
      h("span", { class: "path" }, "~"), h("span", { class: "sep" }, "$"));
  }

  // A web address without the protocol or trailing slash, for display.
  const bare = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Initials for the avatar box. Titles such as "Dr." and "Mr." are skipped.
  function initials(name) {
    const parts = name.trim().split(/\s+/).filter((w) => /^\p{L}/u.test(w) && !w.endsWith("."));
    return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }

  // A row of small labels, used for expertise and for the type of work on a project.
  const tags = (list, label) => (list && list.length ? h("ul", { class: "tags", "aria-label": label || "Expertise" }, list.map((t) => h("li", null, t))) : null);

  // A member's photo, or their initials when there is no photo (or it fails to load).
  function avatar(m, size) {
    const box = h("span", { class: "avatar" + (size ? " " + size : ""), "aria-hidden": "true" }, initials(m.name));
    if (m.photo) {
      const img = h("img", { src: m.photo, alt: "", loading: "lazy" });
      img.addEventListener("error", () => img.remove());
      box.append(img);
    }
    return box;
  }

  // A button that opens another member or project popup.
  const chip = (k, it) => h("button", { type: "button", class: "chip", "data-open": k + ":" + it.id },
    k === "member" ? avatar(it, "tiny") : null, L(it, "name"));

  /* ----------------------------------------------------------------------
   * 4. Views
   * Larger pieces of output shared by commands and popups.
   * ---------------------------------------------------------------------- */

  // Block letters for the banner. Each letter is five rows tall.
  const GLYPHS = {
    A: [" ███ ", "█   █", "█████", "█   █", "█   █"],
    B: ["████ ", "█   █", "████ ", "█   █", "████ "],
    D: ["████ ", "█   █", "█   █", "█   █", "████ "],
    G: [" ████", "█    ", "█  ██", "█   █", " ████"],
    I: ["███", " █ ", " █ ", " █ ", "███"],
    T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
    "&": [" ██  ", "█  █ ", " ██ █", "█  █ ", " ██ █"],
    " ": ["  ", "  ", "  ", "  ", "  "],
  };
  // Turn text into banner rows using the block letters above.
  function bigText(text) {
    const chars = [...text.toUpperCase()].map((c) => GLYPHS[c]).filter(Boolean);
    return [0, 1, 2, 3, 4].map((row) => chars.map((g) => g[row]).join(" ")).join("\n");
  }

  // Full profile of one member. Used by the `member` command and by the popup.
  function profile(m, titleId) {
    const rows = (items) => h("ul", { class: "rows" }, items.map((it) => h("li", null,
      h("span", { class: "row-title" }, it.title),
      it.place && h("span", { class: "row-place" }, it.place),
      it.years && h("span", { class: "row-years" }, it.years))));
    const section = (title, items) => (items && items.length ? [h("h3", { class: "sub" }, title), rows(items)] : null);
    const links = [
      m.website && [t("website"), link(m.website, bare(m.website))],
      m.github && ["github", link("https://github.com/" + m.github, "@" + m.github)],
      m.linkedin && ["linkedin", link(m.linkedin, bare(m.linkedin).replace(/^www\./, ""))],
      m.scholar && ["scholar", link(m.scholar, "Google Scholar")],
      m.huggingface && ["hugging face", link(m.huggingface, bare(m.huggingface))],
      m.email && [t("email"), link("mailto:" + m.email, m.email)],
    ].filter(Boolean);
    const mine = D.projects.filter((p) => (p.team || []).includes(m.id));
    const empty = !mine.length && !m.bio && !(m.expertise && m.expertise.length) && !m.experience && !m.education && !m.work && !links.length;
    return [
      h("div", { class: "profile" },
        avatar(m, "big"),
        h("div", null,
          h("h2", { class: "profile-name", id: titleId || null }, L(m, "name"), m.km && h("span", { class: "km", lang: "km" }, m.km)),
          m.role && h("div", { class: "role" }, L(m, "role")))),
      m.bio && h("p", null, L(m, "bio")),
      m.expertise && m.expertise.length ? [h("h3", { class: "sub" }, t("expertise")), tags(m.expertise)] : null,
      section(t("experience"), m.experience),
      section(t("education"), m.education),
      section(t("selected work"), m.work),
      mine.length ? [h("h3", { class: "sub" }, t("projects")), h("ul", { class: "chips" }, mine.map((p) => h("li", null, chip("project", p))))] : null,
      links.length ? [h("h3", { class: "sub" }, t("links")), h("dl", { class: "kv" }, links.map(([k, v]) => [h("dt", null, k), h("dd", null, v)]))] : null,
      empty && h("p", { class: "dim" }, t("No details added yet.")),
    ];
  }

  // Full view of one project. Used by the `project` command and by the popup.
  function projectView(p, titleId) {
    const facts = [
      p.status && [t("status"), h("span", { class: "tag " + p.status }, "[" + p.status + "]")],
      p.year && [t("year"), p.year],
      p.owner && [t("owner"), p.owner],
      p.link && [t("link"), link(p.link, bare(p.link))],
    ].filter(Boolean);
    const crew = (p.team || []).map((id) => D.team.find((m) => m.id === id)).filter(Boolean);
    return [
      h("div", { class: "profile" },
        h("div", null,
          h("h2", { class: "profile-name", id: titleId || null }, L(p, "name")),
          p.platform && h("div", { class: "role" }, t("for ") + p.platform))),
      p.image && h("img", { class: "shot", src: p.image, alt: "Screenshot of " + p.name, loading: "lazy" }),
      h("p", null, L(p, "summary")),
      p.details && h("p", null, L(p, "details")),
      p.tags && p.tags.length ? [h("h3", { class: "sub" }, t("type of work")), tags(p.tags, "Type of work")] : null,
      crew.length ? [h("h3", { class: "sub" }, t("team")), h("ul", { class: "chips" }, crew.map((m) => h("li", null, chip("member", m))))] : null,
      facts.length ? [h("h3", { class: "sub" }, t("details")), h("dl", { class: "kv" }, facts.map(([k, v]) => [h("dt", null, k), h("dd", null, v)]))] : null,
    ];
  }

  // Apply a color theme and tell the 3D background to recolor itself.
  function setTheme(name) {
    root.dataset.theme = name;
    const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    document.querySelector('meta[name="theme-color"]').setAttribute("content", bg);
    emit("swg:theme");
  }

  /* ----------------------------------------------------------------------
   * 5. Commands
   * ---------------------------------------------------------------------- */

  // Each command has a description for `help`, an optional usage string, an optional
  // complete() list for Tab completion, and run(args), which returns the nodes to print.
  const commands = {
    help: {
      desc: "list commands",
      run: () => h("dl", { class: "help" },
        Object.entries(commands).filter(([, c]) => !c.hidden).map(([name, c]) => [
          h("dt", null, cmd(name), c.usage ? h("span", { class: "dim" }, " " + c.usage) : null),
          h("dd", null, t(c.desc)),
        ]),
        h("dt", { class: "dim" }, "↑ / ↓ · Tab"), h("dd", null, t("history, auto-complete"))),
    },

    about: {
      desc: "about the group",
      run: () => [
        heading("about", "អំពីយើង"),
        L(D.group, "about").map((p) => h("p", null, p)),
        h("h3", { class: "sub" }, t("expertise")),
        h("dl", { class: "kv" }, D.focus.map((f) => [h("dt", null, L(f, "title")), h("dd", null, L(f, "desc"))])),
        lang === "km"
          ? h("p", { class: "dim" }, "សមាជិក " + D.team.length + " នាក់ និងគម្រោង " + D.projects.length + "។ មើល ", cmd("team"), " ឬ ", cmd("projects"), "។")
          : h("p", { class: "dim" }, D.team.length + " members, " + D.projects.length + " projects. See ", cmd("team"), " or ", cmd("projects"), "."),
      ],
    },

    team: {
      desc: "who is on the team",
      run: () => {
        // The whole card is clickable and opens the member's profile in a popup.
        const card = (m) => h("li", { class: "card", "data-open": m.id ? "member:" + m.id : null },
          h("div", { class: "card-head" },
            avatar(m),
            h("div", null,
              h("div", { class: "name" }, L(m, "name"), m.km && h("span", { class: "km", lang: "km" }, m.km)),
              m.role && h("div", { class: "role" }, L(m, "role")))),
          m.bio && h("p", { class: "bio" }, L(m, "bio")),
          tags(m.expertise),
          m.id && h("div", { class: "meta more" }, h("button", { type: "button", class: "kbd" }, t("view profile"))));
        const leads = D.team.filter((m) => m.group === "lead");
        const interns = D.team.filter((m) => m.group === "intern");
        const members = D.team.filter((m) => m.group !== "lead" && m.group !== "intern");
        return [
          heading("team", "សមាជិកក្រុម"),
          leads.length ? [h("h3", { class: "sub" }, leads.length > 1 ? t("leads") + " (" + leads.length + ")" : t("lead")), h("ul", { class: "grid" }, leads.map(card))] : null,
          members.length ? [h("h3", { class: "sub" }, t("members") + " (" + members.length + ")"), h("ul", { class: "grid" }, members.map(card))] : null,
          interns.length ? [h("h3", { class: "sub" }, interns.length > 1 ? t("interns") + " (" + interns.length + ")" : t("intern")), h("ul", { class: "grid" }, interns.map(card))] : null,
          h("p", { class: "dim tip" }, t("Click a card to open the full profile.")),
        ];
      },
    },

    member: {
      desc: "show one team member",
      usage: "<id>",
      complete: () => D.team.map((m) => m.id).filter(Boolean),
      run: (args) => {
        const m = D.team.find((x) => x.id && x.id === (args[0] || "").toLowerCase());
        if (!m) {
          return h("p", { class: args[0] ? "err" : null },
            args[0] ? "member: no such member: " + args[0] + ". " : "usage: member <id>. ",
            "Available: ", D.team.filter((x) => x.id).map((x, i) => [i ? ", " : "", cmd("member " + x.id)]));
        }
        return [profile(m), h("p", { class: "dim" }, t("Back to "), cmd("team"), ".")];
      },
    },

    projects: {
      desc: "what we are working on",
      run: () => [
        heading("projects", "គម្រោង"),
        h("ul", { class: "plist" }, D.projects.map((p) => h("li", { class: "proj", "data-open": "project:" + p.id },
          h("div", { class: "proj-head" },
            h("span", { class: "proj-name" }, L(p, "name")),
            p.platform && h("span", { class: "proj-for" }, t("for ") + p.platform),
            p.status && h("span", { class: "tag " + p.status }, "[" + p.status + "]"),
            p.year && h("span", { class: "dim" }, p.year)),
          h("p", null, L(p, "summary")),
          tags(p.tags, "Type of work"),
          (p.team || []).length ? h("div", { class: "crew" }, p.team.map((id) => D.team.find((m) => m.id === id)).filter(Boolean).map((m) => avatar(m, "tiny"))) : null,
          h("div", { class: "meta more" }, h("button", { type: "button", class: "kbd" }, t("view project")))))),
        h("p", { class: "dim tip" }, t("Click a project to open it.")),
      ],
    },

    project: {
      desc: "show one project",
      usage: "<id>",
      complete: () => D.projects.map((p) => p.id),
      run: (args) => {
        const p = D.projects.find((x) => x.id === (args[0] || "").toLowerCase());
        if (!p) {
          return h("p", { class: args[0] ? "err" : null },
            args[0] ? "project: no such project: " + args[0] + ". " : "usage: project <id>. ",
            "Available: ", D.projects.map((x, i) => [i ? ", " : "", cmd("project " + x.id)]));
        }
        return [projectView(p), h("p", { class: "dim" }, t("Back to "), cmd("projects"), ".")];
      },
    },

    contact: {
      desc: "contact details",
      run: () => {
        const c = D.contact;
        const rows = [
          c.lead && [t("lead"), c.lead],
          c.website && [t("website"), link(c.website, bare(c.website))],
          c.email && [t("email"), link("mailto:" + c.email, c.email)],
          c.github && ["github", link(c.github, bare(c.github))],
          c.telegram && ["telegram", link(c.telegram, bare(c.telegram))],
          c.address && [t("address"), c.address],
        ].filter(Boolean);
        return [
          heading("contact", "ទំនាក់ទំនង"),
          rows.length
            ? h("dl", { class: "kv" }, rows.map(([k, v]) => [h("dt", null, k), h("dd", null, v)]))
            : h("p", { class: "dim" }, t("No contact details yet.")),
        ];
      },
    },

    all: {
      desc: "show everything",
      run: () => ["about", "team", "projects", "contact"].map((n) => h("div", { class: "entry" }, commands[n].run([]))),
    },

    banner: {
      desc: "show the banner",
      run: () => [
        h("pre", { class: "banner", role: "img", "aria-label": D.group.name }, bigText(D.group.name)),
        h("p", { class: "banner-meta" },
          h("span", { class: "km", lang: "km" }, D.group.km),
          h("span", { class: "org" }, L(D.group, "kind") + " · " + (lang === "km" ? D.org.km : D.org.name) + " (" + D.org.short + ")")),
        h("p", { class: "tagline" }, "> " + L(D.group, "tagline")),
        D.org.parent && h("a", { class: "ministry", href: D.org.parent.url, target: "_blank", rel: "noopener noreferrer" },
          h("img", { src: D.org.parent.logo, alt: "", width: "44", height: "44" }),
          h("span", null,
            h("span", { class: "km", lang: "km" }, D.org.parent.km),
            h("span", { class: "en" }, D.org.parent.name + " (" + D.org.parent.short + ")"))),
      ],
    },

    theme: {
      desc: "change colors",
      usage: "[" + THEMES.join("|") + "]",
      complete: () => THEMES,
      run: (args) => {
        const cur = root.dataset.theme;
        const next = args[0] ? args[0].toLowerCase() : THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
        if (!THEMES.includes(next)) return h("p", { class: "err" }, "theme: unknown theme '" + args[0] + "'. Choose one of: " + THEMES.join(", "));
        setTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
        return h("p", null, t("theme") + " → ", h("span", { class: "ok" }, next));
      },
    },

    fx: {
      desc: "turn animation on or off",
      usage: "[on|off]",
      complete: () => ["on", "off"],
      run: (args) => {
        const want = (args[0] || (still() ? "on" : "off")).toLowerCase();
        if (want !== "on" && want !== "off") return h("p", { class: "err" }, "usage: fx [on|off]");
        root.dataset.fx = want;
        try { localStorage.setItem("fx", want); } catch (e) { /* storage unavailable */ }
        emit("swg:fx", { on: want === "on" });
        return h("p", null, t("animation") + " → ", h("span", { class: "ok" }, want));
      },
    },

    lang: {
      desc: "switch language",
      usage: "[en|km]",
      complete: () => Object.keys(LANGS),
      run: (args) => {
        const want = (args[0] || (lang === "km" ? "en" : "km")).toLowerCase();
        if (!LANGS[want]) return h("p", { class: "err" }, "usage: lang [en|km]");
        setLang(want);
        try { localStorage.setItem("lang", want); } catch (e) { /* storage unavailable */ }
        // Reprint the screen in the new language once this command has finished.
        setTimeout(async () => {
          out.replaceChildren();
          await run("banner", { scroll: false });
          await run(lastSection, { scroll: false });
          out.append(hint());
          window.scrollTo(0, 0);
        }, 0);
        return h("p", null, t("language") + " → ", h("span", { class: "ok" }, LANGS[want]));
      },
    },

    clear: { desc: "clear the screen", run: () => { out.replaceChildren(); return null; } },

    // small extras, not listed in help
    ls: { hidden: true, run: () => h("p", null, ["about", "team", "projects", "contact"].map((n, i) => [i ? "   " : "", cmd(n)])) },
    cat: {
      hidden: true,
      complete: () => ["about", "team", "projects", "contact"],
      run: (args) => {
        const name = (args[0] || "").replace(/\.\w+$|\/$/, "");
        return ["about", "team", "projects", "contact"].includes(name)
          ? commands[name].run([])
          : h("p", { class: "err" }, "cat: " + (args[0] || "") + ": No such file or directory");
      },
    },
    whoami: { hidden: true, run: () => h("p", null, "guest") },
    date: { hidden: true, run: () => h("p", null, new Date().toString()) },
    echo: { hidden: true, run: (args) => h("p", null, args.join(" ")) },
    history: { hidden: true, run: () => h("p", null, history.map((c, i) => [String(i + 1).padStart(3) + "  " + c, h("br")])) },
    sudo: { hidden: true, run: () => h("p", { class: "err" }, "guest is not in the sudoers file. This incident will be reported.") },
  };
  // Aliases
  commands.members = { hidden: true, run: commands.team.run };
  commands.home = { hidden: true, run: commands.banner.run };

  /* ----------------------------------------------------------------------
   * 6. Running commands
   * ---------------------------------------------------------------------- */

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Print the prompt and the command, run it, and print what it returns.
  // opts.animate types the command out; opts.scroll === false leaves the page where it is.
  async function run(line, opts = {}) {
    line = line.trim();
    const typed = h("span", { class: "typed" });
    const entry = h("div", { class: "entry" }, h("div", { class: "echo" }, ps1(), typed));
    out.append(entry);

    if (opts.animate && !still()) {
      for (const ch of line) { typed.textContent += ch; await sleep(28); }
      await sleep(120);
    } else {
      typed.textContent = line;
    }
    if (!line) return;

    const [name, ...args] = line.split(/\s+/);
    const c = Object.prototype.hasOwnProperty.call(commands, name.toLowerCase()) ? commands[name.toLowerCase()] : null;
    let result;
    try {
      result = c ? c.run(args) : h("p", { class: "err" }, name + ": command not found. Try ", cmd("help"), ".");
    } catch (e) {
      result = h("p", { class: "err" }, name + ": " + e.message);
    }
    if (name.toLowerCase() === "clear") return;
    if (result) entry.append(h("div", { class: "outp" }, result));

    tabs.forEach((tab) => tab.classList.toggle("on", tab.dataset.cmd === name.toLowerCase()));
    if (["about", "team", "projects", "contact", "all"].includes(name.toLowerCase())) lastSection = name.toLowerCase();
    emit("swg:cmd");
    if (opts.scroll !== false) entry.scrollIntoView({ block: "start", behavior: still() ? "auto" : "smooth" });
  }

  // Run a command from the visitor: one at a time, and remembered in the history.
  async function submit(line, opts) {
    if (busy) return;
    busy = true;
    form.classList.add("busy");
    if (line.trim() && history[history.length - 1] !== line.trim()) history.push(line.trim());
    histPos = history.length;
    await run(line, opts);
    form.classList.remove("busy");
    busy = false;
  }

  // Tab completion for command names and their arguments.
  function complete() {
    const value = input.value.replace(/^\s+/, "");
    const parts = value.split(/\s+/);
    let pool, prefix;
    if (parts.length === 1) {
      pool = Object.keys(commands).filter((n) => !commands[n].hidden || n.startsWith(parts[0]) && parts[0]);
      prefix = "";
    } else {
      const c = commands[parts[0].toLowerCase()];
      pool = c && c.complete ? c.complete() : [];
      prefix = parts[0] + " ";
    }
    const word = parts[parts.length - 1].toLowerCase();
    const hits = pool.filter((n) => n.startsWith(word));
    if (hits.length === 1) {
      input.value = prefix + hits[0] + (parts.length === 1 && commands[hits[0]].usage ? " " : "");
    } else if (hits.length > 1) {
      let common = hits[0];
      for (const hit of hits) while (!hit.startsWith(common)) common = common.slice(0, -1);
      input.value = prefix + common;
    }
  }

  /* ----------------------------------------------------------------------
   * 7. Keyboard and mouse
   * ---------------------------------------------------------------------- */

  // Enter runs what was typed.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const line = input.value;
    input.value = "";
    submit(line);
  });

  // Up and down walk the history, Tab completes, Ctrl+L clears.
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      histPos = Math.max(0, Math.min(history.length, histPos + (e.key === "ArrowUp" ? -1 : 1)));
      input.value = history[histPos] || "";
    } else if (e.key === "Tab" && input.value.trim()) {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      out.replaceChildren();
    }
  });

  // Clickable commands (tabs and inline links), typed out as if the visitor ran them.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cmd]");
    if (btn) { if (modal.open) modal.close(); submit(btn.dataset.cmd, { animate: true }); return; }
    // Team cards and project rows open a popup. Links inside them still work, and selecting text does not trigger it.
    const opener = e.target.closest("a") ? null : e.target.closest("[data-open]");
    if (opener && !String(getSelection())) { const [k, id] = opener.dataset.open.split(":"); openById(k, id); return; }
    // Clicking empty terminal space focuses the prompt, without breaking text selection or links.
    if (screen.contains(e.target) && !e.target.closest("a, button, input") && !String(getSelection())) {
      input.focus({ preventScroll: true });
    }
  });

  // Cards lean toward the mouse.
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    out.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card || still()) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 7).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - (e.clientY - r.top) / r.height) * 7).toFixed(2) + "deg");
    });
    out.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) { card.style.removeProperty("--rx"); card.style.removeProperty("--ry"); }
    });
  }

  /* ----------------------------------------------------------------------
   * 8. Popups for members and projects
   * ---------------------------------------------------------------------- */

  // The two kinds of popup. Each lists its items, its path in the title bar and how to draw one item.
  const KINDS = {
    member: { items: D.team.filter((m) => m.id), path: "team", label: "member", view: (m) => profile(m, "modal-name") },
    project: { items: D.projects.filter((p) => p.id), path: "projects", label: "project", view: (p) => projectView(p, "modal-name") },
  };
  const modal = h("dialog", { class: "modal", "aria-labelledby": "modal-name" });
  document.body.append(modal);
  let kind = "member";
  let current = 0;

  // Open (or redraw) the popup on one item. dir slides the content in from that side,
  // focus names the button that keeps keyboard focus after the redraw.
  function show(k, index, dir, focus) {
    const items = KINDS[k].items;
    if (!items.length) return;
    kind = k;
    current = (index + items.length) % items.length;
    const it = items[current];
    const prev = items[(current - 1 + items.length) % items.length];
    const next = items[(current + 1) % items.length];
    modal.replaceChildren(
      h("div", { class: "modal-bar" },
        h("span", { class: "dots", "aria-hidden": "true" }, h("i"), h("i"), h("i")),
        h("span", { class: "bar-title" }, "~/" + KINDS[k].path + "/" + it.id),
        h("span", { class: "modal-count" }, (current + 1) + " / " + items.length),
        navigator.clipboard && h("button", { type: "button", class: "modal-close", "data-modal": "copy", "aria-label": "Copy a link to this " + KINDS[k].label }, t("copy link")),
        h("button", { type: "button", class: "modal-close", "data-modal": "close", "aria-label": "Close" }, t("close"))),
      h("div", { class: "modal-body" + (dir ? " from-" + dir : "") }, KINDS[k].view(it)),
      items.length > 1 && h("div", { class: "modal-nav" },
        h("button", { type: "button", "data-modal": "prev", "aria-label": "Previous " + KINDS[k].label + ": " + prev.name }, h("span", { "aria-hidden": "true" }, "← "), h("span", { class: "who" }, L(prev, "name"))),
        h("button", { type: "button", "data-modal": "next", "aria-label": "Next " + KINDS[k].label + ": " + next.name }, h("span", { class: "who" }, L(next, "name")), h("span", { "aria-hidden": "true" }, " →"))));
    if (!modal.open) { modal.showModal(); root.classList.add("modal-open"); }
    // Each popup has its own address, e.g. /#member-sobon, so it can be shared.
    window.history.replaceState(null, "", "#" + k + "-" + it.id);
    const target = modal.querySelector('[data-modal="' + (focus || "close") + '"]');
    if (target) target.focus({ preventScroll: true });
    emit("swg:cmd");
  }

  // Open the popup for a member or project id. Returns false when there is no such id.
  function openById(k, id) {
    if (!KINDS[k]) return false;
    const i = KINDS[k].items.findIndex((x) => x.id === id);
    if (i >= 0) show(k, i);
    return i >= 0;
  }

  // Opens whatever the address points at: "#team" runs a command, "#member-sobon" opens a popup.
  async function openHash() {
    const target = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    const deep = /^(member|project)-([a-z0-9-]+)$/.exec(target);
    if (deep && KINDS[deep[1]].items.some((x) => x.id === deep[2])) {
      if (!modal.open) await submit(KINDS[deep[1]].path, { animate: true });
      openById(deep[1], deep[2]);
    } else if (/^[a-z]+$/.test(target) && Object.prototype.hasOwnProperty.call(commands, target) && target !== "clear") {
      if (modal.open) modal.close();
      await submit(target, { animate: true });
    }
  }
  window.addEventListener("hashchange", openHash);

  // Buttons inside the popup, and a click on the dimmed background to close it.
  modal.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-modal]");
    if (e.target === modal || (btn && btn.dataset.modal === "close")) modal.close();
    else if (btn && btn.dataset.modal === "copy") {
      navigator.clipboard.writeText(location.href).then(() => {
        btn.textContent = t("copied");
        setTimeout(() => { if (btn.isConnected) btn.textContent = t("copy link"); }, 1600);
      }, () => { btn.textContent = t("copy failed"); });
    }
    else if (btn && btn.dataset.modal === "prev") show(kind, current - 1, "left", "prev");
    else if (btn && btn.dataset.modal === "next") show(kind, current + 1, "right", "next");
  });
  // Left and right arrow keys move between items. Escape is handled by the dialog itself.
  modal.addEventListener("keydown", (e) => {
    if (KINDS[kind].items.length < 2) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); show(kind, current - 1, "left", "prev"); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(kind, current + 1, "right", "next"); }
  });
  modal.addEventListener("close", () => {
    root.classList.remove("modal-open");
    window.history.replaceState(null, "", location.pathname + location.search);
  });
  // Swipe left or right to move to the next or previous one on touch screens.
  let swipe = null;
  modal.addEventListener("touchstart", (e) => { swipe = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; }, { passive: true });
  modal.addEventListener("touchend", (e) => {
    if (!swipe || KINDS[kind].items.length < 2) return;
    const dx = e.changedTouches[0].clientX - swipe.x, dy = e.changedTouches[0].clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(kind, current + (dx < 0 ? 1 : -1), dx < 0 ? "right" : "left");
  }, { passive: true });

  /* ----------------------------------------------------------------------
   * 9. Structured data for search engines
   * ---------------------------------------------------------------------- */

  // Describe the group and its members to search engines (schema.org JSON-LD), built from the same data.
  (function structuredData() {
    const site = (D.site || location.origin).replace(/\/$/, "");
    const person = (m) => {
      const title = /^(Dr|Mr|Ms|Mrs|Prof)\.\s+/.exec(m.name);
      const same = [m.website, m.github && "https://github.com/" + m.github, m.linkedin, m.scholar, m.huggingface].filter(Boolean);
      return {
        "@type": "Person",
        name: m.name.replace(/^(Dr|Mr|Ms|Mrs|Prof)\.\s+/, ""),
        honorificPrefix: title ? title[1] : undefined,
        jobTitle: m.role || undefined,
        description: m.bio || undefined,
        url: site + "/#member-" + m.id,
        sameAs: same.length ? same : undefined,
      };
    };
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: D.group.name + ", " + D.org.short,
      alternateName: D.group.km,
      description: D.group.about[0],
      url: site + "/",
      logo: site + "/assets/img/logo.svg",
      parentOrganization: D.org.parent && { "@type": "GovernmentOrganization", name: D.org.parent.name, alternateName: D.org.parent.km, url: D.org.parent.url },
      member: D.team.filter((m) => m.id && m.role).map(person),
      knowsAbout: D.focus.map((f) => f.title),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    document.head.append(el);
  })();

  /* ----------------------------------------------------------------------
   * 10. Start
   * ---------------------------------------------------------------------- */

  // Runs once when the page loads: restore saved choices, print the first screen,
  // then open whatever the address points at.
  (async function boot() {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
    if (THEMES.includes(saved)) setTheme(saved);
    // Language: the visitor's saved choice, else Khmer for browsers set to Khmer, else English.
    let savedLang = null;
    try { savedLang = localStorage.getItem("lang"); } catch (e) { /* storage unavailable */ }
    setLang(LANGS[savedLang] ? savedLang : (/^km\b/i.test(navigator.language || "") ? "km" : "en"));

    form.querySelector("#ps1").replaceWith(Object.assign(ps1(), { id: "ps1" }));
    $("#bar-title").textContent = "guest@" + D.group.host + ": ~";

    busy = true;
    form.classList.add("busy");
    // A short boot log, once per browser session.
    let booted = true;
    try { booted = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch (e) { /* storage unavailable */ }
    if (!booted && !still()) {
      const log = h("div", { class: "bootlog" });
      out.append(log);
      for (const text of ["mount /dtwg/ai-bigdata", "load " + D.team.length + " team members", "load " + D.projects.length + " projects", "start terminal"]) {
        log.append(h("div", null, h("span", { class: "ok" }, "[ ok ] "), text));
        await sleep(130);
      }
      await sleep(260);
      log.remove();
    }
    await run("banner", { animate: true, scroll: false });
    await run("about", { animate: true, scroll: false });
    out.append(hint());
    form.classList.remove("busy");
    busy = false;

    await openHash();
    if (matchMedia("(pointer: fine)").matches) input.focus({ preventScroll: true });
  })();
})();
