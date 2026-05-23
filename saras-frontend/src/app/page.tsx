import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Globe2, Users, BarChart3, Library, ArrowRight } from "lucide-react"
import Link from "next/link"

const modules = [
  {
    title: "ARIA",
    description: "AI Research Integrity Auditor",
    details: "Upload CSV, deteksi outlier, Hukum Benford, dan duplikasi. Hasilkan skor integritas.",
    href: "/aria",
    icon: ShieldCheck,
    color: "text-foreground",
    bg: "bg-red-300",
  },
  {
    title: "NEXUS",
    description: "National Data Intelligence Hub",
    details: "Bandingkan data primer Anda dengan indikator resmi BPS secara real-time.",
    href: "/nexus",
    icon: Globe2,
    color: "text-foreground",
    bg: "bg-blue-300",
  },
  {
    title: "VERA",
    description: "Verified Respondent Acquisition",
    details: "Marketplace survei dengan verifikasi email institusi (.ac.id) untuk validitas tinggi.",
    href: "/vera",
    icon: Users,
    color: "text-foreground",
    bg: "bg-green-300",
  },
  {
    title: "SIGMA",
    description: "Statistical Intelligence Engine",
    details: "Uji asumsi, analisis regresi, dan hasilkan narasi interpretasi akademis (BAB IV).",
    href: "/sigma",
    icon: BarChart3,
    color: "text-foreground",
    bg: "bg-purple-300",
  },
  {
    title: "ATLAS",
    description: "Academic Literature Source",
    details: "Pemetaan research gap visual dengan D3.js dan auto-cite APA/IEEE.",
    href: "/atlas",
    icon: Library,
    color: "text-foreground",
    bg: "bg-amber-300",
  },
]

export default function Dashboard() {
  return (
    <div className="flex h-full flex-col bg-background">
      <Topbar title="Dashboard Utama" subtitle="Selamat datang di SARAS - Sistem Asisten Riset Akademik Statistika" />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-8">
          
          <div className="flex flex-row justify-between items-center border-b-4 border-foreground pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">Mulai Riset Anda</h2>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pilih modul yang ingin Anda gunakan hari ini.</p>
            </div>
            <div className="text-4xl md:text-5xl select-none animate-bounce">
              🔬
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link key={module.href} href={module.href} className="h-full flex">
                <Card className="flex flex-col h-full w-full border-4 border-foreground rounded-none bg-card neo-shadow hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 group">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={`p-3 border-2 border-foreground neo-shadow-sm rounded-none ${module.bg}`}>
                      <module.icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-black uppercase tracking-tight text-foreground">{module.title}</CardTitle>
                      <CardDescription className="font-bold text-foreground mt-1 text-sm">{module.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-1 pb-6">
                    <p className="text-xs font-semibold text-muted-foreground mt-2 leading-relaxed">{module.details}</p>
                    <div className="mt-4 flex items-center text-xs font-black uppercase tracking-wider text-primary group-hover:underline">
                      Buka Modul <ArrowRight className="ml-1.5 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="border-4 border-foreground bg-primary text-primary-foreground neo-shadow p-6 md:p-8 rounded-none mt-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Riset yang jujur, dimulai dari data yang benar.</h3>
              <p className="mt-2 text-sm font-bold opacity-90 leading-relaxed">
                SARAS hadir bukan untuk membersihkan data agar terlihat signifikan, melainkan untuk membantu Anda memahami data apa adanya dengan bantuan AI.
              </p>
            </div>
            <div className="text-5xl select-none hidden md:block">
              ✨
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}

