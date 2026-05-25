"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Globe2, Users, BarChart3, Library, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"
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

export default function Home() {
  const { user, signInWithGoogle, loading } = useAuth()
  const [onboardingStep, setOnboardingStep] = useState(0)

  // Loading state
  if (loading) {
    return (
      <div className="flex h-full flex-col bg-background items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="animate-spin rounded-none h-12 w-12 border-4 border-foreground border-t-transparent bg-amber-300 neo-shadow-sm"></div>
          <p className="font-display font-black uppercase text-xl text-foreground">Memuat SARAS...</p>
        </div>
      </div>
    )
  }

  // Dashboard when logged in
  if (user) {
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

  // Onboarding Steps
  const onboardingSteps = [
    {
      title: "Selamat Datang di SARAS! 👋",
      subtitle: "Sistem Asisten Riset Akademik Statistika",
      description: "Platform cerdas bertenaga AI untuk menjamin integritas riset, validasi data nasional, dan akuisisi responden akademik tepercaya bagi akademisi Indonesia.",
      accentBg: "bg-amber-300",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-sm font-bold text-foreground leading-relaxed">
            SARAS dirancang untuk mengatasi tantangan terbesar dalam riset ilmiah: **Integritas Data** dan **Kredibilitas Responden**.
          </p>
          <div className="border-2 border-foreground p-4 bg-background neo-shadow-sm rounded-none space-y-2">
            <h4 className="font-black text-sm uppercase text-foreground">💡 Visi SARAS 2026:</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Membangun budaya riset yang jujur dan transparan dengan memanfaatkan kecerdasan buatan, visualisasi interaktif, dan integrasi data resmi BPS.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Modul Riset Terintegrasi 🔬",
      subtitle: "Alat Lengkap untuk Setiap Tahap Risetmu",
      description: "Kami menyediakan 5 modul cerdas yang mencakup seluruh alur penelitian ilmiah Anda.",
      accentBg: "bg-purple-300",
      icon: ShieldCheck,
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-2 border-foreground p-3 bg-red-100 rounded-none neo-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xs bg-red-300 border border-foreground px-1.5 py-0.5">ARIA</span>
              <span className="font-bold text-xs text-foreground">Integrity Audit</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground">Mendeteksi manipulasi data, outlier, dan uji Hukum Benford.</p>
          </div>
          <div className="border-2 border-foreground p-3 bg-blue-100 rounded-none neo-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xs bg-blue-300 border border-foreground px-1.5 py-0.5">NEXUS</span>
              <span className="font-bold text-xs text-foreground">BPS Data Hub</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground">Sandingkan data Anda langsung dengan data indikator nasional BPS.</p>
          </div>
          <div className="border-2 border-foreground p-3 bg-green-100 rounded-none neo-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xs bg-green-300 border border-foreground px-1.5 py-0.5">VERA</span>
              <span className="font-bold text-xs text-foreground">Respondent</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground">Survei berinsentif tinggi terverifikasi email akademik (.ac.id).</p>
          </div>
          <div className="border-2 border-foreground p-3 bg-purple-100 rounded-none neo-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xs bg-purple-300 border border-foreground px-1.5 py-0.5">SIGMA</span>
              <span className="font-bold text-xs text-foreground">Stat Engine</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground">Otomatisasi uji hipotesis dan penulisan bab analisis ilmiah.</p>
          </div>
        </div>
      )
    },
    {
      title: "Mulai Riset Jujurmu Sekarang 🚀",
      subtitle: "Masuk dengan Akun Google",
      description: "Bergabunglah bersama ribuan peneliti dan mahasiswa Indonesia untuk riset akademik yang lebih berintegritas.",
      accentBg: "bg-emerald-300",
      icon: CheckCircle2,
      content: (
        <div className="space-y-4 flex flex-col items-center">
          <p className="text-sm font-bold text-center text-foreground leading-relaxed max-w-sm">
            Gunakan email institusi (.ac.id) Anda untuk mendapatkan lencana verifikasi responden akademik secara otomatis!
          </p>
          
          <button 
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 border-4 border-foreground bg-primary px-6 py-4 text-base font-black text-primary-foreground neo-shadow hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-none w-full max-w-sm uppercase tracking-wide mt-2"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.438-2.883-6.438-6.438s2.883-6.438 6.438-6.438c1.556 0 2.977.564 4.095 1.493l3.073-3.073C19.347 2.115 15.992 1 12.24 1s-8.11 4.545-8.11 11 4.358 11 8.11 11c7.347 0 10.9-4.898 10.9-11 0-.727-.082-1.418-.218-2.114H12.24z"/>
            </svg>
            Masuk dengan Google
          </button>
        </div>
      )
    }
  ]

  const currentStep = onboardingSteps[onboardingStep]
  const StepIcon = currentStep.icon

  return (
    <div className="flex h-full flex-col bg-background">
      <Topbar title="SARAS Platform" subtitle="Sistem Asisten Riset Akademik Statistika" />
      
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl border-4 border-foreground bg-card p-6 md:p-8 rounded-none neo-shadow relative overflow-hidden">
          
          {/* Background Decorative Element */}
          <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 border-4 border-foreground rounded-none ${currentStep.accentBg} transition-colors duration-300`}></div>
          
          <div className="relative z-10 space-y-6">
            
            {/* Step Counter */}
            <div className="flex items-center gap-2">
              <span className={`inline-block border-2 border-foreground px-2 py-0.5 text-xs font-black uppercase ${currentStep.accentBg} transition-colors duration-300`}>
                Langkah {onboardingStep + 1} dari {onboardingSteps.length}
              </span>
            </div>

            {/* Step Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 border-2 border-foreground rounded-none ${currentStep.accentBg} transition-colors duration-300`}>
                  <StepIcon className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">{currentStep.title}</h2>
              </div>
              <p className="text-sm font-bold text-foreground tracking-wide uppercase">{currentStep.subtitle}</p>
              <p className="text-sm font-semibold text-muted-foreground leading-relaxed">{currentStep.description}</p>
            </div>

            {/* Step Dynamic Content */}
            <div className="border-t-2 border-foreground pt-6">
              {currentStep.content}
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between border-t-2 border-foreground pt-6 mt-6">
              <button
                disabled={onboardingStep === 0}
                onClick={() => setOnboardingStep(prev => prev - 1)}
                className="flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2 text-sm font-black uppercase text-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none transition-all rounded-none"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {onboardingSteps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-3 w-3 border-2 border-foreground rounded-none transition-all duration-300 ${idx === onboardingStep ? currentStep.accentBg + ' w-6' : 'bg-background'}`}
                  />
                ))}
              </div>

              {onboardingStep < onboardingSteps.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep(prev => prev + 1)}
                  className={`flex items-center gap-2 border-2 border-foreground px-4 py-2 text-sm font-black uppercase text-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-none ${currentStep.accentBg}`}
                >
                  Lanjut <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 border-2 border-foreground bg-primary px-4 py-2 text-sm font-black uppercase text-primary-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-none"
                >
                  Masuk Sekarang 🚀
                </button>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
