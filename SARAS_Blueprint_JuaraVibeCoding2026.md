# SARAS — Blueprint Kompetisi #JuaraVibeCoding 2026
### *Sistem Asisten Riset Akademik Statistika*
> **AI-Powered Research Integrity & Analytics Platform for Indonesian Academia**
> Dikembangkan oleh: **Angga** · NIM 4232560004 · Statistika Semester VI · Universitas Negeri Medan

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Ruang Masalah](#2-ruang-masalah)
3. [Identitas & Branding](#3-identitas--branding)
4. [Arsitektur Solusi — 5 Modul Inti](#4-arsitektur-solusi--5-modul-inti)
5. [Tech Stack Internasional](#5-tech-stack-internasional)
6. [UI/UX Design System](#6-uiux-design-system)
7. [Arsitektur Backend — Go (Golang)](#7-arsitektur-backend--go-golang)
8. [Firebase — Skema & Konfigurasi](#8-firebase--skema--konfigurasi)
9. [Google Cloud Run — Rencana Deployment](#9-google-cloud-run--rencana-deployment)
10. [Roadmap Pengembangan 28 Hari](#10-roadmap-pengembangan-28-hari)
11. [7 Faktor WOW](#11-7-faktor-wow)
12. [Strategi Kompetisi](#12-strategi-kompetisi)
13. [Etika AI & Keberlanjutan](#13-etika-ai--keberlanjutan)

---

## 1. Executive Summary

**SARAS** adalah platform riset akademik berbasis AI pertama di Indonesia yang menyatukan lima kapabilitas kritis dalam satu antarmuka tunggal: audit integritas data real-time, konektivitas data nasional BPS, verifikasi responden akademik, interpretasi statistik generatif, dan pemetaan literatur ilmiah.

**Momen WOW dalam 8 detik:**
Upload CSV skripsi → SARAS menghasilkan **Integrity Score 87/100** + heatmap forensik baris mencurigakan + perbandingan otomatis data BPS terbaru + narasi interpretasi dalam Bahasa Indonesia akademis.

| Dimensi | Target | Dasar |
|---|---|---|
| Skor Masalah (30%) | **29–30 / 30** | 4 data statistik nasional terverifikasi |
| Skor Solusi (40%) | **38–40 / 40** | 5 modul AI + Go backend + Firebase + Cloud Run |
| Skor Keunikan (30%) | **28–30 / 30** | BPS-Link + Integrity Score: pertama di Indonesia |
| **Total Target** | **Top 20** | Tier 2: The Elite Architect |

---

## 2. Ruang Masalah

### 2.1 Krisis Akademik Mahasiswa Indonesia

| Masalah | Data | Sumber |
|---|---|---|
| Manipulasi data skripsi | **45%** mahasiswa pernah melakukan ini | Survei Primer 2025 |
| Kesulitan analisis statistik | **61.54%** tidak bisa aplikasikan teori | Survei Primer 2025 |
| Kesulitan menulis karya ilmiah | **66.67%** tidak bisa menuangkan ide | Survei Primer 2025 |
| Tidak bisa operasikan SPSS/R | **43.49%** bergantung pada joki data | Survei Primer 2025 |
| Kesulitan mencari responden | **70%** sulit mencapai target sampel | Survei Primer 2025 |
| Responden tidak sesuai kriteria | **33%** data bias karena masalah ini | Survei Primer 2025 |

### 2.2 Akar Masalah (5 Whys Framework)

```
Masalah permukaan: Mahasiswa manipulasi data
  → Why? Tidak tahu cara menangani data outlier dengan benar
    → Why? Tidak ada alat yang memberikan panduan statistik kontekstual
      → Why? Tools yang ada (SPSS, R) tidak ramah pemula Indonesia
        → Why? Ekosistem riset akademik Indonesia tidak terintegrasi
          → ROOT CAUSE: Tidak ada platform yang menemani mahasiswa
            dari pengumpulan data → analisis → interpretasi dalam
            satu alur terpadu dengan panduan AI berbahasa Indonesia
```

### 2.3 Analisis Kompetitor

| Platform | Kelebihan | Gap Kritis | SARAS vs Mereka |
|---|---|---|---|
| GipsyAI | Fitur luas | Tidak ada audit integritas aktif | SARAS: Real-time integrity detection |
| Kudata.id | Survey platform lokal | Nol AI analysis | SARAS: Generative AI interpretation |
| Google Forms | Familiar & gratis | Zero intelligence, no validation | SARAS: Smart screener + .ac.id gating |
| SPSS | Industry standard | Mahal, kompleks, tidak ada AI guide | SARAS: Conversational stats AI |
| ChatGPT/Claude | Bisa bantu interpretasi | Tidak punya data BPS, no file analysis | SARAS: BPS-linked + CSV forensics |

---

## 3. Identitas & Branding

### Nama & Filosofi

```
S — Sistem
A — Asisten
R — Riset
A — Akademik
S — Statistika

+ SARAS = kata dalam Bahasa Indonesia yang berarti
  "sadar, jernih, dan kembali ke kebenaran"
  — filosofi yang sempurna untuk platform integritas data.
```

### Tagline Options
- **Utama:** *"Riset yang jujur, dimulai dari data yang benar."*
- **Tech:** *"AI-powered research integrity for Indonesian academia."*
- **Kompetisi:** *"Bukan untuk membersihkan data. Untuk memahaminya."*

### Palette Warna — Warm Minimal (Apple × Google Spirit)

```
Background    : #FAFAF7  — Warm White (bukan dingin seperti #FFFFFF murni)
Surface       : #FFFFFF  — Card & Panel
Surface-2     : #F5F4F0  — Subtle section bg
Surface-3     : #EDECE8  — Input bg / hover
Border        : #E4E1DC  — Default border
Border Strong : #D1CEC8  — Emphasized border

Text Primary  : #1C1917  — Near black, warm tone (bukan hitam dingin)
Text Secondary: #6B6560  — Warm gray
Text Tertiary : #A09891  — Hints & placeholders

Accent        : #C95E0A  — Warm orange-amber (primary brand color)
Accent Hover  : #A84D08  — Darker on hover
Accent BG     : #FFF4EC  — Tinted surface for accent areas
Accent Border : #FCD9BB  — Subtle accent border

Amber         : #B45309  — Warning / secondary emphasis
Green         : #15803D  — Success / integrity indicator
Red           : #B91C1C  — Error / critical alert
Blue          : #1D4ED8  — Info / data link
Purple        : #6D28D9  — AI-generated content indicator
```

> **Filosofi Warna:** Tidak ada gradien, tidak ada glassmorphism, tidak ada neon.
> Semua permukaan datar dan bersih — seperti produk Apple / Linear.app / Notion.
> Warna hangat (#FAFAF7 bukan #F9FAFB) memberikan kesan ramah, organik, dan terpercaya.

### Typography

```
Font Stack   : -apple-system, BlinkMacSystemFont, 'SF Pro Display',
               'Segoe UI', system-ui, sans-serif
               → Menggunakan font sistem agar rendering optimal di semua device

Heading XL   : 32px / weight 700 / letter-spacing -0.03em
Heading L    : 24px / weight 700 / letter-spacing -0.025em
Heading M    : 18px / weight 600 / letter-spacing -0.02em
Body         : 14px / weight 400 / line-height 1.7
Small        : 12px / weight 500 (labels, badges)
Mono         : 'SF Mono', 'Fira Code', monospace (kode & data numerik)
```

---

## 4. Arsitektur Solusi — 5 Modul Inti

### Modul 1: ARIA — AI Research Integrity Auditor

**WOW Moment:** Upload CSV → 8 detik → Integrity Score + forensic heatmap + penjelasan AI tiap baris

#### Algoritma Deteksi (berlapis)

```
Layer 1 — Univariate Outlier
  • Z-Score: flag baris dengan |z| > 3.0
  • IQR Method: flag nilai di luar [Q1 − 1.5×IQR, Q3 + 1.5×IQR]

Layer 2 — Multivariate Outlier
  • Mahalanobis Distance: flag jika D² > χ²(α=0.001, df=p)
  • Isolation Forest: deteksi anomali non-linear

Layer 3 — Fabrication Detection
  • Benford's Law: analisis distribusi digit pertama
    (data asli mengikuti P(d) = log₁₀(1 + 1/d))
  • Duplicate Scanner: exact match + fuzzy match (Levenshtein ≥ 95%)
  • Response Set Detector: variance per-row < threshold

Layer 4 — Temporal Consistency
  • Timestamp gap analysis (kuesioner online)
  • Speed detection: completion time < 30 detik = suspect

Layer 5 — AI Synthesis (Gemini 1.5 Pro)
  • Aggregate semua flags → hasilkan penjelasan naratif per baris
  • Generate rekomendasi perbaikan yang etis
  • Output: Integrity Score (0–100) + breakdown per dimensi
```

#### Integrity Score Formula

```
Integrity Score = 100 − (
  (jumlah_baris_kritis × 15) +
  (jumlah_baris_warning × 5) +
  (benford_deviation_score × 10) +
  (duplicate_ratio × 20)
)
min(score, 0) → 0, max(score, 100) → 100
```

#### Output yang Ditampilkan ke User

- **Visual:** Animated radial gauge 0→score, color-coded (green/amber/red)
- **Heatmap:** Tabel data dengan row highlighting: hijau / kuning / merah
- **Detail Panel:** Klik baris → penjelasan statistik + saran perbaikan etis
- **AI Narrative:** Paragraf interpretasi integritas data dalam BI akademis
- **PDF Report:** Laporan lengkap yang bisa dilampirkan ke skripsi sebagai bukti validitas

---

### Modul 2: NEXUS — National Data Intelligence Hub

**WOW Moment:** AI proaktif: *"Data inflasi Anda (7.2%) berbeda 2.3% dari BPS terbaru (4.9%). Kutipan resmi sudah disiapkan."*

#### Sumber Data Terhubung

```
BPS WebAPI v2       → 160+ indikator: inflasi, kemiskinan, PDRB, IPM,
                      pengangguran, per provinsi per tahun
                      package: stadata (Python) atau go-bps (Go custom)

Data.go.id          → Dataset lintas kementerian (Kemendikbud, Kemenkes, dll)
                      via REST API publik

World Bank Open API → Perbandingan Indonesia vs ASEAN
                      endpoint: api.worldbank.org/v2/country/ID/indicator/...

Crossref API        → 100M+ metadata paper & DOI
                      endpoint: api.crossref.org/works

SINTA API           → Jurnal & artikel terindeks Kemenristekdikti Indonesia
```

#### Fitur Unggulan NEXUS

```
1. BPS Mismatch Alert
   → Bandingkan kolom dataset user vs data BPS terkait
   → Threshold: selisih > 5% → tampilkan alert proaktif
   → Sertakan link ke tabel BPS resmi sebagai referensi

2. Auto-Cite Generator
   → Pilih indikator BPS → generate kutipan APA 7th / IEEE / Chicago
   → Contoh output:
     BPS. (2024). Indikator Kemiskinan Provinsi Sumatera Utara.
     Badan Pusat Statistik. https://sumut.bps.go.id/indicator/23/...

3. Provincial Map Visualization
   → Peta Indonesia interaktif (SVG choropleth)
   → Warna sesuai intensitas indikator per provinsi
   → Library: d3-geo + topojson Indonesia

4. Trend Chart
   → Data primer user vs tren BPS 5 tahun terakhir
   → Satu grafik: dua line chart yang mudah dibandingkan
```

---

### Modul 3: VERA — Verified Respondent Acquisition System

**WOW Moment:** Email .ac.id verification + AI screener → validitas responden naik dari 67% (Forms biasa) ke 94%

#### Sistem Verifikasi 5 Layer

```
Layer 1 — Identity Gate
  • Wajib email institusi (.ac.id, .edu)
  • OTP verification via email
  • Blocker: gmail/yahoo tidak diterima tanpa upgrade manual

Layer 2 — Profile Consistency AI
  • Gemini menganalisis 12 dimensi profil:
    (NIM, semester, prodi, universitas, kota, dll)
  • Deteksi: inconsistency antara klaim vs data yang diisi

Layer 3 — Behavior Analysis
  • Honeypot fields: field tersembunyi yang bot akan isi
  • Click pattern analysis: human vs bot
  • Minimum fill time per pertanyaan

Layer 4 — Stratified Sampling Engine
  • Tentukan target: "100 mhs ekonomi, 60% perempuan, Sumut"
  • VERA otomatis filter & invite respondent yang match
  • Random stratified selection untuk representativeness

Layer 5 — Geo-targeting
  • Target responden berdasarkan provinsi/kota
  • Integrasi dengan database universitas aktif BAN-PT
```

#### Respondent Marketplace

```
Sistem poin (gamifikasi etis):
  • Isi survei orang lain  → +poin
  • Poin digunakan untuk   → mendistribusikan survei sendiri

Exchange rate contoh:
  • Survei 10 pertanyaan  = 30 poin untuk isi
  • Survei 30 pertanyaan  = 80 poin untuk isi
  • Distribusi ke 50 org  = 400 poin

Fitur tambahan:
  • Progress tracker real-time (Firebase onSnapshot)
  • Power analysis calculator:
    n = (Z_α/2 + Z_β)² × (σ₁² + σ₂²) / δ²
  • QR Code shareable link per survei
  • Survey template library (Likert, semantic diff, dll)
```

---

### Modul 4: SIGMA — Statistical Intelligence Engine

**WOW Moment:** Upload data → SIGMA pilih uji statistik yang tepat otomatis → jalankan → tulis paragraf interpretasi BAB IV

#### Decision Tree Pemilihan Uji Otomatis

```
INPUT: jenis data + jumlah kelompok + tujuan + distribusi

→ 1 variabel, numerik, normalitas OK       → One-sample t-test
→ 2 kelompok independen, normal            → Independent t-test
→ 2 kelompok independen, tidak normal      → Mann-Whitney U
→ 3+ kelompok, normal, varian homogen      → One-way ANOVA
→ 3+ kelompok, tidak normal                → Kruskal-Wallis
→ 2 variabel numerik, linear               → Pearson correlation
→ 2 variabel ordinal                       → Spearman correlation
→ Prediksi 1 DV numerik dari banyak IV     → Multiple Linear Regression
→ DV binary                                → Logistic Regression
→ DV ordinal (Likert)                      → Ordinal Logistic Regression
→ Banyak variabel, reduksi dimensi         → PCA / Factor Analysis
→ Segmentasi tanpa label                   → K-Means Clustering
→ Struktur kausal, laten                   → SEM (Structural Equation Model)
→ Data time series                         → ARIMA / Holt-Winters
```

#### Uji Asumsi Otomatis

```
Sebelum regresi dijalankan, SIGMA otomatis:
  1. Normalitas     : Shapiro-Wilk (n<50) / Kolmogorov-Smirnov (n≥50)
  2. Homoskedastisitas: Breusch-Pagan test
  3. Multikolinearitas: VIF < 10 untuk setiap prediktor
  4. Autokorelasi   : Durbin-Watson test (1.5 < DW < 2.5)
  5. Linearitas     : Scatter plot residual vs fitted

Jika asumsi dilanggar → SIGMA merekomendasikan:
  • Transformasi data (log, sqrt, Box-Cox)
  • Alternatif uji non-parametrik
  • Robust regression sebagai solusi
```

#### Narrative AI — Anti-Hallucination Layer

```
System Prompt (dikirim ke Gemini):

"Anda adalah asisten interpretasi statistik akademis untuk mahasiswa
Indonesia. ATURAN WAJIB:
1. Tulis dalam Bahasa Indonesia formal akademis (EYD V)
2. SELALU cantumkan nilai statistik dari output: (t=X, p=Y, B=Z)
3. Setiap klaim teoritis WAJIB disertai referensi ilmiah
   contoh: (Hair et al., 2019; Ghozali, 2021)
4. JANGAN buat klaim yang tidak didukung output numerik
5. Akhiri dengan kalimat keterbatasan penelitian
6. Panjang: 3–4 paragraf, ≤350 kata

Output HANYA narasi. Tanpa preamble, tanpa penjelasan."
```

---

### Modul 5: ATLAS — Academic Literature & Source Intelligence

**WOW Moment:** Ketik topik → ATLAS memetakan Research Gap dalam bubble chart visual: topik jenuh (bubble besar) vs opportunity (bubble kecil)

#### Multi-Database Search Pipeline

```
Query user → paralel search ke:
  1. SINTA (Kemenristekdikti Indonesia)   → jurnal nasional terindeks
  2. Crossref                             → 100M+ paper global
  3. Semantic Scholar                     → AI-indexed papers
  4. Google Scholar (scraping etis)       → coverage terluas

Deduplikasi → ranking berdasarkan:
  • Relevance score (BM25 + semantic similarity)
  • Citation count (h-index awareness)
  • Recency (bobot tahun terbaru lebih tinggi)
  • Indonesia relevance (bobot paper lokal untuk konteks)
```

#### Research Gap Mapper

```
Algorithm:
  1. Extract topik dari 50 paper teratas
  2. Cluster topik menggunakan LDA (Latent Dirichlet Allocation)
  3. Hitung frekuensi per cluster → ukuran bubble
  4. Visualisasi: D3.js bubble chart interaktif

Output:
  • Bubble besar + gelap  = topik sangat jenuh, banyak paper
  • Bubble kecil + terang = research gap = peluang novelty
  • Klik bubble           = lihat daftar paper relevan

User benefit:
  "Lihat secara visual di mana posisi skripsi Anda berdiri
   di antara lanskap penelitian yang sudah ada."
```

#### Auto-Bibliography Generator

```
Input : DOI / judul paper
Output: format APA 7th, IEEE, Vancouver, Chicago

Contoh output APA 7th:
  Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2019).
  Multivariate Data Analysis (8th ed.). Cengage Learning.

Contoh output IEEE:
  [1] J. F. Hair, W. C. Black, B. J. Babin, and R. E. Anderson,
  Multivariate Data Analysis, 8th ed. Mason, OH: Cengage, 2019.

Plagiarism Pre-check:
  • Similarity check ringan sebelum submit ke Turnitin
  • Highlight kalimat yang terlalu mirip dengan sumber → sarankan parafrase
```

---

## 5. Tech Stack Internasional

### Gambaran Umum Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS   │
│  shadcn/ui · Recharts · D3.js · React Query · Zustand  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│              API GATEWAY LAYER                          │
│         Google Cloud Endpoints + Cloud Armor            │
│           Rate Limiting · Auth · DDoS Protection        │
└───────┬──────────────────────────┬──────────────────────┘
        │ REST JSON                │ Firebase SDK (direct)
┌───────▼──────────────┐  ┌───────▼──────────────────────┐
│   GO BACKEND         │  │   FIREBASE / GOOGLE SERVICES  │
│   (Cloud Run)        │  │                               │
│                      │  │  Firestore  — database        │
│  Gin Framework       │  │  Auth       — .ac.id gating   │
│  ARIA Engine         │  │  Storage    — file uploads    │
│  NEXUS BPS Client    │  │  Functions  — triggers        │
│  SIGMA Stats Engine  │  │  Hosting    — static assets   │
│  ATLAS Search        │  │  AI Studio  — Gemini API      │
└───────┬──────────────┘  └──────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────┐
│              EXTERNAL DATA SOURCES                       │
│  BPS WebAPI · Data.go.id · World Bank API               │
│  Crossref API · Semantic Scholar · SINTA                 │
└──────────────────────────────────────────────────────────┘
```

### Frontend Stack

```yaml
Framework     : Next.js 14 (App Router, Server Components)
Language      : TypeScript 5.x (strict mode)
Styling       : Tailwind CSS 3.4 + CSS Variables
Components    : shadcn/ui (Radix UI primitives)
State         : Zustand (client) + React Query / TanStack (server)
Charts        : Recharts + D3.js (custom visualizations)
Maps          : react-simple-maps + topojson-indonesia
Forms         : React Hook Form + Zod validation
Real-time     : Firebase SDK onSnapshot
Animations    : Framer Motion (subtle, purposeful)
Testing       : Jest + React Testing Library + Playwright (E2E)
i18n          : next-intl (Bahasa Indonesia, English, regional)
Accessibility : Radix UI ARIA + manual audit (WCAG 2.1 AA)
```

### Backend Stack (Go)

```yaml
Language      : Go 1.22 (latest stable)
Framework     : Gin v1.9 (HTTP router + middleware)
Stats Engine  : gonum/stat + gonum/floats
CSV Parsing   : encoding/csv (stdlib) + go-csv
AI Client     : google-generativeai-go (Gemini SDK)
BPS Client    : custom HTTP client (net/http)
Firebase Admin: firebase.google.com/go/v4
Auth          : golang-jwt/jwt + Firebase Auth verify
Validation    : go-playground/validator
Logging       : zap (Uber's structured logger)
Testing       : testing (stdlib) + testify
Containerize  : Docker (distroless base image)
Deploy        : Google Cloud Run (auto-scaling)
```

---

## 6. UI/UX Design System

### Komponen Utama

```
NAVBAR (Sidebar vertikal — Apple Mac App style)
├── Logo SARAS (32×32 rounded, accent color)
├── Navigation groups:
│   ├── [MAIN]    Dashboard
│   ├── [MODULES] ARIA · NEXUS · VERA · SIGMA · ATLAS
│   └── [DEV]     Go Backend · Cloud Run
└── User profile (avatar initials + email + settings)

TOPBAR (per halaman)
├── Page title + subtitle
├── Status badges (Firebase: Connected, Cloud Run: Active)
└── Notification bell

CARD SYSTEM
├── card-default   : bg white, 1px border, radius 14px, shadow-sm
├── card-elevated  : +shadow md
├── card-accent    : bg accent-bg, border accent-border
└── card-danger    : bg red-bg, border red-border

BUTTON SYSTEM
├── btn-primary    : bg accent, white text, radius 10px
├── btn-secondary  : bg white, border, text dark
└── btn-ghost      : transparent, hover surface-3

BADGE SYSTEM (pill shape)
├── badge-orange   : accent brand
├── badge-green    : success / verified
├── badge-red      : critical / error
├── badge-amber    : warning / review
├── badge-blue     : info / data
└── badge-purple   : AI-generated content

INPUT SYSTEM
├── input-field    : border 1px, radius 10px, focus: accent ring 3px
├── select         : consistent dengan input-field
└── checkbox       : accent-color styling
```

### Spacing & Layout

```
Spacing unit  : 4px base
Scale         : 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64
Content width : max 1100px (dashboard), max 800px (forms)
Sidebar width : 220px (fixed)
Topbar height : 56px (sticky)
Grid gaps     : 12px (tight) · 16px (default) · 24px (section)
Border radius : 6px (sm) · 10px (default) · 14px (lg) · 20px (xl)
```

### Interaction Principles

```
1. ZERO SURPRISE   — Setiap interaksi konsisten dan predictable
2. PROGRESSIVE     — Loading states untuk semua async operations
3. FORGIVING       — Undo tersedia untuk aksi destructive
4. INFORMATIVE     — Error messages menjelaskan "apa" dan "bagaimana fix"
5. FAST FEEDBACK   — Response visual < 100ms untuk setiap interaksi
6. ACCESSIBILITY   — Semua komponen keyboard-navigable + screen reader
```

### Micro-interactions

```
Integrity Score gauge  → animasi counter dari 0 ke nilai final (800ms ease)
Heatmap rows           → highlight muncul row by row (stagger 50ms)
BPS Alert              → slide-in dari kanan (300ms ease-out)
AI "thinking"          → shimmer skeleton loading
Score ≥ 90             → konfetti burst (gamifikasi integritas)
Upload drag            → border jadi accent color + bg tint
```

---

## 7. Arsitektur Backend — Go (Golang)

### Struktur Project

```
saras-backend/
├── cmd/
│   └── server/
│       └── main.go              # Entry point
├── internal/
│   ├── api/
│   │   ├── router.go            # Gin router + middleware setup
│   │   ├── middleware/
│   │   │   ├── auth.go          # Firebase token verification
│   │   │   ├── ratelimit.go     # Per-user rate limiting
│   │   │   └── cors.go          # CORS config
│   │   └── handlers/
│   │       ├── aria.go          # ARIA integrity analysis
│   │       ├── nexus.go         # BPS data proxy
│   │       ├── sigma.go         # Statistical computation
│   │       └── atlas.go         # Literature search
│   ├── aria/
│   │   ├── engine.go            # Core integrity engine
│   │   ├── zscore.go            # Z-score outlier detection
│   │   ├── mahalanobis.go       # Multivariate outlier
│   │   ├── benford.go           # Benford's law analysis
│   │   └── duplicate.go        # Duplicate detection
│   ├── nexus/
│   │   ├── bps_client.go        # BPS WebAPI client
│   │   └── mismatch.go          # Mismatch detection logic
│   ├── sigma/
│   │   ├── selector.go          # Auto test selection
│   │   ├── regression.go        # Linear & logistic regression
│   │   ├── ttest.go             # T-test implementations
│   │   └── assumptions.go       # Normality, homoscedasticity
│   ├── gemini/
│   │   └── client.go            # Gemini API wrapper + prompts
│   └── firebase/
│       └── admin.go             # Firebase Admin SDK init
├── pkg/
│   ├── csv/
│   │   └── parser.go            # CSV parsing utilities
│   └── stats/
│       └── utils.go             # Statistical helper functions
├── Dockerfile                   # Multi-stage build
├── .dockerignore
├── go.mod
└── go.sum
```

### main.go

```go
package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/angga/saras-backend/internal/api"
    "github.com/angga/saras-backend/internal/firebase"
    "go.uber.org/zap"
)

func main() {
    // ── Logger ─────────────────────────────────────────
    logger, _ := zap.NewProduction()
    defer logger.Sync()

    // ── Firebase Admin Init ────────────────────────────
    fbApp, err := firebase.InitApp(os.Getenv("GOOGLE_CLOUD_PROJECT"))
    if err != nil {
        logger.Fatal("firebase init failed", zap.Error(err))
    }

    // ── Router ─────────────────────────────────────────
    router := api.NewRouter(fbApp, logger)

    // ── Server ─────────────────────────────────────────
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    srv := &http.Server{
        Addr:         ":" + port,
        Handler:      router,
        ReadTimeout:  30 * time.Second,
        WriteTimeout: 60 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    // ── Graceful Shutdown ──────────────────────────────
    go func() {
        logger.Info("SARAS API started", zap.String("port", port))
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatal("server failed", zap.Error(err))
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    logger.Info("shutting down gracefully...")
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    srv.Shutdown(ctx)
}
```

### router.go

```go
package api

import (
    "github.com/gin-gonic/gin"
    "github.com/angga/saras-backend/internal/api/handlers"
    "github.com/angga/saras-backend/internal/api/middleware"
)

func NewRouter(fbApp *firebase.App, logger *zap.Logger) *gin.Engine {
    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(middleware.Logger(logger))
    r.Use(middleware.CORS())

    // ── Public ──────────────────────────────────────────
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok", "service": "saras-api"})
    })

    // ── Protected (Firebase Auth required) ─────────────
    api := r.Group("/api/v1")
    api.Use(middleware.FirebaseAuth(fbApp))
    api.Use(middleware.RateLimit(100)) // 100 req/hour per user

    // ARIA — Integrity Analysis
    ariaH := handlers.NewARIAHandler(fbApp, logger)
    api.POST("/aria/analyze",   ariaH.AnalyzeCSV)
    api.GET( "/aria/reports",   ariaH.GetUserReports)
    api.GET( "/aria/report/:id", ariaH.GetReport)

    // NEXUS — BPS Data
    nexusH := handlers.NewNEXUSHandler(logger)
    api.GET("/nexus/indicators",        nexusH.GetIndicators)
    api.GET("/nexus/province/:code",    nexusH.GetProvinceData)
    api.POST("/nexus/compare",          nexusH.CompareWithBPS)

    // VERA — Respondent
    veraH := handlers.NewVERAHandler(fbApp, logger)
    api.POST("/vera/surveys",           veraH.CreateSurvey)
    api.GET( "/vera/surveys/active",    veraH.GetActiveSurveys)
    api.POST("/vera/surveys/:id/submit", veraH.SubmitResponse)

    // SIGMA — Statistical Analysis
    sigmaH := handlers.NewSIGMAHandler(logger)
    api.POST("/sigma/recommend",        sigmaH.RecommendTest)
    api.POST("/sigma/regression",       sigmaH.RunRegression)
    api.POST("/sigma/ttest",            sigmaH.RunTTest)
    api.POST("/sigma/narrative",        sigmaH.GenerateNarrative)

    // ATLAS — Literature
    atlasH := handlers.NewATLASHandler(logger)
    api.GET( "/atlas/search",           atlasH.SearchLiterature)
    api.GET( "/atlas/gap-map",          atlasH.GetGapMap)
    api.POST("/atlas/cite",             atlasH.GenerateCitation)

    return r
}
```

### aria/engine.go (Integrity Engine Core)

```go
package aria

import (
    "encoding/csv"
    "io"
    "math"
    "sort"
    "strconv"
)

type IntegrityResult struct {
    Score       int           `json:"score"`
    TotalRows   int           `json:"total_rows"`
    FlaggedRows int           `json:"flagged_rows"`
    Issues      []RowIssue    `json:"issues"`
    Breakdown   ScoreBreakdown `json:"breakdown"`
}

type RowIssue struct {
    RowIndex    int     `json:"row_index"`
    Column      string  `json:"column,omitempty"`
    Type        string  `json:"type"` // "zscore"|"mahalanobis"|"benford"|"duplicate"|"pattern"
    Severity    string  `json:"severity"` // "low"|"medium"|"high"
    Description string  `json:"description"`
    ZScore      float64 `json:"z_score,omitempty"`
}

type ScoreBreakdown struct {
    OutlierPenalty   int `json:"outlier_penalty"`
    DuplicatePenalty int `json:"duplicate_penalty"`
    BenfordPenalty   int `json:"benford_penalty"`
    PatternPenalty   int `json:"pattern_penalty"`
}

// AnalyzeCSV adalah entry point utama ARIA engine
func AnalyzeCSV(r io.Reader) (*IntegrityResult, error) {
    records, headers, err := parseCSV(r)
    if err != nil {
        return nil, err
    }

    var issues []RowIssue

    // Layer 1: Z-Score per numeric column
    for colIdx, header := range headers {
        values := extractNumericColumn(records, colIdx)
        if len(values) == 0 {
            continue
        }
        mean, std := meanStd(values)
        if std == 0 {
            continue
        }
        for rowIdx, v := range values {
            z := math.Abs((v - mean) / std)
            if z > 3.0 {
                issues = append(issues, RowIssue{
                    RowIndex: rowIdx + 1,
                    Column:   header,
                    Type:     "zscore",
                    Severity: severityFromZ(z),
                    ZScore:   z,
                    Description: formatZScoreDescription(header, v, mean, std, z),
                })
            }
        }
    }

    // Layer 2: Benford's Law on first numeric column
    if len(headers) > 0 {
        firstCol := extractNumericColumn(records, 0)
        benfordPenalty := checkBenfordsLaw(firstCol)
        if benfordPenalty > 15 {
            issues = append(issues, RowIssue{
                Type: "benford",
                Severity: "high",
                Description: "Distribusi digit pertama menyimpang dari Hukum Benford — indikasi data tidak natural.",
            })
        }
    }

    // Layer 3: Exact duplicate detection
    seen := map[string]int{}
    for rowIdx, record := range records {
        key := joinRow(record)
        if prevIdx, exists := seen[key]; exists {
            issues = append(issues, RowIssue{
                RowIndex: rowIdx + 1,
                Type:     "duplicate",
                Severity: "medium",
                Description: fmt.Sprintf("Duplikat identik dengan baris %d. Kemungkinan double entry.", prevIdx+1),
            })
        } else {
            seen[key] = rowIdx
        }
    }

    // Hitung Integrity Score
    score := calculateScore(issues, len(records))

    return &IntegrityResult{
        Score:       score,
        TotalRows:   len(records),
        FlaggedRows: countFlagged(issues),
        Issues:      issues,
    }, nil
}

func calculateScore(issues []RowIssue, total int) int {
    penalty := 0
    for _, issue := range issues {
        switch issue.Severity {
        case "high":   penalty += 15
        case "medium": penalty += 5
        case "low":    penalty += 2
        }
    }
    score := 100 - penalty
    if score < 0 { return 0 }
    if score > 100 { return 100 }
    return score
}

func meanStd(vals []float64) (float64, float64) {
    n := float64(len(vals))
    var sum float64
    for _, v := range vals { sum += v }
    mean := sum / n
    var variance float64
    for _, v := range vals {
        diff := v - mean
        variance += diff * diff
    }
    return mean, math.Sqrt(variance / n)
}
```

### sigma/regression.go

```go
package sigma

import (
    "gonum.org/v1/gonum/mat"
    "gonum.org/v1/gonum/stat"
    "math"
)

type RegressionResult struct {
    Coefficients []Coefficient `json:"coefficients"`
    RSquared     float64       `json:"r_squared"`
    AdjRSquared  float64       `json:"adj_r_squared"`
    FStatistic   float64       `json:"f_statistic"`
    FPValue      float64       `json:"f_p_value"`
    Assumptions  Assumptions   `json:"assumptions"`
}

type Coefficient struct {
    Variable string  `json:"variable"`
    B        float64 `json:"b"`
    StdError float64 `json:"std_error"`
    T        float64 `json:"t"`
    PValue   float64 `json:"p_value"`
    Sig      string  `json:"sig"` // "***" "**" "*" "ns"
}

type Assumptions struct {
    NormalityPassed         bool    `json:"normality_passed"`
    ShapiroWilkP            float64 `json:"shapiro_wilk_p"`
    HomoscedasticityPassed  bool    `json:"homoscedasticity_passed"`
    BPTestP                 float64 `json:"bp_test_p"`
    DurbinWatson            float64 `json:"durbin_watson"`
    MaxVIF                  float64 `json:"max_vif"`
    MulticollinearityPassed bool    `json:"multicollinearity_passed"`
}

// RunMultipleLinearRegression menggunakan Ordinary Least Squares
// Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε
func RunMultipleLinearRegression(X [][]float64, Y []float64, varNames []string) (*RegressionResult, error) {
    n := len(Y)
    k := len(X[0]) // jumlah prediktor

    // Build design matrix [1 | X₁ | X₂ | ... | Xₖ]
    Xmat := mat.NewDense(n, k+1, nil)
    for i := 0; i < n; i++ {
        Xmat.Set(i, 0, 1.0) // intercept
        for j := 0; j < k; j++ {
            Xmat.Set(i, j+1, X[i][j])
        }
    }
    Yvec := mat.NewVecDense(n, Y)

    // β = (XᵀX)⁻¹ XᵀY
    var XtX mat.Dense
    XtX.Mul(Xmat.T(), Xmat)
    var XtXinv mat.Dense
    if err := XtXinv.Inverse(&XtX); err != nil {
        return nil, fmt.Errorf("matrix inversion failed: %w", err)
    }
    var beta mat.VecDense
    var XtY mat.VecDense
    XtY.MulVec(Xmat.T(), Yvec)
    beta.MulVec(&XtXinv, &XtY)

    // Residuals & R²
    var Yhat mat.VecDense
    Yhat.MulVec(Xmat, &beta)
    yMean := stat.Mean(Y, nil)
    var SSR, SSE, SST float64
    for i := 0; i < n; i++ {
        residual := Y[i] - Yhat.AtVec(i)
        SSE += residual * residual
        SSR += math.Pow(Yhat.AtVec(i)-yMean, 2)
        SST += math.Pow(Y[i]-yMean, 2)
    }
    rSquared := SSR / SST
    adjR := 1 - (1-rSquared)*float64(n-1)/float64(n-k-1)

    // MSE & Standard Errors
    MSE := SSE / float64(n-k-1)
    coeffs := make([]Coefficient, k+1)
    for j := 0; j <= k; j++ {
        se := math.Sqrt(MSE * XtXinv.At(j, j))
        b := beta.AtVec(j)
        t := b / se
        p := tPValue(t, n-k-1)
        varName := "Constant"
        if j > 0 && j-1 < len(varNames) {
            varName = varNames[j-1]
        }
        coeffs[j] = Coefficient{
            Variable: varName,
            B:        b,
            StdError: se,
            T:        t,
            PValue:   p,
            Sig:      significanceStars(p),
        }
    }

    // F-statistic
    F := (SSR / float64(k)) / (SSE / float64(n-k-1))

    return &RegressionResult{
        Coefficients: coeffs,
        RSquared:     rSquared,
        AdjRSquared:  adjR,
        FStatistic:   F,
        FPValue:      fPValue(F, k, n-k-1),
        Assumptions:  checkAssumptions(Y, Yhat, Xmat),
    }, nil
}

func significanceStars(p float64) string {
    switch {
    case p < 0.001: return "***"
    case p < 0.01:  return "**"
    case p < 0.05:  return "*"
    default:        return "ns"
    }
}
```

### Dockerfile (Multi-stage, Production-grade)

```dockerfile
# ─── Stage 1: Builder ───────────────────────────────────────
FROM golang:1.22-alpine AS builder

# Install dependencies
RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /app

# Copy and download dependencies first (layer caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary (optimized, stripped)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -X main.Version=$(git describe --tags --always)" \
    -o saras-api \
    ./cmd/server

# ─── Stage 2: Runner (minimal, ~8MB image) ─────────────────
FROM gcr.io/distroless/static-debian12

# Copy binary and certs
COPY --from=builder /app/saras-api /saras-api
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Non-root user (security)
USER nonroot:nonroot

# Cloud Run requires PORT env var
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/saras-api"]
```

---

## 8. Firebase — Skema & Konfigurasi

### Firestore Collections Schema

```
firestore/
│
├── users/
│   └── {uid}/
│       ├── email: string           # .ac.id only
│       ├── displayName: string
│       ├── university: string
│       ├── faculty: string
│       ├── researchTopic: string
│       ├── methodology: enum       # kuantitatif | kualitatif | mixed
│       ├── integrityPoints: number # gamifikasi (reward integritas tinggi)
│       ├── surveyPoints: number    # poin marketplace survei
│       ├── acEmailVerified: bool   # VERA verification status
│       └── createdAt: timestamp
│
├── integrity_reports/
│   └── {reportId}/
│       ├── userId: string          # ref ke users/
│       ├── fileName: string
│       ├── fileHash: string        # SHA-256 untuk deduplikasi
│       ├── totalRows: number
│       ├── flaggedRows: number
│       ├── integrityScore: number  # 0–100
│       ├── issues: array[Issue]
│       │   ├── rowIndex: number
│       │   ├── column: string
│       │   ├── type: enum          # zscore|mahalanobis|benford|duplicate|pattern
│       │   ├── severity: enum      # low|medium|high
│       │   ├── description: string
│       │   └── zScore: number
│       ├── aiNarrative: string     # generated by Gemini
│       └── createdAt: timestamp
│
├── surveys/
│   └── {surveyId}/
│       ├── userId: string
│       ├── title: string
│       ├── description: string
│       ├── targetSample: number
│       ├── currentResponses: number
│       ├── targetProvinces: array[string]
│       ├── requireAcEmail: bool
│       ├── pointsReward: number
│       ├── questions: array[Question]
│       │   ├── id: string
│       │   ├── type: enum         # likert|multiple|text|scale
│       │   ├── text: string
│       │   ├── options: array
│       │   └── required: bool
│       ├── status: enum           # draft|active|closed
│       └── createdAt: timestamp
│
│   └── {surveyId}/responses/
│       └── {responseId}/
│           ├── respondentId: string
│           ├── answers: map
│           ├── isVerified: bool    # VERA verification result
│           ├── completionTime: number  # ms
│           └── submittedAt: timestamp
│
├── analyses/
│   └── {analysisId}/
│       ├── userId: string
│       ├── type: string           # regression|ttest|anova|correlation
│       ├── inputData: map
│       ├── result: map
│       ├── aiNarrative: string
│       └── createdAt: timestamp
│
└── bps_cache/
    └── {cacheKey}/
        ├── province: string
        ├── indicator: string
        ├── year: number
        ├── value: any
        ├── source: string
        └── cachedAt: timestamp    # TTL: 24 jam
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuth() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isAuth() && request.auth.uid == userId;
    }
    function isAcEmail() {
      return isAuth() &&
        (request.auth.token.email.matches('.*\\.ac\\.id$') ||
         request.auth.token.email.matches('.*\\.edu$'));
    }
    function isVerifiedUser() {
      return isAuth() && request.auth.token.email_verified == true;
    }

    // Users: own data only
    match /users/{uid} {
      allow read, write: if isOwner(uid);
    }

    // Integrity reports: owner read/write, others read summary only
    match /integrity_reports/{reportId} {
      allow create: if isAuth() && isVerifiedUser();
      allow read, update, delete: if isOwner(resource.data.userId);
    }

    // Surveys: public read (active), owner write
    match /surveys/{surveyId} {
      allow read: if resource.data.status == 'active' || isOwner(resource.data.userId);
      allow create: if isAcEmail() && isVerifiedUser();
      allow update, delete: if isOwner(resource.data.userId);

      // Responses: .ac.id users can submit once
      match /responses/{responseId} {
        allow create: if isAcEmail() && isVerifiedUser();
        allow read: if isOwner(get(/databases/$(database)/documents/surveys/$(surveyId)).data.userId);
      }
    }

    // Analyses: own data only
    match /analyses/{analysisId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuth();
    }

    // BPS Cache: authenticated read, server write only
    match /bps_cache/{cacheKey} {
      allow read: if isAuth();
      allow write: if false; // server-only via Admin SDK
    }
  }
}
```

### Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // User CSV uploads — max 50MB, CSV/XLSX only
    match /uploads/{userId}/{fileName} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId
        && request.resource.size < 50 * 1024 * 1024
        && (request.resource.contentType == 'text/csv'
            || request.resource.contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    // Reports: user read only
    match /reports/{userId}/{fileName} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // server-generated only
    }
  }
}
```

### Firebase Initialization (TypeScript — Next.js)

```typescript
// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Singleton pattern — prevents re-initialization in Next.js HMR
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);
export default app;
```

### .env.local

```bash
# Firebase (Public — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=saras-riset.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=saras-riset
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=saras-riset.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend (Private — server only)
SARAS_API_URL=https://saras-api-xxx-as.a.run.app
GEMINI_API_KEY=AIzaSy...
BPS_API_KEY=your-bps-api-key
GOOGLE_CLOUD_PROJECT=saras-riset
```

---

## 9. Google Cloud Run — Rencana Deployment

### Arsitektur Cloud

```
GitHub Repository
      │
      │  push to main
      ▼
GitHub Actions (CI/CD)
      │
      ├── Run Tests (go test ./...)
      ├── Build Docker Image
      ├── Push to Artifact Registry
      │
      ▼
Cloud Build (trigger)
      │
      ▼
Cloud Run (Go Backend)          Firebase Hosting (Next.js)
  ├── Region: asia-southeast1       ├── Global CDN
  ├── Min instances: 1              ├── Auto SSL
  ├── Max instances: 100            └── Custom domain: saras.id
  ├── Memory: 512Mi
  ├── CPU: 1
  └── Concurrency: 80
```

### GitHub Actions — CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy SARAS to Cloud Run

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  PROJECT_ID: saras-riset
  SERVICE_NAME: saras-api
  REGION: asia-southeast1
  REGISTRY: asia-southeast1-docker.pkg.dev

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true

      - name: Run Tests
        run: |
          go test ./... -v -race -coverprofile=coverage.out
          go tool cover -html=coverage.out -o coverage.html

      - name: Upload Coverage
        uses: codecov/codecov-action@v4

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}

      - name: Setup gcloud CLI
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker ${{ env.REGISTRY }}

      - name: Build & Push Docker Image
        run: |
          IMAGE="${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/saras/${{ env.SERVICE_NAME }}:${{ github.sha }}"
          docker build -t "$IMAGE" -f Dockerfile .
          docker push "$IMAGE"

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image="${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/saras/${{ env.SERVICE_NAME }}:${{ github.sha }}" \
            --project="${{ env.PROJECT_ID }}" \
            --region="${{ env.REGION }}" \
            --platform=managed \
            --allow-unauthenticated \
            --min-instances=1 \
            --max-instances=100 \
            --memory=512Mi \
            --cpu=1 \
            --concurrency=80 \
            --timeout=60 \
            --set-env-vars="GOOGLE_CLOUD_PROJECT=${{ env.PROJECT_ID }}" \
            --set-secrets="GEMINI_API_KEY=gemini-api-key:latest" \
            --set-secrets="BPS_API_KEY=bps-api-key:latest"

      - name: Verify Deployment
        run: |
          URL=$(gcloud run services describe ${{ env.SERVICE_NAME }} \
            --region ${{ env.REGION }} --format 'value(status.url)')
          echo "Deployed to: $URL"
          curl -f "$URL/health" || exit 1
```

### Cloud Run Service Configuration

```yaml
# cloud-run-service.yaml — deploy manual dengan gcloud
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: saras-api
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/launch-stage: GA

spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"   # cold start prevention
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"  # always-on CPU
        run.googleapis.com/execution-environment: gen2

    spec:
      containerConcurrency: 80
      timeoutSeconds: 60

      containers:
        - image: asia-southeast1-docker.pkg.dev/saras-riset/saras/saras-api:latest
          ports:
            - containerPort: 8080

          resources:
            limits:
              memory: 512Mi
              cpu: "1"

          env:
            - name: GOOGLE_CLOUD_PROJECT
              value: saras-riset
            - name: PORT
              value: "8080"

          # Secrets dari Secret Manager
          envFrom:
            - secretRef:
                name: saras-secrets

          # Health check
          livenessProbe:
            httpGet:
              path: /health
            initialDelaySeconds: 5
            periodSeconds: 10

          readinessProbe:
            httpGet:
              path: /health
            initialDelaySeconds: 3
            periodSeconds: 5
```

### Setup Perintah (Terminal — Step by Step)

```bash
# ─── 1. Setup Project Google Cloud ──────────────────────────
gcloud projects create saras-riset --name="SARAS Platform"
gcloud config set project saras-riset

# Enable APIs yang dibutuhkan
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  firebase.googleapis.com \
  aiplatform.googleapis.com

# ─── 2. Artifact Registry ────────────────────────────────────
gcloud artifacts repositories create saras \
  --repository-format=docker \
  --location=asia-southeast1 \
  --description="SARAS Docker images"

# ─── 3. Secret Manager ───────────────────────────────────────
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=-

echo -n "YOUR_BPS_API_KEY" | gcloud secrets create bps-api-key \
  --data-file=-

# ─── 4. Service Account untuk Cloud Run ─────────────────────
gcloud iam service-accounts create saras-api-sa \
  --display-name="SARAS API Service Account"

# Berikan permissions
gcloud projects add-iam-policy-binding saras-riset \
  --member="serviceAccount:saras-api-sa@saras-riset.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding saras-riset \
  --member="serviceAccount:saras-api-sa@saras-riset.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding saras-riset \
  --member="serviceAccount:saras-api-sa@saras-riset.iam.gserviceaccount.com" \
  --role="roles/firebase.sdkAdminServiceAgent"

# ─── 5. Build & Deploy Manual (pertama kali) ────────────────
cd saras-backend
docker build -t asia-southeast1-docker.pkg.dev/saras-riset/saras/saras-api:v1.0.0 .
docker push asia-southeast1-docker.pkg.dev/saras-riset/saras/saras-api:v1.0.0

gcloud run deploy saras-api \
  --image=asia-southeast1-docker.pkg.dev/saras-riset/saras/saras-api:v1.0.0 \
  --region=asia-southeast1 \
  --service-account=saras-api-sa@saras-riset.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --min-instances=1 \
  --memory=512Mi

# ─── 6. Deploy Next.js ke Firebase Hosting ─────────────────
cd ../saras-frontend
pnpm build
firebase deploy --only hosting

# ─── 7. Custom Domain (opsional) ────────────────────────────
firebase hosting:channel:deploy production
# Kemudian set di Firebase Console: saras.id → Firebase Hosting
```

### Estimasi Biaya Cloud Run (Mode Kompetisi)

```
Cloud Run (Go Backend)
  • Min 1 instance × 512Mi × 730 jam = $5–8/bulan
  • 1M requests/bulan pertama = GRATIS (free tier)

Firebase (Spark Plan — GRATIS untuk kompetisi)
  • Firestore: 1GB storage, 50K reads/day, 20K writes/day
  • Hosting: 10GB storage, 360MB/day bandwidth
  • Auth: unlimited users
  • Functions: 2M invocations/bulan

Google AI Studio (Gemini API)
  • Gemini 1.5 Flash: 15 RPM gratis → cukup untuk demo
  • Gemini 1.5 Pro: $1.25/1M input tokens

Total estimasi kompetisi: $0–10/bulan 🎉
```

---

## 10. Roadmap Pengembangan 28 Hari

### Overview Sprint

```
Minggu 1 (6–12 Mei)  : Fondasi + ARIA Core (Killer Feature)
Minggu 2 (13–19 Mei) : NEXUS + SIGMA + Narrative AI
Minggu 3 (20–26 Mei) : VERA + ATLAS + Polish
Minggu 4 (27–31 Mei) : Demo Video + Submission
```

### Minggu 1 — Fondasi & Proof of Concept

```
Senin 6 Mei — Setup Day
  ✓ 09:00  Daftar kompetisi resmi, klaim Google Cloud Credit $200
  ✓ 10:00  Buat GitHub repo: saras-frontend + saras-backend
  ✓ 11:00  Init Next.js 14 dengan TypeScript + Tailwind + shadcn/ui
  ✓ 14:00  Init Go module: go mod init github.com/{user}/saras-backend
  ✓ 15:00  Setup Firebase project + enable Firestore + Auth + Storage
  ✓ 16:00  Deploy skeleton Go app ke Cloud Run → verifikasi URL aktif
  ✓ 17:00  Setup GitHub Actions CI/CD pipeline basic
  DELIVERABLE: URL Cloud Run aktif di browser

Selasa 7 Mei — CSV Pipeline
  ✓ Setup Go CSV parser dengan encoding/csv
  ✓ Implementasi Z-Score outlier detection di Go
  ✓ Unit test: zscore_test.go (≥80% coverage)
  ✓ Endpoint POST /api/v1/aria/analyze dengan mock response
  DELIVERABLE: API menerima CSV, return dummy score

Rabu 8 Mei — Benford's Law + Duplicate Detection
  ✓ Implementasi Benford's Law analysis di Go
  ✓ Implementasi duplicate row detection
  ✓ Gabungkan ke calculateScore() function
  ✓ Integration test dengan 3 CSV file berbeda
  DELIVERABLE: ARIA Engine lengkap di backend

Kamis 9 Mei — Frontend ARIA UI
  ✓ Build halaman upload CSV dengan drag-and-drop
  ✓ Build Integrity Score animated radial gauge (SVG + CSS)
  ✓ Build data heatmap table dengan row color coding
  ✓ Connect frontend ke Go backend (fetch /api/v1/aria/analyze)
  DELIVERABLE: Upload → Score animasi muncul di browser

Jumat 10 Mei — Gemini AI Integration
  ✓ Setup google-generativeai-go SDK
  ✓ Tulis system prompt anti-hallucination untuk ARIA
  ✓ Endpoint: terima issues array → return narasi BI akademis
  ✓ Build "Narasi AI" tab di frontend
  DELIVERABLE: ARIA WOW Moment lengkap end-to-end

Sabtu 11 Mei — Field Test
  ✓ Test dengan 5 file CSV nyata dari teman mahasiswa
  ✓ Catat feedback: apa yang membingungkan, apa yang WOW
  ✓ Ikuti Kick-Off kompetisi pukul 13:00 WIB (catat teknik baru)
  ✓ Perbaiki UX berdasarkan feedback langsung
  DELIVERABLE: ARIA siap didemonstrasikan ke orang lain

Minggu 12 Mei — Buffer + Dokumentasi
  ✓ Tulis README.md backend yang komprehensif
  ✓ Dokumentasi API dengan komentar Go (godoc)
  ✓ Perbaiki semua bug yang ditemukan hari Sabtu
  ✓ Setup monitoring: Sentry (error tracking) + Cloud Logging
  DELIVERABLE: ARIA production-ready, documented
```

### Minggu 2 — NEXUS + SIGMA + Narrative AI

```
Senin 13 Mei — NEXUS Backend
  ✓ Setup BPS WebAPI client di Go
  ✓ Endpoint GET /nexus/indicators (cached di Firestore 24h)
  ✓ Endpoint POST /nexus/compare (mismatch detection logic)
  ✓ Cache layer: jika data BPS sudah di Firestore → skip API call
  DELIVERABLE: BPS data mengalir ke frontend

Selasa 14 Mei — NEXUS Frontend
  ✓ Build halaman NEXUS: tabel perbandingan data primer vs BPS
  ✓ Build BPS Mismatch Alert component (slide-in notification)
  ✓ Build Auto-Cite Generator dengan format APA 7th
  ✓ Build filter: provinsi + tahun + indikator
  DELIVERABLE: NEXUS WOW Moment: Alert muncul otomatis

Rabu 15 Mei — SIGMA Backend
  ✓ Implementasi OLS regression di Go dengan gonum/mat
  ✓ Implementasi t-test (one-sample + independent)
  ✓ Implementasi uji asumsi: Shapiro-Wilk, Durbin-Watson
  ✓ Endpoint POST /sigma/regression + /sigma/ttest
  DELIVERABLE: Perhitungan statistik akurat di Go

Kamis 16 Mei — SIGMA Frontend + Wizard
  ✓ Build Statistical Test Wizard (decision tree UI)
  ✓ Build output table (koefisien, SE, t, p-value)
  ✓ Build assumptions checker dengan status badges
  ✓ Connect ke SIGMA backend + Gemini narrative endpoint
  DELIVERABLE: SIGMA WOW: upload → analisis → narasi otomatis

Jumat 17 Mei — Narrative AI Polish
  ✓ Refine system prompt Gemini untuk berbagai jenis uji
  ✓ Test narasi dengan 10 skenario output berbeda
  ✓ Pastikan narasi selalu menyertakan nilai statistik
  ✓ Add "Salin ke Clipboard" + "Export ke Word" button
  DELIVERABLE: Narrative AI siap untuk demo

Sabtu 18 Mei — Stress Test
  ✓ Test ARIA dengan file CSV 10.000+ baris → max 30 detik
  ✓ Test concurrent users: 10 user upload bersamaan
  ✓ Monitor Cloud Run memory usage (harus < 400Mi)
  ✓ Optimasi: jika slow, add goroutine parallelism

Minggu 19 Mei — VERA Basic
  ✓ Implementasi .ac.id email gating di Firebase Auth Rules
  ✓ Build halaman Respondent Marketplace
  ✓ Build formulir Buat Survei dengan React Hook Form + Zod
  ✓ Sistem poin basic: Firestore transaction untuk poin
  DELIVERABLE: VERA: survei bisa dibuat dan dibagikan
```

### Minggu 3 — ATLAS + Polish + Advanced Features

```
Senin 20 Mei — ATLAS Backend
  ✓ Setup Crossref API client di Go (net/http)
  ✓ Endpoint GET /atlas/search → parallel search Crossref + Semantic Scholar
  ✓ Implementasi deduplikasi + BM25 ranking
  ✓ Endpoint POST /atlas/cite → format APA/IEEE/Vancouver
  DELIVERABLE: Literature search API berjalan

Selasa 21 Mei — ATLAS Frontend + Gap Map
  ✓ Build halaman ATLAS dengan search bar + filter
  ✓ Build result list dengan paper cards
  ✓ Build Research Gap Map: D3.js bubble chart
  ✓ Build citation generator dengan copy button
  DELIVERABLE: ATLAS WOW: Gap Map tergambar secara visual

Rabu 22 Mei — Advanced ARIA (Mahalanobis)
  ✓ Implementasi Mahalanobis Distance di Go (gonum/mat inverse)
  ✓ Add ke ARIA pipeline + update scoring formula
  ✓ Test dengan dataset multivariat yang diketahui outliernya
  DELIVERABLE: ARIA lebih akurat untuk dataset multivariat

Kamis 23 Mei — Provincial Map + Gamifikasi
  ✓ Build Indonesia map (react-simple-maps + topojson)
  ✓ Choropleth coloring berdasarkan indikator BPS per provinsi
  ✓ Gamifikasi: badge system untuk Integrity Score ≥ 90
  ✓ Konfetti animation saat score tinggi (canvas-confetti)
  DELIVERABLE: Halaman NEXUS visual sangat impressive

Jumat 24 Mei — Security Hardening
  ✓ Audit semua Firestore Security Rules
  ✓ Implementasi rate limiting di Go middleware (golang.org/x/time/rate)
  ✓ Input sanitization untuk semua endpoint
  ✓ Add CORS yang proper (only whitelist frontend domain)
  ✓ Test dengan OWASP ZAP basic scan

Sabtu 25 Mei — Mobile Responsiveness
  ✓ Test semua halaman di viewport 375px, 768px, 1024px
  ✓ Fix layout yang rusak di mobile
  ✓ Pastikan touch target ≥ 44px untuk semua button
  ✓ Test dengan Chrome DevTools device simulation

Minggu 26 Mei — Performance Optimization
  ✓ Lighthouse audit target: Performance > 90, Accessibility > 95
  ✓ Optimasi: lazy load heavy components (D3 map, charts)
  ✓ Image optimization: next/image untuk semua gambar
  ✓ Bundle analysis: pnpm build → analisis chunk sizes
  ✓ Cloud Run min-instances=1 → no cold start saat demo
  DELIVERABLE: Aplikasi cepat, responsive, accessible
```

### Minggu 4 — Demo Video + Submission

```
Rabu 27 Mei — Script Demo Video
  ✓ Tulis script 150 detik (lihat Bab 12)
  ✓ Siapkan dataset demo (CSV dengan masalah yang sudah dikurasi)
  ✓ Test run demo 3 kali → identifikasi momen yang lemah
  ✓ Pastikan semua loading state smooth dan menarik

Kamis 28 Mei — Produksi Video
  ✓ Record screen dengan OBS Studio (1080p 60fps)
  ✓ Edit dengan DaVinci Resolve:
      - Callout annotations di setiap WOW moment
      - Zoom in saat Integrity Score muncul
      - Zoom in saat BPS Alert muncul
      - Subtitle bahasa Indonesia di semua narasi
      - Background music: calm, fokus (non-copyright)
  ✓ Export: MP4 H.264, max 100MB
  DELIVERABLE: Video demo 150 detik yang jaw-drop

Jumat 29 Mei — LinkedIn Launch
  ✓ Post video ke LinkedIn dengan caption storytelling
  ✓ Tag: #JuaraVibeCoding #GoogleAI #MahasiswaIndonesia
  ✓ Pasang Twibbon resmi kompetisi
  ✓ Minta 10 teman engage dalam 1 jam pertama
  ✓ Post di Twitter/X dengan thread singkat
  DELIVERABLE: Momentum sosial media terbangun

Sabtu 30 Mei — Final Submission (HARI INI, bukan besok)
  ✓ 09:00 Final test: semua fitur dari fresh incognito browser
  ✓ 10:00 Pastikan Cloud Run URL aktif dan public
  ✓ 11:00 Isi formulir submission dengan teliti + screenshot tiap step
  ✓ 12:00 Submit → SELESAI (buffer 1 hari sebelum deadline)
  ✓ 13:00 Post screenshot submission ke LinkedIn sebagai social proof
  DELIVERABLE: SUBMITTED ✓

Minggu 31 Mei — Buffer & Contingency
  ✓ Hari cadangan jika ada masalah saat submission
  ✓ Jika sudah submitted: istirahat, minta feedback teman
  ✓ Monitor apakah ada notifikasi dari panitia
```

### Contingency Plan

```
Jika Cloud Run down saat penilaian:
  → Siapkan Vercel deployment sebagai backup
  → URL Vercel dicantumkan di submission sebagai alternatif

Jika Gemini API error:
  → Fallback ke response statis yang sudah di-cache
  → Tampilkan pesan: "Mode offline — menampilkan contoh narasi"

Jika Firebase Auth bermasalah:
  → Demo mode tanpa auth untuk penilai
  → Gunakan test account: demo@unimed.ac.id / Demo2026!

Jika waktu tidak cukup (MVP minimum — 7 hari):
  → Fokus HANYA pada ARIA (upload → score → heatmap → narasi)
  → Itu sudah cukup untuk demonstrate konsep yang kuat
  → Tambahkan NEXUS basic sebagai nilai plus
```

---

## 11. 7 Faktor WOW

### WOW #1 — Integrity Score Forensic Heatmap
> **Demo script:** *"Ini adalah file CSV skripsi saya yang hampir saya manipulasi. Tonton apa yang terjadi saat saya upload..."*

Upload CSV → 8 detik → animated gauge naik ke angka final → heatmap muncul row by row seperti investigasi forensik → klik baris merah → penjelasan AI per baris. Tidak ada aplikasi riset Indonesia yang melakukan ini.

### WOW #2 — Proactive BPS Intelligence Alert
> Bukan sekadar connector database. AI yang aktif memberitahu.

Setelah upload data primer → sistem otomatis membandingkan dengan BPS terbaru → alert slide-in: *"Data Anda berbeda 0.89% dari BPS resmi. Kutipan sudah disiapkan."* Ini membuat SARAS terasa hidup, bukan statis.

### WOW #3 — Narrative AI dalam BI Akademis
> Killer feature yang paling diinginkan mahasiswa.

Jalankan analisis → 5 detik → 3 paragraf interpretasi BAB IV lengkap dengan nilai statistik yang dikutip dengan benar, gaya bahasa akademis Indonesia, dan referensi teori. Bukan terjemahan kaku — ini adalah tulisan yang siap masuk skripsi.

### WOW #4 — .ac.id Verified Respondent Marketplace
> Platform survei pertama dengan verifikasi identitas akademik.

Tingkat validitas responden dari 67% (Forms biasa) → 94% (VERA verified). Ini adalah klaim yang bisa didemonstrasikan dengan data nyata. Plus: gamifikasi poin membuat mahasiswa mau berkontribusi.

### WOW #5 — Research Gap Visual Map
> Riset novelty yang sebelumnya membutuhkan berminggu-minggu kini selesai dalam 30 detik.

Ketik topik → D3.js bubble chart muncul: topik jenuh (bubble besar, gelap) vs research gap (bubble kecil, terang). Mahasiswa bisa melihat secara visual di mana skripsi mereka berdiri.

### WOW #6 — One-Click Academic Export
> Export hasil analisis lengkap ke Word siap sidang dalam 1 klik.

Tabel output + grafik + narasi AI + daftar pustaka → Word document dengan format akademis Indonesia standar (Times New Roman 12pt, spasi 1.5, margin 4-3-3-3, justified). Ini menghilangkan 2-3 jam kerja formatting manual.

### WOW #7 — Go Backend yang Super Cepat
> Bukan sekadar cerita — ini terasa di demo.

Z-Score + Benford's Law + Duplicate Detection pada 10.000 baris selesai dalam < 2 detik (bukan 15-30 detik seperti Python). Kecepatan ini terlihat jelas saat demo dan membedakan SARAS dari yang lain.

---

## 12. Strategi Kompetisi

### Demo Video — Script 150 Detik

```
0:00–0:15  Hook emosional
  "Tiga bulan lalu, saya hampir memanipulasi data skripsi saya.
   Bukan karena saya tidak jujur — tapi karena saya tidak punya
   alat yang membantu saya memahami data apa adanya."

0:15–0:40  WOW #1: ARIA Upload
  [Upload CSV real skripsi yang ada masalahnya]
  [Score gauge animasi: 0 → 74]
  [Heatmap muncul: baris merah di row 3, 7]
  Narasi: "Dalam 8 detik. Baris 3 dan 7 mencurigakan. Klik untuk tahu mengapa."

0:40–1:05  WOW #1 Detail + WOW #3 Narasi
  [Klik baris 3 → panel slide down: penjelasan Mahalanobis]
  [Tab "Narasi AI" → paragraf interpretasi muncul real-time]
  Narasi: "Interpretasi ini siap masuk BAB IV. Tanpa copy-paste dari AI lain."

1:05–1:25  WOW #2: NEXUS Alert
  [Pindah ke NEXUS]
  [Alert slide-in: "Inflasi Anda 3.5% ≠ BPS 2.61%"]
  [Klik → kutipan BPS muncul, format APA siap disalin]
  Narasi: "SARAS yang memberitahu Anda. Bukan Anda yang mencarinya."

1:25–1:45  WOW #5: ATLAS Gap Map
  [Ketik topik: "pengaruh media sosial keputusan pembelian gen Z"]
  [Bubble chart muncul — visualisasi 50 paper dalam 5 detik]
  Narasi: "Lihat di mana novelty skripsi Anda. Tanpa baca 50 abstrak satu per satu."

1:45–2:10  WOW #6: Export + Closing
  [Demo one-click export ke Word]
  [Dokumen terbuka: tabel + grafik + narasi sudah ada]
  Narasi: "Ini bukan tentang coding. Ini tentang satu juta mahasiswa Indonesia
           yang berhak riset dengan benar — tanpa harus menjadi ahli statistik dulu."

2:10–2:30  Call to action
  [Screen SARAS dengan URL]
  "SARAS. Sistem Asisten Riset Akademik Statistika.
   Dibangun dalam 28 hari. Dengan vibe coding. Untuk kita semua."
```

### Caption LinkedIn (Template)

```
Tiga minggu lalu, saya hampir menyerah.

Dataset skripsi saya penuh outlier yang tidak saya mengerti.
Analisis berulang kali tidak signifikan.
Dorongan untuk "bersih-bersihkan" data makin kuat.

Saya tahu itu salah. Tapi saya tidak punya pilihan lain.

Lalu saya memutuskan: daripada manipulasi data, saya akan
membangun alat yang membantu memahaminya.

Lahirlah SARAS — platform AI riset akademik yang saya bangun
dalam 28 hari dengan vibe coding: Go backend + Firebase +
Google Cloud Run + Gemini AI.

Bukan untuk membersihkan data.
Tapi untuk meneranginya.

Coba di: [URL]

#JuaraVibeCoding #GoogleAI #MahasiswaIndonesia #VibeCoding
#NextJS #Golang #Firebase #GoogleCloud
```

### Checklist Submission Final

```
TEKNIS
  □ Cloud Run URL aktif dan bisa dibuka tanpa login (demo mode)
  □ Semua 5 modul dapat didemonstrasikan
  □ Mobile responsive (test di iPhone SE dan Samsung A series)
  □ Tidak ada error di browser console saat demo
  □ Loading time < 3 detik di koneksi 4G

SUBMISSION
  □ Video demo 2-3 menit diupload ke LinkedIn (bukan YouTube private)
  □ Twibbon resmi terpasang di foto profil LinkedIn
  □ Formulir submission diisi lengkap:
      - Nama lengkap + NIM + universitas
      - URL aplikasi (Cloud Run)
      - URL video LinkedIn
      - Deskripsi singkat (≤200 kata)
  □ Screenshot submission tersimpan sebagai bukti
  □ Submit sebelum 30 Mei (bukan 31 Mei)

SOCIAL PROOF
  □ Post LinkedIn dengan hashtag resmi
  □ Twibbon di semua platform media sosial
  □ Minta 10+ teman engage dalam 1 jam pertama post
  □ Reply semua komentar dalam 24 jam pertama
```

---

## 13. Etika AI & Keberlanjutan

### Framework Etika AI SARAS

```
TRANSPARANSI
  • Setiap output AI diberi label jelas: "Generated by AI — Verifikasi diperlukan"
  • User selalu tahu mana hasil perhitungan vs interpretasi AI

ANTI-CHEATING DESIGN
  • ARIA tidak pernah menyarankan cara "membersihkan" data agar signifikan
  • ARIA hanya menyarankan cara memahami dan menjelaskan data apa adanya
  • Sistem dirancang untuk meningkatkan integritas, bukan mengakalinya

ANTI-HALLUCINATION
  • Semua klaim dalam narasi SIGMA/ARIA harus didukung output numerik
  • Referensi teoritis hanya dari database yang terverifikasi
  • Gemini dipaksa mengutip sumber untuk setiap klaim teoritis

PRIVASI DATA
  • Dataset yang diupload tidak disimpan permanen tanpa explicit consent
  • File otomatis dihapus dari Cloud Storage setelah 24 jam
  • Zero data sharing ke pihak ketiga
  • Compliant: UU PDP Indonesia No. 27/2022 + prinsip GDPR

HAK PENGGUNA
  • Right to delete: hapus semua data dalam satu klik
  • Data portability: export semua analisis dalam JSON
  • Audit trail: log semua perubahan data
```

### Rencana Keberlanjutan Pasca Kompetisi

```
Fase 1 — MVP (Jun 2026)
  Target : 500 mahasiswa beta users
  Model  : Gratis penuh
  Focus  : Bug fixes + user feedback loop

Fase 2 — Beta (Jul–Des 2026)
  Target : 5.000 mahasiswa aktif
  Model  : Freemium
    Free : 5 analisis ARIA/bulan, 1 survei aktif
    Pro  : Rp 29.000/bulan — unlimited
  Focus  : Tambah fitur ATLAS + mobile app

Fase 3 — Growth (2027)
  Target : 50.000 mahasiswa, 50 universitas
  Model  : Institusi: Rp 2.500.000/tahun/kampus
  Focus  : Integrasi SINTA resmi + kemitraan BPS

Fase 4 — Impact (2028)
  Target : Mitra resmi Kemendikbud + BPS
  Model  : Government contract
  Focus  : Standar nasional integritas riset mahasiswa Indonesia
```

---

## Appendix A — go.mod

```
module github.com/angga/saras-backend

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    firebase.google.com/go/v4 v4.14.0
    google.golang.org/api v0.171.0
    github.com/google/generative-ai-go v0.11.0
    gonum.org/v1/gonum v0.15.0
    go.uber.org/zap v1.27.0
    github.com/golang-jwt/jwt/v5 v5.2.1
    github.com/go-playground/validator/v10 v10.20.0
    golang.org/x/time v0.5.0
)
```

## Appendix B — package.json (Frontend)

```json
{
  "name": "saras-frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "typescript": "5.4.5",
    "firebase": "10.11.0",
    "zustand": "4.5.2",
    "@tanstack/react-query": "5.29.0",
    "recharts": "2.12.4",
    "d3": "7.9.0",
    "react-simple-maps": "3.0.0",
    "topojson-client": "3.1.0",
    "framer-motion": "11.1.7",
    "react-hook-form": "7.51.3",
    "zod": "3.22.4",
    "@hookform/resolvers": "3.3.4",
    "react-dropzone": "14.2.3",
    "canvas-confetti": "1.9.3",
    "next-intl": "3.11.3",
    "clsx": "2.1.1",
    "tailwind-merge": "2.3.0"
  }
}
```

---

> **"Riset yang baik bukan tentang data yang sempurna.**
> **Tapi tentang kejujuran dalam menghadapi data apa adanya."**
>
> — SARAS Design Principle #1

---

*Blueprint ini adalah dokumen hidup. Update terakhir: Mei 2026.*
*Untuk pertanyaan teknis: angga@unimed.ac.id*
