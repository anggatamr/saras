# SARAS — Comprehensive Project Blueprint
## Sistem Asisten Riset Akademik Statistika
> AI-Powered Research Integrity & Analytics Platform for Indonesian Academia
> Developer: **Angga** · NIM 4232560004 · Statistika Semester VI · Universitas Negeri Medan
> Competition: **#JuaraVibeCoding 2026**

---

## 1. Project Overview

### Core Purpose
SARAS is an AI-powered academic research platform designed for Indonesian university students. It unifies five critical capabilities into a single interface: data integrity auditing, national statistics benchmarking (BPS), verified respondent collection, AI-driven statistical interpretation, and scientific literature mapping.

### User Personas
1. **Mahasiswa S1/S2** (Undergraduate/Graduate Students) — Primary users who upload CSV datasets from their thesis/skripsi, need statistical analysis, integrity checks, and academic narrative generation in Bahasa Indonesia.
2. **Dosen Pembimbing** (Academic Advisors) — Review integrity scores and AI-generated interpretations for student research.
3. **Peneliti Independen** (Independent Researchers) — Use BPS data benchmarking and literature gap analysis.

### High-Level Feature Workflows

#### ARIA Module (Audit & Research Integrity Analysis)
1. User uploads CSV file → 2. Backend parses CSV, launches parallel goroutine analysis per column → 3. Detects missing data, Z-score outliers (|z|>3), IQR outliers, Benford's Law anomalies → 4. Returns integrity score (0-100) with flagged issues → 5. User requests AI narrative → 6. Gemini generates structured academic interpretation (JSON: status_integritas, paragraf_pembuka, analisis_statistik, kesimpulan_akademis)

#### NEXUS Module (National Data Cross-Reference)
1. User selects province from 34-province dropdown → 2. Interactive OpenStreetMap iframe centers on province → 3. User selects BPS indicator (TPT/IPM/Kemiskinan/Pertumbuhan) → 4. Backend fetches BPS data via WebAPI with Firestore caching → 5. User compares their research value against official BPS data → 6. System calculates deviation percentage and alert level → 7. Auto-generates APA 7th citation for BPS source

#### VERA Module (Verified Electronic Respondent Acquisition)
1. Researcher creates survey with title, target, points, tags → 2. Only .ac.id/.edu email holders can create surveys → 3. Other students browse active surveys → 4. Upon submission, respondent email is SHA256-hashed (UU PDP No. 27/2022 compliance) → 5. Progress counter increments atomically (Firestore transaction)

#### SIGMA Module (Statistical Intelligent Guided Modeling & Analysis)
1. User uploads CSV → 2. Frontend detects delimiters (comma/semicolon), identifies numeric columns, parses Indonesian decimal commas → 3. AI recommends test type (regression/ttest) based on dataset profile → 4. User configures Y/X columns or group/value columns → 5. Backend performs OLS regression (QR decomposition via gonum) or Welch's t-test → 6. Results displayed with coefficients, t-stats, p-values, R², F-statistic → 7. AI generates academic narrative for BAB IV thesis chapter

#### ATLAS Module (Academic & Theoretical Literature Analysis System)
1. User enters search query → 2. Backend searches OpenAlex API for academic papers → 3. Results cached in Firestore → 4. Research gap map generated as bubble visualization → 5. Gemini generates research gap synopsis → 6. Citation generation in APA/IEEE format

---

## 2. Directory Architecture

