"use client"

import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle2, Award, Plus, Search, Filter, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/api"

interface Survey {
  id: number
  title: string
  author: string
  uni: string
  target: number
  current: number
  points: number
  tags: string[]
}

export default function VeraPage() {
  const [activeTab, setActiveTab] = useState("marketplace")
  const { user, isAcademicEmail, signInWithGoogle, logout, loading: authLoading } = useAuth()
  
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  // Form fields for new survey
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newTarget, setNewTarget] = useState("100")
  const [newPoints, setNewPoints] = useState("30")
  const [newTags, setNewTags] = useState("Pendidikan, Penelitian")
  const [submitting, setSubmitting] = useState(false)

  const fetchSurveys = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetchWithAuth(`${apiUrl}/api/v1/vera/surveys/active`)
      if (res.ok) {
        const data = await res.json()
        setSurveys(data)
      }
    } catch (e) {
      console.error("Failed to load surveys", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && isAcademicEmail) {
      fetchSurveys()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAcademicEmail])

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setSubmitting(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetchWithAuth(`${apiUrl}/api/v1/vera/surveys`, {
        method: "POST",
        body: JSON.stringify({
          title: newTitle,
          author: user?.name || user?.email || "Akademisi SARAS",
          uni: "Universitas Negeri Medan",
          target: parseInt(newTarget) || 100,
          points: parseInt(newPoints) || 30,
          tags: newTags.split(",").map(t => t.trim()).filter(Boolean)
        })
      })

      if (res.ok) {
        setIsCreateOpen(false)
        setNewTitle("")
        setNewTarget("100")
        setNewPoints("30")
        setNewTags("Pendidikan, Penelitian")
        alert("Sukses: Survei baru Anda berhasil dipublikasikan!")
        fetchSurveys()
      } else {
        alert("Gagal memublikasikan survei.")
      }
    } catch (err) {
      console.error(err)
      alert("Error: Gagal terhubung ke server.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleFillSurvey = async (surveyId: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetchWithAuth(`${apiUrl}/api/v1/vera/surveys/${surveyId}/submit`, {
        method: "POST"
      })

      if (res.ok) {
        alert("Terima kasih! Anda mendapatkan poin tambahan karena mengisi survei akademik terverifikasi ini.")
        fetchSurveys()
      } else {
        alert("Gagal mengirim partisipasi.")
      }
    } catch (e) {
      console.error(e)
      alert("Gagal berpartisipasi dalam survei.")
    }
  }

  const filteredSurveys = surveys.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.author.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const mySurveys = filteredSurveys.filter(s => s.author === user?.name || s.author === user?.email)

  return (
    <div className="flex h-full flex-col bg-background">
      <Topbar title="VERA - Verified Respondent Acquisition" subtitle="Marketplace survei akademik dengan responden terverifikasi email .ac.id." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {authLoading ? (
            <div className="flex justify-center py-10"><span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Memuat status verifikasi...</span></div>
          ) : !user || !isAcademicEmail ? (
            <Card className="border-4 border-dashed border-foreground bg-background rounded-none max-w-md mx-auto mt-10 p-6 neo-shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="border-2 border-foreground bg-red-200 p-5 rounded-none neo-shadow-sm flex items-center justify-center mb-6">
                  <AlertCircle className="h-10 w-10 text-foreground" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Akses Terbatas</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-8 leading-relaxed">
                  Fitur VERA eksklusif untuk civitas akademika. Silakan login menggunakan email kampus (.ac.id / .edu) Anda untuk berpartisipasi atau menyebarkan survei.
                </p>
                <Button 
                  onClick={signInWithGoogle} 
                  className="border-2 border-foreground bg-green-300 hover:bg-green-400 text-foreground neo-shadow neo-interactive font-black text-sm uppercase tracking-wider py-4 rounded-none transition-all w-full h-auto"
                >
                  Login dengan Email Akademik
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header Status */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-green-200 border-4 border-foreground p-6 rounded-none neo-shadow-lg">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 border-4 border-foreground bg-white rounded-none neo-shadow-sm flex items-center justify-center shrink-0">
                    <Users className="h-8 w-8 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase tracking-tight text-green-950">Status Anda: Terverifikasi</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="border-2 border-foreground bg-white text-green-800 font-bold rounded-none text-[9px] uppercase tracking-wider px-2 py-0.5 neo-shadow-sm">{user.email}</Badge>
                      <Badge variant="outline" className="border-2 border-foreground bg-white text-green-800 font-bold rounded-none text-[9px] uppercase tracking-wider px-2 py-0.5 neo-shadow-sm"><CheckCircle2 className="w-3 h-3 mr-1" /> .ac.id Verified</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline border-2 border-foreground bg-background px-3 py-1 rounded-none neo-shadow-sm transition-all ml-2 h-auto" 
                        onClick={logout}
                      >
                        Keluar
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-white p-4 border-4 border-foreground rounded-none neo-shadow shadow-sm min-w-[150px]">
                  <span className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-wider flex items-center"><Award className="w-4 h-4 mr-1 text-amber-500" /> Saldo Poin</span>
                  <span className="text-3xl font-black text-green-700">450</span>
                </div>
              </div>

              {/* Form Modal / Creator Section */}
              {isCreateOpen && (
                <Card className="border-4 border-foreground bg-green-50/40 p-6 rounded-none neo-shadow mb-6">
                  <CardHeader className="p-0 mb-4 border-b-2 border-foreground pb-2">
                    <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground">Buat Survei Baru</CardTitle>
                    <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Publikasikan kuesioner Anda untuk mendapatkan responden terpercaya.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <form onSubmit={handleCreateSurvey} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-green-950 block">Judul Penelitian</label>
                          <Input 
                            value={newTitle} 
                            onChange={(e) => setNewTitle(e.target.value)} 
                            placeholder="Contoh: Pengaruh AI pada Produktivitas Belajar" 
                            className="border-2 border-foreground bg-background rounded-none font-bold"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-green-950 block">Tag / Kategori (pisahkan koma)</label>
                          <Input 
                            value={newTags} 
                            onChange={(e) => setNewTags(e.target.value)} 
                            placeholder="Contoh: Psikologi, Pendidikan" 
                            className="border-2 border-foreground bg-background rounded-none font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-green-950 block">Target Jumlah Responden</label>
                          <Input 
                            type="number" 
                            value={newTarget} 
                            onChange={(e) => setNewTarget(e.target.value)} 
                            className="border-2 border-foreground bg-background rounded-none font-bold"
                            min="10" 
                            max="1000"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-green-950 block">Poin Hadiah Per Responden</label>
                          <Input 
                            type="number" 
                            value={newPoints} 
                            onChange={(e) => setNewPoints(e.target.value)} 
                            className="border-2 border-foreground bg-background rounded-none font-bold"
                            min="10" 
                            max="100"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-4 border-t border-foreground/10">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setIsCreateOpen(false)}
                          className="border-2 border-transparent hover:border-foreground hover:bg-muted/40 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-none transition-all"
                        >
                          Batal
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={submitting} 
                          className="border-2 border-foreground bg-green-300 hover:bg-green-400 text-foreground neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-none transition-all h-auto"
                        >
                          {submitting ? "Memublikasikan..." : "Publikasikan Kuesioner"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                    <TabsTrigger value="marketplace">Marketplace Survei</TabsTrigger>
                    <TabsTrigger value="mysurveys">Survei Saya</TabsTrigger>
                  </TabsList>
                  
                  {!isCreateOpen && (
                    <Button 
                      onClick={() => setIsCreateOpen(true)} 
                      className="border-2 border-foreground bg-green-300 hover:bg-green-400 text-foreground neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-4 py-3 rounded-none transition-all w-full sm:w-auto h-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Buat Survei Baru
                    </Button>
                  )}
                </div>

                <TabsContent value="marketplace" className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Cari topik survei..." 
                        className="pl-9 border-2 border-foreground rounded-none font-bold neo-shadow-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-[1px] focus:-translate-y-[1px] transition-all" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Button className="border-2 border-foreground bg-secondary text-foreground p-3.5 rounded-none neo-shadow-sm transition-all"><Filter className="h-4 w-4 text-foreground" /></Button>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center py-12">
                      <Loader2 className="h-8 w-8 text-foreground animate-spin" />
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-2">Memuat kuesioner aktif...</span>
                    </div>
                  ) : filteredSurveys.length === 0 ? (
                    <div className="text-center py-12 text-sm font-bold text-muted-foreground uppercase tracking-wider">Tidak ada survei yang ditemukan.</div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                      {filteredSurveys.map((survey) => {
                        const progress = survey.target > 0 ? (survey.current / survey.target) * 100 : 0
                        return (
                          <Card key={survey.id} className="flex flex-col border-4 border-foreground rounded-none bg-card neo-shadow hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 group h-full">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start mb-2.5">
                                <Badge variant="secondary" className="border-2 border-foreground bg-amber-200 text-amber-950 font-black rounded-none text-[9px] uppercase tracking-wider px-2.5 py-0.5 neo-shadow-sm">
                                  +{survey.points} Poin
                                </Badge>
                                <span className="border-2 border-foreground bg-secondary px-3 py-1 font-black text-[10px] rounded-none neo-shadow-sm text-foreground">
                                  {Math.round(progress)}% Terisi
                                </span>
                              </div>
                              <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground leading-tight line-clamp-2">{survey.title}</CardTitle>
                              <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-2.5 line-clamp-1 flex flex-col gap-1">
                                <span className="font-black text-foreground">{survey.author}</span>
                                <span>{survey.uni || "Universitas Negeri Medan"}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4 flex-1">
                              <div className="flex flex-wrap gap-1.5">
                                {survey.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="border-2 border-foreground bg-background text-foreground font-black text-[9px] uppercase tracking-wider rounded-none px-2 py-0.5">{tag}</Badge>
                                ))}
                              </div>
                              <div className="mt-5 border-2 border-foreground bg-secondary h-3.5 rounded-none overflow-hidden neo-shadow-sm">
                                <div 
                                  className="bg-green-500 h-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1.5 text-right">{survey.current} / {survey.target} responden</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                              {survey.current >= survey.target ? (
                                <button
                                  className="border-2 border-foreground bg-secondary text-muted-foreground font-black text-xs uppercase tracking-wider py-3.5 rounded-none w-full text-center opacity-50 cursor-not-allowed"
                                  disabled
                                >
                                  Survei Selesai
                                </button>
                              ) : (
                                <Button 
                                  onClick={() => handleFillSurvey(survey.id)} 
                                  className="border-2 border-foreground bg-green-300 hover:bg-green-400 text-foreground neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider py-3.5 rounded-none transition-all w-full text-center h-auto"
                                >
                                  Isi Survei
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="mysurveys">
                  {mySurveys.length === 0 ? (
                    <Card className="border-4 border-dashed border-foreground bg-background rounded-none neo-shadow p-6">
                      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="border-2 border-foreground bg-green-200 p-5 rounded-none neo-shadow-sm flex items-center justify-center mb-6">
                          <Users className="h-10 w-10 text-foreground" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Belum Ada Survei</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-8 max-w-md">
                          Anda belum membuat survei. Publikasikan survei pertama Anda di VERA!
                        </p>
                        <Button 
                          onClick={() => setIsCreateOpen(true)} 
                          className="border-2 border-foreground bg-green-300 hover:bg-green-400 text-foreground neo-shadow-sm hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-black text-xs uppercase tracking-wider px-5 py-3 rounded-none transition-all h-auto"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Buat Survei Baru
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                      {mySurveys.map((survey) => {
                        const progress = survey.target > 0 ? (survey.current / survey.target) * 100 : 0
                        return (
                          <Card key={survey.id} className="flex flex-col border-4 border-foreground rounded-none bg-card neo-shadow hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 h-full">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start mb-2.5">
                                <Badge variant="secondary" className="border-2 border-foreground bg-amber-200 text-amber-950 font-black rounded-none text-[9px] uppercase tracking-wider px-2 py-0.5 neo-shadow-sm">
                                  {survey.points} Poin/Resp
                                </Badge>
                                <span className="border-2 border-foreground bg-secondary px-3 py-1 font-black text-[10px] rounded-none neo-shadow-sm text-foreground">
                                  {Math.round(progress)}% Terisi
                                </span>
                              </div>
                              <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground leading-tight line-clamp-2">{survey.title}</CardTitle>
                              <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2.5">
                                Anda (sebagai {survey.author})
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4 flex-1">
                              <div className="mt-5 border-2 border-foreground bg-secondary h-3.5 rounded-none overflow-hidden neo-shadow-sm">
                                <div 
                                  className="bg-green-500 h-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1.5 text-right">{survey.current} / {survey.target} responden</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
          
        </div>
      </main>
    </div>
  )
}
