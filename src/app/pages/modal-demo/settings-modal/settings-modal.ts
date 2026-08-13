import { Component, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface SettingsModalData {
  title: string;
}

@Component({
  selector: 'app-settings-modal',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './settings-modal.html',
  styleUrl: './settings-modal.scss',
})
export class SettingsModal {
  protected readonly data = inject<SettingsModalData>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef<void, SettingsModal>);

  protected readonly emailAlerts = signal(true);
  protected readonly smsAlerts = signal(false);
  protected readonly weeklyDigest = signal(true);
  protected readonly timezone = signal('UTC-5 (Eastern)');
  protected readonly saved = signal(false);

  protected readonly timezones = ['UTC-8 (Pacific)', 'UTC-5 (Eastern)', 'UTC+0 (London)'];

  protected save(): void {
    this.saved.set(true);
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
