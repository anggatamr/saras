"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Library, Search, BookOpen, Quote, Download, Loader2 } from "lucide-react"
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

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    setSearched(false)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      // Fetch Papers
      const paperRes = await fetchWithAuth(`${apiUrl}/api/v1/atlas/search?q=${encodeURIComponent(query)}`)
      if (paperRes.ok) {
        const paperData = await paperRes.json()
        setPapers(paperData.data || [])
      }

      // Fetch Gap Map
      const gapRes = await fetchWithAuth(`${apiUrl}/api/v1/atlas/gap-map?q=${encodeURIComponent(query)}`)
      if (gapRes.ok) {
        const gapData = await gapRes.json()
        setBubbles(gapData.data || [])
      }
      
      setSearched(true)
    } catch (error) {
      console.error("ATLAS Search failed", error)
      toast({
        type: 'error',
        title: 'Pencarian Gagal',
        description: 'Gagal mencari literatur ilmiah dari OpenAlex.'
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
          title: 'Kutipan Disalin!',
          description: data.citation
        })
      }
    } catch (error) {
      console.error("Citation failed", error)
      toast({
        type: 'error',
        title: 'Gagal Mengutip',
        description: 'Terjadi kesalahan saat memproses kutipan sitasi.'
      })
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <Topbar title="ATLAS - Academic Literature Source" subtitle="Pemetaan research gap visual dan auto-citation via OpenAlex." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <Card className="border-4 border-foreground bg-amber-100 neo-shadow-lg rounded-none">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-12 h-12 border-2 border-foreground bg-amber-300 neo-shadow-sm rounded-none flex items-center justify-center shrink-0">
                  <Library className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Masukkan topik riset Anda (contoh: media sosial keputusan pembelian gen z)..." 
                      className="pl-10 h-12 text-md border-2 border-foreground bg-background rounded-none font-bold neo-shadow-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-[1px] focus:-translate-y-[1px] transition-all"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <Button 
                  className="h-12 px-8 border-2 border-foreground bg-amber-300 hover:bg-amber-400 text-foreground neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider rounded-none w-full md:w-auto transition-all" 
                  onClick={handleSearch} 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-foreground" /> : "Peta Gap"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searched && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-full border-4 border-foreground rounded-none neo-shadow bg-background">
                  <CardHeader className="border-b-2 border-foreground bg-secondary">
                    <CardTitle className="flex items-center justify-between font-black text-lg uppercase tracking-tight text-foreground">
                      <span>Research Gap Map</span>
                      <Badge variant="outline" className="border-2 border-foreground bg-amber-200 text-amber-950 font-black rounded-none uppercase text-[10px] tracking-wider px-2 py-0.5">Top 50 Papers</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Kotak besar menandakan topik jenuh. Kotak kecil (berkedip) adalah peluang kebaruan (novelty).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative w-full h-[400px] border-4 border-foreground rounded-none bg-[#FFFDF5] overflow-hidden flex flex-wrap items-center justify-center gap-4 p-8 neo-shadow-sm">
                      {/* Dynamic Bubbles as sharp boxes */}
                      {bubbles.map((b, i) => (
                        <div 
                          key={i} 
                          className={`rounded-none border-4 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none group relative ${
                            b.is_gap 
                              ? "bg-blue-300 animate-pulse w-24 h-24" 
                              : b.count > 100 
                                ? "bg-amber-500 w-40 h-40" 
                                : "bg-amber-300 w-32 h-32"
                          }`}
                        >
                          <span className={`text-center font-black uppercase text-[10px] tracking-wider leading-tight px-2 ${b.is_gap ? "text-blue-950" : b.count > 100 ? "text-white" : "text-amber-950"}`}>
                            {b.topic}
                          </span>
                          <div className="absolute hidden group-hover:block -top-10 bg-foreground text-background border-2 border-foreground text-[10px] font-black uppercase tracking-wider p-2 rounded-none z-10 whitespace-nowrap neo-shadow-sm">
                            {b.count} Papers Found {b.is_gap && "(Research Gap!)"}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 mt-6 text-xs font-bold uppercase tracking-wider justify-center">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-foreground bg-amber-500"></div> Jenuh</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-foreground bg-amber-300"></div> Menengah</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-foreground bg-blue-300 animate-pulse"></div> Peluang (Gap)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-4 border-foreground rounded-none neo-shadow bg-background">
                  <CardHeader className="border-b-2 border-foreground bg-secondary">
                    <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground">Daftar Pustaka Relevan</CardTitle>
                    <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Hasil pemetaan dari Database OpenAlex.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pt-6">
                    {papers.length === 0 && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center py-4">Tidak ada literatur ditemukan.</p>}
                    {papers.map(paper => (
                      <div key={paper.id} className="border-2 border-foreground bg-background p-4 rounded-none hover:bg-amber-50/50 neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-150 relative">
                        <a href={paper.id} target="_blank" rel="noreferrer" className="font-black text-xs uppercase tracking-tight text-primary leading-tight line-clamp-2 mb-2 hover:underline cursor-pointer">{paper.title}</a>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{paper.authors} ({paper.year})</p>
                        <p className="text-[10px] font-medium text-muted-foreground line-clamp-1 italic">{paper.journal}</p>
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="secondary" className="border-2 border-foreground bg-amber-200 text-amber-950 font-black rounded-none text-[9px] uppercase tracking-wider px-2 py-0">{paper.citations} Sitasi</Badge>
                          <div className="flex gap-2">
                            <Button 
                              size="icon" 
                              className="h-7 w-7 border-2 border-foreground bg-secondary hover:bg-muted text-foreground p-0 rounded-none neo-shadow-sm transition-all" 
                              onClick={() => window.open(paper.id, '_blank')}
                            >
                              <BookOpen className="h-3.5 w-3.5"/>
                            </Button>
                            <Button 
                              className="border-2 border-foreground bg-amber-100 hover:bg-amber-200 text-foreground neo-shadow-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-none transition-all h-auto" 
                              onClick={() => handleCite(paper)} 
                              title="Salin Kutipan APA"
                            >
                              <Quote className="h-3 w-3 mr-1"/> Kutip
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {papers.length > 0 && (
                      <Button 
                        className="border-2 border-foreground bg-amber-300 hover:bg-amber-400 text-foreground neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider py-4 rounded-none transition-all w-full"
                      >
                        <Download className="w-4 h-4 mr-2 text-foreground"/> Export ke RIS/BibTeX
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  )
}
