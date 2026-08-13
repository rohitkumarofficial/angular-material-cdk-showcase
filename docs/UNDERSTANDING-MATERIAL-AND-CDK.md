# Understanding Angular Material & CDK — a guide for beginners

This is a plain-language, end-to-end walkthrough of this project, written for
someone who has never touched Angular Material before. It explains *what
Material and CDK actually are*, how this specific app uses each of them, how
its animations work, how its theming works, and — at the end — why Material
is a strong choice for an Angular team compared to something like Bootstrap.

Every concept below is backed by a real page in this app you can open and
click through while reading — look for the **🧪 Try it** boxes. The other
files in `docs/` go deeper on individual features; this one is the map that
ties them all together.

> 💡 **Read this first:** the single most important idea in this whole
> document is the split in section 1 — Material *looks*, CDK *behaves*.
> Everything else is really just examples of that one idea.

## Contents

1. [Two different things: Material vs. CDK](#1-two-different-things-angular-material-vs-angular-cdk)
2. [Where Material shows up](#2-where-material-shows-up-in-this-app)
3. [Where CDK shows up](#3-where-cdk-shows-up-in-this-app-the-interesting-part)
4. [How the animations actually work](#4-how-the-animations-actually-work)
5. [How theming works](#5-how-theming-works)
6. [Why Material over Bootstrap](#6-why-material-is-a-strong-choice-over-bootstrap-for-an-angular-app)
7. [Quick recap](#quick-recap)

---

## 1. Two different things: "Angular Material" vs. "Angular CDK"

Before touching any code, it's worth being clear that this project depends
on **two** separate packages that are easy to confuse:

| Package | What it is | What it cares about |
|---|---|---|
| **`@angular/material`** | Ready-made, ready-*styled* UI pieces: buttons, text fields, tables, tabs, dialogs. | Looks. Every one already follows Google's Material Design system, and already works correctly — keyboard navigation, screen-reader support, focus outlines, all handled for you. |
| **`@angular/cdk`** *("Component Dev Kit")* | The unstyled *machinery* underneath. No opinion at all about colors, fonts, or borders. | Behavior. "Where should this floating panel go so it never falls off-screen?" "How do I trap keyboard focus inside a popup?" "How do I render 10,000 list items without the browser choking?" |

Angular Material's own components are *built on top of* CDK — `mat-menu` is
really just CDK's overlay-positioning engine wrapped in Material's visual
styling.

That distinction is why this app deliberately uses **CDK directly, without
Material's styling wrapper**, in several places — specifically to show what
that lower layer looks like on its own. If you only ever use `mat-menu` or
`MatDialog`, you never see the machinery underneath. This app peels that
back on purpose.

> 🧪 **Try it:** open the account icon in the top-right toolbar. That
> dropdown is CDK's positioning engine with zero Material styling wrapper —
> every pixel of its appearance is this app's own CSS.

---

## 2. Where Material shows up in this app

Material components appear throughout, doing what they're good at: giving
you a correct, accessible, good-looking building block instead of you
hand-rolling one from `<div>`s.

| Component | Where it's used | What it saves you from building |
|---|---|---|
| `mat-toolbar`, `mat-sidenav`, `mat-nav-list` | The app shell (top bar + collapsible left nav) | The layout skeleton that makes the app *feel* like an app, not a stack of unrelated pages |
| `mat-card` | Home page topic tiles; each call in Call Board's grid | A visually distinct, elevated block of content, with a header/content/actions layout convention |
| `mat-table` + `mat-sort` + `mat-paginator` | Triaged Calls | A sortable, paginated, accessible table — genuinely tedious to hand-build correctly |
| `mat-tab-group` | Active/Triaged Calls tabs; Modal Dialog tabs | Tab switching *and* a free performance win — the inactive tab's content isn't even rendered into the page until you open it |
| `mat-form-field`, `mat-input`, `mat-select`, `mat-datepicker`, `mat-radio-group`, `mat-slide-toggle` | The Forms page | Ten different controls that still look like *one coherent form*, with automatic validation-error display and keyboard support |
| `mat-icon`, `mat-button`, `mat-tooltip`, `mat-divider` | Nearly every page | The "vocabulary" everything bigger is built from |

The throughline: for every row above, you'd otherwise be writing your own
HTML, your own CSS, *and* — the part people usually forget — your own
accessibility behavior (keyboard support, ARIA attributes, focus
management). Material has already done that work, tested across a huge
number of real applications.

> 🧪 **Try it:** run the app (`npm start`), open the Forms page (`/forms`),
> and tab through the fields with your keyboard only, no mouse. Every stop,
> every error message, every focus outline is Material handling
> accessibility for you.

---

## 3. Where CDK shows up in this app (the interesting part)

This is where the app goes further than a typical Material tutorial. Instead
of reaching for `mat-menu` or `MatDialog` every time something needs to
"float above the page," this project builds **five genuinely different
floating-panel patterns** directly on CDK, so you can see the range of what
CDK's positioning engine can do.

| # | Pattern | Where | Anchored to | Mechanism |
|---|---|---|---|---|
| 1 | Account dropdown | Toolbar, top-right | A button element | `cdkOverlayOrigin` / `cdkConnectedOverlay` directives, straight in the HTML |
| 2 | "Call RN" slide-in | Call Board | The screen's edge, not any button | CDK's `Overlay` service in TypeScript, `GlobalPositionStrategy` pinned to the right edge |
| 3 | "Call Seen" push panel | Call Board | N/A — pushes content, doesn't float | `mat-sidenav` in *push* mode (no CDK overlay involved at all) |
| 4 | Row-detail popup | Call Board → Triaged Calls | The exact mouse-click coordinates | CDK's `Overlay` service, `FlexibleConnectedPositionStrategy` anchored to a point |
| 5 | Search results dropdown | Ticker Search | A text input, width-matched | Same directive approach as #1, but resized live to match the input |
| 6 | Settings modal | Modal Dialog page | Centered on screen | `@angular/cdk/dialog`'s `Dialog` service — what `MatDialog` is itself built from |

> 🧪 **Try it:** open Call Board (`/call-board`), select a call, then click
> **Call Seen** and **Call RN** back to back.
> One pushes the page sideways; the other floats a panel over it with a
> dimmed background. Same button styling, two completely different
> underlying mechanisms — that contrast is the easiest way to *feel* the
> difference CDK's position strategies make.

Two more CDK pieces worth knowing about, neither related to floating panels:

- **`cdk-virtual-scroll-viewport`** *(Active Calls' card grid)* — when a
  list has hundreds of rows, rendering all of them into the DOM at once
  makes scrolling janky. Virtual scrolling only ever creates the handful of
  DOM elements currently visible on screen, swapping their content as you
  scroll — so a 10,000-row list scrolls exactly as smoothly as a 10-row one.
- **`BreakpointObserver`** *(the app shell, and Call Board's card grid)* —
  CDK's way of reacting to screen-size changes in TypeScript code, instead
  of only in CSS `@media` queries. It decides whether the sidenav should
  push or float, and how many card columns fit side by side.

> 💡 **Key idea:** CDK never tells you what anything should look like. It
> only ever answers *where should this go* and *how should this behave* —
> the rounded corners, the background color, the shadow, are 100% custom
> CSS written for this app, using the app's own theme colors. That split —
> behavior from CDK, appearance from your own CSS — is the whole reason CDK
> exists as its own package.

---

## 4. How the animations actually work

Here's something that surprises people coming from other component
libraries: **this app has no `@angular/animations` package installed at
all.** Older Angular Material versions needed it — every slide, fade, and
expand was driven by Angular's JavaScript animation engine. Angular Material
21 doesn't need that anymore: its components animate using plain, native CSS
transitions, the same technique any hand-written website uses.

Concretely, in this app:

- **The Call RN slide-in panel** starts with `transform: translateX(100%)`
  (pushed fully off-screen to the right) plus a CSS
  `transition: transform 200ms ease`. Opening it just adds a CSS class that
  changes the transform to `translateX(0)` — the browser animates the
  change on its own. No animation library involved, just *"change a CSS
  property, let the browser interpolate it."*
- **`mat-sidenav`, `mat-tab-group`**, and other Material components ship
  with their own built-in CSS transitions the same way — the slide, the
  tab-underline movement, all without writing any animation code yourself.
- **Ripple effects** (the circular "ink spread" on a Material button click)
  are handled by Material's own small, dedicated ripple code — again, not
  the Angular animations package.

> 🧪 **Try it:** open your browser's DevTools on the Call Board page, click
> **Call RN**, and inspect the panel element while it's opening. You'll see
> a `transform` value animating and a class being toggled — no
> `@angular/animations` machinery anywhere in the trace.

Why this matters if you're new to this: it means you can build fully
animated, polished-feeling UI in this app **without ever learning Angular's
animation DSL** (`trigger()`, `state()`, `transition()`, etc.). Every
animation you see is "toggle a CSS class, let CSS transitions do the rest" —
a skill you likely already have from plain CSS.

---

## 5. How theming works

"Theming" here means: **one central place decides every color in the whole
app**, so a designer (or you) can restyle the entire product by changing a
handful of values, instead of hunting through dozens of files for hardcoded
hex codes.

This app's theming has two independent parts, both controllable from the
toolbar:

1. **Color** — Indigo or Teal. Each is a full *Material 3 color palette*,
   generated from a single starting hex color using Material's own tooling
   (`ng generate @angular/material:m3-theme`). "Palette" here doesn't just
   mean one color — it's a whole coordinated family: a primary color, a
   secondary accent, and about a dozen tonal variations, all mathematically
   related so they're guaranteed to look good together and meet
   accessibility contrast requirements.
2. **Mode** — Light or Dark, independent of which color is picked, so all 4
   combinations (Indigo-light, Indigo-dark, Teal-light, Teal-dark) exist.

Mechanically: Material's `mat.theme()` Sass mixin takes a palette and turns
it into a big set of **CSS custom properties** (things like
`--mat-sys-primary`, `--mat-sys-surface`, `--mat-sys-on-surface`), applied to
the `<html>` element. Every Material component — and every bit of this app's
own custom CSS — reads its colors from those variables instead of using
fixed hex codes anywhere.

> 🧪 **Try it:** switch the color dropdown from Indigo to Teal, and flip the
> light/dark toggle, on *any* page in the app. Notice there's no reload,
> no flicker, no delay — every color on screen repaints instantly because
> it was already reading from a shared variable.

Switching the theme is just adding/removing a CSS class on `<html>`
(`theme-indigo`, `theme-teal`, `dark-theme`) — the browser repaints every
affected color instantly, with no JavaScript re-render and no page reload. A
small `ThemeService` remembers your last choice in `localStorage` and
re-applies it before the page first paints, so there's no flash of the
wrong theme on reload.

The practical payoff for a real team: when a new page is added to this app,
as long as its CSS reads from those same `--mat-sys-*` variables (which
every page here does), it automatically works correctly in all 4 theme
combinations — no extra theming work required, ever. See **THEMING.md** for
the full mechanics.

---

## 6. Why Material is a strong choice over Bootstrap (for an Angular app)

This is a genuinely fair comparison to make — Bootstrap is a mature, capable
toolkit, and it's the right choice for plenty of projects. But for a team
building specifically on Angular, several structural differences favor
Material:

| | Bootstrap | Angular Material |
|---|---|---|
| **Framework relationship** | Framework-agnostic — CSS classes plus vanilla-JS widgets, with no idea Angular exists. Using it properly in Angular usually means a wrapper library (e.g. `ng-bootstrap`) that *re-implements* the widgets as Angular components. | Angular-native. Every component *is* a real Angular component — `@Input()`/`@Output()`, signals support, integrated change detection. No translation layer to fall out of sync with. |
| **Accessibility** | Needs manual attention to reach a high bar. | Correct ARIA roles, keyboard navigation, and focus management ship built in, maintained by the Angular team itself. |
| **Design consistency** | A grid and a set of component styles — systematic consistency is left to your team's discipline. | A full design *system*: elevation, spacing, typography, and a mathematically-derived color system (M3) that keeps new colors accessible and harmonious automatically. |
| **Custom, non-Material-looking widgets** | No unstyled behavior-only layer — positioning/focus-trapping/keyboard logic for a custom widget has to be hand-written. | CDK exists exactly for this. This app's five overlay patterns above are only possible because that layer exists. |
| **Version compatibility** | Evolves entirely independently of any framework — a strength for multi-framework shops. | Released from the *same repository, on the same schedule* as Angular — a new major Angular version and compatible Material version always land together. |

None of this means Bootstrap is a bad tool — it's an excellent, lightweight
choice when a project isn't committed to one JS framework, or needs the
absolute minimum footprint. But for a team that has already chosen Angular
and wants deep, correct integration with it — components that are Angular
components, not wrapped ones; a real design-token theming system; and a CDK
layer for the inevitable custom widget nobody makes pre-built — Material is
the more natural fit. This app is meant to be the proof of that in working
code rather than in the abstract.

---

## Quick recap

- [ ] **Material** = pre-styled, accessible components. **CDK** = the
      unstyled behavior engine those components (and this app's custom
      overlays) are built on.
- [ ] Material shows up as the toolbar/sidenav shell, cards, the sortable
      table, tabs, and every form control on the Forms page.
- [ ] CDK shows up as five different floating-panel patterns across this
      app, plus virtual scrolling and screen-size-aware layout.
- [ ] Animations are plain CSS transitions toggled by a class — no
      `@angular/animations` package anywhere in this project.
- [ ] Theming is CSS custom properties on `<html>`, swapped by toggling a
      class — instant, no reload, no re-render.
- [ ] Material wins for an Angular-committed team because it's Angular-native,
      accessible by default, a real design system, and — via CDK — gives you
      professional behavior even for fully custom-looking widgets.

## Where to go next

- **SETUP.md** — how this workspace itself was scaffolded.
- **THEMING.md** — the full mechanics of the color/mode system above.
- **USER-MENU.md** — a close read of overlay pattern #1 above.
- **CALL-BOARD.md** — a full feature reference for overlay patterns #2–#4,
  virtual scrolling, and the Material table.
