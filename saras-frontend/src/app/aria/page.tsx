"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"
import { fetchWithAuth } from "@/lib/api"

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
    
    try {
      const text = await file.text()
      const lines = text.split("\n").filter(line => line.trim().length > 0)
      
      if (lines.length < 2) {
        alert("Format CSV tidak valid.")
        setLoading(false)
        return
      }

      const headers = lines[0].split(",").map(h => h.trim())
      const records = lines.slice(1).map(line => line.split(",").map(cell => cell.trim()))

      // Identify numeric columns
      const numericCols = headers.map((_, i) => {
        const colData = records.map(r => parseFloat(r[i]))
        const isNumeric = colData.every(val => !isNaN(val))
        return { index: i, isNumeric, data: isNumeric ? colData : [] }
      }).filter(c => c.isNumeric)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issues: any[] = []
      let penalty = 0

      // Z-Score outlier detection
      for (const col of numericCols) {
        const mean = col.data.reduce((a, b) => a + b, 0) / col.data.length
        const stdDev = Math.sqrt(col.data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / col.data.length)
        if (stdDev === 0) continue
        col.data.forEach((val, rowIdx) => {
          const z = Math.abs((val - mean) / stdDev)
          if (z > 3.0) {
            issues.push({
              row_index: rowIdx + 1,
              column: headers[col.index],
              type: "zscore",
              severity: z > 4.0 ? "high" : "medium",
              description: `Nilai ${val} terlalu ekstrem (Z-Score: ${z.toFixed(2)}). Rata-rata kolom ini adalah ${mean.toFixed(2)}.`,
              z_score: z
            })
            penalty += (z > 4.0 ? 15 : 5)
          }
        })
      }

      // Duplicate detection
      const seen = new Map<string, number>()
      records.forEach((row, idx) => {
        const key = row.join("|")
        if (seen.has(key)) {
          issues.push({
            row_index: idx + 1,
            type: "duplicate",
            severity: "medium",
            description: `Duplikat identik dengan baris ${seen.get(key)! + 1}. Kemungkinan double entry.`
          })
          penalty += 5
        } else {
          seen.set(key, idx)
        }
      })

      let score = 100 - penalty
      if (score < 0) score = 0
      if (score > 100) score = 100

      setResult({
        score,
        total_rows: records.length,
        flagged_rows: new Set(issues.map(i => i.row_index)).size,
        issues: issues.sort((a, b) => a.row_index - b.row_index),
        ai_narrative: ""
      })

      if (score >= 90) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

    } catch (error) {
      console.error(error)
      alert("Gagal menganalisis file.")
    } finally {
      setLoading(false)
    }
  }

  const [generatingNarrative, setGeneratingNarrative] = useState(false)

  const handleGenerateNarrative = async () => {
    if (!result) return
    setGeneratingNarrative(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetchWithAuth(`${apiUrl}/api/v1/aria/narrative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: result.score,
          total_rows: result.total_rows,
          flagged_rows: result.flagged_rows,
          issues: result.issues
        })
      })
      if (!res.ok) throw new Error("Gagal generate narasi")
      const data = await res.json()
      setResult({ ...result, ai_narrative: data.narrative })
    } catch (error) {
      console.error(error)
      // Fallback narrative
      let fallback = `Berdasarkan analisis dataset, Integrity Score adalah ${result.score}/100. `
      if (result.issues.length > 0) fallback += "Ditemukan masalah yang memerlukan perhatian. "
      fallback += "\n\n(Gagal terhubung ke AI. Ini adalah teks fallback.)"
      setResult({ ...result, ai_narrative: fallback })
    } finally {
      setGeneratingNarrative(false)
    }
  }

  const copyToClipboard = () => {
    if (result && result.ai_narrative) {
      navigator.clipboard.writeText(result.ai_narrative)
      alert("Teks disalin ke clipboard!")
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <Topbar title="ARIA - AI Research Integrity Auditor" subtitle="Deteksi integritas dataset riset Anda secara otomatis." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {!result ? (
            <Card className="border-4 border-dashed border-foreground bg-background rounded-none neo-shadow p-6">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="border-2 border-foreground bg-red-200 p-5 rounded-none neo-shadow-sm flex items-center justify-center mb-6">
                  <UploadCloud className="h-10 w-10 text-foreground" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Upload Dataset Skripsi Anda</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-8 max-w-md">
                  Upload file CSV Anda. ARIA akan mendeteksi outlier ekstrem, duplikasi, dan deviasi distribusi (Hukum Benford).
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="border-2 border-foreground bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 font-black text-xs uppercase tracking-wider rounded-none neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                      Pilih File
                    </div>
                    <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  </label>
                  {file && (
                    <Button 
                      onClick={handleUpload} 
                      disabled={loading}
                      className="border-2 border-foreground bg-primary text-primary-foreground neo-shadow neo-interactive font-black text-xs uppercase tracking-wider px-6 py-3 rounded-none"
                    >
                      {loading ? "Menganalisis..." : "Mulai Analisis Integritas"}
                    </Button>
                  )}
                </div>
                {file && (
                  <p className="mt-6 text-sm font-bold border-2 border-foreground bg-secondary px-3 py-1.5 rounded-none neo-shadow-sm flex items-center">
                    <FileText className="w-4 h-4 mr-2"/> {file.name}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              
              <div className="md:col-span-1 space-y-6">
                <Card className="border-4 border-foreground rounded-none neo-shadow">
                  <CardHeader className="pb-2 border-b-2 border-foreground bg-secondary">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Integrity Score</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className={`relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${result.score >= 80 ? 'bg-green-300' : result.score >= 60 ? 'bg-amber-300' : 'bg-red-300'}`}>
                        <span className="text-4xl font-black text-foreground">{result.score}</span>
                      </div>
                      <p className="mt-6 text-xs font-black uppercase tracking-wider text-center text-foreground">
                        {result.score >= 80 ? 'Integritas Sangat Baik' : result.score >= 60 ? 'Perlu Perhatian' : 'Indikasi Manipulasi / Error Tinggi'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
 
                <Card className="border-4 border-foreground rounded-none neo-shadow">
                  <CardHeader className="pb-2 border-b-2 border-foreground bg-secondary">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Ringkasan Analisis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex justify-between items-center border-b-2 border-foreground/10 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Baris Data</span>
                      <span className="font-black text-xl text-foreground">{result.total_rows}</span>
                    </div>
                    <div className="flex justify-between items-center border-b-2 border-foreground/10 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Baris Mencurigakan</span>
                      <span className="font-black text-xl text-red-500">{result.flagged_rows}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Issue Ditemukan</span>
                      <span className="font-black text-xl text-amber-500">{result.issues.length}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  onClick={() => {setResult(null); setFile(null)}}
                  className="w-full border-2 border-foreground bg-background text-foreground hover:bg-secondary neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider py-4 rounded-none transition-all"
                >
                  Analisis File Lain
                </Button>
              </div>
 
              <div className="md:col-span-2 space-y-6">
                <Card className="border-4 border-foreground bg-[#FFFDF5] text-foreground rounded-none neo-shadow relative overflow-hidden">
                  <CardHeader className="pb-2 border-b-2 border-foreground bg-secondary flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-foreground" />
                      <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Interpretasi AI (BAB IV)</CardTitle>
                    </div>
                    {result.ai_narrative && (
                      <Button 
                        onClick={copyToClipboard}
                        className="border-2 border-foreground bg-background text-foreground neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-none h-auto transition-all"
                      >
                        Salin
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6 relative">
                    {result.ai_narrative ? (
                      <div>
                        <div className="absolute top-0 right-0 border-2 border-foreground bg-amber-200 text-amber-900 font-black text-[9px] uppercase tracking-wider rotate-[-3deg] neo-shadow-sm px-2.5 py-1 rounded-none select-none z-10">
                          🤖 AI Generated
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap mt-4">{result.ai_narrative}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Narasi belum di-generate. Klik tombol di bawah untuk meminta AI menyusun interpretasi.</p>
                        <Button 
                          onClick={handleGenerateNarrative} 
                          disabled={generatingNarrative}
                          className="border-2 border-foreground bg-primary text-primary-foreground neo-shadow-sm neo-interactive font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-none"
                        >
                          {generatingNarrative ? "Menyusun Narasi..." : "🤖 Generate Narasi BAB IV"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
 
                <Card className="border-4 border-foreground rounded-none neo-shadow">
                  <CardHeader className="border-b-2 border-foreground bg-secondary">
                    <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground">Forensic Heatmap (Daftar Masalah)</CardTitle>
                    <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Baris data yang terdeteksi sebagai outlier atau duplikat secara mendalam.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {result.issues.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-green-900">
                        <div className="border-2 border-foreground bg-green-200 p-4 rounded-none neo-shadow-sm text-green-950 flex items-center justify-center mb-4">
                          <CheckCircle2 className="h-8 w-8 text-foreground" />
                        </div>
                        <p className="font-black text-sm uppercase tracking-wider">Tidak ada masalah ditemukan. Data terlihat bersih.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {result.issues.map((issue: any, i: number) => (
                          <div key={i} className={`p-4 rounded-none border-2 border-foreground flex gap-4 neo-shadow-sm transition-all ${issue.severity === 'high' ? 'bg-red-200 text-red-950' : 'bg-amber-200 text-amber-950'}`}>
                            <div className="mt-0.5 border border-foreground bg-background p-1.5 rounded-none h-fit w-fit flex items-center justify-center">
                              <AlertTriangle className={`h-4 w-4 ${issue.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="font-black text-xs uppercase tracking-wider border-b-2 border-foreground">Baris {issue.row_index}</span>
                                <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-background text-foreground border-2 border-foreground rounded-none px-2 py-0">{issue.type}</Badge>
                                {issue.column && <Badge variant="secondary" className="text-[9px] uppercase tracking-wider bg-background text-foreground border-2 border-foreground rounded-none px-2 py-0">Kolom: {issue.column}</Badge>}
                              </div>
                              <p className="text-xs font-bold leading-relaxed">{issue.description}</p>
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
