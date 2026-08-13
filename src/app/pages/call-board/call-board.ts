import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CallBoardState } from './call-board-state';
import { ActiveCalls } from './active-calls/active-calls';
import { TriagedCalls } from './triaged-calls/triaged-calls';
import { CallSeenPanel } from './call-seen-panel/call-seen-panel';
import { CallRnOverlayService } from './call-rn-overlay/call-rn-overlay.service';
import { CallDetailPopupService } from './call-detail-popup/call-detail-popup.service';

@Component({
  selector: 'app-call-board',
  imports: [MatTabsModule, MatSidenavModule, ActiveCalls, TriagedCalls, CallSeenPanel],
  providers: [CallBoardState, CallRnOverlayService, CallDetailPopupService],
  templateUrl: './call-board.html',
  styleUrl: './call-board.scss',
})
export class CallBoard {
  protected readonly state = inject(CallBoardState);
}
