"use client"

import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, BellRing, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Mock BPS Data
const mockBpsData = [
  { indicator: "Tingkat Pengangguran Terbuka (TPT)", province: "Sumatera Utara", year: 2024, value: "5.89%", userValue: "6.10%", difference: "+0.21%", alert: false },
  { indicator: "Indeks Pembangunan Manusia (IPM)", province: "Sumatera Utara", year: 2024, value: "75.13", userValue: "75.13", difference: "0.00", alert: false },
  { indicator: "Tingkat Kemiskinan", province: "Sumatera Utara", year: 2024, value: "8.15%", userValue: "12.4%", difference: "+4.25%", alert: true },
  { indicator: "Pertumbuhan Ekonomi", province: "Sumatera Utara", year: 2023, value: "5.01%", userValue: "4.80%", difference: "-0.21%", alert: false },
]

export default function NexusPage() {
  const [showCitation, setShowCitation] = useState<number | null>(null)

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
              <Select defaultValue="sumut">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sumut">Sumatera Utara</SelectItem>
                  <SelectItem value="jakarta">DKI Jakarta</SelectItem>
                  <SelectItem value="jabar">Jawa Barat</SelectItem>
                  <SelectItem value="jatim">Jawa Timur</SelectItem>
                </SelectContent>
              </Select>
              <Button><Search className="w-4 h-4 mr-2" /> Cari Data</Button>
            </div>
          </div>

          <Card className="border-primary/20">
            <CardHeader className="bg-blue-50/50 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-900 flex items-center"><BellRing className="w-5 h-5 mr-2 text-blue-600"/> BPS Mismatch Alert</CardTitle>
                  <CardDescription>Terdeteksi 1 perbedaan signifikan antara data primer Anda dan data resmi BPS.</CardDescription>
                </div>
                <Badge variant="destructive" className="bg-red-500">Tindakan Diperlukan</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-4 border rounded-lg bg-red-50/50 border-red-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h4 className="font-semibold text-red-900">Tingkat Kemiskinan Sumatera Utara (2024)</h4>
                  <p className="text-sm text-red-700/80 mt-1">Data Anda: 12.4% | Data Resmi BPS: 8.15% (Selisih 4.25%)</p>
                </div>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100 shrink-0" onClick={() => setShowCitation(2)}>
                  Lihat Kutipan Resmi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Indikator Makro</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indikator</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Data Anda</TableHead>
                    <TableHead>Data BPS</TableHead>
                    <TableHead>Selisih</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBpsData.map((data, index) => (
                    <TableRow key={index} className={data.alert ? "bg-red-50/30" : ""}>
                      <TableCell className="font-medium">{data.indicator}</TableCell>
                      <TableCell>{data.year}</TableCell>
                      <TableCell>{data.userValue}</TableCell>
                      <TableCell className="text-blue-600 font-medium">{data.value}</TableCell>
                      <TableCell>
                        <span className={data.alert ? "text-red-500 font-bold" : "text-green-600"}>
                          {data.difference}
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
            </CardContent>
          </Card>

          {showCitation !== null && (
            <Card className="bg-slate-50 border-slate-200 shadow-inner">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Auto-Cite Generator (APA 7th)</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowCitation(null)}>Tutup</Button>
                </div>
                <div className="bg-white p-3 rounded border font-mono text-sm break-words flex justify-between items-center group">
                  <p>Badan Pusat Statistik Provinsi Sumatera Utara. ({mockBpsData[showCitation].year}). <i>{mockBpsData[showCitation].indicator}</i>. BPS. https://sumut.bps.go.id</p>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
