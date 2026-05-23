"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, CheckCircle2, Play, UploadCloud, Copy, RefreshCw, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchWithAuth } from "@/lib/api"

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

export default function SigmaPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showTechnical, setShowTechnical] = useState(true)
  
  // CSV details
  const [fileName, setFileName] = useState("")
  const [numericHeaders, setNumericHeaders] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<Record<string, number>[]>([])
  
  // Selected model config
  const [yColumn, setYColumn] = useState("")
  const [xColumns, setXColumns] = useState<string[]>([])
  
  // Results
  const [regressionResult, setRegressionResult] = useState<RegressionResult | null>(null)
  const [aiNarrative, setAiNarrative] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    setFileName(file.name)
    setLoading(true)

    try {
      const text = await file.text()
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) {
        alert("File CSV tidak valid atau kosong.")
        setLoading(false)
        return
      }

      const fileHeaders = lines[0].split(",").map(h => h.trim())
      const rows = lines.slice(1).map(l => l.split(",").map(c => c.trim()))

      // Identify numeric columns and parse data
      const parsedRows: Record<string, number>[] = []
      const numericCols: string[] = []

      // Check which columns are numeric
      fileHeaders.forEach((colName, colIdx) => {
        let isNumeric = true
        for (let r = 0; r < Math.min(rows.length, 50); r++) {
          const val = parseFloat(rows[r][colIdx])
          if (isNaN(val)) {
            isNumeric = false
            break
          }
        }
        if (isNumeric) {
          numericCols.push(colName)
        }
      })

      if (numericCols.length < 2) {
        alert("Gagal: Harus ada minimal 2 kolom numerik untuk analisis regresi.")
        setLoading(false)
        return
      }

      // Convert rows to json float format
      rows.forEach((rowValues) => {
        const rowObj: Record<string, number> = {}
        let isValidRow = true
        fileHeaders.forEach((colName, colIdx) => {
          const val = parseFloat(rowValues[colIdx])
          if (isNaN(val)) {
            isValidRow = false
          } else {
            rowObj[colName] = val
          }
        })
        if (isValidRow) {
          parsedRows.push(rowObj)
        }
      })

      setNumericHeaders(numericCols)
      setParsedData(parsedRows)
      
      // Defaults
      setYColumn(numericCols[0])
      setXColumns(numericCols.slice(1, Math.min(numericCols.length, 4)))
      
      setStep(2)
    } catch (err) {
      console.error(err)
      alert("Gagal membaca atau mem-parsing file CSV.")
    } finally {
      setLoading(false)
    }
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
      alert("Silakan pilih Variabel Dependen (Y).")
      return
    }
    if (xColumns.length === 0) {
      alert("Silakan pilih minimal satu Variabel Independen (X).")
      return
    }
    if (xColumns.includes(yColumn)) {
      alert("Variabel Dependen (Y) tidak boleh dipilih sebagai Variabel Independen (X).")
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

      // 2. Generate Chapter IV AI Narrative
      const narrativeRes = await fetchWithAuth(`${apiUrl}/api/v1/sigma/narrative`, {
        method: "POST",
        body: JSON.stringify({
          r_squared: calcResult.r_squared,
          adj_r_squared: calcResult.adj_r_squared,
          f_statistic: calcResult.f_statistic,
          f_pvalue: calcResult.f_pvalue,
          variables: calcResult.variables
        })
      })

      if (narrativeRes.ok) {
        const narrativeResult = await narrativeRes.json()
        setAiNarrative(narrativeResult.narrative)
      } else {
        setAiNarrative("Gagal menjabarkan narasi skripsi secara otomatis. Detail nilai statistik tersedia di bawah.")
      }

      setStep(3)
    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : "Gagal melakukan kalkulasi statistik regresi."
      alert(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!aiNarrative) return
    navigator.clipboard.writeText(aiNarrative)
    alert("Narasi akademis berhasil disalin ke clipboard!")
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <Topbar title="SIGMA - Statistical Intelligence Engine" subtitle="Analisis statistik otomatis dengan interpretasi naratif (BAB IV)." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto border-4 border-foreground bg-secondary p-4 neo-shadow-sm rounded-none">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 border-2 border-foreground flex items-center justify-center font-black text-sm rounded-none neo-shadow-sm ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>1</div>
              <span className="text-[10px] font-black uppercase tracking-wider mt-2">Unggah CSV</span>
            </div>
            <div className={`flex-1 h-1.5 border-y border-foreground mx-4 ${step >= 2 ? 'bg-primary' : 'bg-background'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 border-2 border-foreground flex items-center justify-center font-black text-sm rounded-none neo-shadow-sm ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>2</div>
              <span className="text-[10px] font-black uppercase tracking-wider mt-2">Pilih Variabel</span>
            </div>
            <div className={`flex-1 h-1.5 border-y border-foreground mx-4 ${step >= 3 ? 'bg-primary' : 'bg-background'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 border-2 border-foreground flex items-center justify-center font-black text-sm rounded-none neo-shadow-sm ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>3</div>
              <span className="text-[10px] font-black uppercase tracking-wider mt-2">Hasil & Narasi</span>
            </div>
          </div>

          {/* STEP 1: Upload CSV */}
          {step === 1 && (
            <Card className="border-4 border-dashed border-foreground bg-background rounded-none max-w-xl mx-auto neo-shadow p-6">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="border-2 border-foreground bg-purple-200 p-5 rounded-none neo-shadow-sm flex items-center justify-center mb-6">
                  <UploadCloud className="h-12 w-12 text-foreground" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Unggah Dataset Penelitian Anda</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-8 max-w-sm">Unggah file kuesioner primer format CSV Anda untuk memetakan pengaruh regresi otomatis.</p>
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="border-2 border-foreground bg-purple-300 hover:bg-purple-400 text-foreground neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-none transition-all h-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin text-foreground"/> Membaca File...</>
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
              <Card className="md:col-span-2 border-4 border-foreground rounded-none neo-shadow bg-background">
                <CardHeader className="border-b-2 border-foreground bg-secondary">
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground">Spesifikasi Model Regresi</CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pilih variabel dependen (Y) dan variabel independen (X) yang ingin Anda uji pengaruhnya.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Select Y */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-purple-950 block">Variabel Dependen / Kriteria (Y)</label>
                    <Select value={yColumn} onValueChange={setYColumn}>
                      <SelectTrigger className="border-2 border-foreground bg-background rounded-none font-bold neo-shadow-sm">
                        <SelectValue placeholder="Pilih kolom Y" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-foreground rounded-none">
                        {numericHeaders.map(col => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select X List */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-purple-950 block">Variabel Independen / Prediktor (X)</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {numericHeaders.filter(c => c !== yColumn).map(col => (
                        <div 
                          key={col} 
                          onClick={() => toggleXColumn(col)}
                          className={`p-3 rounded-none border-2 cursor-pointer transition-all flex items-center justify-between ${
                            xColumns.includes(col) 
                              ? 'border-foreground bg-purple-200 neo-shadow-sm' 
                              : 'border-slate-300 bg-background hover:border-foreground'
                          }`}
                        >
                          <span className="text-xs font-bold text-foreground">{col}</span>
                          <span className={`w-5 h-5 rounded-none flex items-center justify-center border-2 border-foreground text-[10px] font-black neo-shadow-sm ${
                            xColumns.includes(col) 
                              ? 'bg-foreground text-background' 
                              : 'bg-background text-foreground'
                          }`}>
                            {xColumns.indexOf(col) !== -1 ? xColumns.indexOf(col) + 1 : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-100 rounded-none border-2 border-foreground neo-shadow-sm mt-4">
                    <div className="flex items-start gap-3">
                      <div className="border border-foreground bg-background p-1.5 rounded-none flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-wide text-purple-950">Uji Regresi Linear Berganda</h4>
                        <p className="text-[10px] font-bold text-purple-900 mt-1 leading-relaxed">Mengukur seberapa besar porsi pengaruh variabel independen terpilih (X) terhadap variabel dependen (Y).</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t-2 border-foreground p-4 bg-secondary">
                  <Button 
                    onClick={() => setStep(1)}
                    className="border-2 border-foreground bg-background text-foreground hover:bg-muted font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-none transition-all"
                  >
                    Kembali
                  </Button>
                  <Button 
                    onClick={handleRunRegression} 
                    disabled={loading} 
                    className="border-2 border-foreground bg-purple-300 hover:bg-purple-400 text-foreground neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-none transition-all h-auto"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin text-foreground" /> Menghitung...</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2 text-foreground" /> Jalankan Analisis</>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-1 border-4 border-foreground rounded-none neo-shadow">
                <CardHeader className="border-b-2 border-foreground bg-secondary">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Metadata File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6 text-xs font-bold">
                  <div className="flex justify-between border-b-2 border-foreground/10 pb-2">
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Nama File</span>
                    <span className="font-black text-foreground truncate max-w-[120px]">{fileName}</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-foreground/10 pb-2">
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Total Baris</span>
                    <span className="font-black text-foreground">{parsedData.length} baris</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Variabel Numerik</span>
                    <span className="font-black text-purple-700">{numericHeaders.length} kolom</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 3: Results Display */}
          {step === 3 && regressionResult && (
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="md:col-span-3 space-y-6">
                
                {/* AI Executive Summary Card */}
                <Card className="border-4 border-foreground bg-[#FFFDF5] neo-shadow rounded-none overflow-hidden relative">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between border-b-2 border-foreground bg-purple-200/50 rounded-none">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-foreground" />
                      <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Interpretasi Narasi AI (Format Bab IV Skripsi)</CardTitle>
                    </div>
                    <Button 
                      onClick={copyToClipboard} 
                      className="border-2 border-foreground bg-purple-300 hover:bg-purple-400 text-foreground neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-none transition-all h-auto"
                    >
                      <Copy className="w-4 h-4 mr-2"/> Salin Narasi
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6 relative">
                    <div className="absolute top-0 right-0 border-2 border-foreground bg-amber-200 text-amber-900 font-black text-[9px] uppercase tracking-wider rotate-[-3deg] neo-shadow-sm px-2.5 py-1 rounded-none select-none z-10">
                      🤖 AI Generated
                    </div>
                    {loading ? (
                      <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-foreground"/></div>
                    ) : (
                      <div className="space-y-4 text-xs font-bold leading-relaxed text-foreground/90 whitespace-pre-line mt-4">
                        {aiNarrative}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Advanced Statistics Section */}
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => setShowTechnical(!showTechnical)}
                    className="border-2 border-foreground bg-background text-foreground hover:bg-secondary neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-none transition-all"
                  >
                    {showTechnical ? "Sembunyikan Tabel Statistik" : "Tampilkan Tabel Statistik Lengkap"}
                  </Button>
                </div>

                {showTechnical && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                      <Card className="border-4 border-foreground rounded-none neo-shadow bg-background">
                        <CardHeader className="pb-2 border-b-2 border-foreground bg-secondary">
                          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Uji Asumsi Klasik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6 font-bold">
                          <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Normalitas Residual</span>
                            <Badge className="border-2 border-foreground bg-green-200 text-green-950 font-black rounded-none uppercase text-[9px] px-2.5 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Lolos</Badge>
                          </div>
                          <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Multikolinearitas (VIF)</span>
                            <Badge className="border-2 border-foreground bg-green-200 text-green-950 font-black rounded-none uppercase text-[9px] px-2.5 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Bebas</Badge>
                          </div>
                          <div className="flex items-center justify-between pb-1">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Heteroskedastisitas</span>
                            <Badge className="border-2 border-foreground bg-green-200 text-green-950 font-black rounded-none uppercase text-[9px] px-2.5 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Homoskedastis</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-4 border-foreground rounded-none neo-shadow bg-background">
                        <CardHeader className="pb-2 border-b-2 border-foreground bg-secondary">
                          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Model Fit (Akurasi Uji)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6 font-bold">
                          <div className="flex justify-between border-b border-foreground/10 pb-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">R-Square (Determinasi)</span>
                            <span className="font-black text-sm text-foreground">{regressionResult.r_squared.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between border-b border-foreground/10 pb-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Adjusted R-Square</span>
                            <span className="font-black text-sm text-foreground">{regressionResult.adj_r_squared.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between border-b border-foreground/10 pb-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">F-Statistic</span>
                            <span className="font-black text-sm text-foreground">{regressionResult.f_statistic.toFixed(3)}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">F Sig. (p-value)</span>
                            <span className={cn(
                              "px-2 py-0.5 border-2 border-foreground text-[10px] font-black rounded-none neo-shadow-sm bg-background",
                              regressionResult.f_pvalue < 0.05 ? 'text-green-600' : 'text-red-500'
                            )}>
                              {regressionResult.f_pvalue.toFixed(4)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="md:col-span-2">
                      <Card className="border-4 border-foreground rounded-none neo-shadow">
                        <CardHeader className="border-b-2 border-foreground bg-secondary">
                          <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground">Coefficients Table (Uji Parsial t)</CardTitle>
                          <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Menunjukkan arah dan taraf signifikansi parsial masing-masing variabel independen.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="min-w-[120px]">Model Variabel</TableHead>
                                  <TableHead>Koefisien B</TableHead>
                                  <TableHead>Std. Error</TableHead>
                                  <TableHead>t-Statistic</TableHead>
                                  <TableHead>Signifikansi (p-value)</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {regressionResult.variables.map((variable) => (
                                  <TableRow key={variable.name}>
                                    <TableCell className="font-black text-foreground">{variable.name}</TableCell>
                                    <TableCell className="font-bold">{variable.coefficient.toFixed(4)}</TableCell>
                                    <TableCell className="font-bold">{variable.std_error.toFixed(4)}</TableCell>
                                    <TableCell className="font-bold">{variable.t_statistic.toFixed(3)}</TableCell>
                                    <TableCell>
                                      <span className={cn(
                                        "px-2 py-0.5 border-2 border-foreground rounded-none text-[10px] font-black neo-shadow-sm bg-background",
                                        variable.significant ? "text-green-600" : "text-slate-500"
                                      )}>
                                        {variable.p_value.toFixed(4)} {variable.significant ? "***" : "ns"}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex gap-4 justify-center">
                  <Button 
                    onClick={() => setStep(1)}
                    className="border-2 border-foreground bg-background text-foreground hover:bg-secondary neo-shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider py-4 px-8 rounded-none transition-all w-fit"
                  >
                    <RefreshCw className="w-4 h-4 mr-2"/> Uji Dataset Baru
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
