# User menu — a CDK Overlay dropdown, built by hand

How the account-menu dropdown in the toolbar (`app/shared/user-menu/`) was
built directly on `@angular/cdk/overlay`'s connected-overlay directives,
instead of `mat-menu`. For the shell it lives in, see **SETUP.md**; for how
it inherits the app's colors, see **THEMING.md**.

## Why CDK Overlay instead of `mat-menu`

`mat-menu` would have been the one-line answer, but it hides the exact
mechanism this app exists to showcase. Building the panel on the CDK's own
`cdkOverlayOrigin` / `cdkConnectedOverlay` directives demonstrates the
primitive `mat-menu` is itself built on: an overlay connected to a trigger
element, with explicit position fallback and backdrop-dismiss behavior — all
config the caller controls directly instead of it being implicit.

## 1. The trigger and the template-driven overlay

```html
<button
  #trigger="cdkOverlayOrigin"
  cdkOverlayOrigin
  mat-icon-button
  aria-label="Account menu"
  [attr.aria-expanded]="isOpen()"
  (click)="toggle()"
>
  <mat-icon>account_circle</mat-icon>
</button>

<ng-template
  cdkConnectedOverlay
  [cdkConnectedOverlayOrigin]="trigger"
  [cdkConnectedOverlayOpen]="isOpen()"
  [cdkConnectedOverlayPositions]="positions"
  [cdkConnectedOverlayHasBackdrop]="true"
  cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
  (backdropClick)="close()"
  (detach)="close()"
>
  <div class="user-panel"><!-- panel content --></div>
</ng-template>
```

This is the *template-driven* way to use CDK Overlay (`OverlayModule` from
`@angular/cdk/overlay`, imported directly into the standalone component) —
no `Overlay`/`OverlayRef` service injection or manual `attach()`/`detach()`
calls needed:

- `cdkOverlayOrigin` on the trigger button exports itself as a template
  reference (`#trigger="cdkOverlayOrigin"`) that the `<ng-template>` points
  back to via `cdkConnectedOverlayOrigin`.
- `cdkConnectedOverlayOpen` is bound straight to a signal
  (`isOpen()`) — the overlay is created/destroyed reactively, there's no
  imperative open/close call beyond flipping that signal.
- `cdkConnectedOverlayHasBackdrop` + a **transparent** backdrop class
  (`cdk-overlay-transparent-backdrop`, one of the CDK's built-in backdrop
  classes) gives click-outside-to-close without visually dimming the page —
  a real backdrop still exists for the `(backdropClick)` handler to fire on,
  it's just invisible.
- `(detach)="close()"` keeps `isOpen` in sync if the overlay is ever torn
  down by something other than a backdrop click (e.g. the trigger scrolling
  out of view), so the signal never goes stale relative to the DOM.

```ts
protected readonly isOpen = signal(false);

protected toggle(): void {
  this.isOpen.update((open) => !open);
}

protected close(): void {
  this.isOpen.set(false);
}
```

## 2. Connected positioning, with a real fallback

```ts
protected readonly positions: ConnectedPosition[] = [
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
];
```

`ConnectedPosition[]` is an ordered preference list, not just one position —
the CDK's `FlexibleConnectedPositionStrategy` tries each in order and picks
the first that actually fits the viewport. The primary position anchors the
panel's top-right corner (`overlayX/Y: 'end'/'top'`) to the trigger button's
bottom-right corner (`originX/Y: 'end'/'bottom'`), 8px below it — which is
also why the panel visually hangs down-and-left from the account icon rather
than covering it. The second entry is the same idea flipped vertically (open
*upward* instead), used automatically if the panel wouldn't fit below the
trigger — e.g. the account button sitting near the bottom of a short
viewport.

## 3. Data model — signals, no backend

The panel's content is mock data local to the component (this is a
showcase, not a wired-up feature):

```ts
protected readonly user = { initials: 'PCT', firstName: 'John', lastName: 'Doe', online: true };
protected readonly devices: Device[] = [ /* phone + badge chips */ ];
protected readonly dutyProfiles = ["St. Mary's Hospital", /* ...4 more */];
protected readonly selectedDutyProfile = signal(this.dutyProfiles[0]);
protected readonly dutyGroups = signal<DutyGroup[]>([
  { name: '1AB', enabled: false },
  { name: 'All', enabled: false },
  { name: 'BedsPt1', enabled: false },
  { name: 'BedsPt2', enabled: true },
]);
```

`dutyGroups` is a signal (not a plain array) because each
`mat-slide-toggle`'s `(change)` handler needs to update one entry
immutably and have the `@for` loop re-render:

```ts
protected onDutyGroupToggle(group: DutyGroup, event: MatSlideToggleChange): void {
  this.dutyGroups.update((groups) =>
    groups.map((g) => (g === group ? { ...g, enabled: event.checked } : g)),
  );
}
```

`dutyProfiles` itself is a plain readonly array (the *options* never
change, only the *selection* does), so only the selection
(`selectedDutyProfile`) needs to be a signal.

## 4. Styling with the app's own theme tokens

The panel's SCSS never hardcodes a color — every surface, text, and border
color is one of the `--mat-sys-*` custom properties `mat.theme()` publishes
(`SETUP.md`/`THEMING.md`):

```scss
.user-panel {
  background: var(--mat-sys-surface-container-high);
  color: var(--mat-sys-on-surface);
}

.user-panel-section h3 {
  color: var(--mat-sys-primary);
}
```

Because of that, the panel repaints correctly across all 4 theme
combinations (Indigo/Teal × light/dark) with zero theme-specific code of its
own — it inherits whatever `<html>` class `ThemeService` currently has
applied, same as every Material component. The one hardcoded color is the
online-status dot (`#2e7d32`, a fixed green) — status color, not brand
color, so it's intentionally theme-independent.

`width: 380px; max-width: calc(100vw - 32px)` keeps the panel a fixed,
comfortable size on desktop while guaranteeing it never overflows a narrow
viewport, with 16px of breathing room on each side.

## 5. Wiring into the shell

```html
<!-- app.html, toolbar -->
<button mat-icon-button (click)="themeService.toggleMode()"><!-- theme toggle --></button>

<app-user-menu />
```

One line — `UserMenu` is a fully self-contained standalone component
(imports its own `OverlayModule` and Material modules), so dropping
`<app-user-menu />` into the toolbar right after the theme toggle button was
the entire integration.

## Verifying it

Checked with a scripted Playwright pass against the running dev server
rather than by eye alone:

- Opens on click, closes on backdrop click (confirmed via
  `.user-panel`'s visibility, not just "looks closed").
- Re-themes correctly when the color dropdown / dark toggle are changed
  *while the panel is open*.
- Holds up at a 400px mobile viewport.

**One methodology note from that pass:** a first look at the mobile
screenshot appeared to show the `Test001` device chip's text
clipped at the panel's edge. Before "fixing" it, the actual DOM was
measured directly (`getBoundingClientRect()` on the panel and the chip's
text span) rather than trusting the screenshot pixels — the measurements
showed the panel ending at `x=384` on a 400px-wide viewport and the chip's
text ending at `x=301`, i.e. not clipped at all. The apparent clipping was a
screenshot-rendering artifact, not a real bug — a reminder to verify layout
bugs against actual computed geometry, not just a visual read of a
screenshot.
