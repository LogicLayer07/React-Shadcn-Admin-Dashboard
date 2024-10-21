import { IconLayoutDashboard, IconLayoutKanban } from "@tabler/icons-react"


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

]
