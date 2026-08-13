import { Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SettingsModal } from './settings-modal/settings-modal';

@Component({
  selector: 'app-modal-demo',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './modal-demo.html',
  styleUrl: './modal-demo.scss',
})
export class ModalDemo {
  private readonly dialog = inject(Dialog);

  protected openSettings(): void {
    this.dialog.open(SettingsModal, {
      data: { title: 'Board Settings' },
      hasBackdrop: true,
    });
  }
}
