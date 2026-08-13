import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CallRecord } from '../call-record';

interface WorkflowAction {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-call-detail-popup',
  imports: [MatTabsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './call-detail-popup.html',
  styleUrl: './call-detail-popup.scss',
})
export class CallDetailPopup {
  readonly call = input.required<CallRecord>();

  @Output() closed = new EventEmitter<void>();

  protected readonly workflowActions: WorkflowAction[] = [
    { icon: 'call', label: 'Simple Call' },
    { icon: 'cleaning_services', label: 'Cleaning Required' },
    { icon: 'king_bed', label: 'Bed Transfer' },
    { icon: 'directions_walk', label: 'Ambulation Round' },
    { icon: 'medication', label: 'Medication Due' },
    { icon: 'restaurant', label: 'Meal Assist' },
  ];

  protected readonly selectedActions = signal<ReadonlySet<string>>(new Set());
  protected readonly noteText = signal('');
  protected readonly noteSubmitted = signal(false);

  protected toggleAction(label: string): void {
    this.selectedActions.update((current) => {
      const next = new Set(current);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  protected onNoteInput(event: Event): void {
    this.noteText.set((event.target as HTMLTextAreaElement).value);
  }

  protected submitNote(): void {
    if (!this.noteText().trim()) {
      return;
    }
    this.noteSubmitted.set(true);
  }

  protected onClose(): void {
    this.closed.emit();
  }
}
