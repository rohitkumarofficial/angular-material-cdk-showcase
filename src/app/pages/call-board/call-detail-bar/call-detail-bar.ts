import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { CallRecord } from '../call-record';

@Component({
  selector: 'app-call-detail-bar',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDividerModule],
  templateUrl: './call-detail-bar.html',
  styleUrl: './call-detail-bar.scss',
})
export class CallDetailBar {
  readonly call = input.required<CallRecord>();
  readonly isSeen = input(false);

  readonly callSeen = output<CallRecord>();
  readonly callRn = output<CallRecord>();

  protected onCallSeen(): void {
    this.callSeen.emit(this.call());
  }

  protected onCallRn(): void {
    this.callRn.emit(this.call());
  }
}
