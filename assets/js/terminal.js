(() => {
  "use strict";

  const D = window.SWG;
  const $ = (s) => document.querySelector(s);
  const out = $("#out");
  const form = $("#prompt");
  const input = $("#cmd");
  const screen = $("#screen");
  const tabs = [...document.querySelectorAll(".tabs button")];
  const root = document.documentElement;
  // Effects (typing, motion, 3D background) can be switched off with the `fx` command.
  const still = () => root.dataset.fx === "off";
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));
  const THEMES = ["green", "amber", "ice", "paper"];
  const history = [];
  let histPos = 0;
  let busy = false;

  /* ── tiny DOM helpers (all content goes in as text nodes, never innerHTML) ── */
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

  function link(href, label) {
    if (!/^(https?:|mailto:|tel:)/i.test(href || "")) return document.createTextNode(label || href || "");
    const ext = /^https?:/i.test(href);
    return h("a", { href, target: ext ? "_blank" : null, rel: ext ? "noopener noreferrer" : null }, label || href);
  }

  // A clickable command, e.g. cmd("team") → runs `team` when clicked.
  const cmd = (text) => h("button", { type: "button", class: "kbd", "data-cmd": text }, text);

  const heading = (title, km) => h("h2", { class: "h" }, title, km && h("span", { class: "km", lang: "km" }, km));

  function ps1() {
    return h("span", { class: "ps1" },
      h("span", { class: "long" }, "guest@" + D.group.host, h("span", { class: "sep" }, ":")),
      h("span", { class: "path" }, "~"), h("span", { class: "sep" }, "$"));
  }

  /* ── banner ── */
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
  function bigText(text) {
    const chars = [...text.toUpperCase()].map((c) => GLYPHS[c]).filter(Boolean);
    return [0, 1, 2, 3, 4].map((row) => chars.map((g) => g[row]).join(" ")).join("\n");
  }

  /* ── commands ── */
  const commands = {
    help: {
      desc: "list commands",
      run: () => h("dl", { class: "help" },
        Object.entries(commands).filter(([, c]) => !c.hidden).map(([name, c]) => [
          h("dt", null, cmd(name), c.usage ? h("span", { class: "dim" }, " " + c.usage) : null),
          h("dd", null, c.desc),
        ]),
        h("dt", { class: "dim" }, "↑ / ↓ · Tab"), h("dd", null, "history, auto-complete")),
    },

    about: {
      desc: "about the group",
      run: () => [
        heading("about", "អំពីយើង"),
        D.group.about.map((p) => h("p", null, p)),
        h("h3", { class: "sub" }, "expertise"),
        h("dl", { class: "kv" }, D.focus.map((f) => [h("dt", null, f.title), h("dd", null, f.desc)])),
        h("p", { class: "dim" },
          D.team.length + " members, " + D.projects.length + " projects. See ", cmd("team"), " or ", cmd("projects"), "."),
      ],
    },

    team: {
      desc: "who is on the team",
      run: () => {
        // The whole card is clickable and opens the member's details.
        const card = (m) => h("li", { class: "card", "data-cmd": m.id ? "member " + m.id : null },
          h("div", { class: "card-head" },
            h("span", { class: "avatar", "aria-hidden": "true" }, initials(m.name)),
            h("div", null,
              h("div", { class: "name" }, m.name, m.km && h("span", { class: "km", lang: "km" }, m.km)),
              m.role && h("div", { class: "role" }, m.role))),
          m.bio && h("p", { class: "bio" }, m.bio),
          tags(m.expertise),
          m.id && h("div", { class: "meta more" }, cmd("member " + m.id)));
        const leads = D.team.filter((m) => m.group === "lead");
        const interns = D.team.filter((m) => m.group === "intern");
        const members = D.team.filter((m) => m.group !== "lead" && m.group !== "intern");
        return [
          heading("team", "សមាជិកក្រុម"),
          leads.length ? [h("h3", { class: "sub" }, leads.length > 1 ? "leads (" + leads.length + ")" : "lead"), h("ul", { class: "grid" }, leads.map(card))] : null,
          members.length ? [h("h3", { class: "sub" }, "members (" + members.length + ")"), h("ul", { class: "grid" }, members.map(card))] : null,
          interns.length ? [h("h3", { class: "sub" }, interns.length > 1 ? "interns (" + interns.length + ")" : "intern"), h("ul", { class: "grid" }, interns.map(card))] : null,
          h("p", { class: "dim tip" }, "Click a card to see the full profile."),
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
        const rows = (items) => h("ul", { class: "rows" }, items.map((it) => h("li", null,
          h("span", { class: "row-title" }, it.title),
          it.place && h("span", { class: "row-place" }, it.place),
          it.years && h("span", { class: "row-years" }, it.years))));
        const section = (title, items) => (items && items.length ? [h("h3", { class: "sub" }, title), rows(items)] : null);
        const links = [
          m.website && ["website", link(m.website, bare(m.website))],
          m.github && ["github", link("https://github.com/" + m.github, "@" + m.github)],
          m.linkedin && ["linkedin", link(m.linkedin, bare(m.linkedin).replace(/^www\./, ""))],
          m.scholar && ["scholar", link(m.scholar, "Google Scholar")],
          m.huggingface && ["hugging face", link(m.huggingface, bare(m.huggingface))],
          m.email && ["email", link("mailto:" + m.email, m.email)],
        ].filter(Boolean);
        const empty = !m.bio && !(m.expertise && m.expertise.length) && !m.experience && !m.education && !m.work && !links.length;
        return [
          h("div", { class: "profile" },
            h("span", { class: "avatar big", "aria-hidden": "true" }, initials(m.name)),
            h("div", null,
              h("h2", { class: "profile-name" }, m.name, m.km && h("span", { class: "km", lang: "km" }, m.km)),
              m.role && h("div", { class: "role" }, m.role))),
          m.bio && h("p", null, m.bio),
          m.expertise && m.expertise.length ? [h("h3", { class: "sub" }, "expertise"), tags(m.expertise)] : null,
          section("experience", m.experience),
          section("education", m.education),
          section("selected work", m.work),
          links.length ? [h("h3", { class: "sub" }, "links"), h("dl", { class: "kv" }, links.map(([k, v]) => [h("dt", null, k), h("dd", null, v)]))] : null,
          empty && h("p", { class: "dim" }, "No details added yet."),
          h("p", { class: "dim" }, "Back to ", cmd("team"), "."),
        ];
      },
    },

    projects: {
      desc: "what we are working on",
      run: () => [
        heading("projects", "គម្រោង"),
        h("ul", { class: "plist" }, D.projects.map((p) => h("li", { class: "proj" },
          h("div", { class: "proj-head" },
            h("span", { class: "proj-name" }, p.name),
            h("span", { class: "tag " + p.status }, "[" + p.status + "]"),
            p.year && h("span", { class: "dim" }, p.year)),
          h("p", null, p.summary),
          h("p", { class: "stack" }, (p.stack || []).join(" · "), "  → ", cmd("project " + p.id))))),
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
        return [
          heading(p.name),
          h("dl", { class: "kv" },
            h("dt", null, "status"), h("dd", null, h("span", { class: "tag " + p.status }, "[" + p.status + "]"), p.year ? " " + p.year : ""),
            h("dt", null, "summary"), h("dd", null, p.summary),
            p.details && [h("dt", null, "details"), h("dd", null, p.details)],
            p.stack && p.stack.length ? [h("dt", null, "stack"), h("dd", null, p.stack.join(" · "))] : null,
            p.owner && [h("dt", null, "owner"), h("dd", null, p.owner)],
            p.link && [h("dt", null, "link"), h("dd", null, link(p.link))]),
        ];
      },
    },

    contact: {
      desc: "contact details",
      run: () => {
        const c = D.contact;
        const rows = [
          c.lead && ["lead", c.lead],
          c.website && ["website", link(c.website, bare(c.website))],
          c.email && ["email", link("mailto:" + c.email, c.email)],
          c.github && ["github", link(c.github, bare(c.github))],
          c.telegram && ["telegram", link(c.telegram, bare(c.telegram))],
          c.address && ["address", c.address],
        ].filter(Boolean);
        return [
          heading("contact", "ទំនាក់ទំនង"),
          rows.length
            ? h("dl", { class: "kv" }, rows.map(([k, v]) => [h("dt", null, k), h("dd", null, v)]))
            : h("p", { class: "dim" }, "No contact details yet."),
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
          h("span", { class: "org" }, D.group.kind + " · " + D.org.name + " (" + D.org.short + ")")),
        h("p", { class: "tagline" }, "> " + D.group.tagline),
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
        const cur = document.documentElement.dataset.theme;
        const next = args[0] ? args[0].toLowerCase() : THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
        if (!THEMES.includes(next)) return h("p", { class: "err" }, "theme: unknown theme '" + args[0] + "'. Choose one of: " + THEMES.join(", "));
        setTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
        return h("p", null, "theme → ", h("span", { class: "ok" }, next));
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
        return h("p", null, "animation → ", h("span", { class: "ok" }, want));
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
  commands.members = { hidden: true, run: commands.team.run };
  commands.home = { hidden: true, run: commands.banner.run };

  const bare = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const tags = (list) => (list && list.length ? h("ul", { class: "tags", "aria-label": "Expertise" }, list.map((t) => h("li", null, t))) : null);

  function initials(name) {
    const parts = name.trim().split(/\s+/).filter((w) => /^\p{L}/u.test(w) && !w.endsWith("."));
    return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }

  function setTheme(name) {
    document.documentElement.dataset.theme = name;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    document.querySelector('meta[name="theme-color"]').setAttribute("content", bg);
    emit("swg:theme");
  }

  /* ── execution ── */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

    tabs.forEach((t) => t.classList.toggle("on", t.dataset.cmd === name.toLowerCase()));
    emit("swg:cmd");
    if (opts.scroll !== false) entry.scrollIntoView({ block: "start", behavior: still() ? "auto" : "smooth" });
  }

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

  /* ── events ── */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const line = input.value;
    input.value = "";
    submit(line);
  });

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
    // Links inside a clickable card still behave as links, and selecting text does not trigger it.
    const btn = e.target.closest("a") ? null : e.target.closest("[data-cmd]");
    if (btn && !(btn.matches(".card") && String(getSelection()))) { submit(btn.dataset.cmd, { animate: true }); return; }
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

  /* ── boot ── */
  (async function boot() {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
    if (THEMES.includes(saved)) setTheme(saved);

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
    out.append(h("p", { class: "dim" }, "Type ", cmd("help"), " to see the commands, or tap a tab above."));
    form.classList.remove("busy");
    busy = false;

    const target = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    if (/^[a-z]+$/.test(target) && Object.prototype.hasOwnProperty.call(commands, target) && target !== "clear") {
      await submit(target, { animate: true });
    }
    if (matchMedia("(pointer: fine)").matches) input.focus({ preventScroll: true });
  })();
})();
