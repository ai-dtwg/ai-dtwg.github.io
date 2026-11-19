# AI & Big Data, DTWG Sub Working Group

Terminal-themed portfolio of the **AI & Big Data Sub Working Group** of the Digital Transformation Working Group (DTWG).

Plain HTML, CSS and JavaScript. No build step, no external dependencies.

## Edit the content

All content lives in [`assets/js/data.js`](assets/js/data.js): group description, focus areas, team, projects and contact details. Entries marked `TODO` are placeholders.

```
index.html              page shell
404.html                not-found page
assets/js/data.js       content  ← edit this
assets/js/terminal.js   terminal behaviour and commands
assets/css/style.css    themes and layout
assets/fonts/           Khmer Digital font files
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

This repository is named `ai-dtwg.github.io`, so GitHub Pages serves the `main` branch at
<https://ai-dtwg.github.io>. Push to `main` to publish. If the site does not appear, check
**Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.

## Terminal commands

`help` · `about` · `team` · `projects` · `project <id>` · `contact` · `all` · `banner` · `theme [green|amber|ice|paper]` · `clear`

A section can be linked directly, e.g. `https://ai-dtwg.github.io/#team`.

## Font

Khmer text uses [Khmer Digital](https://github.com/pisey-suon/mptc-khmerDigitalFont), the Khmer Unicode typeface released by the
Ministry of Post and Telecommunications of Cambodia, under the SIL Open Font License 1.1
(see [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt)).
