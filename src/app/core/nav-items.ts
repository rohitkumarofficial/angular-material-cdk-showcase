export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/call-board', label: 'Call Board', icon: 'emergency' },
];
