import { IconBrandProducthunt, IconCalendarWeek, IconChecklist, IconHelpHexagon, IconHexagonNumber1, IconHexagonNumber2, IconHexagonNumber3, IconHexagonNumber4, IconHexagonNumber5, IconHome, IconLayoutDashboard, IconLayoutKanban, IconMessages, IconSettings, IconShoppingCart, IconUserShield } from "@tabler/icons-react"


export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Home',
    label: '',
    href: '/',
    icon: <IconHome size={18} />,
  },
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'KanBan',
    label: '',
    href: '/kanban',
    icon: <IconLayoutKanban size={18} />,
  },
  {
    title: 'Products',
    label: '',
    href: '',
    icon: <IconChecklist size={18} />,
    sub: [
      {
        title: 'Product',
        label: '',
        href: '/product',
        icon: <IconBrandProducthunt size={18} />,
      },
      {
        title: 'Add Product',
        label: '',
        href: '/product/add-product',
        icon: <IconHexagonNumber1 size={18} />,
      },
    ],
  },
  {
    title: 'Chats',
    label: '',
    href: '/chats',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Order',
    label: '',
    href: '/order',
    icon: <IconShoppingCart size={18} />,
  },
  {
    title: 'Calendar',
    label: '',
    href: '/calendar',
    icon: <IconCalendarWeek size={18} />,
  },
  {
    title: 'Tasks',
    label: '',
    href: '/tasks',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Supports',
    label: '',
    href: '/supports',
    icon: <IconHelpHexagon size={18} />,
  },
  {
    title: 'Authentication',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'Sign In (email + password)',
        label: '',
        href: '/sign-in',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'Sign In (Box)',
        label: '',
        href: '/sign-in-2',
        icon: <IconHexagonNumber2 size={18} />,
      },
      {
        title: 'Sign Up',
        label: '',
        href: '/sign-up',
        icon: <IconHexagonNumber3 size={18} />,
      },
      {
        title: 'Forgot Password',
        label: '',
        href: '/forgot-password',
        icon: <IconHexagonNumber4 size={18} />,
      },
      {
        title: 'OTP',
        label: '',
        href: '/otp',
        icon: <IconHexagonNumber5 size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
