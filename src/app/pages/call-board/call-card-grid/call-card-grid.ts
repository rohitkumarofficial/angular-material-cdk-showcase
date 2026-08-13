import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CallRecord } from '../call-record';

const GRID_ROW_HEIGHT = 232;

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

@Component({
  selector: 'app-call-card-grid',
  imports: [ScrollingModule, MatCardModule, MatDividerModule],
  templateUrl: './call-card-grid.html',
  styleUrl: './call-card-grid.scss',
})
export class CallCardGrid {
  readonly calls = input.required<CallRecord[]>();
  readonly selectedCallId = input<string | null>(null);

  readonly cardSelected = output<CallRecord>();

  protected readonly gridRowHeight = GRID_ROW_HEIGHT;

  private readonly columnsPerRow = toSignal(
    inject(BreakpointObserver)
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .pipe(
        map((state) => {
          if (state.breakpoints[Breakpoints.XSmall]) return 1;
          if (state.breakpoints[Breakpoints.Small]) return 2;
          if (state.breakpoints[Breakpoints.Medium]) return 3;
          return 4;
        }),
      ),
    { initialValue: 4 },
  );

  protected readonly rows = computed(() => chunk(this.calls(), this.columnsPerRow()));

  protected trackByRow(index: number, row: CallRecord[]): string {
    return row[0]?.id ?? String(index);
  }

  protected selectCall(call: CallRecord): void {
    this.cardSelected.emit(call);
  }
}
