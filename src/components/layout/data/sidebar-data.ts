import {
  LayoutDashboard,
  Battery,
  ListTodo,
  Package,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'BIMS',
      logo: Battery,
      plan: 'Battery Inventory & Management System',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Battery details',
      items: [
        {
          title: 'Battery Types',
          url: '/battery-types',
          icon: ListTodo,
        },
        {
          title: 'Battery Models',
          url: '/battery-models',
          icon: ListTodo,
        },
      ],
    },
    {
      title: 'Advance Sells',
      items: [
        {
          title: 'Advance Sells Form',
          url: '/advance-sells',
          icon: ShoppingCart,
        },
        {
          title: 'Advance Sells Data',
          url: '/advance-sells-data',
          icon: LayoutDashboard,
        },
        {
          title: 'Bills Assigned',
          url: '/bills-assigned',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'Warranty Battery DCWR',
      items: [
        {
          title: 'DCWR Form',
          url: '/dcwr/form',
          icon: Package,
        },
        {
          title: 'Unverified DCWR',
          url: '/dcwr/unverified',
          icon: LayoutDashboard,
        },
        {
          title: 'Verified DCWR',
          url: '/dcwr/verified',
          icon: ShieldCheck,
        },
      ],
    },
  ],
}
