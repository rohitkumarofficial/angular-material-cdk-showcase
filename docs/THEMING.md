# Theming — two custom M3 colors × light/dark, switchable at runtime

How the theme system works: generating the two custom palettes, wiring them
into `mat.theme()`, the `ThemeService` that drives everything, and the two
toolbar controls (a color dropdown, a separate light/dark toggle) that let a
user switch either independently. For the rest of the app setup, see
**SETUP.md**.

This deliberately does **not** replicate `angular-material-with-mfe`'s
5-theme M2/M3-hybrid system (`m2-define-light-theme` +
`all-component-themes()` re-theming every component individually). Modern
Angular Material's `mat.theme()` mixin covers both component tokens and the
`--mat-sys-*` system tokens from one call, so each theme here is a single
mixin invocation, not a component-by-component re-theme.

## 1. Generate the two custom M3 palettes

```powershell
ng generate @angular/material:m3-theme --primary-color="#3F51B5" --directory=src --is-scss=true --include-high-contrast=false --force
ng generate @angular/material:m3-theme --primary-color="#00695C" --directory=src --is-scss=true --include-high-contrast=false --force
```

Each run produces a `theme-colors.scss` with tonal-palette maps
(`$primary-palette`, `$tertiary-palette`, plus secondary/neutral/error,
merged in) for one seed hex — indigo (`#3F51B5`) and teal (`#00695C`).

**Gotcha hit here:** the `--directory` flag doesn't create a subfolder the
way it looks like it should — `--directory=src/themes` produced a file
literally named `src/themes_theme-colors.scss` (directory value flattened
into the filename with an underscore, not turned into a real path). Worked
around it by generating both into `src/` directly and renaming by hand to
`src/theme-indigo.scss` / `src/theme-teal.scss`.

## 2. Wire both palettes into `src/styles.scss`

Four `mat.theme()` blocks, one per (color × mode) combination, scoped to
class combinations on `<html>`:

```scss
@use '@angular/material' as mat;
@use './theme-indigo' as theme-indigo;
@use './theme-teal' as theme-teal;

html {
  height: 100%;
  color-scheme: light;

  &.theme-indigo {
    @include mat.theme((
      color: (
        primary: theme-indigo.$primary-palette,
        tertiary: theme-indigo.$tertiary-palette,
      ),
      typography: Roboto,
      density: 0,
    ));
  }

  &.theme-indigo.dark-theme {
    color-scheme: dark;
    @include mat.theme((
      color: (
        theme-type: dark,
        primary: theme-indigo.$primary-palette,
        tertiary: theme-indigo.$tertiary-palette,
      ),
      typography: Roboto,
      density: 0,
    ));
  }

  // .theme-teal and .theme-teal.dark-theme follow the same shape,
  // swapping in the teal palette.
}

body {
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  font: var(--mat-sys-body-medium);
  margin: 0;
  height: 100%;
}
```

Each color's dark variant reuses the *same* palette with
`theme-type: dark` in the config map — Material derives a correct dark
tonal mapping from the same seed rather than needing a second, separately
generated dark palette. That's what keeps this to 2 generated files instead
of 4.

**Gotcha hit here:** the first attempt aliased the two `@use` imports as
`indigo` and `teal` (`@use './theme-indigo' as indigo;`). Sass build failed
with `Expected digit.` pointing at `indigo.$primary-palette` — because
`indigo` and `teal` are both reserved CSS/Sass color-keyword identifiers,
and the Sass parser tried to read `indigo.$primary-palette` as a color
literal followed by a decimal number rather than as
`<namespace>.<variable>` module-member access. Renaming the namespaces to
`theme-indigo` / `theme-teal` (any non-color-keyword identifier) fixed it.

`src/index.html`'s root `<html>` element also carries a hardcoded
`class="theme-indigo"` as the pre-JS default, so there's a sane look even
before `ThemeService.restore()` runs.

## 3. `ThemeService` — single source of truth for both axes

