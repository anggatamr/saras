"use client"

import { Bell, Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MobileSidebar } from "./Sidebar"
import { generateResearchIntegrityReport, ResearchIntegrityData } from "@/lib/pdfGenerator"
import { generateWordReport } from "@/lib/wordGenerator"

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  
  const mockData: ResearchIntegrityData = {
    projectName: "Analisis Keputusan Pembelian Generasi Z",
    researcherName: "Angga (Statistika 2023)",
    institution: "Universitas Indonesia",
    ariaScore: 92,
    totalRows: 450,
    flaggedRows: 12,
    shapiroWilkPValue: 0.124,
    issues: ["Missing data in 'Income' (4 rows)", "Outlier detected in 'Age' (8 rows)"],
    sigmaSummary: "Berdasarkan analisis Regresi Linear Berganda, variabel X1 dan X2 memiliki pengaruh signifikan secara simultan terhadap Y (F-hitung = 45.2, p < 0.01).",
    nexusMismatchCount: 0,
    date: new Date().toLocaleDateString('id-ID')
  };

  const handleExportPDF = () => {
    generateResearchIntegrityReport(mockData);
  }

  const handleExportWord = () => {
    generateWordReport(mockData);
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <MobileSidebar />
      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        <h1 className="text-lg font-semibold md:text-xl truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="hidden lg:flex bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800" onClick={handleExportWord}>
          <FileText className="mr-2 h-4 w-4" />
          Word
        </Button>
        <Button variant="outline" size="sm" className="hidden md:flex bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>

        <div className="hidden md:flex items-center gap-2 text-sm ml-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            <span className="mr-1 flex h-2 w-2 rounded-full bg-green-500"></span>
            Online
          </Badge>
        </div>
        
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  )
}
