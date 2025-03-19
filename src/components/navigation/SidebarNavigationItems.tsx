
import { LayoutDashboard, LineChart, Lightbulb, UserRound, Settings, CreditCard, Users } from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    activePattern: /^\/dashboard$/,
  },
  {
    title: 'Campaigns',
    icon: LineChart, // Using LineChart icon for Campaigns
    href: '/campaigns',
    activePattern: /^\/campaigns(\/.*)?$/,
  },
  {
    title: 'AI Insights & Analytics',
    icon: Lightbulb,
    href: '/insights',
    activePattern: /^\/insights$/,
  },
  {
    title: 'Profile',
    icon: UserRound,
    href: '/profile',
    activePattern: /^\/profile$/,
  },
  {
    title: 'Configuration',
    icon: Settings,
    href: '/config',
    activePattern: /^\/config$/,
  },
  {
    title: 'Billing',
    icon: CreditCard,
    href: '/billing',
    activePattern: /^\/billing$/,
  },
  {
    title: 'User Roles',
    icon: Users,
    href: '/roles',
    activePattern: /^\/roles$/,
  },
];

export default navigationItems;