`src/app/core/services/theme.service.ts` tracks color and light/dark mode as
two independent signals, and is the only place that ever touches
`<html>`'s classes or `localStorage`:

```ts
export type ThemeColor = 'indigo' | 'teal';
export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly colorTheme = signal<ThemeColor>('indigo');
  readonly mode = signal<ThemeMode>('light');

  setColorTheme(color: ThemeColor): void {
    const root = document.documentElement;
    root.classList.remove(...Object.values(COLOR_CLASSES));
    root.classList.add(COLOR_CLASSES[color]);
    localStorage.setItem(COLOR_STORAGE_KEY, color);
    this.colorTheme.set(color);
  }

  setMode(mode: ThemeMode): void {
    document.documentElement.classList.toggle(DARK_CLASS, mode === 'dark');
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    this.mode.set(mode);
  }

  toggleMode(): void {
    this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
  }

  restore(): void {
    const savedColor = localStorage.getItem(COLOR_STORAGE_KEY) as ThemeColor | null;
    this.setColorTheme(savedColor === 'indigo' || savedColor === 'teal' ? savedColor : 'indigo');

    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    const preferDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.setMode(
      savedMode === 'dark' || savedMode === 'light' ? savedMode : preferDark ? 'dark' : 'light',
    );
  }
}
```

Color and mode are independent on purpose: `theme-indigo`/`theme-teal` and
`dark-theme` are two separate classes on `<html>`, so any of the 4
combinations can be reached by toggling either axis without touching the
other. Two separate `localStorage` keys (`theme-color`, `theme-mode`) so
each choice persists independently across reloads.

## 4. Applying the saved choice before first paint

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => inject(ThemeService).restore()),
  ],
};
```

`provideAppInitializer` runs during bootstrap, before the root component
renders — by the time anything paints, `<html>` already has the right
`theme-*` and (if applicable) `dark-theme` classes, so there's no
flash-of-wrong-theme on reload. `restore()` falls back to
`prefers-color-scheme` for mode (not for color — there's no OS-level signal
for "indigo vs teal") when `localStorage` has nothing yet.

## 5. The two toolbar controls

Both live in `app.html`, deliberately as two separate controls rather than
one combined picker, so either axis can change without touching the other:

```html
<mat-form-field appearance="outline" class="theme-select" subscriptSizing="dynamic">
  <mat-select
    [value]="themeService.colorTheme()"
    (selectionChange)="onColorThemeChange($event.value)"
    aria-label="Color theme"
  >
    <mat-option value="indigo">Indigo</mat-option>
    <mat-option value="teal">Teal</mat-option>
  </mat-select>
</mat-form-field>

<button
  mat-icon-button
  [matTooltip]="themeService.mode() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
  (click)="themeService.toggleMode()"
>
  <mat-icon>{{ themeService.mode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
</button>
```

`[value]="themeService.colorTheme()"` is what makes the dropdown always show
the currently-active color when reopened — it reads the same signal
`setColorTheme()` just updated, not separate local state. Because both
`setColorTheme()` and `setMode()` swap `<html>` classes synchronously, every
Material component and any custom CSS reading `--mat-sys-*` re-themes
instantly — no navigation, no reload, no flicker.

**Gotcha hit here:** the toolbar's title text originally had no
`min-width: 0` / `text-overflow: ellipsis`, so on narrow (mobile) widths the
long app title pushed the color dropdown and toggle button off-screen
entirely instead of truncating. Fixed by giving `.shell-title` `flex: 0 1
auto; min-width: 0; overflow: hidden; text-overflow: ellipsis` so it shrinks
and truncates instead of overflowing the toolbar.

## Verifying the theme system

- Open the app, confirm the color dropdown and light/dark button both work
  independently, in all 4 combinations.
- Reload after changing both — confirm both persist (check
  `localStorage['theme-color']` / `['theme-mode']`) with no flash of the
  wrong theme.
- Narrow the viewport to mobile width — confirm both toolbar controls stay
  visible and usable.
