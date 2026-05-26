"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, BellRing, Copy, Loader2, Map as MapIcon, MapPin, AlertCircle, CheckCircle2, BookOpen, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchWithAuth } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

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

const provinceCoordinates: Record<string, { lat: number, lng: number; description: string }> = {
  "Aceh": { lat: 4.695135, lng: 96.749399, description: "Daerah Istimewa di ujung barat Sumatra dengan potensi ekonomi perkebunan, perikanan, dan migas." },
  "Sumatera Utara": { lat: 2.1153547, lng: 99.5450974, description: "Kawasan administratif pantai barat utara Sumatera dengan konsentrasi ekonomi manufaktur dan perkebunan." },
  "Sumatera Barat": { lat: -0.739945, lng: 100.800005, description: "Sentra ekonomi pertanian, pariwisata budaya, dan perdagangan di pesisir barat Sumatra." },
  "Riau": { lat: 0.293347, lng: 101.706829, description: "Provinsi kaya sumber daya alam dengan industri minyak bumi, gas, kelapa sawit, dan kehutanan." },
  "Jambi": { lat: -1.61862, lng: 103.61312, description: "Wilayah agraris dengan hasil andalan kelapa sawit, karet, dan batubara." },
  "Sumatera Selatan": { lat: -3.319437, lng: 104.914565, description: "Hub utama energi di Sumatra Selatan dengan lumbung batubara, gas alam, dan perkebunan karet." },
  "Bengkulu": { lat: -3.792845, lng: 102.260764, description: "Pesisir barat daya Sumatra yang kaya hasil pertanian, perkebunan kopi, dan perikanan laut." },
  "Lampung": { lat: -4.558585, lng: 105.400000, description: "Gerbang selatan Sumatra dengan keunggulan agribisnis, perkebunan pisang, tebu, dan perikanan tambak." },
  "Kepulauan Bangka Belitung": { lat: -2.741892, lng: 106.440467, description: "Provinsi kepulauan dengan keunggulan pertambangan timah, pariwisata bahari, dan lada putih." },
  "Kepulauan Riau": { lat: 3.916120, lng: 108.270912, description: "Gerbang ekonomi perbatasan dengan Singapura, unggul dalam industri galangan kapal, manufaktur elektronik, dan jasa." },
  "DKI Jakarta": { lat: -6.2088224, lng: 106.845599, description: "Pusat pemerintahan dan ekonomi nasional dengan kepadatan penduduk dan aktivitas jasa yang sangat tinggi." },
  "Jawa Barat": { lat: -7.090911, lng: 107.668887, description: "Provinsi penyangga ibukota dengan basis pertanian, industri manufaktur, dan pariwisata pegunungan." },
  "Jawa Tengah": { lat: -7.150975, lng: 110.140259, description: "Pusat industri kreatif, pertanian padi, dan peninggalan sejarah purbakala serta budaya Jawa." },
  "DI Yogyakarta": { lat: -7.875385, lng: 110.426208, description: "Kota budaya dan pendidikan tinggi dengan keunggulan industri pariwisata serta ekonomi kreatif digital." },
  "Jawa Timur": { lat: -7.5360639, lng: 112.2384017, description: "Gerbang ekonomi Indonesia Timur dengan sektor agraris dan industri pengolahan yang kokoh." },
  "Banten": { lat: -6.405817, lng: 106.064018, description: "Wilayah industri manufaktur, kimia, dan jasa logistik pelabuhan penyeberangan Selat Sunda." },
  "Bali": { lat: -8.4095178, lng: 115.188916, description: "Hub pariwisata internasional dengan keunggulan ekonomi kreatif, seni budaya, dan industri jasa." },
  "Nusa Tenggara Barat": { lat: -8.652933, lng: 117.361648, description: "Sektor andalan pariwisata global (Lombok/Mandalika) serta pertanian tanaman pangan lahan kering." },
  "Nusa Tenggara Timur": { lat: -8.657382, lng: 121.079370, description: "Sentra peternakan sapi, kelautan perikanan, tenun ikat tradisional, serta keunikan fauna Komodo." },
  "Kalimantan Barat": { lat: -0.278781, lng: 111.475285, description: "Wilayah perbatasan darat dengan Malaysia, unggul di komoditas kelapa sawit, bauksit, dan perikanan air tawar." },
  "Kalimantan Tengah": { lat: -1.681488, lng: 113.382354, description: "Provinsi terluas kedua di Indonesia dengan potensi kehutanan, batubara, dan lahan gambut." },
  "Kalimantan Selatan": { lat: -3.092642, lng: 115.283758, description: "Lumbung energi batubara, bijih besi, perkebunan kelapa sawit, serta perkebunan karet terpadu." },
  "Kalimantan Timur": { lat: 1.082729, lng: 116.311892, description: "Lokasi Ibu Kota Nusantara (IKN) dengan basis pertambangan gas alam, batubara, dan kehutanan." },
  "Kalimantan Utara": { lat: 3.327583, lng: 116.571954, description: "Provinsi termuda di Kalimantan dengan keunggulan perikanan tambak udang, dan potensi PLTA sungai besar." },
  "Sulawesi Utara": { lat: 1.282928, lng: 124.848465, description: "Hub ekonomi Pasifik Utara dengan unggulan kelapa sawit, perikanan laut dalam, dan pariwisata Bunaken." },
  "Sulawesi Tengah": { lat: -1.430000, lng: 121.445214, description: "Sentra pengolahan nikel terbesar di Morowali, serta perkebunan kakao dan kelapa." },
  "Sulawesi Selatan": { lat: -3.668799, lng: 119.974053, description: "Hub logistik Indonesia Tengah dengan lumbung beras nasional, kakao, serta perikanan budidaya." },
  "Sulawesi Tenggara": { lat: -4.144910, lng: 122.174605, description: "Kawasan industri smelter feronikel serta kelautan aspal alam Buton." },
  "Gorontalo": { lat: 0.699937, lng: 122.449992, description: "Sentra produksi jagung nasional, kelautan perikanan tangkap, dan pariwisata hiu paus." },
  "Sulawesi Barat": { lat: -2.844139, lng: 119.232078, description: "Produsen utama kakao di Sulawesi, kelapa dalam, serta kopi robusta pegunungan Mamasa." },
  "Maluku": { lat: -3.238461, lng: 130.145273, description: "Provinsi kepulauan lumbung ikan nasional serta penghasil rempah-rempah pala dan cengkih historis." },
  "Maluku Utara": { lat: 1.258900, lng: 127.356700, description: "Pusat industri pertambangan nikel, pariwisata sejarah keraton, dan perikanan cakalang." },
  "Papua Barat": { lat: -1.336111, lng: 132.900000, description: "Daerah kaya keanekaragaman hayati laut dunia (Raja Ampat) serta gas alam cair tangguh." },
  "Papua": { lat: -4.269928, lng: 138.080353, description: "Provinsi paling timur dengan pegunungan tertinggi, tambang emas terbesar, dan hutan hujan tropis tropis luas." }
};

