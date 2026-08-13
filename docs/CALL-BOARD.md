# Call Board — Angular Material + CDK feature reference

`app/pages/call-board/` is a mock nurse call-board (inspired by, not
copied from, a reference screenshot — all patient/staff/hospital names,
call types, and copy are original fictional content) built specifically to
exercise a wide slice of Material and CDK in one page. This doc is a
reference for *what's used where and why*, not a code walkthrough — for
the account-menu's overlay pattern see **USER-MENU.md**; for how
everything here inherits the app's colors see **THEMING.md**.

## Angular Material features

| Feature | Where | Notes |
|---|---|---|
| `MatTabsModule` | `call-board.ts` | Active Calls / Triaged Calls tabs. Restyled via `::ng-deep` CSS on the MDC classes into angled "folder tabs" — a `clip-path` parallelogram (not a symmetric trapezoid — that leaves a gap at the seam, see gotchas below) with the active tab colored `--mat-sys-primary`. `mat-tab-group` only renders the selected tab's *content*, which is what gives Triaged Calls' table/data source true lazy instantiation — it isn't created until that tab is first opened. |
| `MatSidenavModule` | `call-board.ts`, `call-seen-panel.ts` | The Call Seen panel — `mode="side"` (push, not overlay) is what makes it shift page content over instead of floating above it. No CDK Overlay involved; this is Material's own layout doing the work, deliberately contrasted with the two CDK-Overlay-based patterns below. |
| `MatTableModule` + `MatSortModule` + `MatPaginatorModule` | `triaged-calls.ts` | Standard `MatTableDataSource` wired to `MatSort`/`MatPaginator` via `ngAfterViewInit`. Rows are clickable (open the detail popup); the two action-icon buttons call `$event.stopPropagation()` so clicking them doesn't also trigger the row click. |
| `MatCardModule` | `call-detail-bar.ts`, `call-card-grid.ts` | The selected-call detail bar and each card in the Active Calls grid. |
| `MatFormFieldModule` + `MatInputModule` | `call-detail-popup.ts` | The Notes tab's `textarea` (demo-only submit, no persistence). |
| `MatIconModule`, `MatButtonModule`, `MatTooltipModule`, `MatDividerModule` | throughout | Action icons, buttons, hover tooltips (Overhead/Call Room are intentionally inert — tooltip only, no handler), section separators. |

## Angular CDK features

| Feature | Where | Notes |
|---|---|---|
| `@angular/cdk/overlay` — imperative `Overlay` service, **`GlobalPositionStrategy`** | `call-rn-overlay.service.ts` | Call RN's slide-in panel. Pinned to the viewport's right edge/full height regardless of which button opened it — deliberately *not* connected to a trigger element, since the trigger can be a row inside a `cdk-virtual-scroll-viewport` that scrolls out from under it. Uses `ComponentPortal` (not a template) since it's opened from two unrelated components (Active Calls + Triaged Calls) with no single template to anchor a `TemplatePortal` to. |
| `@angular/cdk/overlay` — imperative `Overlay` service, **`FlexibleConnectedPositionStrategy` anchored to a point** | `call-detail-popup.service.ts` | The row-click detail popup. `flexibleConnectedTo({ x, y })` takes the click's `event.clientX/clientY` directly (not an `ElementRef`) as the origin. Four fallback `ConnectedPosition`s, one per quadrant (`overlayX`/`overlayY` = `start`/`end` × `top`/`bottom`, all with `originX/Y: 'center'` since a point origin has no edges) — CDK's positioning engine tries each in order and uses the first that fits the viewport, so the popup opens down-right of the click normally but flips up/left automatically near the screen's edges. `withPush(true)` is a safety net beyond that. |
| `@angular/cdk/overlay` — directive-based `cdkConnectedOverlay` | *(see USER-MENU.md, not used within call-board)* | Listed for contrast: this page deliberately uses the **imperative** service API twice instead, in two different position-strategy configurations, rather than repeating the directive approach. |
| `@angular/cdk/scrolling` — `ScrollingModule` / `cdk-virtual-scroll-viewport` / `*cdkVirtualFor` | `call-card-grid.ts` | Active Calls' card grid. 60 mock calls chunked into rows and virtualized with a fixed `itemSize` (constant row height regardless of column count) — only a handful of the 60 records exist in the DOM at once. |
| `@angular/cdk/layout` — `BreakpointObserver` | `call-card-grid.ts` | Drives the responsive column count (1/2/3/4 depending on `Breakpoints.XSmall/Small/Medium`) that the virtual-scroll rows are chunked into. |
| `@angular/cdk/portal` — `ComponentPortal` | `call-rn-overlay.service.ts`, `call-detail-popup.service.ts` | Both imperative overlays attach a real standalone component this way; `componentRef.setInput('call', call)` is how a value reaches the attached component's signal `input()` — a plain property assignment doesn't trigger Angular's input-change machinery the same way. |

## A few things worth knowing before touching this code

- **Scope new overlay services to the route, not the app root.** `CallRnOverlayService` and `CallDetailPopupService` are registered in `call-board.ts`'s `providers` array, *not* `providedIn: 'root'`. A service that's `providedIn: 'root'` and statically references a component (`new ComponentPortal(SomeComponent)`) pulls that component into the **eager** bundle even if every call site is inside a lazy route — because root providers are always part of the initial injector. Scoping to the route's own `providers` keeps the whole feature, service included, inside the lazy `call-board` chunk.
- **A symmetric trapezoid `clip-path` leaves a gap between adjacent shapes.** The folder-tab CSS's first version inset *both* left and right edges at the bottom, so neighboring tabs' bottom corners receded away from each other no matter what overlap margin was used. Fixed by using a parallelogram (both edges slanting the *same* direction) instead — the horizontal shift is then constant top-to-bottom, so a margin equal to that shift makes adjacent shapes share an exact edge rather than approximately overlap.
- **Don't trust a naive `isVisible()` check on a closed `mat-sidenav`.** In `mode="side"`, Material keeps the element mounted at zero width when closed rather than setting `display: none`, so a bare visibility check can report a false positive. A screenshot (or an actual width/bounding-box measurement) is the real signal.
- **No `@angular/animations` dependency.** Material 21's own components animate via native CSS; this app follows suit — the Call RN panel's slide transition is a plain CSS `transform` on a class the service toggles, defined globally in `src/styles.scss` since the CDK overlay pane it targets lives outside any component's view encapsulation.
- The production bundle budget in `angular.json` was raised (700kB → 850kB warning) to accommodate the legitimate cost of using this much Material surface area in one page — not something worth fighting by trimming features from a showcase app whose whole point is demonstrating them.
