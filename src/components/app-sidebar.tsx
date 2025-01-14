"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  Beef,
  LayoutDashboard,
  ShoppingBasket
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { BusinessSwitcher } from "@/components/business-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { Restaurant } from "@/types/Restaurant.type"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/home",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: Beef,
      items: [
        {
          title: "List",
          url: "/products-list",
        },
        {
          title: "Add",
          url: "/products-add",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingBasket,
      items: [
        {
          title: "List",
          url: "/orders/list",
        },
      ],
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

interface Props extends React.ComponentProps<typeof Sidebar> {
  businesses?: Restaurant[]
}

export function AppSidebar({ businesses, ...props }: Props) {
  const { user, isSignedIn } = useUser()

  const headerContent = React.useMemo(() => {
    if (!businesses || businesses.length === 0) {
      return null
    }
    return <BusinessSwitcher />
  }, [businesses])

  if (!isSignedIn) {
    return null
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {headerContent}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName || user.firstName || user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