```
Saras/
├── README.md                              # Project documentation
├── DESIGN.md                              # Design system documentation
├── VALIDATION.md                          # Statistical validation documentation
├── SECURITY.md                            # Security documentation
├── SARAS_Blueprint_JuaraVibeCoding2026.md # Competition blueprint
├── firestore.rules                        # Firestore security rules
├── storage.rules                          # Firebase Storage rules
├── deploy_backend.ps1                     # Cloud Run deployment script
│
├── saras-backend/                         # Go (Golang) API server
│   ├── cmd/
│   │   └── server/
│   │       └── main.go                    # Entry point with graceful shutdown
│   ├── internal/
│   │   ├── api/
│   │   │   ├── router.go                  # Gin router with all route definitions
│   │   │   ├── handlers/
│   │   │   │   ├── health.go              # GET /health endpoint
│   │   │   │   ├── aria.go                # ARIA integrity analysis handlers
│   │   │   │   ├── aria_test.go           # ARIA unit tests
│   │   │   │   ├── nexus.go               # NEXUS BPS data handlers
│   │   │   │   ├── vera.go                # VERA survey handlers
│   │   │   │   ├── sigma.go               # SIGMA statistical computation handlers
│   │   │   │   ├── sigma_test.go          # SIGMA unit tests
│   │   │   │   └── atlas.go               # ATLAS literature search handlers
│   │   │   └── middleware/
│   │   │       ├── auth.go                # Firebase/NextAuth authentication
│   │   │       ├── cors.go                # CORS middleware
│   │   │       ├── logger.go              # Zap structured logging
│   │   │       ├── ratelimit.go           # IP-based rate limiting (golang.org/x/time)
│   │   │       └── request_id.go          # UUID request tracking
│   │   ├── gemini/
│   │   │   ├── client.go                  # Google Gemini AI SDK client wrapper
│   │   │   └── scrubber.go                # PII scrubber (email, phone, NIM regex)
│   │   ├── bps/
│   │   │   ├── client.go                  # BPS WebAPI HTTP client
│   │   │   └── provinces.go               # 34-province code mapping
│   │   ├── openalex/
│   │   │   └── client.go                  # OpenAlex academic search API client
│   │   ├── cache/
│   │   │   └── firestore_cache.go         # Firestore-backed 24h TTL cache
│   │   └── database/
│   │       └── firestore.go               # Database layer (Firestore + MemoryDB fallback)
│   ├── go.mod                             # Go module dependencies
│   ├── go.sum                             # Dependency checksums
│   ├── Dockerfile                         # Multi-stage Docker build (distroless)
│   ├── cloud-run-service.yaml             # Cloud Run service configuration
│   ├── .env                               # Environment variables (gitignored)
│   └── .env.example                       # Environment variable template
│
└── saras-frontend/                        # Next.js 14 React application
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx                 # Root layout (Sidebar, AuthProvider, Toast)
    │   │   ├── page.tsx                   # Landing/Dashboard page
    │   │   ├── globals.css                # CSS design tokens (neobrutalism theme)
    │   │   ├── aria/
    │   │   │   └── page.tsx               # ARIA module page
    │   │   ├── nexus/
    │   │   │   └── page.tsx               # NEXUS module page
    │   │   ├── vera/
    │   │   │   └── page.tsx               # VERA module page
    │   │   ├── sigma/
    │   │   │   └── page.tsx               # SIGMA module page (~999 lines)
    │   │   ├── atlas/
    │   │   │   └── page.tsx               # ATLAS module page
    │   │   ├── profile/
    │   │   │   └── page.tsx               # User profile page
    │   │   └── api/
    │   │       └── auth/
    │   │           └── [...nextauth]/
    │   │               └── route.ts       # NextAuth.js API route (Google OAuth)
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx            # Desktop sidebar + mobile bottom nav
    │   │   │   └── Topbar.tsx             # Page header with breadcrumbs
    │   │   └── ui/
    │   │       ├── SarasLogo.tsx           # SVG logo component
    │   │       ├── badge.tsx              # Badge component
    │   │       ├── button.tsx             # Button with neobrutalism variants
    │   │       ├── card.tsx               # Card component
    │   │       ├── checkbox.tsx           # Checkbox (Radix)
    │   │       ├── dialog.tsx             # Dialog modal (Radix)
    │   │       ├── error-boundary.tsx     # React error boundary
    │   │       ├── hover-card.tsx         # Hover card (Radix)
    │   │       ├── input.tsx              # Input field
    │   │       ├── scroll-area.tsx        # Scroll area (Radix)
    │   │       ├── select.tsx             # Select dropdown (Radix)
    │   │       ├── sheet.tsx              # Sheet/drawer component
    │   │       ├── table.tsx              # Data table component
    │   │       ├── tabs.tsx               # Tabs component (Radix)
    │   │       └── toast.tsx              # Toast notification system
    │   └── lib/
    │       ├── api.ts                     # fetchWithAuth wrapper (injects X-User-Email, X-Saras-Secret)
    │       ├── auth.tsx                   # AuthProvider + useAuth hook (NextAuth SessionProvider)
    │       ├── pdfGenerator.ts            # PDF report generation (jsPDF)
    │       ├── wordGenerator.ts           # Word-like document generation
    │       └── utils.ts                   # cn() utility (clsx + tailwind-merge)
    ├── package.json                       # NPM dependencies
    ├── tailwind.config.ts                 # Tailwind CSS configuration (neobrutalism)
    ├── next.config.mjs                    # Next.js config (standalone, unoptimized images)
    ├── tsconfig.json                      # TypeScript configuration
    ├── postcss.config.mjs                 # PostCSS config
    ├── firebase.json                      # Firebase Hosting config
    └── components.json                    # shadcn/ui configuration
```

