"use client"

import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, BellRing, Copy, Loader2, Map } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface BpsComparison {
  indicator: string
  province: string
  year: number
  value: string
  userValue: string
  difference: string
  alertLevel: string
  citation: string
}

export default function NexusPage() {
  const [showCitation, setShowCitation] = useState<number | null>(null)
  const [province, setProvince] = useState("Sumatera Utara")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BpsComparison[]>([])
  
  // Initial user data to compare against
  const userResearchData = [
    { indicator: "Tingkat Pengangguran Terbuka (TPT)", year: 2024, user_value: 6.10 },
    { indicator: "Indeks Pembangunan Manusia (IPM)", year: 2024, user_value: 75.13 },
    { indicator: "Tingkat Kemiskinan", year: 2024, user_value: 12.4 },
  ]

  const handleSearch = async () => {
    setLoading(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      const fetchPromises = userResearchData.map(async (item) => {
        const res = await fetch(`${apiUrl}/api/v1/nexus/compare`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            province: province,
            indicator: item.indicator,
            year: item.year,
            user_value: item.user_value
          })
        })
        
        if (res.ok) {
          const apiData = await res.json()
          return {
            indicator: item.indicator,
            province: province,
            year: item.year,
            value: apiData.bps_value ? `${apiData.bps_value.toFixed(2)}${item.indicator.includes("Indeks") ? "" : "%"}` : "N/A",
            userValue: `${item.user_value.toFixed(2)}${item.indicator.includes("Indeks") ? "" : "%"}`,
            difference: apiData.difference > 0 ? `+${apiData.difference.toFixed(2)}${item.indicator.includes("Indeks") ? "" : "%"}` : `${apiData.difference.toFixed(2)}${item.indicator.includes("Indeks") ? "" : "%"}`,
            alertLevel: apiData.alert_level,
            citation: apiData.citation_apa
          }
        }
        return null
      })
      
      const results = (await Promise.all(fetchPromises)).filter(Boolean) as BpsComparison[]
      setData(results)
    } catch (error) {
      console.error("Failed to fetch BPS comparison", error)
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasAlerts = data.some(d => d.alertLevel === "high")
  const alertCount = data.filter(d => d.alertLevel === "high").length
  const topAlert = data.find(d => d.alertLevel === "high")

  return (
    <div className="flex h-full flex-col">
      <Topbar title="NEXUS - National Data Intelligence Hub" subtitle="Sinkronisasi data sekunder Anda dengan indikator resmi BPS." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Perbandingan Data BPS</h2>
              <p className="text-muted-foreground">Tinjau kesesuaian data riset Anda dengan sumber nasional.</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sumatera Utara">Sumatera Utara</SelectItem>
                  <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                  <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                  <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                  <SelectItem value="Bali">Bali</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />} 
                {loading ? "Mencari..." : "Cari Data"}
              </Button>
            </div>
          </div>

          {hasAlerts && topAlert && (
            <Card className="border-primary/20">
              <CardHeader className="bg-blue-50/50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-900 flex items-center"><BellRing className="w-5 h-5 mr-2 text-blue-600"/> BPS Mismatch Alert</CardTitle>
                    <CardDescription>Terdeteksi {alertCount} perbedaan signifikan antara data primer Anda dan data resmi BPS.</CardDescription>
                  </div>
                  <Badge variant="destructive" className="bg-red-500">Tindakan Diperlukan</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 border rounded-lg bg-red-50/50 border-red-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-900">{topAlert.indicator} {topAlert.province} ({topAlert.year})</h4>
                    <p className="text-sm text-red-700/80 mt-1">Data Anda: {topAlert.userValue} | Data Resmi BPS: {topAlert.value} (Selisih {topAlert.difference})</p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100 shrink-0" onClick={() => setShowCitation(data.indexOf(topAlert))}>
                    Lihat Kutipan Resmi
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center"><Map className="w-5 h-5 mr-2 text-muted-foreground"/> Peta Persebaran Data (Choropleth)</CardTitle>
                  <CardDescription>Visualisasi disparitas indikator berdasarkan provinsi.</CardDescription>
                </div>
                <Badge variant="outline">Simulasi D3.js</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[250px] bg-slate-50 border rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated SVG Map Blocks */}
                <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-green-200 rounded-full opacity-70 blur-xl"></div>
                <div className="absolute top-1/3 left-1/3 w-48 h-24 bg-amber-200 rounded-full opacity-70 blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-200 rounded-full opacity-70 blur-xl"></div>
                
                <div className="z-10 text-center">
                  <Map className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Peta Indonesia Sedang Dimuat...</p>
                  <p className="text-xs text-slate-400 mt-1">Menunggu integrasi TopoJSON BPS</p>
                </div>
                
                {/* Simulated Heatmap Legend */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white p-2 rounded-md shadow-sm border text-[10px]">
                  <span>Rendah</span>
                  <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
                  <div className="w-4 h-4 bg-amber-200 rounded-sm"></div>
                  <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                  <span>Tinggi</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Indikator Makro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Indikator</TableHead>
                      <TableHead>Tahun</TableHead>
                      <TableHead>Data Anda</TableHead>
                      <TableHead>Data BPS</TableHead>
                      <TableHead>Selisih</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Belum ada data. Silakan lakukan pencarian.</TableCell>
                      </TableRow>
                    )}
                    {data.map((item, index) => (
                      <TableRow key={index} className={item.alertLevel === "high" ? "bg-red-50/30" : ""}>
                        <TableCell className="font-medium">{item.indicator}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>{item.userValue}</TableCell>
                        <TableCell className="text-blue-600 font-medium">{item.value}</TableCell>
                        <TableCell>
                          <span className={item.alertLevel === "high" ? "text-red-500 font-bold" : item.alertLevel === "medium" ? "text-amber-500 font-bold" : "text-green-600"}>
                            {item.difference}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setShowCitation(index)}>
                            <Copy className="w-4 h-4 mr-2" /> Kutip
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {showCitation !== null && data[showCitation] && (
            <Card className="bg-slate-50 border-slate-200 shadow-inner">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Auto-Cite Generator (APA 7th)</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowCitation(null)}>Tutup</Button>
                </div>
                <div className="bg-white p-3 rounded border font-mono text-sm break-words flex justify-between items-center group">
                  <p>{data[showCitation].citation}</p>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                    navigator.clipboard.writeText(data[showCitation].citation);
                    alert("Kutipan disalin ke clipboard!");
                  }}>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  )
}
