import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CallRecord } from '../call-record';

@Component({
  selector: 'app-call-rn-panel',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './call-rn-panel.html',
  styleUrl: './call-rn-panel.scss',
})
export class CallRnPanel {
  readonly call = input.required<CallRecord>();

  @Output() closed = new EventEmitter<void>();

  protected onClose(): void {
    this.closed.emit();
  }
}
