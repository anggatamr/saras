import { ResearchIntegrityData } from "./pdfGenerator";

export function generateWordReport(data: ResearchIntegrityData) {
  const isNormal = data.shapiroWilkPValue !== undefined && data.shapiroWilkPValue > 0.05 ? "Normal" : "Not Normal";
  const pValueText = data.shapiroWilkPValue !== undefined ? `p=${data.shapiroWilkPValue.toFixed(4)}` : "N/A";
  
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Research Integrity Report</title></head>
    <body style="font-family: Arial, sans-serif;">
      <h1 style="color: #14532d; text-align: center;">SARAS</h1>
      <h3 style="color: #666; text-align: center;">Sistem Asisten Riset Akademik Statistika</h3>
      <h2 style="text-align: center;">Research Integrity Report</h2>
      
      <table style="width: 100%; margin-bottom: 20px;">
        <tr><td><strong>Project Name:</strong></td><td>${data.projectName}</td></tr>
        <tr><td><strong>Researcher:</strong></td><td>${data.researcherName}</td></tr>
        <tr><td><strong>Institution:</strong></td><td>${data.institution}</td></tr>
        <tr><td><strong>Date Generated:</strong></td><td>${data.date}</td></tr>
      </table>

      <h3 style="color: #14532d;">1. ARIA: Data Integrity Analysis</h3>
      <ul>
        <li><strong>Integrity Score:</strong> ${data.ariaScore}/100</li>
        <li><strong>Total Records Analyzed:</strong> ${data.totalRows}</li>
        <li><strong>Anomalous Records:</strong> ${data.flaggedRows}</li>
        <li><strong>Shapiro-Wilk Normality Test:</strong> ${pValueText} (${isNormal})</li>
      </ul>
      <p><strong>Detected Issues:</strong></p>
      <ul>
        ${data.issues.length > 0 ? data.issues.map(i => `<li>${i}</li>`).join('') : '<li>None. Data is clean.</li>'}
      </ul>

      <h3 style="color: #14532d;">2. SIGMA: Statistical Consistency</h3>
      <p>${data.sigmaSummary}</p>

      <h3 style="color: #14532d;">3. NEXUS: Official Data Synchronization</h3>
      <p><strong>Status:</strong> ${data.nexusMismatchCount === 0 ? 'SYNCHRONIZED' : 'ATTENTION REQUIRED'}</p>
      <p>${data.nexusMismatchCount === 0 
        ? 'All secondary data matches official government (BPS) records.' 
        : `Found ${data.nexusMismatchCount} mismatches with official BPS records.`}</p>

      <br><hr>
      <p style="text-align: center; font-size: 10px; color: #999;">
        This document was generated automatically by the SARAS platform to verify research integrity.<br>
        Universitas/Institution committees can verify this report using the system.
      </p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SARAS_Integrity_Report_${data.researcherName.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
