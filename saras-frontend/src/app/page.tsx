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
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    title: "NEXUS",
    description: "National Data Intelligence Hub",
    details: "Bandingkan data primer Anda dengan indikator resmi BPS secara real-time.",
    href: "/nexus",
    icon: Globe2,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "VERA",
    description: "Verified Respondent Acquisition",
    details: "Marketplace survei dengan verifikasi email institusi (.ac.id) untuk validitas tinggi.",
    href: "/vera",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    title: "SIGMA",
    description: "Statistical Intelligence Engine",
    details: "Uji asumsi, analisis regresi, dan hasilkan narasi interpretasi akademis (BAB IV).",
    href: "/sigma",
    icon: BarChart3,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    title: "ATLAS",
    description: "Academic Literature Source",
    details: "Pemetaan research gap visual dengan D3.js dan auto-cite APA/IEEE.",
    href: "/atlas",
    icon: Library,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
]

export default function Dashboard() {
  return (
    <div className="flex h-full flex-col">
      <Topbar title="Dashboard Utama" subtitle="Selamat datang di SARAS - Sistem Asisten Riset Akademik Statistika" />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Mulai Riset Anda</h2>
            <p className="text-muted-foreground">Pilih modul yang ingin Anda gunakan hari ini.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link key={module.href} href={module.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={`p-3 rounded-xl ${module.bg}`}>
                      <module.icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="font-medium text-foreground mt-1">{module.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mt-2">{module.details}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Buka Modul <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="rounded-xl bg-accent p-6 text-accent-foreground border border-accent-border mt-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold">Riset yang jujur, dimulai dari data yang benar.</h3>
              <p className="mt-2 text-sm opacity-90 text-foreground">
                SARAS hadir bukan untuk membersihkan data agar terlihat signifikan, melainkan untuk membantu Anda memahami data apa adanya dengan bantuan AI.
              </p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