---

## 3. Tech Stack & Configurations

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2.35 | React framework with App Router |
| React | 18 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| tailwindcss-animate | 1.0.7 | Animation utilities |
| Framer Motion | 12.38.0 | Advanced animations |
| Radix UI | Various | Accessible primitives (Dialog, Select, Tabs, Checkbox, ScrollArea, HoverCard) |
| Lucide React | 1.16.0 | Icon library |
| Recharts | 3.8.1 | Data visualization charts |
| D3 | 7.9.0 | Gap map bubble visualization |
| NextAuth.js | 4.24.14 | Authentication (Google OAuth) |
| Zustand | 5.0.13 | State management |
| React Hook Form | 7.75.0 | Form handling |
| Zod | 4.4.3 | Schema validation |
| jsPDF | 4.2.1 | PDF report generation |
| canvas-confetti | 1.9.4 | Celebration animations |
| react-dropzone | 15.0.0 | File upload drag-and-drop |
| class-variance-authority | 0.7.1 | Component variant management |
| clsx + tailwind-merge | Latest | Conditional class merging |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Go (Golang) | 1.25.0 | Backend language |
| Gin | 1.9.1 | HTTP router framework |
| google.golang.org/genai | 1.58.0 | Google Gemini AI SDK |
| google-generative-ai-go | 0.20.1 | Gemini client library |
| Cloud Firestore SDK | 1.22.0 | Database & caching |
| gonum | 0.17.0 | Scientific computing (mat, stat/distuv) |
| zap | 1.27.0 | Structured logging |
| golang.org/x/time | 0.15.0 | Rate limiting |

### External APIs
| API | Base URL | Purpose | Auth |
|---|---|---|---|
| Google Gemini | via SDK | AI narrative generation | API Key (`GEMINI_API_KEY`) |
| BPS WebAPI | `https://webapi.bps.go.id/v1/api/` | National statistics data | API Key (`BPS_API_KEY`) |
| OpenAlex | `https://api.openalex.org/` | Academic paper search | User-Agent header |
| Google OAuth | via NextAuth | User authentication | Client ID + Secret |

### Environment Variables

**Backend (`saras-backend/.env`)**:
```
PORT=8080
GOOGLE_CLOUD_PROJECT=saras-platform
GEMINI_API_KEY=<google-gemini-api-key>
BPS_API_KEY=<bps-webapi-key>
SARAS_API_SECRET=saras-secret-handshake-token-9988
GIN_MODE=debug                    # Set to "release" for production
GOOGLE_APPLICATION_CREDENTIALS=   # Optional: path to service account JSON
ALLOWED_EMAILS=                   # Optional: comma-separated whitelist
```

