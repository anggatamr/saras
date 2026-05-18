"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, CheckCircle2, AlertCircle, FileText, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SigmaPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showTechnical, setShowTechnical] = useState(false)

  const handleRun = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(3)
    }, 1500)
  }

  return (
    <div className="flex h-full flex-col">
      <Topbar title="SIGMA - Statistical Intelligence Engine" subtitle="Analisis statistik otomatis dengan interpretasi naratif (BAB IV)." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>1</div>
              <span className="text-sm font-medium">Pilih Dataset</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>2</div>
              <span className="text-sm font-medium">Konfigurasi Uji</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>3</div>
              <span className="text-sm font-medium">Hasil & Interpretasi</span>
            </div>
          </div>

          {step === 1 && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Pilih Dataset Anda</h3>
                <p className="text-muted-foreground mb-6">Pilih file yang sudah diunggah sebelumnya di ARIA atau upload file baru.</p>
                <div className="flex gap-4">
                  <Button variant="outline">Upload File Baru</Button>
                  <Button onClick={() => setStep(2)}>Gunakan Dataset Aktif (skripsi_final.csv)</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Decision Tree Pemilihan Uji Otomatis</CardTitle>
                  <CardDescription>Jawab pertanyaan berikut, SIGMA akan merekomendasikan uji yang tepat.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Apa tujuan analisis Anda?</label>
                    <Select defaultValue="prediksi">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beda">Menguji Perbedaan</SelectItem>
                        <SelectItem value="hubungan">Mencari Hubungan (Korelasi)</SelectItem>
                        <SelectItem value="prediksi">Memprediksi Pengaruh (Regresi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Berapa variabel Independen (X)?</label>
                    <Select defaultValue="banyak">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Variabel</SelectItem>
                        <SelectItem value="banyak">2 atau Lebih Variabel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mt-4">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900">Rekomendasi SIGMA: Multiple Linear Regression</h4>
                        <p className="text-sm text-purple-700 mt-1">Berdasarkan tujuan memprediksi dan adanya beberapa variabel independen, Regresi Linear Berganda adalah metode yang paling tepat.</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={handleRun} disabled={loading}>
                    {loading ? "Menjalankan Analisis..." : <><Play className="w-4 h-4 mr-2" /> Jalankan Analisis</>}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Variabel Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variabel Dependen (Y)</label>
                    <div className="p-2 border rounded-md bg-secondary text-sm">Keputusan Pembelian (Y)</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variabel Independen (X)</label>
                    <div className="p-2 border rounded-md bg-secondary text-sm">Social Media Marketing (X1)</div>
                    <div className="p-2 border rounded-md bg-secondary text-sm">Brand Image (X2)</div>
                    <div className="p-2 border rounded-md bg-secondary text-sm">Harga (X3)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-3 space-y-6">
                
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg">Executive Summary (Interpretasi AI)</CardTitle>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Salin ke Word</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm leading-relaxed text-foreground">
                      <p>
                        Berdasarkan hasil analisis regresi linear berganda, model secara keseluruhan menunjukkan pengaruh yang signifikan secara statistik (F = 42.15, p &lt; 0.001). Nilai Adjusted R-Square sebesar 0.672 mengindikasikan bahwa 67.2% variansi dari Keputusan Pembelian dapat dijelaskan oleh model ini, sementara sisanya dipengaruhi oleh faktor lain di luar penelitian (Ghozali, 2021).
                      </p>
                      <p>
                        Pengujian hipotesis secara parsial menunjukkan bahwa Social Media Marketing memiliki pengaruh positif dan signifikan terhadap Keputusan Pembelian (B = 0.342, t = 3.353, p = 0.001). Demikian pula, Brand Image terbukti berpengaruh positif dan signifikan secara statistik (B = 0.415, t = 4.368, p &lt; 0.001). Temuan ini sejalan dengan penelitian sebelumnya yang menyatakan bahwa citra merek yang kuat mendorong probabilitas pembelian (Hair et al., 2019).
                      </p>
                      <p>
                        Sebaliknya, variabel Harga tidak menunjukkan pengaruh yang signifikan terhadap Keputusan Pembelian dalam penelitian ini (B = 0.052, t = 0.591, p = 0.556). Hal ini mungkin mengindikasikan bahwa pada target demografis responden ini, aspek nilai merek dan paparan media sosial lebih dominan dibandingkan sensitivitas harga.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setShowTechnical(!showTechnical)}>
                    {showTechnical ? "Sembunyikan Detail Statistik" : "Tampilkan Detail Statistik Lanjutan"}
                  </Button>
                </div>

                {showTechnical && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Uji Asumsi Klasik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Normalitas</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Terpenuhi</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Multikolinearitas</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Terpenuhi</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Heteroskedastisitas</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Terpenuhi</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Autokorelasi</span>
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100"><AlertCircle className="w-3 h-3 mr-1"/> Marginal</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Model Fit Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">R Square</span>
                            <span className="font-bold">0.684</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Adjusted R Square</span>
                            <span className="font-bold">0.672</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">F Statistic</span>
                            <span className="font-bold">42.15 (p &lt; 0.001)</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Coefficients Table</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="min-w-[120px]">Model</TableHead>
                                  <TableHead>B</TableHead>
                                  <TableHead>Std. Error</TableHead>
                                  <TableHead>t</TableHead>
                                  <TableHead>Sig.</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">(Constant)</TableCell>
                                  <TableCell>2.104</TableCell>
                                  <TableCell>0.452</TableCell>
                                  <TableCell>4.655</TableCell>
                                  <TableCell>0.000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">SocMed (X1)</TableCell>
                                  <TableCell>0.342</TableCell>
                                  <TableCell>0.102</TableCell>
                                  <TableCell>3.353</TableCell>
                                  <TableCell className="text-green-600 font-bold">0.001 ***</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Brand (X2)</TableCell>
                                  <TableCell>0.415</TableCell>
                                  <TableCell>0.095</TableCell>
                                  <TableCell>4.368</TableCell>
                                  <TableCell className="text-green-600 font-bold">0.000 ***</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Harga (X3)</TableCell>
                                  <TableCell>0.052</TableCell>
                                  <TableCell>0.088</TableCell>
                                  <TableCell>0.591</TableCell>
                                  <TableCell className="text-muted-foreground">0.556 ns</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex justify-center">
                  <Button variant="outline" className="w-1/2" onClick={() => setStep(1)}>Mulai Analisis Baru</Button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  )
}
