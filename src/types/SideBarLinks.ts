import {
  Album,
  Atom,
  Box,
  BringToFront,
  FilePlus2,
  Handshake,
  Layers2,
  Layers3,
  NotebookTabs,
  NotepadText,
  PanelLeftDashed,
  ScrollText,
  Settings,
  ShieldHalf,
  User,
  UsersRound,
} from 'lucide-react';
import { Roles } from './user';

export type LinkItem = {
  type: 'link';
  title: string;
  link: string;
  role: Roles[] | 'all';
  slug: string;
  icon: React.ComponentType<any>;
};

export type DropdownItem = {
  type: 'dropdown';
  title: string;
  role: Roles[] | 'all';
  icon: React.ComponentType<any>;
  subLink: LinkItem[];
};

export type SeparationItem = {
  type: 'separation';
  title: string;
};

export const SideBarLinks: (LinkItem | DropdownItem | SeparationItem)[] = [
  {
    type: 'separation',
    title: 'Navigation',
  },
  {
    type: 'link',
    title: 'Dashboard',
    role: 'all',
    link: '/',
    slug: '/',
    icon: PanelLeftDashed,
  },
  {
    type: 'link',
    title: 'Clients',
    role: ['controller', 'od', 'md'],
    link: '/clients',
    slug: 'clients',
    icon: UsersRound,
  },
  {
    type: 'dropdown',
    title: 'Teams',
    icon: ShieldHalf,
    role: ['controller', 'od', 'md'],
    subLink: [
      {
        type: 'link',
        title: 'Operators',
        role: ['controller', 'od'],
        link: 'teams/operators',
        slug: 'operators',
        icon: Handshake,
      },
      {
        type: 'link',
        title: 'Marketing',
        role: ['controller', 'md'],
        link: 'teams/marketing',
        slug: 'marketing',
        icon: Atom,
      },
    ],
  },
  {
    type: 'dropdown',
    title: 'Catalog',
    role: 'all',
    icon: NotebookTabs,
    subLink: [
      {
        type: 'link',
        title: 'Categories',
        role: 'all',
        link: 'catalog/categories',
        slug: 'categories',
        icon: Layers2,
      },
      {
        type: 'link',
        title: 'Sub-Categories',
        role: 'all',
        link: 'catalog/sub-categories',
        slug: 'sub-categories',
        icon: Layers3,
      },
      {
        type: 'link',
        title: 'Products',
        role: 'all',
        link: 'catalog/products',
        slug: 'products',
        icon: Box,
      },
    ],
  },
  {
    type: 'separation',
    title: 'Helpful Links',
  },
  {
    type: 'link',
    title: 'Profile',
    role: 'all',
    link: 'profile',
    slug: 'profile',
    icon: User,
  },
  {
    type: 'link',
    title: 'Settings',
    role: 'all',
    link: '/settings',
    slug: 'settings',
    icon: Settings,
  },
];
