"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Building2,
  Menu,
  X,
  LogOut,
  User,
  Globe,
  Plus,
  BarChart3,
  Settings,
  CreditCard,
  Shield
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: {
    title: string
    href: string
  }[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
    subItems: [
      {
        title: "All Leads",
        href: "/leads/list",
      },
      {
        title: "Create Lead",
        href: "/leads/create",
      },
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Building2,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Building2,
  },
  {
    title: "Landing Pages",
    href: "/landing-pages",
    icon: Globe,
    subItems: [
      {
        title: "All Pages",
        href: "/landing-pages",
      },
      {
        title: "Create Page",
        href: "/landing-pages/create",
      },
      {
        title: "Analytics",
        href: "/landing-pages/analytics",
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Admin",
    href: "/admin/users",
    icon: Shield,
  },
]

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "text-lg font-semibold tracking-tight",
              collapsed && "sr-only"
            )}>
              Mini CRM
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInternalCollapsed(!internalCollapsed)}
              className="h-8 w-8 p-0"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              
              return (
                <div key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("mr-2 h-4 w-4", collapsed && "mr-0")} />
                      {!collapsed && item.title}
                    </Button>
                  </Link>
                  
                  {/* Sub-items */}
                  {!collapsed && item.subItems && isActive && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link key={subItem.href} href={subItem.href}>
                            <Button
                              variant={isSubActive ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-sm"
                            >
                              {subItem.title}
                            </Button>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* User Section */}
        {!collapsed && (
          <div className="mt-auto p-3 border-t">
            <div className="flex items-center space-x-2 p-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
