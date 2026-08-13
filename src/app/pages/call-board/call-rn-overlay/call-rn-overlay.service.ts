import { Injectable, inject } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CallRecord } from '../call-record';
import { CallRnPanel } from './call-rn-panel';

const OPEN_CLASS = 'is-open';
const CLOSE_TRANSITION_MS = 200;

@Injectable()
export class CallRnOverlayService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  open(call: CallRecord): void {
    this.close();

    const positionStrategy = this.overlay.position().global().top('0').right('0').height('100%');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      panelClass: 'call-rn-overlay-panel',
    });

    const componentRef = this.overlayRef.attach(new ComponentPortal(CallRnPanel));
    componentRef.setInput('call', call);
    componentRef.instance.closed.subscribe(() => this.close());
    this.overlayRef.backdropClick().subscribe(() => this.close());

    requestAnimationFrame(() => this.overlayRef?.overlayElement.classList.add(OPEN_CLASS));
  }

  close(): void {
    if (!this.overlayRef) {
      return;
    }
    const ref = this.overlayRef;
    this.overlayRef = null;
    ref.overlayElement.classList.remove(OPEN_CLASS);
    setTimeout(() => ref.dispose(), CLOSE_TRANSITION_MS);
  }
}
