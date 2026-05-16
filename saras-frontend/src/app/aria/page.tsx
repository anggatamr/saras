"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AriaPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/aria", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error(error)
      alert("Gagal menganalisis file.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Topbar title="ARIA - AI Research Integrity Auditor" subtitle="Deteksi integritas dataset riset Anda secara otomatis." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {!result ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Dataset Skripsi Anda</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Upload file CSV Anda. ARIA akan mendeteksi outlier ekstrem, duplikasi, dan deviasi distribusi (Hukum Benford).
                </p>
                <div className="flex items-center gap-4">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm">
                      Pilih File
                    </div>
                    <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  </label>
                  {file && (
                    <Button onClick={handleUpload} disabled={loading}>
                      {loading ? "Menganalisis..." : "Mulai Analisis Integritas"}
                    </Button>
                  )}
                </div>
                {file && <p className="mt-4 text-sm font-medium flex items-center"><FileText className="w-4 h-4 mr-2"/> {file.name}</p>}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Integrity Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className={`relative flex h-40 w-40 items-center justify-center rounded-full border-8 ${result.score >= 80 ? 'border-green-500 text-green-600' : result.score >= 60 ? 'border-amber-500 text-amber-600' : 'border-red-500 text-red-600'}`}>
                        <span className="text-5xl font-bold">{result.score}</span>
                      </div>
                      <p className="mt-4 text-sm font-medium text-center">
                        {result.score >= 80 ? 'Integritas Sangat Baik' : result.score >= 60 ? 'Perlu Perhatian' : 'Indikasi Manipulasi / Error Tinggi'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ringkasan Analisis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Baris Data</span>
                      <span className="font-bold">{result.total_rows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Baris Mencurigakan</span>
                      <span className="font-bold text-red-500">{result.flagged_rows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Issue Ditemukan</span>
                      <span className="font-bold text-amber-500">{result.issues.length}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="w-full" onClick={() => {setResult(null); setFile(null)}}>
                  Analisis File Lain
                </Button>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2 flex flex-row items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Interpretasi AI (BAB IV)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.ai_narrative}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Forensic Heatmap (Daftar Masalah)</CardTitle>
                    <CardDescription>Baris data yang terdeteksi sebagai outlier atau duplikat.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.issues.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-green-600">
                        <CheckCircle2 className="h-8 w-8 mb-2" />
                        <p className="font-medium">Tidak ada masalah ditemukan. Data terlihat bersih.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {result.issues.map((issue: any, i: number) => (
                          <div key={i} className={`p-4 rounded-lg border flex gap-4 ${issue.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="mt-0.5">
                              <AlertTriangle className={`h-5 w-5 ${issue.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">Baris {issue.row_index}</span>
                                <Badge variant="outline" className="text-xs bg-white">{issue.type}</Badge>
                                {issue.column && <Badge variant="secondary" className="text-xs">Kolom: {issue.column}</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{issue.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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
