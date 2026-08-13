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
  {
    path: 'ticker-search',
    loadComponent: () => import('./pages/ticker-search/ticker-search').then((m) => m.TickerSearch),
  },
  {
    path: 'forms',
    loadComponent: () => import('./pages/forms/forms').then((m) => m.Forms),
  },
  {
    path: 'modal-demo',
    loadComponent: () => import('./pages/modal-demo/modal-demo').then((m) => m.ModalDemo),
  },
  { path: '**', redirectTo: '' },
];
