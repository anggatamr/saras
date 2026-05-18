import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Type extension for jspdf-autotable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface jsPDFWithAutoTable extends jsPDF {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoTable: (options: any) => jsPDFWithAutoTable;
}

export interface ResearchIntegrityData {
  projectName: string;
  researcherName: string;
  institution: string;
  ariaScore: number;
  totalRows: number;
  flaggedRows: number;
  shapiroWilkPValue?: number;
  issues: string[];
  sigmaSummary: string;
  nexusMismatchCount: number;
  date: string;
}

export function generateResearchIntegrityReport(data: ResearchIntegrityData) {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(20, 83, 45); // Tailwind green-900
  doc.text('SARAS', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistem Asisten Riset Akademik Statistika', 14, 30);
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Research Integrity Report', 105, 45, { align: 'center' });
  
  // Metadata
  doc.setFontSize(11);
  doc.text(`Project Name: ${data.projectName}`, 14, 60);
  doc.text(`Researcher: ${data.researcherName}`, 14, 67);
  doc.text(`Institution: ${data.institution}`, 14, 74);
  doc.text(`Date Generated: ${data.date}`, 14, 81);
  doc.text(`Report ID: SARAS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, 14, 88);

  // ARIA Section
  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text('1. ARIA: Data Integrity Analysis', 14, 105);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Integrity Score: ${data.ariaScore}/100`, 14, 115);
  doc.text(`Total Records Analyzed: ${data.totalRows}`, 14, 122);
  doc.text(`Anomalous Records: ${data.flaggedRows}`, 14, 129);
  
  if (data.shapiroWilkPValue !== undefined) {
    const isNormal = data.shapiroWilkPValue > 0.05 ? "Normal" : "Not Normal";
    doc.text(`Shapiro-Wilk Normality Test: p=${data.shapiroWilkPValue.toFixed(4)} (${isNormal})`, 14, 136);
  }

  if (data.issues.length > 0) {
    doc.text('Detected Issues:', 14, 146);
    data.issues.forEach((issue, index) => {
      doc.setFontSize(10);
      doc.text(`- ${issue}`, 20, 153 + (index * 6));
    });
  } else {
    doc.text('Detected Issues: None. Data is clean.', 14, 146);
  }

  // SIGMA Section
  const nextY = data.issues.length > 0 ? 153 + (data.issues.length * 6) + 15 : 160;
  
  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text('2. SIGMA: Statistical Consistency', 14, nextY);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const splitSigma = doc.splitTextToSize(data.sigmaSummary, 180);
  doc.text(splitSigma, 14, nextY + 10);
  
  // NEXUS Section
  const finalY = nextY + 10 + (splitSigma.length * 5) + 15;
  
  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text('3. NEXUS: Official Data Synchronization', 14, finalY);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  if (data.nexusMismatchCount === 0) {
    doc.text('Status: SYNCHRONIZED', 14, finalY + 10);
    doc.text('All secondary data matches official government (BPS) records.', 14, finalY + 17);
  } else {
    doc.text('Status: ATTENTION REQUIRED', 14, finalY + 10);
    doc.text(`Found ${data.nexusMismatchCount} mismatches with official BPS records.`, 14, finalY + 17);
  }

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This document was generated automatically by the SARAS platform to verify research integrity.', 105, 280, { align: 'center' });
  doc.text('Universitas/Institution committees can verify this report using the Report ID.', 105, 284, { align: 'center' });

  // Save the PDF
  doc.save(`SARAS_Integrity_Report_${data.researcherName.replace(/\s+/g, '_')}.pdf`);
}
