import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { TickerResult, TickerType, generateMockTickers } from './ticker-record';

type FilterType = 'all' | TickerType;

@Component({
  selector: 'app-ticker-search',
  imports: [OverlayModule, MatIconModule],
  templateUrl: './ticker-search.html',
  styleUrl: './ticker-search.scss',
})
export class TickerSearch {
  @ViewChild('searchWrapper') private searchWrapperRef!: ElementRef<HTMLElement>;

  private readonly allTickers = generateMockTickers();

  protected readonly query = signal('');
  protected readonly filterType = signal<FilterType>('all');
  protected readonly isOpen = signal(false);
  protected readonly overlayWidth = signal(0);
  protected readonly selectedResult = signal<TickerResult | null>(null);

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
  ];

  protected readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    const type = this.filterType();

    return this.allTickers
      .filter((ticker) => type === 'all' || ticker.type === type)
      .filter(
        (ticker) =>
          !q || ticker.symbol.toLowerCase().includes(q) || ticker.name.toLowerCase().includes(q),
      )
      .slice(0, 8);
  });

  protected onFocus(): void {
    this.overlayWidth.set(this.searchWrapperRef.nativeElement.offsetWidth);
    this.isOpen.set(true);
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setFilter(type: FilterType): void {
    this.filterType.set(type);
  }

  protected selectResult(result: TickerResult): void {
    this.selectedResult.set(result);
    this.query.set(result.symbol);
    this.isOpen.set(false);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected trendIcon(changePercent: number): string {
    if (changePercent > 0) return 'arrow_upward';
    if (changePercent < 0) return 'arrow_downward';
    return 'remove';
  }

  protected trendClass(changePercent: number): string {
    if (changePercent > 0) return 'trend-up';
    if (changePercent < 0) return 'trend-down';
    return 'trend-flat';
  }

  protected formatChange(changePercent: number): string {
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  }

  protected trackResult(_index: number, result: TickerResult): string {
    return `${result.symbol}-${result.exchange}`;
  }
}