export default function NexusPage() {
  const { toast } = useToast()
  const [showCitation, setShowCitation] = useState<number | null>(null)
  const [province, setProvince] = useState("Sumatera Utara")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BpsComparison[]>([])
  
  // Dynamic form input states
  const [tptVal, setTptVal] = useState("6.10")
  const [ipmVal, setIpmVal] = useState("75.13")
  const [kemiskinanVal, setKemiskinanVal] = useState("12.40")

  const handleSearch = async () => {
    setLoading(true)
    setShowCitation(null)
    
    // Parse values from form
    const parsedTpt = parseFloat(tptVal) || 0.0
    const parsedIpm = parseFloat(ipmVal) || 0.0
    const parsedKemiskinan = parseFloat(kemiskinanVal) || 0.0

    const userResearchData = [
      { indicator: "Tingkat Pengangguran Terbuka (TPT)", year: 2024, user_value: parsedTpt },
      { indicator: "Indeks Pembangunan Manusia (IPM)", year: 2024, user_value: parsedIpm },
      { indicator: "Tingkat Kemiskinan", year: 2024, user_value: parsedKemiskinan },
    ]
    
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
      
      toast({
        type: 'success',
        title: 'Sinkronisasi Berhasil',
        description: `Berhasil membandingkan data penelitian Anda dengan BPS Provinsi ${province}.`
      })
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

  const hasAlerts = data.some(d => d.alertLevel === "high")
  const alertCount = data.filter(d => d.alertLevel === "high").length
  const topAlert = data.find(d => d.alertLevel === "high")
  const currentCoords = provinceCoordinates[province] || { lat: -0.789275, lng: 113.921327, description: "Wilayah kedaulatan Negara Kesatuan Republik Indonesia." }

  // Compute bounding box / view parameters dynamically for OSM
  const zoom = 9
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentCoords.lng - 0.45}%2C${currentCoords.lat - 0.35}%2C${currentCoords.lng + 0.45}%2C${currentCoords.lat + 0.35}&layer=mapnik&marker=${currentCoords.lat}%2C${currentCoords.lng}`

  return (
    <div className="flex h-full flex-col bg-background font-sans text-foreground">
      <Topbar title="NEXUS — National Data Intelligence Hub" subtitle="Sinkronisasi data sekunder riset Anda secara langsung dengan indikator resmi BPS." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-foreground/10 pb-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Kesesuaian Data BPS</h2>
              <p className="text-sm text-muted-foreground mt-1">Uji konsistensi data primer penelitian Anda dengan parameter makro BPS nasional.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="w-[240px] border-2 border-foreground/20 bg-background rounded-lg font-medium shadow-sm transition-all focus:border-foreground/50">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent className="border border-foreground/20 rounded-lg max-h-[300px] overflow-y-auto">
                  {Object.keys(provinceCoordinates).map((provName) => (
                    <SelectItem key={provName} value={provName}>{provName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="border border-foreground bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-medium text-sm px-6 py-2.5 rounded-lg transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />} 
                {loading ? "Sinkronisasi..." : "Bandingkan dengan Baseline"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Input Panel Card */}
            <Card className="md:col-span-1 border border-foreground/10 shadow-md rounded-xl overflow-hidden bg-card transition-all duration-300">
              <CardHeader className="bg-muted/50 border-b border-foreground/5 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  Parameter Riset Anda
                </CardTitle>
                <CardDescription className="text-xs">
                  Masukkan nilai indikator hasil survei lapangan Anda untuk divalidasi.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="tpt-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TPT (%)</label>
                  <input
                    id="tpt-input"
                    type="number"
                    step="0.01"
                    className="w-full border border-foreground/20 bg-background text-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-foreground/50 transition-all"
                    value={tptVal}
                    onChange={(e) => setTptVal(e.target.value)}
                    placeholder="Contoh: 6.10"
                  />
                  <p className="text-[10px] text-muted-foreground">Tingkat Pengangguran Terbuka</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ipm-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">IPM (Indeks)</label>
                  <input
                    id="ipm-input"
                    type="number"
                    step="0.01"
                    className="w-full border border-foreground/20 bg-background text-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-foreground/50 transition-all"
                    value={ipmVal}
                    onChange={(e) => setIpmVal(e.target.value)}
                    placeholder="Contoh: 75.13"
                  />
                  <p className="text-[10px] text-muted-foreground">Indeks Pembangunan Manusia</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="kemiskinan-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kemiskinan (%)</label>
                  <input
                    id="kemiskinan-input"
                    type="number"
                    step="0.01"
                    className="w-full border border-foreground/20 bg-background text-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-foreground/50 transition-all"
                    value={kemiskinanVal}
                    onChange={(e) => setKemiskinanVal(e.target.value)}
                    placeholder="Contoh: 12.40"
                  />
                  <p className="text-[10px] text-muted-foreground">Persentase Penduduk Miskin</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t border-foreground/5 pt-4">
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full text-xs font-medium"
                  variant="outline"
                >
                  {loading ? "Menyinkronkan..." : "Perbarui Data"}
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Geographic Details Card (Interactive OpenStreetMap) */}
            <Card className="md:col-span-2 border border-foreground/10 shadow-md rounded-xl overflow-hidden bg-card transition-all duration-300">
              <CardHeader className="border-b border-foreground/5 bg-muted/50 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center text-base font-semibold text-foreground">
                      <MapIcon className="w-4 h-4 mr-2 text-primary"/> 
                      Geographic Intelligence Hub
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Visualisasi spasial dan koordinat wilayah baseline penelitian terpilih.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border border-green-500/20 bg-green-500/5 text-green-600 font-medium rounded-full text-[10px] px-2.5 py-0.5 animate-pulse">
                    Dynamic Map
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  
                  {/* Styled Coordinates/Geo Info */}
                  <div className="sm:col-span-1 space-y-4">
                    <div className="bg-muted/40 p-4 rounded-xl border border-foreground/5">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold">{province}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {currentCoords.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-muted/30 p-2.5 rounded-lg border border-foreground/5">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Lintang</div>
                        <div className="font-mono font-medium text-foreground mt-0.5">{currentCoords.lat.toFixed(5)}°</div>
                      </div>
                      <div className="bg-muted/30 p-2.5 rounded-lg border border-foreground/5">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Bujur</div>
                        <div className="font-mono font-medium text-foreground mt-0.5">{currentCoords.lng.toFixed(5)}°</div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic OpenStreetMap Embed */}
                  <div className="sm:col-span-2 relative border border-foreground/10 bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl min-h-[220px] h-[220px] overflow-hidden">
                    <iframe
                      title={`OSM Map for ${province}`}
                      width="100%"
                      height="100%"
                      className="border-0"
                      src={osmUrl}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-foreground/10 px-2.5 py-1 rounded-full shadow-sm text-[10px] font-medium text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary animate-bounce" />
                      <span>{province} (OSM Active Node)</span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>

          {/* Real-time Mismatch Alerts (Only Shown after compare is run and hasAlerts is true) */}
          {hasAlerts && topAlert && (
            <Card className="border border-red-500/20 bg-red-500/5 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-red-500/10 pb-4 border-b border-red-500/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-red-950 flex items-center font-semibold text-lg">
                      <BellRing className="w-5 h-5 mr-2 text-red-600 animate-swing"/> 
                      Peringatan Mismatch BPS (Data Anomali)
                    </CardTitle>
                    <CardDescription className="text-xs text-red-800">
                      Ditemukan {alertCount} deviasi signifikan antara data lapangan Anda dengan data resmi BPS Provinsi {province}.
                    </CardDescription>
                  </div>
                  <Badge className="border-0 bg-red-600 text-white font-medium rounded-full text-[10px] uppercase tracking-wider px-3 py-1">
                    Butuh Verifikasi
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 border border-red-500/10 bg-red-500/10 text-red-950 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
                  <div>
                    <h4 className="font-semibold text-sm text-red-950 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      {topAlert.indicator} — {topAlert.province} ({topAlert.year})
                    </h4>
                    <p className="text-xs text-red-900 mt-1.5 leading-relaxed">
                      Kalkulasi deviasi statistik menunjukkan perbedaan ekstrem. Nilai riset lapangan Anda sebesar <strong>{topAlert.userValue}</strong>, sementara pangkalan data nasional resmi BPS mencatatkan nilai sebesar <strong>{topAlert.value}</strong>. Terdapat selisih <strong>{topAlert.difference}</strong>.
                    </p>
                  </div>
                  <Button 
                    className="border border-red-500/20 bg-background text-red-900 hover:bg-red-50 shadow-sm font-medium text-xs px-4 py-2 rounded-lg shrink-0 transition-all" 
                    onClick={() => setShowCitation(data.indexOf(topAlert))}
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    Lihat Kutipan Resmi
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Macro Indicator Table Card */}
          <Card className="border border-foreground/10 shadow-md rounded-xl overflow-hidden bg-card">
            <CardHeader className="border-b border-foreground/5 bg-muted/50 pb-4">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Matriks Perbandingan Indikator Makro
              </CardTitle>
              <CardDescription className="text-xs">
                Perbandingan lengkap parameter riset Anda dengan pangkalan data BPS nasional.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto rounded-lg border border-foreground/10">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="min-w-[200px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">Indikator Makro</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tahun</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Anda</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Resmi BPS</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selisih Deviasi</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium text-sm">
                          <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                          Belum ada sinkronisasi aktif. Klik <strong>Bandingkan dengan Baseline</strong> untuk memulai perbandingan.
                        </TableCell>
                      </TableRow>
                    )}
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium text-sm">
                          <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary mb-2" />
                          Menghubungkan ke BPS API dan menghitung varians...
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && data.map((item, index) => (
                      <TableRow key={index} className={cn("transition-all hover:bg-muted/30", item.alertLevel === "high" ? "bg-red-500/5 hover:bg-red-500/10" : "")}>
                        <TableCell className="font-semibold text-sm text-foreground">{item.indicator}</TableCell>
                        <TableCell className="font-medium text-xs text-muted-foreground">{item.year}</TableCell>
                        <TableCell className="font-semibold text-sm text-foreground">{item.userValue}</TableCell>
                        <TableCell className="text-primary font-semibold text-sm">{item.value}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                            item.alertLevel === "high" 
                              ? "text-red-600 bg-red-500/10 border-red-500/20" 
                              : item.alertLevel === "medium" 
                                ? "text-amber-600 bg-amber-500/10 border-amber-500/20" 
                                : "text-green-600 bg-green-500/10 border-green-500/20"
                          )}>
                            {item.difference}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            className="border border-foreground/15 bg-background text-foreground hover:bg-muted font-medium text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                            onClick={() => setShowCitation(index)}
                          >
                            <Copy className="w-3 h-3 mr-1.5" /> Kutip
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Premium Backdrop-Blurred Overlay Modal Dialog for APA Citation */}
          {showCitation !== null && data[showCitation] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
              <Card className="w-full max-w-xl mx-4 border border-foreground/20 bg-slate-950 text-slate-100 shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 scale-100">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-400 font-mono flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Auto-Cite Reference Generator (APA 7th Edition)
                    </span>
                    <Button 
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg transition-all bg-transparent" 
                      onClick={() => setShowCitation(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="py-2">
                    <p className="text-sm text-slate-300 mb-3">Berikut adalah sitasi format APA yang dapat Anda salin langsung ke daftar pustaka skripsi:</p>
                    <div className="bg-slate-900 border border-green-500/30 p-4 rounded-xl font-mono text-xs text-green-300 break-words flex justify-between items-center group shadow-inner">
                      <p className="flex-1 mr-4 italic leading-relaxed">{data[showCitation].citation}</p>
                      <Button 
                        size="icon" 
                        className="border border-green-500/40 text-green-400 hover:bg-green-500/20 px-3 py-2 rounded-lg transition-all shrink-0 bg-transparent shadow-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(data[showCitation].citation);
                          toast({
                            type: 'success',
                            title: 'Kutipan Disalin!',
                            description: 'Sitasi format APA berhasil disalin ke clipboard.'
                          });
                        }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
                    <Button
                      variant="outline"
                      className="border-slate-800 hover:bg-slate-900 hover:text-slate-100 text-xs px-4 py-2 text-slate-400"
                      onClick={() => setShowCitation(null)}
                    >
                      Tutup
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all"
                      onClick={() => {
                        navigator.clipboard.writeText(data[showCitation].citation);
                        toast({
                          type: 'success',
                          title: 'Kutipan Disalin!',
                          description: 'Sitasi format APA berhasil disalin ke clipboard.'
                        });
                        setShowCitation(null);
                      }}
                    >
                      Salin & Tutup
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