**Frontend (`saras-frontend/.env.local`)**:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-nextauth-secret>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_SECRET=saras-secret-handshake-token-9988
```

### Deployment Configuration
- **Docker**: Multi-stage build (golang:1.25-alpine → gcr.io/distroless/static-debian12), ~8MB final image
- **Cloud Run**: Target service on Google Cloud Platform
- **Firebase Hosting**: Static frontend deployment

---

## 4. Data Models & Database Schemas

### Firestore Collections

#### Collection: `surveys` (VERA Module)
```typescript
{
  id: number,           // Auto-generated ID (int or Unix timestamp % 100M)
  title: string,        // Survey title (required)
  author: string,       // Creator name or email
  uni: string,          // University name
  target: number,       // Target respondent count (required)
  current: number,      // Current respondent count (starts at 0)
  points: number,       // Reward points (required)
  tags: string[],       // Category tags (e.g., ["Manajemen", "Pemasaran"])
  created_at: Timestamp // Creation timestamp
}
```

#### Collection: `surveys/{surveyId}/responses`
```typescript
{
  hashed_respondent_id: string, // SHA256(email + "_saras_pdp_salt_2026")
  submitted_at: Timestamp
}
```

#### Collection: `reports` (ARIA/SIGMA)
```typescript
{
  userId: string,       // Firebase Auth UID
  type: string,         // "aria" | "sigma"
  data: object,         // Analysis result JSON
  created_at: Timestamp
}
```

#### Collection: `cache_bps` (Server-side only)
```typescript
{
  data: any,            // Cached BPS API response
  created_at: Timestamp // 24-hour TTL
}
```

#### Collection: `cache_atlas` (Server-side only)
```typescript
{
  data: any,            // Cached OpenAlex search results
  created_at: Timestamp // 24-hour TTL
}
```

### In-Memory Database (Fallback)
When Firestore is unavailable, the backend uses `MemoryDB` with the same interface:
- Pre-seeded with 3 mock surveys
- Thread-safe with `sync.Mutex`
- Auto-incrementing IDs starting at 4

### Firestore Security Rules
- **Default deny all** (`allow read, write: if false`)
- `users/{userId}`: Read = authenticated; Write = owner + academic email
- `surveys/{surveyId}`: Read = public; Create = academic email only; Update/Delete = creator only
- `surveys/{surveyId}/responses`: Create = academic email; Read = survey creator only
- `reports/{reportId}`: Read = owner only; Create = academic email + owner
- `cache_bps`, `cache_atlas`: All access denied (server-side only via Admin SDK)

---

## 5. Core Business Logic

### 5.1 Authentication Flow
1. Frontend uses NextAuth.js with Google OAuth provider
2. On login, `getSession()` provides `user.email`
3. Every API call uses `fetchWithAuth()` which injects:
   - `X-User-Email: <email>` header
   - `X-Saras-Secret: saras-secret-handshake-token-9988` header
4. Backend `Auth()` middleware validates:
   - In release mode: checks `X-Saras-Secret` matches `SARAS_API_SECRET` env var
   - Validates email is academic (.ac.id / .edu) or whitelisted
   - In dev mode: falls back to `dev@unimed.ac.id`
5. Sets `email` and `uid` in Gin context for downstream handlers

### 5.2 ARIA — CSV Integrity Analysis (Concurrent)
```
POST /api/v1/aria/analyze (multipart/form-data: file)

Step 1: Parse CSV header row and all data rows into memory
Step 2: Launch N goroutines (one per column) for parallel analysis:
  - Per-column: Count missing values ("", "NA", "null", "-")
  - Per-column: Calculate mean, stddev → Z-score outliers (|z| > 3)
  - Per-column: Calculate Q1, Q3, IQR → IQR outliers (below Q1-1.5*IQR or above Q3+1.5*IQR)
Step 3: Launch 1 goroutine for Benford's Law analysis:
  - Count first-digit distribution across all numeric values
  - Flag digits where observed % deviates > 10% from Benford expected %
  - Expected: {1: 30.1%, 2: 17.6%, 3: 12.5%, 4: 9.7%, 5: 7.9%, 6: 6.7%, 7: 5.8%, 8: 5.1%, 9: 4.6%}
Step 4: Wait for all goroutines (sync.WaitGroup)
Step 5: Calculate integrity score = 100 - (flaggedRows/totalRows * 100)
Step 6: Return IntegrityAnalysisResult JSON
```

### 5.3 ARIA — AI Narrative Generation
```
POST /api/v1/aria/narrative (JSON body)

System Instruction (exact):
"Anda adalah asisten interpretasi statistik akademis untuk mahasiswa Indonesia.

