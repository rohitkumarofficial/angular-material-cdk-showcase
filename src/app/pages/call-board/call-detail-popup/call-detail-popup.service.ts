import { Injectable, inject } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CallRecord } from '../call-record';
import { CallDetailPopup } from './call-detail-popup';

// Four fallback positions, one per quadrant relative to the click point —
// FlexibleConnectedPositionStrategy tries each in order and uses the first
// that actually fits the viewport, so the popup opens right/left/down/up
// depending on how much room is left around where the user clicked.
const POSITIONS: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 12,
    offsetY: 12,
  },
  {
    originX: 'center',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -12,
    offsetY: 12,
  },
  {
    originX: 'center',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 12,
    offsetY: -12,
  },
  {
    originX: 'center',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -12,
    offsetY: -12,
  },
];

@Injectable()
export class CallDetailPopupService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  open(call: CallRecord, origin: { x: number; y: number }): void {
    this.close();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(POSITIONS)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const componentRef = this.overlayRef.attach(new ComponentPortal(CallDetailPopup));
    componentRef.setInput('call', call);
    componentRef.instance.closed.subscribe(() => this.close());
    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
