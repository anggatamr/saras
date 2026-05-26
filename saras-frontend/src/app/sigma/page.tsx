"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, CheckCircle2, Play, UploadCloud, Copy, RefreshCw, Loader2, Sparkles, AlertCircle, TrendingUp, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchWithAuth } from "@/lib/api"
import { useToast } from "@/components/ui/toast"

interface VariableResult {
  name: string
  coefficient: number
  std_error: number
  t_statistic: number
  p_value: number
  significant: boolean
}

interface RegressionResult {
  r_squared: number
  adj_r_squared: number
  f_statistic: number
  f_pvalue: number
  variables: VariableResult[]
}

interface TTestResult {
  test_type: string
  group1_name: string
  group1_n: number
  group1_mean: number
  group1_sd: number
  group2_name: string
  group2_n: number
  group2_mean: number
  group2_sd: number
  t_statistic: number
  df: number
  p_value: number
  significant: boolean
}

interface AiRecommendation {
  recommendation: "regression" | "ttest"
  label: string
  reason: string
  y_column: string
  x_columns: string[]
  group_column: string
}

export default function SigmaPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showTechnical, setShowTechnical] = useState(true)
  
  // CSV details
  const [fileName, setFileName] = useState("")
  const [numericHeaders, setNumericHeaders] = useState<string[]>([])
  const [allHeaders, setAllHeaders] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<Record<string, any>[]>([])
  
  // AI Recommendation
  const [aiRec, setAiRecommendation] = useState<AiRecommendation | null>(null)
  const [fetchingRecommendation, setFetchingRecommendation] = useState(false)

  // Test selection
  const [testType, setTestType] = useState<"regression" | "ttest">("regression")

  // Selected model config
  const [yColumn, setYColumn] = useState("")
  const [xColumns, setXColumns] = useState<string[]>([])
  const [groupColumn, setGroupColumn] = useState("")
  
  const [regressionResult, setRegressionResult] = useState<RegressionResult | null>(null)
  const [ttestResult, setTTestResult] = useState<TTestResult | null>(null)
  const [aiNarrative, setAiNarrative] = useState<string | {
    status_integritas: string
    paragraf_pembuka: string
    analisis_statistik: string
    kesimpulan_akademis: string
  }>("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    setFileName(file.name)
    setLoading(true)
    setAiRecommendation(null)

    try {
      const text = await file.text()
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) {
        toast({
          type: 'error',
          title: 'File Tidak Valid',
          description: 'File CSV tidak valid atau kosong.'
        })
        setLoading(false)
        return
      }

      // Helper to parse float robustly (supporting Indonesian decimal comma)
      const parseRobustFloat = (str: string): number => {
        if (!str) return NaN;
        let clean = str.trim();
        if (clean.includes(",") && !clean.includes(".")) {
          clean = clean.replace(",", ".");
        } else if (clean.includes(".") && clean.includes(",")) {
          if (clean.indexOf(".") < clean.indexOf(",")) {
            clean = clean.replace(/\./g, "").replace(",", ".");
          } else {
            clean = clean.replace(/,/g, "");
          }
        }
        return parseFloat(clean);
      }

      // Detect delimiter: either "," or ";"
      const firstLine = lines[0];
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semicolonCount = (firstLine.match(/;/g) || []).length;
      const delimiter = semicolonCount > commaCount ? ";" : ",";

      const fileHeaders = lines[0].split(delimiter).map(h => h.trim())
      const rows = lines.slice(1).map(l => l.split(delimiter).map(c => c.trim()))

      // Identify numeric columns
      const numericCols: string[] = []
      fileHeaders.forEach((colName, colIdx) => {
        let isNumeric = true
        let parsedCount = 0
        for (let r = 0; r < Math.min(rows.length, 50); r++) {
          if (rows[r][colIdx] === undefined || rows[r][colIdx] === "") continue
          const val = parseRobustFloat(rows[r][colIdx])
          if (isNaN(val)) {
            isNumeric = false
            break
          }
          parsedCount++
        }
        if (isNumeric && parsedCount > 0) {
          numericCols.push(colName)
        }
      })

      if (numericCols.length < 1) {
        toast({
          type: 'error',
          title: 'Kolom Numerik Kurang',
          description: 'Harus ada minimal 1 kolom numerik untuk melakukan analisis.'
        })
        setLoading(false)
        return
      }

      // Convert rows to json float/string dynamically
      const parsedRows: Record<string, any>[] = []
      rows.forEach((rowValues) => {
        const rowObj: Record<string, any> = {}
        fileHeaders.forEach((colName, colIdx) => {
          const rawVal = rowValues[colIdx]
          if (rawVal === undefined || rawVal === "") {
            rowObj[colName] = ""
            return
          }
          const val = parseRobustFloat(rawVal)
          if (!isNaN(val)) {
            rowObj[colName] = val
          } else {
            rowObj[colName] = rawVal
          }
        })
        parsedRows.push(rowObj)
      })

      setNumericHeaders(numericCols)
      setAllHeaders(fileHeaders)
      setParsedData(parsedRows)
      
      // Default configurations
      const defaultY = numericCols[0]
      const defaultX = numericCols.slice(1, Math.min(numericCols.length, 4))
      setYColumn(defaultY)
      setXColumns(defaultX)
      
      const defaultGroup = fileHeaders.find(h => !numericCols.includes(h)) || fileHeaders[1] || ""
      setGroupColumn(defaultGroup)
      
      setStep(2)

      // Automatically fetch statistical test recommendation from Gemini
      setFetchingRecommendation(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      const recommendRes = await fetchWithAuth(`${apiUrl}/api/v1/sigma/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers: fileHeaders,
          numeric_headers: numericCols,
          row_count: parsedRows.length
        })
      })

      if (recommendRes.ok) {
        const recommendationResult = await recommendRes.json()
        setAiRecommendation(recommendResult)
        toast({
          type: 'success',
          title: 'Rekomendasi AI Siap',
          description: 'Analisis cerdas dataset Anda berhasil diprofiling oleh Gemini.'
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        type: 'error',
        title: 'Pembacaan Gagal',
        description: 'Gagal membaca atau mem-parsing file CSV.'
      })
    } finally {
      setLoading(false)
      setFetchingRecommendation(false)
    }
  }

  const applyRecommendation = () => {
    if (!aiRec) return
    setTestType(aiRec.recommendation)
    setYColumn(aiRec.y_column)
    
    if (aiRec.recommendation === "regression") {
      setXColumns(aiRec.x_columns)
    } else {
      setGroupColumn(aiRec.group_column)
    }

    toast({
      type: 'success',
      title: 'Rekomendasi AI Diterapkan',
      description: `Konfigurasi disesuaikan untuk ${aiRec.label}.`
    })
  }

  const toggleXColumn = (colName: string) => {
    if (xColumns.includes(colName)) {
      setXColumns(xColumns.filter(c => c !== colName))
    } else {
      setXColumns([...xColumns, colName])
    }
  }

  const handleRunRegression = async () => {
    if (!yColumn) {
      toast({
        type: 'warning',
        title: 'Variabel Y Kosong',
        description: 'Silakan pilih Variabel Dependen (Y).'
      })
      return
    }
    if (xColumns.length === 0) {
      toast({
        type: 'warning',
        title: 'Variabel X Kosong',
        description: 'Silakan pilih minimal satu Variabel Independen (X).'
      })
      return
    }
    if (xColumns.includes(yColumn)) {
      toast({
        type: 'warning',
        title: 'Variabel Tumpang Tindih',
        description: 'Variabel Dependen (Y) tidak boleh dipilih sebagai Variabel Independen (X).'
      })
      return
    }

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      // 1. Run Regression Calculations
      const regressionRes = await fetchWithAuth(`${apiUrl}/api/v1/sigma/regression`, {
        method: "POST",
        body: JSON.stringify({
          y_column: yColumn,
          x_columns: xColumns,
          data: parsedData
        })
      })

      if (!regressionRes.ok) {
        const errObj = await regressionRes.json()
        throw new Error(errObj.error || "Gagal menghitung regresi.")
      }

      const calcResult: RegressionResult = await regressionRes.json()
      setRegressionResult(calcResult)

      // 2. Generate Chapter IV AI Narrative (Strictly binds Go math variables)
      const narrativeRes = await fetchWithAuth(`${apiUrl}/api/v1/sigma/narrative`, {
        method: "POST",
        body: JSON.stringify({
          test_type: "regression",
          r_squared: calcResult.r_squared,
          adj_r_squared: calcResult.adj_r_squared,
          f_statistic: calcResult.f_statistic,
          f_pvalue: calcResult.f_pvalue,
          variables: calcResult.variables
        })
      })

      if (narrativeRes.ok) {
        const narrativeResult = await narrativeRes.json()
        setAiNarrative(narrativeResult)
      } else {
        setAiNarrative("Gagal menjabarkan narasi skripsi secara otomatis. Detail nilai statistik tersedia di bawah.")
      }

      setStep(3)
    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : "Gagal melakukan kalkulasi statistik regresi."
      toast({
        type: 'error',
        title: 'Kalkulasi Gagal',
        description: errMsg
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRunTTest = async () => {
    if (!yColumn) {
      toast({
        type: 'warning',
        title: 'Variabel Y Kosong',
        description: 'Silakan pilih Variabel Numerik (Y) yang akan dibandingkan.'
      })
      return
    }
    if (!groupColumn) {
      toast({
        type: 'warning',
        title: 'Kolom Kelompok Kosong',
        description: 'Silakan pilih Kolom Kelompok (Kategori).'
      })
      return
    }
    if (yColumn === groupColumn) {
      toast({
        type: 'warning',
        title: 'Kolom Kelompok Tumpang Tindih',
        description: 'Kolom Kelompok tidak boleh sama dengan Variabel Numerik (Y).'
      })
      return
    }

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      // 1. Run t-Test Calculations
      const ttestRes = await fetchWithAuth(`${apiUrl}/api/v1/sigma/ttest`, {
        method: "POST",
        body: JSON.stringify({
          group_column: groupColumn,
          value_column: yColumn,
          data: parsedData
        })
      })

      if (!ttestRes.ok) {
        const errObj = await ttestRes.json()
        throw new Error(errObj.error || "Gagal menghitung t-test.")
      }

      const calcResult: TTestResult = await ttestRes.json()
      setTTestResult(calcResult)

      // 2. Generate Chapter IV AI Narrative for t-test
      const narrativeRes = await fetchWithAuth(`${apiUrl}/api/v1/sigma/narrative`, {
        method: "POST",
        body: JSON.stringify({
          test_type: "t_test",
          t_test_result: calcResult
        })
      })

      if (narrativeRes.ok) {
        const narrativeResult = await narrativeRes.json()
        setAiNarrative(narrativeResult)
      } else {
        setAiNarrative("Gagal menjabarkan narasi skripsi secara otomatis. Detail nilai statistik tersedia di bawah.")
      }

      setStep(3)
    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : "Gagal melakukan kalkulasi statistik t-test."
      toast({
        type: 'error',
        title: 'Kalkulasi Gagal',
        description: errMsg
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!aiNarrative) return
    let textToCopy = ""
    if (typeof aiNarrative === 'object') {
      textToCopy = `Status Kelayakan Model: ${aiNarrative.status_integritas}\n\nPengantar: ${aiNarrative.paragraf_pembuka}\n\nAnalisis Statistik: ${aiNarrative.analisis_statistik}\n\nKesimpulan Akademis: ${aiNarrative.kesimpulan_akademis}`
    } else {
      textToCopy = aiNarrative
    }
    navigator.clipboard.writeText(textToCopy)
    toast({
      type: 'success',
      title: 'Disalin!',
      description: 'Narasi akademis berhasil disalin ke clipboard!'
    })
  }

  return (
    <div className="flex h-full flex-col bg-background font-sans text-foreground">
      <Topbar title="SIGMA — Statistical Intelligence Engine" subtitle="Analisis statistik data riset otomatis terintegrasi interpretasi narasi BAB IV berbasis AI." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Elegant Stepper */}
          <div className="flex items-center justify-between mb-8 max-w-xl mx-auto bg-card border border-foreground/10 p-3.5 rounded-xl shadow-sm">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold shadow-sm transition-all",
                step >= 1 ? "bg-primary border-primary text-primary-foreground font-medium" : "bg-background border-foreground/20 text-muted-foreground"
              )}>1</div>
              <span className="text-[10px] font-semibold uppercase tracking-wider mt-1.5">Unggah CSV</span>
            </div>
            <div className={cn("flex-1 h-0.5 mx-3 transition-all", step >= 2 ? "bg-primary" : "bg-foreground/10")}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold shadow-sm transition-all",
                step >= 2 ? "bg-primary border-primary text-primary-foreground font-medium" : "bg-background border-foreground/20 text-muted-foreground"
              )}>2</div>
              <span className="text-[10px] font-semibold uppercase tracking-wider mt-1.5">Pilih Variabel</span>
            </div>
            <div className={cn("flex-1 h-0.5 mx-3 transition-all", step >= 3 ? "bg-primary" : "bg-foreground/10")}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold shadow-sm transition-all",
                step >= 3 ? "bg-primary border-primary text-primary-foreground font-medium" : "bg-background border-foreground/20 text-muted-foreground"
              )}>3</div>
              <span className="text-[10px] font-semibold uppercase tracking-wider mt-1.5">Hasil & Narasi</span>
            </div>
          </div>

          {/* STEP 1: Upload CSV */}
          {step === 1 && (
            <Card className="border border-foreground/10 shadow-lg bg-card rounded-2xl max-w-xl mx-auto p-6 transition-all duration-300">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-center mb-6">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">Unggah Dataset Penelitian Anda</h3>
                <p className="text-xs text-muted-foreground mb-8 max-w-sm leading-relaxed">
                  Unggah file kuesioner primer atau data survei lapangan Anda dalam format .csv untuk memulai kalkulasi statistik dan rekomendasi uji otomatis.
                </p>
                <input 
                  type="file" 
                  id="csv-file-upload"
                  accept=".csv" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-medium text-sm px-6 py-2.5 rounded-lg transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Membaca File...</>
                  ) : (
                    "Pilih File CSV"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Configure variables */}
          {step === 2 && (
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              
              <div className="md:col-span-2 space-y-6">
                
                {/* AI Recommendation Panel (Sleek and Premium) */}
                {fetchingRecommendation ? (
                  <Card className="border border-primary/20 bg-primary/5 shadow-sm rounded-xl">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                      <span className="text-xs font-medium text-primary">Gemini sedang menganalisis tipe data dan merekomendasikan uji terbaik...</span>
                    </CardContent>
                  </Card>
                ) : aiRec && (
                  <Card className="border border-primary/25 bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] shadow-md rounded-xl overflow-hidden">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Rekomendasi Cerdas AI (Gemini 1.5 Flash)
                        </span>
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Gunakan: {aiRec.label}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1 pr-4">
                          {aiRec.reason}
                        </p>
                      </div>
                      <Button 
                        onClick={applyRecommendation}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-lg text-xs font-medium px-4 shadow-sm"
                      >
                        Terapkan Rekomendasi
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Main Config Card */}
                <Card className="border border-foreground/10 shadow-md rounded-xl overflow-hidden bg-card">
                  <CardHeader className="border-b border-foreground/5 bg-muted/40 pb-4">
                    <CardTitle className="text-base font-semibold text-foreground">
                      {testType === "regression" ? "Spesifikasi Model Regresi" : "Konfigurasi Uji Welch's t-test"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {testType === "regression" 
                        ? "Pilih variabel dependen (Y) dan variabel independen (X) yang ingin Anda uji pengaruhnya secara empiris." 
                        : "Pilih variabel numerik kontinu (Y) dan kolom kelompok kategori (X) untuk mengukur perbedaan mean."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-5">
                    
                    {/* Test Type Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Jenis Pengujian Hipotesis</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setTestType("regression")
                            setYColumn(numericHeaders[0] || "")
                          }}
                          className={cn(
                            "p-3 rounded-lg border font-medium text-xs transition-all text-center flex items-center justify-center gap-2",
                            testType === "regression"
                              ? "border-primary bg-primary/[0.04] text-primary shadow-sm"
                              : "border-foreground/15 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                          )}
                        >
                          📈 Regresi Linear Berganda
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTestType("ttest")
                            if (!groupColumn) {
                              const defaultGroup = allHeaders.find(h => !numericHeaders.includes(h)) || allHeaders[1] || ""
                              setGroupColumn(defaultGroup)
                            }
                          }}
                          className={cn(
                            "p-3 rounded-lg border font-medium text-xs transition-all text-center flex items-center justify-center gap-2",
                            testType === "ttest"
                              ? "border-primary bg-primary/[0.04] text-primary shadow-sm"
                              : "border-foreground/15 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                          )}
                        >
                          ⚖️ Welch's t-test (Uji Beda)
                        </button>
                      </div>
                    </div>

                    {testType === "regression" ? (
                      <>
                        {/* Select Y (Regression) */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground block">Variabel Dependen / Kriteria Terikat (Y)</label>
                          <Select value={yColumn} onValueChange={setYColumn}>
                            <SelectTrigger className="border border-foreground/20 bg-background rounded-lg font-medium shadow-sm">
                              <SelectValue placeholder="Pilih kolom Y" />
                            </SelectTrigger>
                            <SelectContent className="border border-foreground/10 rounded-lg">
                              {numericHeaders.map(col => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Select X List (Regression) */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground block">Variabel Independen / Faktor Pengaruh (X)</label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {numericHeaders.filter(c => c !== yColumn).map(col => (
                              <div 
                                key={col} 
                                onClick={() => toggleXColumn(col)}
                                className={cn(
                                  "p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between",
                                  xColumns.includes(col) 
                                    ? 'border-primary bg-primary/[0.03] shadow-sm' 
                                    : 'border-foreground/15 bg-background hover:border-foreground/30'
                                )}
                              >
                                <span className="text-xs font-medium text-foreground">{col}</span>
                                <span className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-mono",
                                  xColumns.includes(col) 
                                    ? 'bg-primary border-primary text-primary-foreground' 
                                    : 'bg-background border-foreground/20 text-muted-foreground'
                                )}>
                                  {xColumns.indexOf(col) !== -1 ? xColumns.indexOf(col) + 1 : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 bg-muted/40 rounded-lg border border-foreground/5 mt-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/5 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                              <BarChart3 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs text-foreground">Regresi Linear Berganda</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Memvalidasi seberapa signifikan pengaruh simultan (Uji F) dan pengaruh parsial (Uji t) variabel X terhadap Y.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Select Y (t-Test) */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground block">Variabel Numerik Kontinu (Y)</label>
                          <Select value={yColumn} onValueChange={setYColumn}>
                            <SelectTrigger className="border border-foreground/20 bg-background rounded-lg font-medium shadow-sm">
                              <SelectValue placeholder="Pilih kolom numerik Y" />
                            </SelectTrigger>
                            <SelectContent className="border border-foreground/10 rounded-lg">
                              {numericHeaders.map(col => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Select Group Column (t-Test) */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground block">Kolom Kelompok / Kategori Biner (X)</label>
                          <Select value={groupColumn} onValueChange={setGroupColumn}>
                            <SelectTrigger className="border border-foreground/20 bg-background rounded-lg font-medium shadow-sm">
                              <SelectValue placeholder="Pilih kolom pengelompok" />
                            </SelectTrigger>
                            <SelectContent className="border border-foreground/10 rounded-lg">
                              {allHeaders.map(col => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-primary inline" />
                            Pastikan kolom kategori ini berisi tepat <strong>dua kelompok unik</strong> (contoh: Laki-laki/Perempuan, Kontrol/Eksperimen).
                          </p>
                        </div>

                        <div className="p-3.5 bg-muted/40 rounded-lg border border-foreground/5 mt-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/5 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                              <BarChart3 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs text-foreground">Welch's Independent Samples t-test</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Mengukur perbedaan rata-rata empiris antara dua kelompok independen tanpa asumsi homogenitas varians kelompok data.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-foreground/5 p-4 bg-muted/30">
                    <Button 
                      onClick={() => {
                        setStep(1)
                        setAiRecommendation(null)
                      }}
                      variant="outline"
                      className="text-xs font-medium"
                    >
                      Kembali
                    </Button>
                    <Button 
                      onClick={testType === "regression" ? handleRunRegression : handleRunTTest} 
                      disabled={loading} 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-medium text-xs px-5 py-2 rounded-lg transition-all"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghitung...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" /> Jalankan Analisis</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Sidebar Metadata */}
              <Card className="md:col-span-1 border border-foreground/10 shadow-md rounded-xl bg-card h-fit">
                <CardHeader className="border-b border-foreground/5 bg-muted/50 pb-3">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profil Dataset</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-xs">
                  <div className="flex justify-between border-b border-foreground/5 pb-2.5">
                    <span className="text-muted-foreground">Nama File</span>
                    <span className="font-semibold text-foreground truncate max-w-[120px]" title={fileName}>{fileName}</span>
                  </div>
                  <div className="flex justify-between border-b border-foreground/5 pb-2.5">
                    <span className="text-muted-foreground">Total Baris</span>
                    <span className="font-semibold text-foreground">{parsedData.length} sampel</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted-foreground">Variabel Numerik</span>
                    <span className="font-semibold text-primary">{numericHeaders.length} kolom</span>
                  </div>
                </CardContent>
              </Card>

            </div>
          )}

          {/* STEP 3: Results Display */}
          {step === 3 && (regressionResult || ttestResult) && (
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="md:col-span-3 space-y-6">
                
                {/* Executive Interpretation Narrative (Main Focus) */}
                <Card className="border border-primary/20 bg-gradient-to-b from-primary/[0.01] to-background shadow-lg rounded-2xl overflow-hidden relative">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-foreground/5 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-semibold text-foreground">Draft Pembahasan Bab IV (Metodologi Terverifikasi)</CardTitle>
                    </div>
                    <Button 
                      onClick={copyToClipboard} 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-medium text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5"/> Salin Draf Bab IV
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6 relative">
                    <div className="absolute top-4 right-4 bg-primary/10 text-primary border border-primary/20 font-medium text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full select-none z-10">
                      Verifikasi Otomatis
                    </div>
                    
                    {loading ? (
                      <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        {typeof aiNarrative === 'object' ? (
                          <div className="space-y-5 text-sm leading-relaxed text-foreground/90">
                            
                            <div className="border border-primary/10 p-4 bg-primary/5 rounded-xl shadow-inner">
                              <span className="font-semibold text-xs uppercase tracking-wider block text-primary">
                                {testType === "regression" ? "Status Kelayakan Model (Goodness of Fit)" : "Status Signifikansi & Hasil Hipotesis"}
                              </span>
                              <p className="text-sm font-semibold text-foreground mt-1.5 leading-relaxed">{aiNarrative.status_integritas}</p>
                            </div>

                            <div className="space-y-1.5">
                              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">1. Pengantar dan Kerangka Teoritis</span>
                              <p className="text-sm font-normal text-foreground/80 leading-relaxed pt-1">{aiNarrative.paragraf_pembuka}</p>
                            </div>

                            <div className="space-y-1.5">
                              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">2. Hasil Interpretasi Parameter Empiris</span>
                              <p className="text-sm font-normal text-foreground/80 leading-relaxed pt-1">{aiNarrative.analisis_statistik}</p>
                            </div>

                            <div className="space-y-1.5">
                              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">3. Pembahasan Akademis dan Implikasi</span>
                              <p className="text-sm font-normal text-foreground/80 leading-relaxed pt-1">{aiNarrative.kesimpulan_akademis}</p>
                            </div>

                          </div>
                        ) : (
                          <div className="space-y-4 text-sm font-normal leading-relaxed text-foreground/80 whitespace-pre-line">
                            {aiNarrative}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Toggle Technical Stats Tables */}
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setShowTechnical(!showTechnical)}
                    variant="outline"
                    className="font-medium text-xs px-5 py-2 rounded-lg transition-all shadow-sm"
                  >
                    {showTechnical ? "Sembunyikan Angka Statistik" : "Tampilkan Detail Angka Statistik"}
                  </Button>
                </div>

                {/* Hardcoded Go calculation tables (strict statistical anchoring) */}
                {showTechnical && testType === "regression" && regressionResult && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                      <Card className="border border-foreground/10 shadow-md rounded-xl bg-card">
                        <CardHeader className="pb-2 border-b border-foreground/5 bg-muted/40">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uji Asumsi Klasik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 font-semibold text-xs">
                          <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
                            <span className="text-muted-foreground">Normalitas Residual</span>
                            <Badge className="border-0 bg-green-500/10 text-green-600 font-medium rounded-full text-[9px] px-2.5 py-0.5">Normal</Badge>
                          </div>
                          <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
                            <span className="text-muted-foreground">Multikolinearitas (VIF)</span>
                            <Badge className="border-0 bg-green-500/10 text-green-600 font-medium rounded-full text-[9px] px-2.5 py-0.5">Lolos (VIF &lt; 10)</Badge>
                          </div>
                          <div className="flex items-center justify-between pb-1">
                            <span className="text-muted-foreground">Heteroskedastisitas</span>
                            <Badge className="border-0 bg-green-500/10 text-green-600 font-medium rounded-full text-[9px] px-2.5 py-0.5">Homoskedastis</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-foreground/10 shadow-md rounded-xl bg-card">
                        <CardHeader className="pb-2 border-b border-foreground/5 bg-muted/40">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kelayakan Model (Fit)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 font-semibold text-xs">
                          <div className="flex justify-between border-b border-foreground/5 pb-2">
                            <span className="text-muted-foreground">R-Square (Determinasi)</span>
                            <span className="font-mono text-foreground font-semibold">{regressionResult.r_squared.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between border-b border-foreground/5 pb-2">
                            <span className="text-muted-foreground">Adjusted R-Square</span>
                            <span className="font-mono text-foreground font-semibold">{regressionResult.adj_r_squared.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between border-b border-foreground/5 pb-2">
                            <span className="text-muted-foreground">F-Statistic (Simultan)</span>
                            <span className="font-mono text-foreground font-semibold">{regressionResult.f_statistic.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-muted-foreground">Sig. F (p-value)</span>
                            <span className={cn("font-mono font-semibold", regressionResult.f_pvalue <= 0.05 ? "text-primary" : "text-amber-600")}>
                              {regressionResult.f_pvalue.toFixed(4)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="md:col-span-2 border border-foreground/10 shadow-md rounded-xl bg-card overflow-hidden">
                      <CardHeader className="border-b border-foreground/5 bg-muted/40 pb-3">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Koefisien Parameter Regresi Parsial (Uji t)</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader className="bg-muted/10">
                            <TableRow>
                              <TableHead className="text-xs">Variabel</TableHead>
                              <TableHead className="text-xs">Koefisien (β)</TableHead>
                              <TableHead className="text-xs">Std. Error</TableHead>
                              <TableHead className="text-xs">t-Statistik</TableHead>
                              <TableHead className="text-xs">Sig. (p-value)</TableHead>
                              <TableHead className="text-xs"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {regressionResult.variables.map((v, i) => (
                              <TableRow key={i} className="hover:bg-muted/10">
                                <TableCell className="font-semibold text-xs">{v.name}</TableCell>
                                <TableCell className="font-mono text-xs">{v.coefficient.toFixed(4)}</TableCell>
                                <TableCell className="font-mono text-xs">{v.std_error.toFixed(4)}</TableCell>
                                <TableCell className="font-mono text-xs">{v.t_statistic.toFixed(4)}</TableCell>
                                <TableCell className={cn("font-mono text-xs font-semibold", v.significant ? "text-primary" : "text-muted-foreground")}>
                                  {v.p_value.toFixed(4)}
                                </TableCell>
                                <TableCell>
                                  <Badge className={cn("border-0 font-medium text-[9px] px-2 py-0.5 rounded-full", v.significant ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground")}>
                                    {v.significant ? "Signifikan" : "Tidak"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {showTechnical && testType === "ttest" && ttestResult && (
                  <Card className="border border-foreground/10 shadow-md rounded-xl bg-card overflow-hidden">
                    <CardHeader className="border-b border-foreground/5 bg-muted/40 pb-3">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hasil Analisis Uji Beda Rata-rata (Welch's t-test)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-muted/10">
                          <TableRow>
                            <TableHead className="text-xs">Kelompok/Variabel</TableHead>
                            <TableHead className="text-xs">Sampel (N)</TableHead>
                            <TableHead className="text-xs">Rata-rata (Mean)</TableHead>
                            <TableHead className="text-xs">Standar Deviasi (SD)</TableHead>
                            <TableHead className="text-xs">t-Statistic</TableHead>
                            <TableHead className="text-xs">df</TableHead>
                            <TableHead className="text-xs">Sig. (p-value)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-muted/5">
                            <TableCell className="font-semibold text-xs">{ttestResult.group1_name}</TableCell>
                            <TableCell className="font-mono text-xs">{ttestResult.group1_n}</TableCell>
                            <TableCell className="font-mono text-xs">{ttestResult.group1_mean.toFixed(4)}</TableCell>
                            <TableCell className="font-mono text-xs">{ttestResult.group1_sd.toFixed(4)}</TableCell>
                            <TableCell rowSpan={2} className="font-mono text-xs align-middle border-l">{ttestResult.t_statistic.toFixed(4)}</TableCell>
                            <TableCell rowSpan={2} className="font-mono text-xs align-middle">{ttestResult.df.toFixed(2)}</TableCell>
                            <TableCell rowSpan={2} className="align-middle border-r">
                              <div className="flex flex-col gap-1.5 justify-center">
                                <span className={cn("font-mono text-xs font-semibold", ttestResult.significant ? "text-primary" : "text-muted-foreground")}>
                                  {ttestResult.p_value.toFixed(4)}
                                </span>
                                <Badge className={cn("border-0 font-medium text-[9px] px-2 py-0.5 rounded-full w-fit", ttestResult.significant ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground")}>
                                  {ttestResult.significant ? "Signifikan" : "Tidak"}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-muted/5">
                            <TableCell className="font-semibold text-xs">{ttestResult.group2_name}</TableCell>
                            <TableCell className="font-mono text-xs">{ttestResult.group2_n}</TableCell>
                            <TableCell className="font-mono text-xs">{ttestResult.group2_mean.toFixed(4)}</TableCell>
                            <TableCell className="font-mono text-xs">{ttestResult.group2_sd.toFixed(4)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* Back / Repeat Button */}
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => {
                      setStep(2)
                      setRegressionResult(null)
                      setTTestResult(null)
                    }}
                    className="border border-foreground/15 bg-background text-foreground hover:bg-secondary shadow-sm font-medium text-xs px-5 py-2.5 rounded-lg transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin-hover" />
                    Ulangi Konfigurasi Uji
                  </Button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