ATURAN WAJIB:
1. Tulis dalam Bahasa Indonesia formal akademis (EYD V).
2. SELALU cantumkan nilai statistik dari output jika ada: (t=X, p=Y, B=Z).
3. Setiap klaim teoritis WAJIB disertai referensi ilmiah (Hair et al., 2019; Ghozali, 2021).
4. JANGAN buat klaim yang tidak didukung output numerik.
5. Jika nilai p > 0.05, Anda DILARANG KERAS menyimpulkan adanya hubungan atau pengaruh. Nyatakan secara eksplisit bahwa tidak ada bukti statistik yang cukup.
6. Akhiri dengan kalimat keterbatasan penelitian.
7. Panjang: 3–4 paragraf, ≤350 kata.
8. Tambahkan label: "Generated by AI — Verifikasi diperlukan" di akhir teks.

Output HANYA narasi. Tanpa preamble, tanpa penjelasan awal/akhir."

Config: model=gemini-1.5-flash, temperature=0.3, topP=0.8, responseMIMEType=application/json
Response Schema (structured output):
{
  "status_integritas": string,
  "paragraf_pembuka": string,
  "analisis_statistik": string,
  "kesimpulan_akademis": string
}
GoogleSearch tool enabled for grounding.
PII scrubbed before sending (email, phone, NIM regex).
```

### 5.4 SIGMA — AI Test Recommendation
```
POST /api/v1/sigma/recommend (JSON body: {headers, numeric_headers, row_count})

System Instruction:
"Anda adalah pakar statistik senior dan asisten metodologi penelitian skripsi di Indonesia. Tugas Anda adalah memberikan rekomendasi uji statistik (regression vs ttest) secara dinamis, akurat, dan sangat ilmiah berdasarkan kolom-kolom dataset yang diberikan."

User Prompt Template:
"Analisis profil dataset berikut untuk merekomendasikan uji statistik yang tepat (antara 'regression' untuk Regresi Linier Berganda atau 'ttest' untuk Welch's Independent t-test):
- Nama semua kolom: {headers}
- Kolom bertipe numerik: {numericHeaders}
- Jumlah baris data: {rowCount}

Tugas Anda:
1. Tentukan jenis analisis ('regression' atau 'ttest') ...
2. Berikan label bahasa Indonesia yang mewah ...
3. Berikan alasan akademis singkat tapi mendalam ...
4. Pilih kolom dependen Y yang paling logis ...
5. Jika jenisnya 'regression', pilih kolom independen X ...
6. Jika jenisnya 'ttest', pilih kolom kelompok (group_column) ..."

Config: model=gemini-1.5-flash, temperature=0.2, responseMIMEType=application/json
Response Schema:
{
  "recommendation": string ("regression" | "ttest"),
  "label": string,
  "reason": string,
  "y_column": string,
  "x_columns": string[],
  "group_column": string
}

Local heuristic fallback if Gemini is unavailable:
- If numericHeaders >= 2 → "regression"
- If numericHeaders == 1 → "ttest"
```

### 5.5 SIGMA — OLS Regression Engine (Pure Go, No External Stats Libraries)
```
POST /api/v1/sigma/regression (JSON body)

Request: { y_column: string, x_columns: string[], data: []map[string]interface{} }

Algorithm:
1. Parse Y vector from data using convertToFloat64() (handles float64, float32, int, int64, string→float)
2. Construct X design matrix with intercept column [1, x1, x2, ..., xk]
3. QR decomposition factorization: qr.Factorize(X)
4. Solve OLS: β = (XᵀX)⁻¹ Xᵀy via qr.SolveVecTo(β, false, y)
5. Compute ŷ = Xβ (predicted values)
6. Compute SST = Σ(yi - ȳ)², SSR = Σ(yi - ŷi)²
7. R² = 1 - SSR/SST
8. Adjusted R² = 1 - (SSR/(n-k-1)) / (SST/(n-1))
9. F-statistic = ((SST-SSR)/k) / (SSR/(n-k-1))
10. F p-value via Fisher-Snedecor distribution CDF (gonum distuv.F)
11. Standard errors via (XᵀX)⁻¹ diagonal × residual variance
12. t-statistics = β_j / SE_j for each predictor
13. t p-values via Student's t-distribution CDF (gonum distuv.StudentsT)
14. Significant if p < 0.05

