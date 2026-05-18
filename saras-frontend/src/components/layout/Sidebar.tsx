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

import { useAuth } from "@/lib/auth"

export function Sidebar() {
  const pathname = usePathname()
  const { user, signInWithGoogle, logout } = useAuth()

  return (
    <div className="hidden h-full w-[220px] flex-col border-r bg-background md:flex">
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
        {user ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold uppercase">
                {user.email?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-sm font-medium truncate">{user.displayName || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            <button onClick={logout} className="ml-2 text-xs text-red-500 hover:underline shrink-0">Logout</button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="w-full rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Login
          </button>
        )}
      </div>
    </div>
  )
}

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileSidebar() {
  const pathname = usePathname()
  const { user, signInWithGoogle, logout } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden flex h-8 w-8 items-center justify-center rounded-md bg-transparent hover:bg-accent hover:text-accent-foreground mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0">
        <div className="flex h-full flex-col bg-background">
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
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold uppercase">
                    {user.email?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="text-sm font-medium truncate">{user.displayName || "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
                <button onClick={logout} className="ml-2 text-xs text-red-500 hover:underline shrink-0">Logout</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="w-full rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Login
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  
  // Create a combined list of key routes for bottom nav (max 5 items usually looks best)
  const bottomNavItems = [
    { name: "Dash", href: "/", icon: LayoutDashboard },
    { name: "ARIA", href: "/aria", icon: ShieldCheck },
    { name: "NEXUS", href: "/nexus", icon: Globe2 },
    { name: "SIGMA", href: "/sigma", icon: BarChart3 },
    { name: "ATLAS", href: "/atlas", icon: Library },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 pb-safe">
      {bottomNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors hover:text-primary",
            (item.href === "/" ? pathname === item.href : pathname.startsWith(item.href))
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px]">{item.name}</span>
        </Link>
      ))}
    </div>
  )
}
