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
  Server,
  User
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
    <div className="hidden h-full w-[240px] flex-col border-r-4 border-foreground bg-background md:flex">
      <div className="flex h-14 items-center border-b-4 border-foreground px-4 bg-background">
        <Link href="/" className="flex items-center gap-2 font-black text-foreground uppercase tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground neo-shadow-sm font-black rounded-none">
            S
          </div>
          <span className="text-xl">SARAS</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">MAIN</div>
        <nav className="grid gap-1 px-2">
          {mainNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                  isActive 
                    ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm" 
                    : "text-foreground hover:bg-accent hover:border-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">MODULES</div>
        <nav className="grid gap-1 px-2">
          {moduleNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                  isActive 
                    ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm" 
                    : "text-foreground hover:bg-accent hover:border-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">DEV</div>
        <nav className="grid gap-1 px-2">
          {devNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                  isActive 
                    ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm" 
                    : "text-foreground hover:bg-accent hover:border-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">ACCOUNT</div>
        <nav className="grid gap-1 px-2">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
              pathname === "/profile"
                ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm"
                : "text-foreground hover:bg-accent hover:border-foreground"
            )}
          >
            <User className="h-4 w-4" />
            Profil
          </Link>
        </nav>
      </div>

      <div className="mt-auto border-t-4 border-foreground p-4 bg-background">
        {user ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-foreground bg-secondary text-sm font-black uppercase rounded-none neo-shadow-sm">
                {user.email?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-sm font-bold truncate text-foreground">{user.name || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            <button onClick={logout} className="ml-2 text-xs font-bold text-red-500 hover:text-red-700 hover:underline shrink-0">Logout</button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="w-full border-2 border-foreground bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-none">
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
        <button className="md:hidden flex h-9 w-9 items-center justify-center border-2 border-foreground bg-background text-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-none mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0 border-r-4 border-foreground">
        <div className="flex h-full flex-col bg-background">
          <div className="flex h-14 items-center border-b-4 border-foreground px-4">
            <Link href="/" className="flex items-center gap-2 font-black text-foreground uppercase tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground neo-shadow-sm font-black rounded-none">
                S
              </div>
              <span className="text-xl">SARAS</span>
            </Link>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">MAIN</div>
            <nav className="grid gap-1 px-2">
              {mainNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                      isActive 
                        ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm" 
                        : "text-foreground hover:bg-accent hover:border-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">MODULES</div>
            <nav className="grid gap-1 px-2">
              {moduleNav.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                      isActive 
                        ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm" 
                        : "text-foreground hover:bg-accent hover:border-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">DEV</div>
            <nav className="grid gap-1 px-2">
              {devNav.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                      isActive 
                        ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm" 
                        : "text-foreground hover:bg-accent hover:border-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">ACCOUNT</div>
            <nav className="grid gap-1 px-2">
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-none border-2 border-transparent",
                  pathname === "/profile"
                    ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm"
                    : "text-foreground hover:bg-accent hover:border-foreground"
                )}
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
            </nav>
          </div>

          <div className="mt-auto border-t-4 border-foreground p-4 bg-background">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-foreground bg-secondary text-sm font-black uppercase rounded-none neo-shadow-sm">
                    {user.email?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="text-sm font-bold truncate text-foreground">{user.name || "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
                <button onClick={logout} className="ml-2 text-xs font-bold text-red-500 hover:text-red-700 hover:underline shrink-0">Logout</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="w-full border-2 border-foreground bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-none">
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
  
  const bottomNavItems = [
    { name: "Dash", href: "/", icon: LayoutDashboard },
    { name: "ARIA", href: "/aria", icon: ShieldCheck },
    { name: "NEXUS", href: "/nexus", icon: Globe2 },
    { name: "SIGMA", href: "/sigma", icon: BarChart3 },
    { name: "ATLAS", href: "/atlas", icon: Library },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t-4 border-foreground bg-background px-2 pb-safe">
      {bottomNavItems.map((item) => {
        const isActive = (item.href === "/" ? pathname === item.href : pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-xs font-black transition-all rounded-none border-2 border-transparent",
              isActive
                ? "bg-primary text-primary-foreground border-foreground neo-shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[9px] uppercase tracking-wider">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

