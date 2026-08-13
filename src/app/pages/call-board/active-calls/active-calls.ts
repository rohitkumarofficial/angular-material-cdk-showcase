import { Component, inject, signal } from '@angular/core';
import { CallRecord, generateMockCalls } from '../call-record';
import { CallBoardState } from '../call-board-state';
import { CallRnOverlayService } from '../call-rn-overlay/call-rn-overlay.service';
import { CallDetailBar } from '../call-detail-bar/call-detail-bar';
import { CallCardGrid } from '../call-card-grid/call-card-grid';

@Component({
  selector: 'app-active-calls',
  imports: [CallDetailBar, CallCardGrid],
  templateUrl: './active-calls.html',
  styleUrl: './active-calls.scss',
})
export class ActiveCalls {
  protected readonly state = inject(CallBoardState);
  private readonly callRnOverlay = inject(CallRnOverlayService);

  protected readonly calls = generateMockCalls(60);
  protected readonly selectedCall = signal<CallRecord | null>(null);

  protected selectCall(call: CallRecord): void {
    this.selectedCall.set(call);
  }

  protected onCallSeen(call: CallRecord): void {
    this.state.toggleSeen(call);
  }

  protected onCallRn(call: CallRecord): void {
    this.callRnOverlay.open(call);
  }
}
