"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle2, Award, Plus, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Surveys
const mockSurveys = [
  { id: 1, title: "Pengaruh Media Sosial terhadap Keputusan Pembelian Gen Z", author: "Budi Santoso", uni: "Universitas Negeri Medan", target: 100, current: 45, points: 30, tags: ["Manajemen", "Pemasaran"] },
  { id: 2, title: "Tingkat Stres Mahasiswa Tingkat Akhir Selama Penyusunan Skripsi", author: "Siti Aminah", uni: "Universitas Indonesia", target: 200, current: 180, points: 50, tags: ["Psikologi", "Kesehatan"] },
  { id: 3, title: "Adopsi AI dalam Proses Belajar Mahasiswa IT", author: "Reza Fahlevi", uni: "ITB", target: 150, current: 12, points: 40, tags: ["Informatika", "Pendidikan"] },
]

export default function VeraPage() {
  const [activeTab, setActiveTab] = useState("marketplace")

  return (
    <div className="flex h-full flex-col">
      <Topbar title="VERA - Verified Respondent Acquisition" subtitle="Marketplace survei akademik dengan responden terverifikasi email .ac.id." />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-6 rounded-xl">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-green-200 shadow-sm">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-green-950">Status Anda: Terverifikasi</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-white border-green-200 text-green-700">angga@unimed.ac.id</Badge>
                  <Badge variant="outline" className="bg-white border-green-200 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> .ac.id Verified</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-green-100 min-w-[150px]">
              <span className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider flex items-center"><Award className="w-4 h-4 mr-1 text-amber-500" /> Saldo Poin</span>
              <span className="text-3xl font-bold text-green-700">450</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                <TabsTrigger value="marketplace">Marketplace Survei</TabsTrigger>
                <TabsTrigger value="mysurveys">Survei Saya</TabsTrigger>
              </TabsList>
              
              {activeTab === "mysurveys" && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Buat Survei Baru
                </Button>
              )}
            </div>

            <TabsContent value="marketplace" className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari topik survei..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {mockSurveys.map((survey) => (
                  <Card key={survey.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                          +{survey.points} Poin
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          {Math.round((survey.current/survey.target)*100)}% Terisi
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">{survey.title}</CardTitle>
                      <CardDescription className="text-xs mt-2 line-clamp-1 flex flex-col gap-1">
                        <span className="font-medium text-foreground">{survey.author}</span>
                        <span>{survey.uni}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 flex-1">
                      <div className="flex flex-wrap gap-1">
                        {survey.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                      <div className="mt-4 bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 h-full" 
                          style={{ width: `${(survey.current/survey.target)*100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">{survey.current} / {survey.target} responden</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Isi Survei</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mysurveys">
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="rounded-full bg-green-50 p-4 mb-4">
                    <Users className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Belum Ada Survei</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Anda belum membuat survei. Gunakan saldo poin Anda (450 Poin) untuk mendapatkan responden terverifikasi.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> Buat Survei Baru
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
        </div>
      </main>
    </div>
  )
}
