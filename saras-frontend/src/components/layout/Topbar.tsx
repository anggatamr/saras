import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <span className="mr-1 flex h-2 w-2 rounded-full bg-green-500"></span>
            Firebase: Connected
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <span className="mr-1 flex h-2 w-2 rounded-full bg-green-500"></span>
            API: Active
          </Badge>
        </div>
        
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  )
}
