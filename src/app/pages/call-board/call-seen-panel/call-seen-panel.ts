import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CallRecord } from '../call-record';

@Component({
  selector: 'app-call-seen-panel',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './call-seen-panel.html',
  styleUrl: './call-seen-panel.scss',
})
export class CallSeenPanel {
  readonly call = input<CallRecord | null>(null);

  @Output() closed = new EventEmitter<void>();

  protected onClose(): void {
    this.closed.emit();
  }
}