Response: { r_squared, adj_r_squared, f_statistic, f_pvalue, variables: [{name, coefficient, std_error, t_statistic, p_value, significant}] }
```

### 5.6 SIGMA — Welch's Independent t-Test
```
POST /api/v1/sigma/ttest (JSON body)

Request: { group_column: string, value_column: string, data: []map[string]interface{} }

Algorithm:
1. Group data by group_column string values into exactly 2 groups
2. Per group: compute N, mean, variance (sample), SD
3. Welch's t = (mean1 - mean2) / sqrt(var1/n1 + var2/n2)
4. Welch-Satterthwaite degrees of freedom:
   df = (var1/n1 + var2/n2)² / ((var1/n1)²/(n1-1) + (var2/n2)²/(n2-1))
5. P-value = 2 × (1 - CDF(|t|)) via Student's t-distribution
6. Significant if p < 0.05

Response: { test_type, group1_name, group1_n, group1_mean, group1_sd, group2_name, group2_n, group2_mean, group2_sd, t_statistic, df, p_value, significant }
```

### 5.7 SIGMA — AI Narrative for BAB IV
```
POST /api/v1/sigma/narrative (JSON body)

For Regression:
Prompt includes R², Adj R², F-stat, F p-value, and per-variable coefficients/t-stats/p-values.
Instructions: Write in formal Indonesian academic prose, cite Ghozali/Sugiyono/Hair, interpret R², F-test, and individual t-tests. No bullet points.

For T-Test:
Prompt includes both group stats and t-statistic/df/p-value.
Instructions: Describe group means comparison, explain Welch's t-test choice, interpret significance.

