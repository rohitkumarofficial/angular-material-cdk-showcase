import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NAV_ITEMS } from './core/nav-items';
import { ThemeColor, ThemeService } from './core/services/theme.service';
import { UserMenu } from './shared/user-menu/user-menu';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    UserMenu,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Angular Material + CDK Showcase');
  protected readonly navItems = NAV_ITEMS;
  protected readonly themeService = inject(ThemeService);

  private readonly isHandset = toSignal(
    inject(BreakpointObserver)
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  protected readonly sidenavMode = () => (this.isHandset() ? 'over' : 'side');
  protected readonly sidenavOpened = () => !this.isHandset();

  protected onColorThemeChange(color: ThemeColor): void {
    this.themeService.setColorTheme(color);
  }
}
