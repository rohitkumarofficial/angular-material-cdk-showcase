import { Component, signal } from '@angular/core';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface DutyGroup {
  name: string;
  enabled: boolean;
}

interface Device {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-user-menu',
  imports: [
    OverlayModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
})
export class UserMenu {
  protected readonly isOpen = signal(false);

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
  ];

  protected readonly user = {
    initials: 'PCT',
    firstName: 'Ajeshkumar',
    lastName: 'Parna',
    online: true,
  };

  protected readonly devices: Device[] = [
    { icon: 'call', label: '210' },
    { icon: 'badge', label: 'Test001' },
  ];

  protected readonly dutyProfiles = [
    "St. Mary's Hospital",
    'Lakeside General Hospital',
    'Riverside Medical Center',
    'Grace Regional Hospital',
    'Sunnyvale Community Hospital',
  ];
  protected readonly selectedDutyProfile = signal(this.dutyProfiles[0]);

  protected readonly dutyGroups = signal<DutyGroup[]>([
    { name: '1AB', enabled: false },
    { name: 'All', enabled: false },
    { name: 'BedsPt1', enabled: false },
    { name: 'BedsPt2', enabled: true },
  ]);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected onDutyProfileChange(profile: string): void {
    this.selectedDutyProfile.set(profile);
  }

  protected onDutyGroupToggle(group: DutyGroup, event: MatSlideToggleChange): void {
    this.dutyGroups.update((groups) =>
      groups.map((g) => (g === group ? { ...g, enabled: event.checked } : g)),
    );
  }

  protected signOut(): void {
    this.close();
  }
}