Config: Same as ARIA narrative (temperature=0.3, topP=0.8, structured JSON output, GoogleSearch grounding).
```

### 5.8 ATLAS — Literature Search & Gap Analysis
```
GET /api/v1/atlas/search?q=<query>
- Searches OpenAlex API (https://api.openalex.org/works?search=<query>&per-page=10)
- Response cached in Firestore (cache_atlas collection, 24h TTL)
- Maps Work objects to simplified Paper: {id, title, authors, year, citations, journal}
- Falls back to mock data if API fails

GET /api/v1/atlas/gap-map?q=<query>
- Generates bubble data for D3 visualization
- Creates known-topic bubbles + 1 "gap" bubble with is_gap=true
- Uses Gemini to generate research gap synopsis (2-3 sentences in Indonesian)

System Instruction for gap synopsis:
"Anda adalah asisten peneliti akademis senior Indonesia yang menganalisis kekosongan riset (research gap). Tulis ringkasan singkat dalam Bahasa Indonesia formal akademis tanpa preambul."

Config: temperature=0.4, topP=0.8

POST /api/v1/atlas/cite
- Generates citations in APA or IEEE format from paper metadata
```

### 5.9 NEXUS — BPS Data Integration
```
GET /api/v1/nexus/indicators
- Returns static list of BPS indicators: TPT, IPM, Kemiskinan, Pertumbuhan

GET /api/v1/nexus/province/:code?province=<name>&indicator=<id>
- Resolves province name to BPS domain code via provinceAliases map (34 provinces + "nasional")
- Fetches data from BPS WebAPI: https://webapi.bps.go.id/v1/api/list/model/data/domain/{code}/var/{varID}/key/{apiKey}/
- Caches results in Firestore (cache_bps, 24h TTL)
- Falls back to mock data [{val: 72.14, tahun: 2024}]

POST /api/v1/nexus/compare
- Compares user_value against BPS official value for a given province/indicator/year
- Calculates absolute difference and percentage deviation
- Alert levels: "high" (>5%), "medium" (>1%), "none"
- Auto-generates APA citation string
```

### 5.10 PII Scrubber
```go
// Applied to ALL prompts before sending to Gemini API
emailRegex: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,} → [EMAIL_REDACTED]
phoneRegex: (\+62|08)\d{8,12} → [PHONE_REDACTED]
nimRegex:   \b\d{10,13}\b → [NIM_REDACTED]
```

### 5.11 Caching Layer
- Uses Firestore as distributed cache
- SHA256 hash of query parameters as document key
- 24-hour TTL (entries older than 24h auto-deleted on read)
- Graceful degradation: if Firestore unavailable, cache operations silently return nil

### 5.12 Rate Limiting
- Per-IP rate limiter using `golang.org/x/time/rate`
- Configured at 100 requests/minute per user
- In-memory limiter map with sync.Mutex
- Returns HTTP 429 when exceeded

---

## 6. UI/UX & Component Styling

### Design System: Neobrutalism
The UI follows a **Neobrutalism** design aesthetic with the following characteristics:
- **Bold borders**: All components have visible black borders
- **Hard shadows**: Box shadows offset in the bottom-right direction (no blur)
- **Sharp corners**: `borderRadius: 0px` globally (except `full: 9999px`)
- **Vibrant accent colors**: Burned orange primary color

### Color Tokens (CSS Custom Properties)

**Light Mode:**
```css
--background: #fff8f6;        /* Warm White */
--foreground: #241913;        /* Dark Brown */
--primary: #c95e0a;           /* Burned Orange */
--primary-foreground: #fff8f6;
--primary-container: #be5600;
--secondary: #e0e0dc;         /* Pastel Sand */
--accent: #ffb68d;            /* Light Orange */
--destructive: #ba1a1a;       /* Red */
--border: #1c1917;            /* Ink Black */
--muted: #f3ded5;
--muted-foreground: #574238;
```

**Dark Mode:**
```css
--background: #241913;
--foreground: #fff8f6;
--primary: #c95e0a;
--secondary: #5e5f5c;
--accent: #9b4500;
--border: #fff8f6;
```

### Typography
- **Primary font**: Plus Jakarta Sans (Google Fonts, loaded via `next/font/google`)
- **Font variable**: `--font-plus-jakarta-sans`
- Headings: `font-display font-semibold tracking-tight`
- Body: `font-sans antialiased`

### Shadow System (Neobrutalism)
```css
shadow-neo: 4px 4px 0px 0px var(--foreground);
shadow-neo-sm: 2px 2px 0px 0px var(--foreground);
shadow-neo-hover: 6px 6px 0px 0px var(--foreground);
```

### Interactive States
```css
.neo-interactive:hover {
  transform: translate(-2px, -2px);
  box-shadow: shadow-neo-hover;
}
.neo-interactive:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}
```

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│ Desktop: Sidebar (left) + Content (right)       │
│ Mobile: Content (full) + Bottom Nav (fixed)     │
├─────────────────────────────────────────────────┤
│ Content Area:                                    │
│   ┌─ Topbar (breadcrumb + module title) ──────┐ │
│   │                                             │ │
│   │  Module Page Content                        │ │
│   │  (Cards, Tables, Charts, Upload Areas)      │ │
│   │                                             │ │
│   └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Responsive Rules
- `pb-[64px] md:pb-0`: Bottom padding on mobile for bottom nav clearance
- Sidebar hidden on mobile, BottomNav hidden on desktop
- Cards use responsive grid layouts (1 column mobile → 2-3 columns desktop)
- All modules follow same page structure: Topbar → Content area with overflow scroll

### Navigation Flow
```
Dashboard (/) ──→ ARIA (/aria)   ──→ Upload CSV → Analysis → AI Narrative
                  NEXUS (/nexus) ──→ Select Province → Map → Compare BPS
                  VERA (/vera)   ──→ Browse Surveys → Create/Submit
                  SIGMA (/sigma) ──→ Upload CSV → AI Recommend → Configure → Run → Narrative
                  ATLAS (/atlas) ──→ Search → Papers List → Gap Map → Citation
                  Profile (/profile)
```

### Key Component Patterns
- **Card**: `bg-card border-2 border-border shadow-neo` with `CardHeader`, `CardContent`, `CardFooter`
- **Button**: `neo-interactive` class for hover/active transforms; variants: default (primary bg), secondary, outline, ghost, destructive
- **Dialog/Modal**: Radix Dialog with backdrop blur, centered glassmorphism panels for citations
- **Select**: Radix Select with neobrutalism styling
- **Toast**: Custom toast system with success/error/info variants, auto-dismiss
- **Table**: Styled with alternating row backgrounds and bold headers

### NEXUS Interactive Map
- OpenStreetMap iframe embed (no API key needed)
- URL format: `https://www.openstreetmap.org/export/embed.html?bbox={bbox}&layer=mapnik&marker={lat},{lon}`
- Province coordinates stored as `{ lat, lon, description }` for all 34 provinces
- Map updates dynamically when province selection changes

