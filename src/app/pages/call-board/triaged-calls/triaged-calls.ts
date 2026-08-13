import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CallRecord, generateMockCalls } from '../call-record';
import { CallBoardState } from '../call-board-state';
import { CallRnOverlayService } from '../call-rn-overlay/call-rn-overlay.service';
import { CallDetailPopupService } from '../call-detail-popup/call-detail-popup.service';

@Component({
  selector: 'app-triaged-calls',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './triaged-calls.html',
  styleUrl: './triaged-calls.scss',
})
export class TriagedCalls implements AfterViewInit {
  protected readonly state = inject(CallBoardState);
  private readonly callRnOverlay = inject(CallRnOverlayService);
  private readonly detailPopup = inject(CallDetailPopupService);

  protected readonly displayedColumns = [
    'type',
    'elapsed',
    'location',
    'patient',
    'assignedRn',
    'actions',
  ];

  protected readonly dataSource = new MatTableDataSource<CallRecord>(
    generateMockCalls(24, 'Northbridge Health').map((call, i) => ({
      ...call,
      id: `triaged-${i}`,
    })),
  );

  @ViewChild(MatSort) private sort!: MatSort;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  protected assignedRn(call: CallRecord): string {
    return call.careTeam.find((member) => member.role === 'RN')?.name ?? '—';
  }

  protected onCallSeen(call: CallRecord): void {
    this.state.toggleSeen(call);
  }

  protected onCallRn(call: CallRecord): void {
    this.callRnOverlay.open(call);
  }

  protected openDetail(call: CallRecord, event: MouseEvent): void {
    this.detailPopup.open(call, { x: event.clientX, y: event.clientY });
  }
}
