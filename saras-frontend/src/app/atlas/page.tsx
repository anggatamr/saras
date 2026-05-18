"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Library, Search, BookOpen, Quote, Download, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
      const paperRes = await fetch(`${apiUrl}/api/v1/atlas/search?q=${encodeURIComponent(query)}`)
      if (paperRes.ok) {
        const paperData = await paperRes.json()
        setPapers(paperData.data || [])
      }

      // Fetch Gap Map
      const gapRes = await fetch(`${apiUrl}/api/v1/atlas/gap-map?q=${encodeURIComponent(query)}`)
      if (gapRes.ok) {
        const gapData = await gapRes.json()
        setBubbles(gapData.data || [])
      }
      
      setSearched(true)
    } catch (error) {
      console.error("ATLAS Search failed", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCite = async (paper: Paper) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetch(`${apiUrl}/api/v1/atlas/cite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paper, style: "apa" })
      })
      if (res.ok) {
        const data = await res.json()
        navigator.clipboard.writeText(data.citation)
        alert("Kutipan disalin ke clipboard!\n\n" + data.citation)
      }
    } catch (error) {
      console.error("Citation failed", error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Topbar title="ATLAS - Academic Literature Source" subtitle="Pemetaan research gap visual dan auto-citation via OpenAlex." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Library className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Masukkan topik riset Anda (contoh: media sosial keputusan pembelian gen z)..." 
                      className="pl-10 h-12 text-lg border-amber-300 focus-visible:ring-amber-500"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <Button className="h-12 px-8 bg-amber-600 hover:bg-amber-700 w-full md:w-auto" onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Peta Gap"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searched && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Research Gap Map</span>
                      <Badge variant="outline" className="text-xs">Top 50 Papers</Badge>
                    </CardTitle>
                    <CardDescription>
                      Bubble besar menandakan topik jenuh. Bubble kecil (berkedip) adalah peluang kebaruan (novelty).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[400px] border rounded-lg bg-slate-50/50 overflow-hidden flex flex-wrap items-center justify-center gap-4 p-8">
                      {/* Dynamic Bubbles */}
                      {bubbles.map((b, i) => (
                        <div 
                          key={i} 
                          className={`rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors group relative ${
                            b.is_gap 
                              ? "bg-blue-400/80 border-2 border-blue-500 hover:bg-blue-400 animate-pulse w-24 h-24" 
                              : b.count > 100 
                                ? "bg-amber-600/90 border-2 border-amber-700 hover:bg-amber-600 w-40 h-40" 
                                : "bg-amber-400/70 border-2 border-amber-500 hover:bg-amber-400 w-32 h-32"
                          }`}
                        >
                          <span className={`text-center font-bold px-2 ${b.is_gap ? "text-white text-[10px]" : b.count > 100 ? "text-white text-sm" : "text-amber-950 text-xs"}`}>
                            {b.topic}
                          </span>
                          <div className="absolute hidden group-hover:block -top-10 bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                            {b.count} Papers Found {b.is_gap && "(Research Gap!)"}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 mt-4 text-sm justify-center">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-600"></div> Jenuh</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Menengah</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div> Peluang (Gap)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daftar Pustaka Relevan</CardTitle>
                    <CardDescription>Dari OpenAlex Database</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                    {papers.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Tidak ada literatur ditemukan.</p>}
                    {papers.map(paper => (
                      <div key={paper.id} className="border rounded-lg p-3 hover:bg-slate-50 transition-colors group">
                        <a href={paper.id} target="_blank" rel="noreferrer" className="font-semibold text-sm line-clamp-2 leading-tight text-primary mb-1 group-hover:underline cursor-pointer">{paper.title}</a>
                        <p className="text-xs text-muted-foreground">{paper.authors} ({paper.year})</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{paper.journal}</p>
                        <div className="flex justify-between items-center mt-3">
                          <Badge variant="secondary" className="text-[10px]">Kutipan: {paper.citations}</Badge>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => window.open(paper.id, '_blank')}><BookOpen className="h-3 w-3"/></Button>
                            <Button size="icon" variant="outline" className="h-6 w-6 border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => handleCite(paper)} title="Salin Kutipan APA">
                              <Quote className="h-3 w-3"/>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {papers.length > 0 && <Button variant="outline" className="w-full text-sm"><Download className="w-4 h-4 mr-2"/> Export ke RIS/BibTeX</Button>}
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
