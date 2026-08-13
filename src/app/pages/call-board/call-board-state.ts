import { Injectable, signal } from '@angular/core';
import { CallRecord } from './call-record';

@Injectable()
export class CallBoardState {
  readonly seenTarget = signal<CallRecord | null>(null);

  toggleSeen(call: CallRecord): void {
    this.seenTarget.update((current) => (current?.id === call.id ? null : call));
  }

  closeSeen(): void {
    this.seenTarget.set(null);
  }
}
