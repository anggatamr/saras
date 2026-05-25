"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, BellRing, Copy, Loader2, Map as MapIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchWithAuth } from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api"

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

const mapContainerStyle = {
  width: '100%',
  height: '350px'
};

const center = {
  lat: -0.789275, // Center on Indonesia
  lng: 113.921327
};

const provinceCoordinates: Record<string, { lat: number, lng: number }> = {
  "Sumatera Utara": { lat: 2.1153547, lng: 99.5450974 },
  "DKI Jakarta": { lat: -6.2088224, lng: 106.845599 },
  "Jawa Barat": { lat: -7.090911, lng: 107.668887 },
  "Jawa Timur": { lat: -7.5360639, lng: 112.2384017 },
  "Bali": { lat: -8.4095178, lng: 115.188916 }
};

export default function NexusPage() {
  const { toast } = useToast()
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  })

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
        const res = await fetchWithAuth(`${apiUrl}/api/v1/nexus/compare`, {
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
      toast({
        type: 'error',
        title: 'Gagal Sinkronisasi BPS',
        description: 'Terjadi kesalahan saat membandingkan data dengan pangkalan data BPS.'
      })
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
    <div className="flex h-full flex-col bg-background">
      <Topbar title="NEXUS - National Data Intelligence Hub" subtitle="Sinkronisasi data sekunder Anda dengan indikator resmi BPS." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b-4 border-foreground pb-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">Perbandingan Data BPS</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">Tinjau kesesuaian data riset Anda dengan sumber nasional resmi.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="w-[200px] border-2 border-foreground bg-background rounded-none font-bold neo-shadow-sm">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground rounded-none">
                  <SelectItem value="Sumatera Utara">Sumatera Utara</SelectItem>
                  <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                  <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                  <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                  <SelectItem value="Bali">Bali</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="border-2 border-foreground bg-blue-300 hover:bg-blue-400 text-foreground neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-6 py-3 rounded-none transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-foreground" /> : <Search className="w-4 h-4 mr-2 text-foreground" />} 
                {loading ? "Mencari..." : "Cari Data"}
              </Button>
            </div>
          </div>

          {hasAlerts && topAlert && (
            <Card className="border-4 border-foreground bg-red-100 neo-shadow-lg rounded-none overflow-hidden">
              <CardHeader className="bg-red-200/50 pb-4 border-b-2 border-foreground">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-red-900 flex items-center font-black text-2xl uppercase tracking-tight"><BellRing className="w-6 h-6 mr-2 text-red-700"/> BPS Mismatch Alert</CardTitle>
                    <CardDescription className="text-xs font-bold text-red-800 uppercase tracking-wide mt-1">Terdeteksi {alertCount} perbedaan signifikan antara data primer Anda dan data resmi BPS.</CardDescription>
                  </div>
                  <Badge variant="destructive" className="border-2 border-foreground bg-red-500 text-white font-black neo-shadow-sm rounded-none uppercase text-[10px] tracking-wider px-3 py-1">Tindakan Diperlukan</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 border-2 border-foreground bg-red-200 text-red-950 rounded-none flex flex-col md:flex-row gap-4 items-start md:items-center justify-between neo-shadow-sm">
                  <div>
                    <h4 className="font-black text-md uppercase tracking-wide text-red-950">{topAlert.indicator} - {topAlert.province} ({topAlert.year})</h4>
                    <p className="text-xs font-bold text-red-900 mt-1">Data Anda: {topAlert.userValue} | Data Resmi BPS: {topAlert.value} (Selisih {topAlert.difference})</p>
                  </div>
                  <Button 
                    className="border-2 border-foreground bg-white text-red-900 hover:bg-red-50 neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-5 py-3 rounded-none shrink-0 transition-all" 
                    onClick={() => setShowCitation(data.indexOf(topAlert))}
                  >
                    Lihat Kutipan Resmi
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-4 border-foreground rounded-none neo-shadow bg-background">
            <CardHeader className="border-b-2 border-foreground bg-secondary">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center text-lg font-black uppercase tracking-tight text-foreground"><MapIcon className="w-5 h-5 mr-2 text-foreground"/> Peta Interaktif Wilayah Indonesia</CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Visualisasi lokasi data sekunder nasional berdasarkan provinsi terpilih.</CardDescription>
                </div>
                <Badge variant="outline" className="border-2 border-foreground bg-green-200 text-green-950 font-black rounded-none uppercase text-[10px] tracking-wider px-2.5 py-0.5">Live Google Maps</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full border-4 border-foreground rounded-none overflow-hidden neo-shadow-sm">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={provinceCoordinates[province] || center}
                    zoom={provinceCoordinates[province] ? 8 : 5}
                  >
                    {provinceCoordinates[province] && (
                      <MarkerF
                        position={provinceCoordinates[province]}
                        label={{
                          text: province,
                          className: "font-black bg-white px-2 py-1 rounded-none shadow-sm border-2 border-foreground text-xs text-foreground -translate-y-8"
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-[350px] bg-secondary/30 flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-12 h-12 text-foreground/30 mx-auto mb-2 animate-spin" />
                      <p className="text-sm font-bold text-muted-foreground">Sedang memuat Google Maps...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-foreground rounded-none neo-shadow">
            <CardHeader className="border-b-2 border-foreground bg-secondary">
              <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground">Ringkasan Indikator Makro</CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Perbandingan lengkap parameter riset Anda dengan baseline BPS nasional.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-bold">Belum ada data. Silakan lakukan pencarian.</TableCell>
                      </TableRow>
                    )}
                    {data.map((item, index) => (
                      <TableRow key={index} className={item.alertLevel === "high" ? "bg-red-100/40" : ""}>
                        <TableCell className="font-black text-foreground">{item.indicator}</TableCell>
                        <TableCell className="font-black">{item.year}</TableCell>
                        <TableCell className="font-black">{item.userValue}</TableCell>
                        <TableCell className="text-blue-700 font-black">{item.value}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-0.5 border-2 border-foreground rounded-none text-xs font-black neo-shadow-sm bg-background",
                            item.alertLevel === "high" ? "text-red-600" : item.alertLevel === "medium" ? "text-amber-600" : "text-green-600"
                          )}>
                            {item.difference}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            className="border-2 border-foreground bg-secondary text-foreground hover:bg-muted neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-3 py-2.5 rounded-none transition-all"
                            onClick={() => setShowCitation(index)}
                          >
                            <Copy className="w-3.5 h-3.5 mr-2 text-foreground" /> Kutip
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
            <Card className="border-4 border-foreground bg-foreground text-background neo-shadow-lg rounded-none mt-6">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-green-400 font-mono">Auto-Cite Generator (APA 7th)</span>
                  <Button 
                    className="text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-white border-2 border-transparent hover:border-white px-2 py-0.5 rounded-none" 
                    onClick={() => setShowCitation(null)}
                  >
                    Tutup
                  </Button>
                </div>
                <div className="bg-slate-900 border-2 border-green-400 p-4 rounded-none font-mono text-sm text-green-300 break-words flex justify-between items-center group">
                  <p className="flex-1 mr-4">{data[showCitation].citation}</p>
                  <Button 
                    size="icon" 
                    className="border-2 border-green-400 text-green-400 hover:bg-green-400/20 px-3 py-2 rounded-none transition-all shrink-0 bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(data[showCitation].citation);
                      toast({
                        type: 'success',
                        title: 'Kutipan Disalin!',
                        description: 'Sitasi format APA berhasil disalin ke clipboard.'
                      });
                    }}
                  >
                    <Copy className="w-4 h-4" />
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
