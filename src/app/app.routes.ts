import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'call-board',
    loadComponent: () => import('./pages/call-board/call-board').then((m) => m.CallBoard),
    data: { fullWidth: true },
  },
  { path: '**', redirectTo: '' },
];
