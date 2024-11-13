import { IconCalendarWeek, IconChecklist, IconLayoutDashboard, IconLayoutKanban, IconMessages } from "@tabler/icons-react"


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
    title: 'Dashboard',
    label: '',
    href: '/',
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
    href: '/product',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Chats',
    label: '',
    href: '/chats',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Calendar',
    label: '',
    href: '/calendar',
    icon: <IconCalendarWeek size={18} />,
  },
]
