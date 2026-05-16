"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Library, Search, BookOpen, Quote, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockPapers = [
  { id: 1, title: "The Effect of Social Media Marketing on Purchase Intention: A Meta-Analysis", authors: "Kurniawan, A. et al.", year: 2023, citations: 45, journal: "Jurnal Manajemen Indonesia" },
  { id: 2, title: "Brand Image and Consumer Behavior in Digital Era", authors: "Putri, S.", year: 2022, citations: 112, journal: "Asian Journal of Business" },
  { id: 3, title: "Gen Z Purchasing Decisions: The Role of E-WOM", authors: "Wibowo, T. & Rahman, H.", year: 2024, citations: 8, journal: "Marketing Science Review" },
]

export default function AtlasPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    if (!query) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSearched(true)
    }, 1500)
  }

  return (
    <div className="flex h-full flex-col">
      <Topbar title="ATLAS - Academic Literature Source" subtitle="Pemetaan research gap visual dan auto-citation." />
      
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
                  {loading ? "Memetakan..." : "Peta Gap"}
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
                      Bubble besar menandakan topik jenuh. Bubble kecil adalah peluang kebaruan (novelty).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[400px] border rounded-lg bg-slate-50/50 overflow-hidden">
                      {/* Simulating D3 Bubble Chart with absolute positioning */}
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-amber-500/80 border-2 border-amber-600 flex items-center justify-center shadow-sm cursor-pointer hover:bg-amber-500 transition-colors group">
                        <span className="text-center text-xs font-bold text-white px-2">Brand Image<br/>(Jenuh)</span>
                        <div className="absolute hidden group-hover:block -top-10 bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">24 Papers Found</div>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-amber-600/90 border-2 border-amber-700 flex items-center justify-center shadow-md cursor-pointer hover:bg-amber-600 transition-colors group">
                        <span className="text-center text-sm font-bold text-white px-2">Social Media<br/>Marketing</span>
                        <div className="absolute hidden group-hover:block -top-10 bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">45 Papers Found</div>
                      </div>

                      <div className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-amber-400/70 border-2 border-amber-500 flex items-center justify-center shadow-sm cursor-pointer hover:bg-amber-400 transition-colors group">
                        <span className="text-center text-[10px] font-bold text-amber-950 px-2">E-WOM</span>
                        <div className="absolute hidden group-hover:block -top-10 bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">12 Papers Found</div>
                      </div>

                      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-blue-400/80 border-2 border-blue-500 flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-400 transition-colors group animate-pulse">
                        <span className="text-center text-[9px] font-bold text-white px-1">TikTok<br/>Live</span>
                        <div className="absolute hidden group-hover:block -top-10 bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">3 Papers Found (Research Gap!)</div>
                      </div>
                      
                      <div className="absolute bottom-1/3 left-1/3 w-20 h-20 rounded-full bg-amber-300/60 border-2 border-amber-400 flex items-center justify-center shadow-sm cursor-pointer hover:bg-amber-300 transition-colors group">
                        <span className="text-center text-[10px] font-bold text-amber-950 px-2">Influencer</span>
                        <div className="absolute hidden group-hover:block -top-10 bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">8 Papers Found</div>
                      </div>
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
                    <CardDescription>Berdasarkan topik yang dicari</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockPapers.map(paper => (
                      <div key={paper.id} className="border rounded-lg p-3 hover:bg-slate-50 transition-colors group">
                        <h4 className="font-semibold text-sm line-clamp-2 leading-tight text-primary mb-1 group-hover:underline cursor-pointer">{paper.title}</h4>
                        <p className="text-xs text-muted-foreground">{paper.authors} ({paper.year})</p>
                        <p className="text-xs text-muted-foreground">{paper.journal}</p>
                        <div className="flex justify-between items-center mt-3">
                          <Badge variant="secondary" className="text-[10px]">Kutipan: {paper.citations}</Badge>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-6 w-6"><BookOpen className="h-3 w-3"/></Button>
                            <Button size="icon" variant="outline" className="h-6 w-6 border-amber-200 text-amber-700 hover:bg-amber-50"><Quote className="h-3 w-3"/></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full text-sm"><Download className="w-4 h-4 mr-2"/> Export ke EndNote/Mendeley</Button>
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
