# Setup — how this app was scaffolded

A walkthrough of how `angular-material-cdk-showcase` was created: the exact
CLI commands, the reasoning behind each flag, and the resulting project
structure. For how the theme system specifically works, see **THEMING.md**.

## 1. Create the workspace

```powershell
ng new angular-material-cdk-showcase `
  --routing `
  --style=scss `
  --test-runner=vitest `
  --package-manager=npm `
  --file-name-style-guide=2025 `
  --ai-config=none `
  --ssr=false
```

Angular CLI 21.2.10 was already installed globally, so no `npx`/version
pinning was needed. Flag choices, matched to this team's other Angular
projects (`angular-material-with-mfe` in particular):

- `--test-runner=vitest` and `--file-name-style-guide=2025` are actually the
  CLI's own defaults on 21.2.10 — passed explicitly for clarity, not because
  they changed anything. The `2025` style guide is what produces short
  filenames like `app.ts` / `home.ts` instead of `app.component.ts`.
- `--style=scss` — every sibling project uses SCSS, not plain CSS.
- `--package-manager=npm` — matches every sibling's committed
  `package-lock.json`.
- `--ai-config=none` and `--ssr=false` — this is a client-rendered demo app
  with no AI-tool config files needed.
- Left at CLI defaults (already correct): `--standalone` (true — no
  NgModules anywhere), `--strict` (true), git init + initial commit
  (`--skip-git` not passed — each project in this workspace is its own
  independent git repo), zone.js (no `--zoneless`).

This produced the base workspace: `src/app/app.ts|.html|.scss`,
`app.config.ts`, `app.routes.ts`, `.editorconfig`, `.gitignore`,
`.vscode/`, and — notably — a `.prettierrc` and a `test` architect target
already wired to the Vitest-backed `@angular/build:unit-test` builder in
`angular.json`, all generated automatically by this CLI version.

## 2. Add Angular Material + CDK

```powershell
cd angular-material-cdk-showcase
ng add @angular/material
```

`ng add` prompts for a starter color palette — any placeholder works here,
because it gets immediately overwritten by two custom M3 palettes (see
**THEMING.md**). This step is what actually pulls in `@angular/cdk` as a
dependency, updates `src/index.html` with the Roboto font `<link>`, and
seeds `src/styles.scss` with a first-draft `mat.theme()` block.

## 3. Project structure

```
src/
  index.html
  main.ts
  styles.scss            ← theme definitions (see THEMING.md)
  theme-indigo.scss       ← generated M3 palette
  theme-teal.scss         ← generated M3 palette
  app/
    app.ts / app.html / app.scss   ← root shell: toolbar + sidenav + router-outlet
    app.config.ts                   ← providers (router, theme initializer)
    app.routes.ts                   ← lazy-loaded page routes
    core/
      nav-items.ts                  ← sidenav link list (path/label/icon)
      services/
        theme.service.ts            ← signal-based theme state (THEMING.md)
    pages/
      home/                         ← landing page
    shared/
      user-menu/                    ← CDK Overlay-based account dropdown
```

Two folder conventions worth calling out, both matched to
`angular-material-with-mfe`:

- **`pages/`** holds route-level components, each lazy-loaded via
  `loadComponent()` in `app.routes.ts`. Adding a new showcase topic later is:
  new folder under `pages/`, one new route, one new entry in `nav-items.ts`
  — no changes to the shell itself.
- **`shared/`** holds cross-cutting, reusable components. It started empty
  (per the original scaffold plan — no premature abstraction) and got its
  first resident, `user-menu`, once the account-dropdown feature was added.

## 4. App shell

`app.ts`/`app.html` wires a `mat-sidenav-container` (toolbar + collapsible
nav + routed content) instead of using the `@angular/material:navigation`
schematic, so naming and styling could be controlled directly rather than
generated then rewired. Responsiveness comes from
`BreakpointObserver.observe(Breakpoints.Handset)` (`@angular/cdk/layout`),
converted to a signal via `toSignal()`: the sidenav's `mode` is `'side'`
(always visible) on desktop and `'over'` (overlay, closed by default, opened
via a hamburger button) on handset widths — a genuine functional use of CDK
in the shell itself, not just in a demo page.

## 5. Tooling

- **Prettier** — `.prettierrc` (`printWidth: 100`, `singleQuote: true`,
  `*.html` parsed with the `angular` parser) matches every sibling project
  exactly; `prettier` is a devDependency, not a global tool.
- **`.editorconfig`** — identical to `angular-material-with-mfe`'s, diffed
  and confirmed to match byte-for-byte.
- **No ESLint** — consistent with every sibling project in this workspace.
- **Vitest**, not Karma/Jasmine — the current-generation choice for
  Angular 21 projects here (`angular21-vitest`, `angular-material-with-mfe`
  both use it too).

## 6. Verifying it works

```powershell
npm run build     # production build, no TS/template errors
npm test           # Vitest run
npx prettier --check "src/**/*.{ts,html,scss}"
npm start          # ng serve, then open the app in a browser
```

The build has one non-fatal note worth knowing: the initial bundle sits
around 690–700 kB (multiple Material component modules imported eagerly into
the always-visible shell), so `angular.json`'s production budget was raised
from the CLI's default 500 kB warning threshold to 700 kB rather than trying
to trim the shell's dependencies artificially.
