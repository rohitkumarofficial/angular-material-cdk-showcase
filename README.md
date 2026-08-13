# Angular Material + CDK Showcase

A living catalog of Angular Material and Angular CDK patterns for the team — each topic is a real, working page with source you can copy straight into your own feature work, not a toy snippet.

Built on Angular 21, standalone components, signals, and a custom Material 3 theme with a color dropdown (Indigo/Teal) and an independent light/dark toggle — see **[docs/THEMING.md](docs/THEMING.md)**.

## Topics

| Topic | Route | What it shows |
|---|---|---|
| **Call Board** | `/call-board` | A mock nurse call-board demonstrating three distinct CDK Overlay patterns side by side (a push-mode reflow panel, a modal slide-in, and a click-positioned popover), CDK virtual scrolling, and a Material table with sort/pagination. See **[docs/CALL-BOARD.md](docs/CALL-BOARD.md)**. |
| **Ticker Search** | `/ticker-search` | A typeahead search box built on CDK's `cdkConnectedOverlay` directive, anchored to a text input (not a button), width-matched, with live-filtered results as you type. |
| **Forms** | `/forms` | A Reactive Forms showcase across the common Material field types (input, select, datepicker, radio, slide-toggle) with validation, plus a `cdkTextareaAutosize` field. |
| **Modal Dialog** | `/modal-demo` | A centered, tabbed modal built directly on `@angular/cdk/dialog`'s `Dialog` service — the CDK primitive `MatDialog` is itself built on. |

The toolbar's account menu (`shared/user-menu/`) is its own CDK Overlay example — a dropdown built on `cdkConnectedOverlay`, documented in **[docs/USER-MENU.md](docs/USER-MENU.md)**.

## Getting started

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

```bash
npm run build     # production build → dist/
npm test           # Vitest unit tests
npx prettier --check "src/**/*.{ts,html,scss}"
```

## Docs

Deeper write-ups of how specific patterns were built live in **[docs/](docs/)**:

- **[UNDERSTANDING-MATERIAL-AND-CDK.md](docs/UNDERSTANDING-MATERIAL-AND-CDK.md)** — start here if you're new to Angular Material or CDK. A beginner-friendly, end-to-end walkthrough of this whole project: what Material and CDK each are, where every piece is used, how the animations work with no `@angular/animations` package, how theming works, and why Material is a strong fit over Bootstrap for an Angular app.
- **[SETUP.md](docs/SETUP.md)** — how the workspace itself was scaffolded (`ng new` flags, tooling, conventions).
- **[THEMING.md](docs/THEMING.md)** — the two custom M3 color palettes, the light/dark toggle, and the `ThemeService`.
- **[USER-MENU.md](docs/USER-MENU.md)** — the account-menu CDK Overlay dropdown.
- **[CALL-BOARD.md](docs/CALL-BOARD.md)** — a full Material + CDK feature reference for the Call Board page.

## Adding a new topic

1. `ng generate component pages/<topic-name>` (standalone, no module needed).
2. Add a lazy route in `src/app/app.routes.ts` (`loadComponent`).
3. Add an entry to `src/app/core/nav-items.ts`.
4. Add a card linking to it from `src/app/pages/home/home.html`.
5. Reuse `--mat-sys-*` theme tokens for anything custom — see THEMING.md — so it repaints correctly across all 4 theme combinations for free.
