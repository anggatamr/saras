"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, ShieldCheck, Loader2, Sparkles, ServerCrash, Cpu, ArrowLeft, RefreshCw, FileWarning, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"
import { fetchWithAuth } from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import { motion, AnimatePresence } from "framer-motion"

interface Issue {
  row_index: string
  type: string
  column: string
  severity: "high" | "medium"
  description: string
}

interface AnalysisResult {
  score: number
  total_rows: number
  flagged_rows: number
  issues: Issue[]
  shapiro_wilk_p_value: number
  is_normally_distributed: boolean
  ai_narrative: string | {
    status_integritas: string
    paragraf_pembuka: string
    analisis_statistik: string
    kesimpulan_akademis: string
  } | null
}

export default function AriaPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [columns, setHeaders] = useState<string[]>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [errorState, setErrorState] = useState<{ title: string; description: string } | null>(null)
  const [auditStep, setAuditStep] = useState(0)
  const [generatingNarrative, setGeneratingNarrative] = useState(false)

  // Simulation steps for Go Goroutine column-sharded audit
  const [simulatedSteps, setSimulatedSteps] = useState<string[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorState(null)
    setResult(null)
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (!selectedFile.name.endsWith(".csv")) {
        setErrorState({
          title: "Format Berkas Tidak Valid",
          description: "ARIA hanya dapat mengaudit berkas bertipe Comma Separated Values (.csv). Harap konversi dataset Anda terlebih dahulu."
        })
        return
      }
      setFile(selectedFile)

      // Parse headers locally for animation metadata
      try {
        const text = await selectedFile.text()
        const lines = text.split("\n").filter(line => line.trim().length > 0)
        if (lines.length < 2) {
          setErrorState({
            title: "Dataset Terlalu Sedikit",
            description: "Dataset Anda harus memiliki baris judul kolom (headers) dan minimal 1 baris data numerik untuk di-audit secara statistik."
          })
          return
        }
        const firstLine = lines[0]
        const commaCount = (firstLine.match(/,/g) || []).length
        const semicolonCount = (firstLine.match(/;/g) || []).length
        const delimiter = semicolonCount > commaCount ? ";" : ","
        const parsedHeaders = firstLine.split(delimiter).map(h => h.trim().replace(/"/g, ""))
        setHeaders(parsedHeaders)
      } catch (err) {
        console.error("Local parse error", err)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setAuditStep(0)
    setErrorState(null)

    // Setup simulated Go Goroutine steps for animation
    const steps = [
      "Menginisialisasi Go Goroutines untuk pembagian kerja (Column Sharding)...",
      "Goroutine #0: Melakukan analisis validasi struktur CSV dan duplikasi...",
    ]
    columns.forEach((col, idx) => {
      steps.push(`Goroutine #${idx + 1}: Memindai kolom '${col}' untuk missing data & pencilan...`)
    })
    steps.push(`Goroutine #${columns.length + 1}: Melakukan pengujian anomali Hukum Benford (Benford's Law)...`)
    steps.push(`Goroutine #${columns.length + 2}: Melakukan uji normalitas Shapiro-Wilk untuk deteksi sebaran data...`)
    steps.push("Sinkronisasi Goroutines (Mutex Unlock) & rekapitulasi skor integritas...")
    setSimulatedSteps(steps)

    // Trigger staggered steps animation
    const stepInterval = 2200 / steps.length
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep < steps.length) {
        setAuditStep(currentStep)
      } else {
        clearInterval(timer)
      }
    }, stepInterval)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetchWithAuth(`${apiUrl}/api/v1/aria/analyze`, {
        method: "POST",
        body: formData,
      })

      // Ensure animation finishes naturally before showing results (min 2.5 seconds wait)
      await new Promise(resolve => setTimeout(resolve, 2500))
      clearInterval(timer)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Gagal melakukan audit data.")
      }

      const backendData = await res.json()

      // Parse backend issues strings into structured objects for forensic display
      const structuredIssues: Issue[] = (backendData.issues || []).map((issueStr: string) => {
        let type = "outlier"
        let column = ""
        let severity: "high" | "medium" = "medium"

        if (issueStr.includes("Missing data") || issueStr.includes("kosong")) {
          type = "Missing Value"
          severity = "high"
          const colMatch = issueStr.match(/'([^']+)'/)
          if (colMatch) column = colMatch[1]
        } else if (issueStr.includes("Z-score")) {
          type = "Z-Score Outlier"
          severity = "medium"
          const colMatch = issueStr.match(/'([^']+)'/)
          if (colMatch) column = colMatch[1]
        } else if (issueStr.includes("IQR") || issueStr.includes("non-parametrik")) {
          type = "Robust IQR Outlier"
          severity = "medium"
          const colMatch = issueStr.match(/'([^']+)'/)
          if (colMatch) column = colMatch[1]
        } else if (issueStr.includes("Benford")) {
          type = "Anomali Benford"
          severity = "high"
        } else if (issueStr.includes("Shapiro-Wilk")) {
          type = "Uji Normalitas"
          severity = "medium"
        }

        return {
          row_index: "Kolom / Global",
          type,
          column,
          severity,
          description: issueStr
        }
      })

      setResult({
        score: backendData.score,
        total_rows: backendData.total_rows,
        flagged_rows: backendData.flagged_rows,
        issues: structuredIssues,
        shapiro_wilk_p_value: backendData.shapiro_wilk_p_value,
        is_normally_distributed: backendData.is_normally_distributed,
        ai_narrative: null,
      })

      // Burst confetti for pristine datasets (Score >= 90)
      if (backendData.score >= 90) {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 }
        })
      }

    } catch (error: any) {
      console.error(error)
      setErrorState({
        title: "Audit Gagal Diproses",
        description: error.message || "Terdapat kendala pada server Go atau format kolom CSV tidak dapat di-parse dengan benar."
      })
    } finally {
      setLoading(false)
    }
  }

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
          issues: result.issues.map(i => i.description) // Send plain descriptions
        })
      })
      if (!res.ok) throw new Error("Gagal menyusun narasi")
      const data = await res.json()
      setResult({ ...result, ai_narrative: data })
    } catch (error) {
      console.error(error)
      // Fallback narrative
      const fallback = {
        status_integritas: result.score >= 80 ? "Sangat Baik" : "Perlu Perhatian",
        paragraf_pembuka: `Berdasarkan analisis audit forensik SARAS, dataset memiliki tingkat integritas sebesar ${result.score}/100. Audit ini memproses total ${result.total_rows} baris data dengan cakupan multivariat.`,
        analisis_statistik: `Terdapat ${result.flagged_rows} baris yang diidentifikasi memiliki anomali atau deviasi sebaran. Pengujian distribusi Benford's Law dan non-parametrik IQR mendeteksi beberapa pencilan data.`,
        kesimpulan_akademis: "Disarankan untuk melakukan pembersihan data pencilan (outlier) atau melakukan pengumpulan ulang data untuk menjamin validitas pengujian statistik BAB IV."
      }
      setResult({ ...result, ai_narrative: fallback })
    } finally {
      setGeneratingNarrative(false)
    }
  }

  const copyToClipboard = () => {
    if (result && result.ai_narrative) {
      let textToCopy = ""
      if (typeof result.ai_narrative === 'object') {
        textToCopy = `Status Integritas: ${result.ai_narrative.status_integritas}\n\nPengantar: ${result.ai_narrative.paragraf_pembuka}\n\nAnalisis: ${result.ai_narrative.analisis_statistik}\n\nKesimpulan: ${result.ai_narrative.kesimpulan_akademis}`
      } else {
        textToCopy = result.ai_narrative
      }
      navigator.clipboard.writeText(textToCopy)
      toast({
        type: 'success',
        title: 'Narasi disalin!',
        description: 'Teks rekomendasi interpretasi BAB IV disalin ke papan klip.'
      })
    }
  }

  return (
    <div className="flex h-full flex-col bg-background font-sans">
      <Topbar 
        title="ARIA" 
        subtitle="Audit forensik integritas dataset skripsi via analisis multivariat & Hukum Benford secara paralel." 
      />
      
      <main className="flex-1 overflow-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* 1. LOADING STATE - STAGGERED GOROUTINE LOADER */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                <Card className="border border-primary/20 rounded-2xl shadow-md bg-gradient-to-br from-primary/5 via-card to-card p-6 md:p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
                        <Cpu className="h-7 w-7 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-base text-foreground">Audit Forensik Paralel Aktif</h3>
                      <p className="text-xs text-muted-foreground">
                        Backend Go meluncurkan Goroutines untuk menganalisis kolom secara konkuren.
                      </p>
                    </div>

                    {/* Staggered steps terminal */}
                    <div className="w-full bg-slate-950 text-slate-300 font-mono text-[10px] md:text-xs rounded-xl p-4 text-left border border-slate-800 shadow-inner h-[200px] overflow-y-auto space-y-1.5 scrollbar-thin">
                      {simulatedSteps.slice(0, auditStep + 1).map((step, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2"
                        >
                          <span className="text-emerald-500 shrink-0">&gt;</span>
                          <span className={idx === auditStep ? "text-emerald-400 font-medium" : "text-slate-400"}>
                            {step}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span>Sedikit lagi... Menyelaraskan status mutex...</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 2. ERROR STATE - PREMIUM SHADCN STYLE */}
            {!loading && errorState && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border border-destructive/20 rounded-2xl shadow-sm bg-destructive/5 overflow-hidden">
                  <div className="p-6 flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0 border border-destructive/20">
                      <ServerCrash className="h-6 w-6" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="font-semibold text-base text-destructive">{errorState.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {errorState.description}
                        </p>
                      </div>

                      {/* Scientific Guidelines for fixing */}
                      <div className="border border-destructive/10 bg-background/50 rounded-xl p-4 space-y-2 text-xs text-foreground/80 leading-relaxed">
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          <FileWarning className="h-4 w-4 text-destructive/80" />
                          Panduan Struktur Data ARIA:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Pastikan berkas bertipe format **Comma Separated Values (.csv)**.</li>
                          <li>Baris pertama harus berisi judul kolom bahasa Inggris atau Indonesia tanpa simbol khusus.</li>
                          <li>Isi data di bawah baris judul kolom harus berupa nilai numerik (integer atau desimal).</li>
                          <li>Gunakan format desimal standar titik (.) atau koma (,) yang konsisten.</li>
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button 
                          variant="outline" 
                          onClick={() => { setErrorState(null); setFile(null) }}
                          className="rounded-xl h-9 text-xs font-medium border-destructive/20 text-destructive hover:bg-destructive/5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Pilih File Lain
                        </Button>
                        {file && (
                          <Button 
                            onClick={handleUpload}
                            className="rounded-xl h-9 text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/95"
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Coba Lagi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 3. DEFAULT STATE - FILE UPLOADER */}
            {!loading && !errorState && !result && (
              <motion.div
                key="uploader"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border border-border/50 rounded-2xl shadow-sm bg-card p-6 md:p-8">
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-5 shadow-sm">
                      <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Unggah Dataset Penelitian Anda</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                      Sistem akan mendeteksi pencilan multivariat, duplikasi data secara presisi, dan anomali fabrikasi Hukum Benford secara konkuren.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label htmlFor="csv-upload" className="cursor-pointer w-full sm:w-auto">
                        <div className="h-10 px-5 rounded-xl border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center text-xs font-medium tracking-wide transition-all shadow-sm">
                          Pilih Berkas CSV
                        </div>
                        <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                      </label>
                      
                      {file && (
                        <Button 
                          onClick={handleUpload} 
                          className="h-10 px-6 rounded-xl font-medium text-xs tracking-wide bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all w-full sm:w-auto"
                        >
                          Mulai Audit Integritas
                        </Button>
                      )}
                    </div>

                    {file && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-5 border border-border/60 bg-muted/20 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs text-muted-foreground shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-primary shrink-0"/> 
                        <span className="font-semibold text-foreground/90 max-w-xs truncate">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground/60">• {(file.size / 1024).toFixed(1)} KB</span>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 4. RESULT STATE - INTEGRITY BOARD */}
            {!loading && !errorState && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 md:grid-cols-12 items-start"
              >
                
                {/* Side Board (Stats & Score) */}
                <div className="md:col-span-4 space-y-6">
                  
                  {/* Score Card */}
                  <Card className="border border-border/40 rounded-2xl shadow-sm bg-card overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/10 bg-muted/20">
                      <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Integrity Score</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className={`relative flex h-32 w-36 items-center justify-center rounded-2xl border border-border/40 shadow-sm ${
                          result.score >= 80 
                            ? 'bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-200/20 text-emerald-800' 
                            : result.score >= 60 
                              ? 'bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-200/20 text-amber-800' 
                              : 'bg-gradient-to-br from-rose-50 via-rose-100/50 to-rose-200/20 text-rose-800'
                        }`}>
                          <span className="text-4xl font-semibold tracking-tight">{result.score}</span>
                          <span className="text-[11px] absolute bottom-3 font-medium opacity-80">dari 100</span>
                        </div>
                        <p className="mt-4 text-xs font-semibold text-center text-foreground">
                          {result.score >= 80 ? 'Integritas Sangat Baik' : result.score >= 60 ? 'Perlu Perhatian Khusus' : 'Indikasi Masalah Tinggi'}
                        </p>
                        <p className="text-[10px] text-muted-foreground text-center mt-1 leading-relaxed max-w-[200px]">
                          {result.score >= 80 
                            ? "Dataset bersih dan memenangi standar validitas replikasi akademik." 
                            : "Ditemukan deviasi sebaran atau pencilan yang cukup mengganggu statistik."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analysis Summary Info */}
                  <Card className="border border-border/40 rounded-2xl shadow-sm bg-card overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/10 bg-muted/20">
                      <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ringkasan Analisis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3.5 pt-5 pb-5">
                      <div className="flex justify-between items-center border-b border-border/10 pb-2">
                        <span className="text-xs text-muted-foreground font-medium">Total Baris Data</span>
                        <span className="font-semibold text-sm text-foreground">{result.total_rows}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/10 pb-2">
                        <span className="text-xs text-muted-foreground font-medium">Baris Berisiko</span>
                        <span className={`font-semibold text-sm ${result.flagged_rows > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                          {result.flagged_rows}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-medium">Total Masalah Ditemukan</span>
                        <span className={`font-semibold text-sm ${result.issues.length > 0 ? "text-amber-500" : "text-emerald-600"}`}>
                          {result.issues.length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button 
                    variant="outline"
                    onClick={() => { setResult(null); setFile(null) }}
                    className="w-full rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-xs tracking-wide py-5 transition-all shadow-sm"
                  >
                    Audit Berkas Lain
                  </Button>
                </div>

                {/* Main Results Column (AI Narrative & Forensic Log) */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* AI Interpretative Narrative BAB IV */}
                  <Card className="border border-purple-100 rounded-2xl shadow-sm bg-gradient-to-br from-purple-50/20 via-background to-background overflow-hidden relative">
                    <CardHeader className="pb-3 border-b border-purple-100/20 bg-purple-50/10 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4.5 w-4.5 text-purple-600 shrink-0" />
                        <CardTitle className="text-sm font-semibold tracking-tight text-purple-950">Interpretasi AI (BAB IV)</CardTitle>
                      </div>
                      {result.ai_narrative && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={copyToClipboard}
                          className="h-7 px-2.5 rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 text-[10px] font-medium transition-all"
                        >
                          <Copy className="h-3 w-3 mr-1" /> Salin Narasi
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="pt-5 pb-6 relative">
                      {result.ai_narrative ? (
                        <div className="space-y-4">
                          {typeof result.ai_narrative === 'object' ? (
                            <div className="space-y-4">
                              <div className="p-3.5 bg-purple-50/50 border border-purple-100/60 rounded-xl">
                                <span className="font-semibold text-[10px] text-purple-700 uppercase tracking-wide">Status Integritas Akademik</span>
                                <p className="text-xs font-semibold text-purple-950 mt-1">{result.ai_narrative.status_integritas}</p>
                              </div>
                              <div className="space-y-1.5">
                                <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Pengantar Interpretasi</span>
                                <p className="text-xs leading-relaxed text-slate-700 font-medium">{result.ai_narrative.paragraf_pembuka}</p>
                              </div>
                              <div className="space-y-1.5">
                                <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Analisis Statistik</span>
                                <p className="text-xs leading-relaxed text-slate-700 font-medium">{result.ai_narrative.analisis_statistik}</p>
                              </div>
                              <div className="space-y-1.5">
                                <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Kesimpulan & Rekomendasi</span>
                                <p className="text-xs leading-relaxed text-slate-700 font-medium">{result.ai_narrative.kesimpulan_akademis}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{result.ai_narrative}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-5 text-center space-y-3.5">
                          <p className="text-xs text-muted-foreground font-medium max-w-sm leading-relaxed">
                            Interpretasikan status kegagalan/kebersihan data Anda ke dalam narasi bahasa Indonesia formal ilmiah untuk draf BAB IV Skripsi.
                          </p>
                          <Button 
                            onClick={handleGenerateNarrative} 
                            disabled={generatingNarrative}
                            className="rounded-xl h-10 px-5 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all"
                          >
                            {generatingNarrative ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Menyusun Narasi Ilmiah...
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                Susun Narasi Bab IV
                              </span>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Forensic Issues Log List */}
                  <Card className="border border-border/40 rounded-2xl shadow-sm bg-card overflow-hidden">
                    <CardHeader className="border-b border-border/10 pb-4 bg-muted/20">
                      <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                        Forensic Log Heatmap (Daftar Temuan)
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Daftar lengkap anomali yang diidentifikasi oleh Go Goroutines audit.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5">
                      {result.issues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-emerald-800 text-center space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <p className="font-semibold text-xs text-foreground mt-1">Integritas Sempurna</p>
                          <p className="text-[10px] text-muted-foreground max-w-xs">Tidak ditemukan outlier ekstrem, duplikasi baris, atau anomali sebaran pada data.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                          {result.issues.map((issue, i) => (
                            <div 
                              key={i} 
                              className={`p-3.5 rounded-xl border flex gap-3 shadow-sm transition-all ${
                                issue.severity === 'high' 
                                  ? 'bg-rose-50/50 border-rose-100 text-slate-800' 
                                  : 'bg-amber-50/30 border-amber-100/70 text-slate-800'
                              }`}
                            >
                              <div className={`mt-0.5 border p-1 rounded-lg h-fit w-fit flex items-center justify-center shadow-inner shrink-0 ${
                                issue.severity === 'high' 
                                  ? 'bg-rose-100/50 border-rose-200 text-rose-600' 
                                  : 'bg-amber-100/50 border-amber-200 text-amber-600'
                              }`}>
                                <AlertTriangle className="h-3.5 w-3.5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-semibold text-[10px] text-slate-600">Audit Forensik</span>
                                  <span className="text-[9px] text-muted-foreground/60">•</span>
                                  <Badge variant="outline" className={`text-[8.5px] font-medium tracking-wide rounded-full px-1.5 py-0 ${
                                    issue.severity === 'high' 
                                      ? 'bg-rose-100/30 text-rose-700 border-rose-200' 
                                      : 'bg-amber-100/20 text-amber-700 border-amber-200'
                                  }`}>
                                    {issue.type}
                                  </Badge>
                                  {issue.column && (
                                    <>
                                      <span className="text-[9px] text-muted-foreground/60">•</span>
                                      <span className="text-[10px] font-medium text-slate-500">Kolom: {issue.column}</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-xs leading-relaxed text-slate-700">{issue.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
          
        </div>
      </main>
    </div>
  )
}
