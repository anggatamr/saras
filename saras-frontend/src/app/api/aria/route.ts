import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter(line => line.trim().length > 0);
    
    if (lines.length < 2) {
      return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 });
    }

    const headers = lines[0].split(",").map(h => h.trim());
    const records = lines.slice(1).map(line => line.split(",").map(cell => cell.trim()));

    // 1. Convert to numeric where possible
    const numericCols = headers.map((_, i) => {
      const colData = records.map(r => parseFloat(r[i]));
      const isNumeric = colData.every(val => !isNaN(val));
      return { index: i, isNumeric, data: isNumeric ? colData : [] };
    }).filter(c => c.isNumeric);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const issues: any[] = [];
    let penalty = 0;

    // 2. Z-Score outlier detection
    for (const col of numericCols) {
      const mean = col.data.reduce((a, b) => a + b, 0) / col.data.length;
      const stdDev = Math.sqrt(col.data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / col.data.length);
      
      if (stdDev === 0) continue;

      col.data.forEach((val, rowIdx) => {
        const z = Math.abs((val - mean) / stdDev);
        if (z > 3.0) {
          issues.push({
            row_index: rowIdx + 1,
            column: headers[col.index],
            type: "zscore",
            severity: z > 4.0 ? "high" : "medium",
            description: `Nilai ${val} terlalu ekstrem (Z-Score: ${z.toFixed(2)}). Rata-rata kolom ini adalah ${mean.toFixed(2)}.`,
            z_score: z
          });
          penalty += (z > 4.0 ? 15 : 5);
        }
      });
    }

    // 3. Duplicate detection
    const seen = new Map<string, number>();
    records.forEach((row, idx) => {
      const key = row.join("|");
      if (seen.has(key)) {
        issues.push({
          row_index: idx + 1,
          type: "duplicate",
          severity: "medium",
          description: `Duplikat identik dengan baris ${seen.get(key)! + 1}. Kemungkinan double entry.`
        });
        penalty += 5;
      } else {
        seen.set(key, idx);
      }
    });

    let score = 100 - penalty;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // 4. Dummy AI Narrative
    let ai_narrative = `Berdasarkan analisis file dataset dengan ${records.length} baris, Integrity Score yang diperoleh adalah ${score}/100. `;
    if (issues.length > 0) {
      ai_narrative += `Ditemukan ${issues.length} masalah yang memerlukan perhatian. Sebagian besar merupakan indikasi data pencilan ekstrem (outlier) dan duplikasi baris. `;
      ai_narrative += `Saran: Periksa kembali instrumen pengumpulan data pada baris yang ditandai merah. Jangan menghapus data secara sepihak; laporkan temuan ini di BAB IV sebagai batasan penelitian.`;
    } else {
      ai_narrative += `Data terlihat sangat natural tanpa indikasi fabrikasi atau duplikasi yang signifikan. Distribusi nilai berada dalam batas kewajaran statistik.`;
    }

    return NextResponse.json({
      score,
      total_rows: records.length,
      flagged_rows: new Set(issues.map(i => i.row_index)).size,
      issues: issues.sort((a, b) => a.row_index - b.row_index),
      ai_narrative
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
