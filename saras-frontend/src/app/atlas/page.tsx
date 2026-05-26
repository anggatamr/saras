"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Library, Search, BookOpen, Quote, Download, Loader2, Sparkles, Compass, GraduationCap, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fetchWithAuth } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

interface Paper {
  id: string
  title: string
  authors: string
  year: number
  citations: number
  journal: string
}

interface Bubble {
  topic: string
  count: number
  is_gap: boolean
}

export default function AtlasPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [papers, setPapers] = useState<Paper[]>([])
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [synopsis, setSynopsis] = useState("")
  const [hoveredBubble, setHoveredBubble] = useState<Bubble | null>(null)
  const [activeTab, setActiveTab] = useState<"map" | "list">("map")

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(false)
    setSynopsis("")
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      // Fetch Papers
      const paperRes = await fetchWithAuth(`${apiUrl}/api/v1/atlas/search?q=${encodeURIComponent(query)}`)
      let paperList: Paper[] = []
      if (paperRes.ok) {
        const paperData = await paperRes.json()
        paperList = paperData.data || []
        setPapers(paperList)
      } else {
        throw new Error("Gagal memuat paper")
      }

      // Fetch Gap Map
      const gapRes = await fetchWithAuth(`${apiUrl}/api/v1/atlas/gap-map?q=${encodeURIComponent(query)}`)
      if (gapRes.ok) {
        const gapData = await gapRes.json()
        setBubbles(gapData.data || [])
        setSynopsis(gapData.synopsis || "")
      } else {
        throw new Error("Gagal memuat peta gap")
      }
      
      setSearched(true)
    } catch (error) {
      console.error("ATLAS Search failed", error)
      toast({
        type: 'error',
        title: 'Pencarian gagal',
        description: 'Terjadi kesalahan saat memproses data literatur ilmiah dari OpenAlex.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCite = async (paper: Paper) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetchWithAuth(`${apiUrl}/api/v1/atlas/cite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paper, style: "apa" })
      })
      if (res.ok) {
        const data = await res.json()
        navigator.clipboard.writeText(data.citation)
        toast({
          type: 'success',
          title: 'Kutipan disalin!',
          description: 'Format APA telah disalin ke papan klip.'
        })
      }
    } catch (error) {
      console.error("Citation failed", error)
      toast({
        type: 'error',
        title: 'Gagal mengutip',
        description: 'Terjadi kesalahan saat memproses kutipan sitasi.'
      })
    }
  }

  // Calculate deterministic SVG positions for bubbles
  const getBubbleCoords = (b: Bubble, index: number, total: number) => {
    const cx = 250
    const cy = 200
    if (b.is_gap) {
      return { x: cx, y: cy, r: 55 }
    }

    const nonGapNodes = bubbles.filter(node => !node.is_gap)
    const nonGapIndex = nonGapNodes.findIndex(node => node.topic === b.topic)
    const isOuter = b.count > 50
    const orbitRadius = isOuter ? 140 : 85
    const bubbleR = isOuter ? 45 : 36

    // Distribute angles evenly
    const totalNonGap = Math.max(1, nonGapNodes.length)
    const baseAngle = isOuter ? 0 : Math.PI / 4
    const angleStep = (2 * Math.PI) / totalNonGap
    const angle = baseAngle + (nonGapIndex !== -1 ? nonGapIndex : index) * angleStep

    return {
      x: cx + orbitRadius * Math.cos(angle),
      y: cy + orbitRadius * Math.sin(angle),
      r: bubbleR
    }
  }

  // Helper to split long topic name in SVG
  const renderTextLines = (text: string, x: number, y: number, maxLength = 12) => {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach(word => {
      if ((currentLine + " " + word).trim().length > maxLength) {
        if (currentLine) lines.push(currentLine.trim())
        currentLine = word
      } else {
        currentLine = (currentLine + " " + word).trim()
      }
    })
    if (currentLine) lines.push(currentLine.trim())

    // Limit to 2 lines for visual elegance
    const displayLines = lines.slice(0, 2)
    return displayLines.map((line, idx) => (
      <tspan
        key={idx}
        x={x}
        y={y + (idx - (displayLines.length - 1) / 2) * 14}
        textAnchor="middle"
        className="select-none"
      >
        {line}
      </tspan>
    ))
  }

  return (
    <div className="flex h-full flex-col bg-background font-sans">
      <Topbar 
        title="ATLAS" 
        subtitle="Analisis pemetaan celah penelitian visual (research gap) dan auto-sitasi dari OpenAlex secara instan." 
      />
      
      <main className="flex-1 overflow-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* Search Box - Premium Minimalist */}
          <Card className="border border-border/50 shadow-sm rounded-2xl bg-card overflow-hidden">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                  <Library className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Masukkan topik riset Anda (contoh: green accounting kinerja keuangan go-public)..." 
                      className="pl-10 h-11 text-sm border border-border/80 bg-background/50 rounded-xl focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <Button 
                  className="h-11 px-6 rounded-xl font-medium text-xs tracking-wide bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all w-full md:w-auto" 
                  onClick={handleSearch} 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memetakan...
                    </span>
                  ) : "Peta Celah Riset"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searched ? (
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              
              {/* Main Visualization & Synopsis Column */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* SVG Concentric Gap Map */}
                <Card className="border border-border/40 rounded-2xl shadow-sm bg-card overflow-hidden">
                  <CardHeader className="border-b border-border/10 pb-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-semibold text-base text-foreground tracking-tight">
                          Research Gap Map
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">
                          Representasi konsentrasi literatur. Celah terdalam berada di pusat orbital.
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-primary/10 bg-primary/5 text-primary font-medium rounded-full text-[10px] tracking-wide px-2.5 py-0.5">
                        OpenAlex Database
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 relative">
                    
                    {/* SVG Canvas */}
                    <div className="relative w-full h-[380px] rounded-xl border border-border/10 bg-gradient-to-b from-muted/5 to-muted/20 overflow-hidden flex items-center justify-center p-4">
                      
                      <svg viewBox="0 0 500 400" className="w-full h-full max-w-[450px]">
                        <defs>
                          {/* Premium Gradients for Circles */}
                          <linearGradient id="gapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="jenuhGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#fecaca" stopOpacity="0.7" />
                          </linearGradient>
                          <linearGradient id="menengahGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.7" />
                          </linearGradient>
                        </defs>

                        {/* Subtle Grid Axes */}
                        <line x1="250" y1="30" x2="250" y2="370" stroke="currentColor" className="text-foreground/5" strokeWidth={1} strokeDasharray="3 3" />
                        <line x1="50" y1="200" x2="450" y2="200" stroke="currentColor" className="text-foreground/5" strokeWidth={1} strokeDasharray="3 3" />

                        {/* Orbital Circles */}
                        {/* Outer Ring */}
                        <circle cx="250" cy="200" r="140" fill="none" stroke="currentColor" className="text-foreground/5" strokeWidth={1.5} strokeDasharray="5 5" />
                        {/* Inner Ring */}
                        <circle cx="250" cy="200" r="85" fill="none" stroke="currentColor" className="text-foreground/5" strokeWidth={1.5} strokeDasharray="5 5" />

                        {/* Node Elements */}
                        {bubbles.map((b, i) => {
                          const { x, y, r } = getBubbleCoords(b, i, bubbles.length)
                          
                          if (b.is_gap) {
                            return (
                              <g key={i}>
                                {/* Glowing orbit background */}
                                <circle 
                                  cx={x} 
                                  cy={y} 
                                  r={r + 8} 
                                  className="fill-sky-100/10 stroke-sky-300/30 animate-pulse" 
                                  strokeWidth={1} 
                                  strokeDasharray="4 4" 
                                />
                                <circle 
                                  cx={x} 
                                  cy={y} 
                                  r={r + 16} 
                                  className="fill-none stroke-sky-200/10" 
                                  strokeWidth={1} 
                                />
                                {/* Main circle */}
                                <g 
                                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                                  onMouseEnter={() => setHoveredBubble(b)}
                                  onMouseLeave={() => setHoveredBubble(null)}
                                >
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r={r}
                                    fill="url(#gapGradient)"
                                    stroke="#0284c7"
                                    strokeWidth={2}
                                    className="transition-all"
                                  />
                                  <text
                                    className="text-[10px] font-semibold fill-sky-800 tracking-tight"
                                  >
                                    {renderTextLines(b.topic, x, y)}
                                  </text>
                                  {/* Center core target dot */}
                                  <circle cx={x} cy={y - r + 8} r={3} fill="#0284c7" />
                                </g>
                              </g>
                            )
                          }

                          const isOuter = b.count > 50
                          const strokeColor = isOuter ? "#ef4444" : "#f59e0b"
                          const textColor = isOuter ? "fill-rose-800" : "fill-amber-800"
                          const gradientId = isOuter ? "url(#jenuhGradient)" : "url(#menengahGradient)"

                          return (
                            <g 
                              key={i} 
                              className="cursor-pointer transition-all duration-300 hover:scale-105"
                              onMouseEnter={() => setHoveredBubble(b)}
                              onMouseLeave={() => setHoveredBubble(null)}
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={r}
                                fill={gradientId}
                                stroke={strokeColor}
                                strokeWidth={1}
                                strokeDasharray={isOuter ? "none" : "3 1"}
                                className="transition-all"
                              />
                              <text
                                className={`text-[9px] font-medium ${textColor} tracking-tight`}
                              >
                                {renderTextLines(b.topic, x, y)}
                              </text>
                            </g>
                          )
                        })}
                      </svg>

                      {/* Tooltip Overlay inside Box */}
                      {hoveredBubble && (
                        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-md border border-border/40 p-3 rounded-xl shadow-lg transition-opacity duration-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs font-semibold text-foreground">{hoveredBubble.topic}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                Kepadatan Riset: <span className="font-semibold text-foreground">{hoveredBubble.count}</span> karya ilmiah terindeks
                              </p>
                            </div>
                            <Badge 
                              className={`text-[9px] font-medium rounded-full px-2 py-0.5 border ${
                                hoveredBubble.is_gap 
                                  ? "bg-sky-50 border-sky-200 text-sky-700" 
                                  : hoveredBubble.count > 50 
                                    ? "bg-rose-50 border-rose-100 text-rose-700" 
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                              }`}
                            >
                              {hoveredBubble.is_gap ? "Celah Terbuka (Novelty)" : hoveredBubble.count > 50 ? "Sangat Jenuh" : "Saturasi Menengah"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Premium Legend Indicator */}
                    <div className="flex gap-6 mt-4 text-[11px] font-medium text-muted-foreground justify-center">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-rose-400 bg-rose-50/70" /> 
                        Topik Jenuh (&gt;50 paper)
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-amber-400 bg-amber-50/70 border-dashed" /> 
                        Topik Moderat (10-50 paper)
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border-2 border-sky-500 bg-sky-50 animate-pulse" /> 
                        Peluang Kebaruan (Celah)
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Research Gap Synopsis Card */}
                {synopsis && (
                  <Card className="border border-sky-100 rounded-2xl shadow-sm bg-gradient-to-br from-sky-50/30 via-background to-background overflow-hidden">
                    <CardHeader className="border-b border-sky-100/20 pb-3">
                      <CardTitle className="flex items-center gap-2 font-semibold text-sm text-sky-900">
                        <Sparkles className="h-4 w-4 text-sky-500 shrink-0" />
                        Analisis Celah Riset AI (ATLAS Insight)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-5">
                      <p className="text-xs leading-relaxed text-slate-700 italic">
                        &ldquo;{synopsis}&rdquo;
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-sky-100/10">
                        <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
                        <span className="text-[10px] text-sky-700 font-medium tracking-wide">
                          Rekomendasi Kontribusi Akademis • Disintesis oleh Gemini 1.5 Flash
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

              </div>

              {/* Related Papers Column */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border border-border/40 rounded-2xl shadow-sm bg-card overflow-hidden">
                  <CardHeader className="border-b border-border/10 pb-4 bg-muted/20">
                    <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                      Daftar Pustaka Relevan
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Literatur akademik yang dipetakan dari database OpenAlex.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[550px] overflow-y-auto pt-5">
                    {papers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/30 stroke-1 mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">Tidak ada literatur ditemukan.</p>
                      </div>
                    ) : (
                      papers.map(paper => (
                        <div 
                          key={paper.id} 
                          className="border border-border/50 bg-background/40 hover:bg-muted/10 p-3.5 rounded-xl shadow-sm hover:shadow transition-all duration-200"
                        >
                          <a 
                            href={paper.id} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="font-semibold text-[11px] md:text-xs text-slate-800 leading-snug hover:underline cursor-pointer block"
                          >
                            {paper.title}
                          </a>
                          <p className="text-[10px] text-muted-foreground font-medium mt-1">
                            {paper.authors} ({paper.year})
                          </p>
                          <p className="text-[9px] text-muted-foreground/80 line-clamp-1 italic mt-0.5">
                            {paper.journal}
                          </p>
                          
                          <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-border/10">
                            <Badge variant="secondary" className="bg-slate-50 border border-slate-100 hover:bg-slate-50 text-slate-700 font-medium rounded-full text-[9px] px-2 py-0">
                              {paper.citations} Sitasi
                            </Badge>
                            
                            <div className="flex gap-1.5">
                              <Button 
                                size="icon" 
                                variant="outline"
                                className="h-7 w-7 rounded-lg border-border/40 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-all" 
                                onClick={() => window.open(paper.id, '_blank')}
                                title="Buka Paper"
                              >
                                <BookOpen className="h-3.5 w-3.5"/>
                              </Button>
                              <Button 
                                variant="outline"
                                className="h-7 px-2.5 rounded-lg border-primary/20 hover:bg-primary/5 text-primary hover:text-primary-dark font-medium text-[10px] tracking-wide transition-all" 
                                onClick={() => handleCite(paper)} 
                                title="Salin Kutipan APA"
                              >
                                <Quote className="h-3 w-3 mr-1 shrink-0"/> Kutip
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {papers.length > 0 && (
                      <Button 
                        variant="outline"
                        className="rounded-xl border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary font-medium text-xs tracking-wide py-5 transition-all w-full mt-2"
                      >
                        <Download className="w-3.5 h-3.5 mr-2 shrink-0"/> Export ke RIS/BibTeX
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground/40 border border-border/10">
                <Compass className="h-8 w-8 stroke-1" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="font-semibold text-sm text-foreground">Pemetaan Literatur belum dimulai</h3>
                <p className="text-xs text-muted-foreground px-4">
                  Gunakan kotak pencarian di atas untuk memasukkan topik penelitian Anda. SARAS akan memetakan literatur terkait secara visual.
                </p>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  )
}
