import { Injectable, signal } from '@angular/core';

export type ThemeColor = 'indigo' | 'teal';
export type ThemeMode = 'light' | 'dark';

const COLOR_STORAGE_KEY = 'theme-color';
const MODE_STORAGE_KEY = 'theme-mode';
const DARK_CLASS = 'dark-theme';
const COLOR_CLASSES: Record<ThemeColor, string> = {
  indigo: 'theme-indigo',
  teal: 'theme-teal',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly colorTheme = signal<ThemeColor>('indigo');
  readonly mode = signal<ThemeMode>('light');

  setColorTheme(color: ThemeColor): void {
    const root = document.documentElement;
    root.classList.remove(...Object.values(COLOR_CLASSES));
    root.classList.add(COLOR_CLASSES[color]);
    localStorage.setItem(COLOR_STORAGE_KEY, color);
    this.colorTheme.set(color);
  }

  setMode(mode: ThemeMode): void {
    document.documentElement.classList.toggle(DARK_CLASS, mode === 'dark');
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    this.mode.set(mode);
  }

  toggleMode(): void {
    this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
  }

  restore(): void {
    const savedColor = localStorage.getItem(COLOR_STORAGE_KEY) as ThemeColor | null;
    this.setColorTheme(savedColor === 'indigo' || savedColor === 'teal' ? savedColor : 'indigo');

    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    const preferDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.setMode(
      savedMode === 'dark' || savedMode === 'light' ? savedMode : preferDark ? 'dark' : 'light',
    );
  }
}
