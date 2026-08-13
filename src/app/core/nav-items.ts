export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/call-board', label: 'Call Board', icon: 'emergency' },
  { path: '/ticker-search', label: 'Ticker Search', icon: 'search' },
  { path: '/forms', label: 'Forms', icon: 'assignment' },
  { path: '/modal-demo', label: 'Modal Dialog', icon: 'open_in_new' },
];
