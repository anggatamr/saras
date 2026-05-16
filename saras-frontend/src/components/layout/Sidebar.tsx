"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Globe2, 
  Users, 
  BarChart3, 
  Library, 
  Server
} from "lucide-react"

const mainNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
]

const moduleNav = [
  { name: "ARIA", href: "/aria", icon: ShieldCheck },
  { name: "NEXUS", href: "/nexus", icon: Globe2 },
  { name: "VERA", href: "/vera", icon: Users },
  { name: "SIGMA", href: "/sigma", icon: BarChart3 },
  { name: "ATLAS", href: "/atlas", icon: Library },
]

const devNav = [
  { name: "Go Backend", href: "/dev/backend", icon: Server },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[220px] flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            S
          </div>
          <span>SARAS</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2 text-xs font-semibold tracking-tight text-muted-foreground">MAIN</div>
        <nav className="grid gap-1 px-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-4 px-4 py-2 text-xs font-semibold tracking-tight text-muted-foreground">MODULES</div>
        <nav className="grid gap-1 px-2">
          {moduleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-4 px-4 py-2 text-xs font-semibold tracking-tight text-muted-foreground">DEV</div>
        <nav className="grid gap-1 px-2">
          {devNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold">
            AG
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Angga</span>
            <span className="text-xs text-muted-foreground">angga@unimed.ac.id</span>
          </div>
        </div>
      </div>
    </div>
  )
}