---

## Appendix A: Complete API Route Table

| Method | Path | Handler | Auth | Description |
|--------|------|---------|------|-------------|
| GET | `/health` | `HealthCheck` | No | Health check endpoint |
| POST | `/api/v1/aria/analyze` | `AnalyzeCSV` | Yes | Upload CSV for integrity analysis |
| GET | `/api/v1/aria/reports` | `GetUserReports` | Yes | List user's reports (placeholder) |
| GET | `/api/v1/aria/report/:id` | `GetReport` | Yes | Get single report (placeholder) |
| POST | `/api/v1/aria/narrative` | `GenerateNarrative` | Yes | Generate AI academic narrative |
| GET | `/api/v1/nexus/indicators` | `GetIndicators` | Yes | List BPS indicators |
| GET | `/api/v1/nexus/province/:code` | `GetProvinceData` | Yes | Get BPS data for province |
| POST | `/api/v1/nexus/compare` | `CompareWithBPS` | Yes | Compare user data vs BPS |
| POST | `/api/v1/vera/surveys` | `CreateSurvey` | Yes | Create new survey |
| GET | `/api/v1/vera/surveys/active` | `GetActiveSurveys` | Yes | List active surveys |
| POST | `/api/v1/vera/surveys/:id/submit` | `SubmitResponse` | Yes | Submit survey response |
| POST | `/api/v1/sigma/recommend` | `RecommendTest` | Yes | AI-powered test recommendation |
| POST | `/api/v1/sigma/regression` | `RunRegression` | Yes | Execute OLS regression |
| POST | `/api/v1/sigma/ttest` | `RunTTest` | Yes | Execute Welch's t-test |
| POST | `/api/v1/sigma/narrative` | `GenerateNarrative` | Yes | AI statistical narrative |
| GET | `/api/v1/atlas/search` | `SearchLiterature` | Yes | Search OpenAlex papers |
| GET | `/api/v1/atlas/gap-map` | `GetGapMap` | Yes | Research gap visualization |
| POST | `/api/v1/atlas/cite` | `GenerateCitation` | Yes | Generate citation string |

## Appendix B: BPS Province Code Mapping (34 Provinces)

```
nasional/indonesia → 0000
aceh → 1100, sumut/sumatera utara → 1200, sumbar/sumatera barat → 1300
riau → 1400, jambi → 1500, sumsel/sumatera selatan → 1600
bengkulu → 1700, lampung → 1800, babel/bangka belitung → 1900
kepri/kepulauan riau → 2100, jakarta/dki jakarta → 3100
jabar/jawa barat → 3200, jateng/jawa tengah → 3300
diy/yogyakarta → 3400, jatim/jawa timur → 3500, banten → 3600
bali → 5100, ntb/nusa tenggara barat → 5200, ntt/nusa tenggara timur → 5300
kalbar/kalimantan barat → 6100, kalteng/kalimantan tengah → 6200
kalsel/kalimantan selatan → 6300, kaltim/kalimantan timur → 6400
kaltara/kalimantan utara → 6500, sulut/sulawesi utara → 7100
sulteng/sulawesi tengah → 7200, sulsel/sulawesi selatan → 7300
sultra/sulawesi tenggara → 7400, gorontalo → 7500
sulbar/sulawesi barat → 7600, maluku → 8100
malut/maluku utara → 8200, papua barat → 9100, papua → 9400
```

## Appendix C: Gemini AI Configuration Summary

| Feature | Model | Temperature | TopP | Response Type | GoogleSearch |
|---------|-------|-------------|------|---------------|-------------|
| ARIA Narrative | gemini-1.5-flash | 0.3 | 0.8 | JSON (structured schema) | Yes |
| SIGMA Recommend | gemini-1.5-flash | 0.2 | — | JSON (structured schema) | No |
| SIGMA Narrative | gemini-1.5-flash | 0.3 | 0.8 | JSON (structured schema) | Yes |
| ATLAS Gap Synopsis | gemini-1.5-flash | 0.4 | 0.8 | Plain text | No |
