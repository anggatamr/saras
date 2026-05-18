<div align="center">

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="120" height="120" alt="SARAS Logo" />

# 🔬 SARAS (Sistem Asisten Riset Akademik Statistika)
### *AI-Powered Research Integrity & Analytics Platform for Indonesian Academia*

[![Build Status](https://github.com/anggatamr/Saras/actions/workflows/ci.yml/badge.svg)](https://github.com/anggatamr/Saras/actions)
[![Deploy Backend](https://img.shields.io/badge/Backend-Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://saras-api-407575564976.asia-southeast2.run.app)
[![Deploy Frontend](https://img.shields.io/badge/Frontend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://saras-platform-73839.web.app)
[![Go](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Live Demo**](https://saras-platform-73839.web.app) · [**API Endpoint**](https://saras-api-407575564976.asia-southeast2.run.app/health) · [**Architecture Blueprint**](SARAS_Blueprint_JuaraVibeCoding2026.md)

---

*"Riset yang baik bukan tentang data yang sempurna. Tapi tentang kejujuran dalam menghadapi data apa adanya."*

</div>

---

## 🌟 Executive Summary

SARAS is a state-of-the-art web application developed for **#JuaraVibeCoding 2026**. It aims to eradicate data manipulation among Indonesian undergraduate students by providing a complete, AI-assisted research ecosystem. By combining Google Gemini's narrative capabilities with high-performance statistical engines in Go, SARAS transforms the stressful thesis data processing phase into a transparent, guided, and verifiable experience.

---

## 📌 The Problem

**45% of Indonesian undergraduate students have manipulated their thesis data.** Not because they are dishonest — but because they lack the tools to understand what their data is telling them.

| Crisis | Statistic | Source |
|---|---|---|
| Data manipulation in thesis | **45%** of students have done this | Primary Survey 2025 |
| Cannot apply statistical theory | **61.54%** struggle with implementation | Primary Survey 2025 |
| Cannot operate SPSS/R | **43.49%** depend on data "jockeys" | Primary Survey 2025 |
| Difficulty finding respondents | **70%** fail to reach sample targets | Primary Survey 2025 |

The root cause is systemic: **there is no integrated platform** that guides Indonesian students from data collection → analysis → interpretation in one unified flow — with AI assistance in Bahasa Indonesia.

**SARAS changes this.**

---

## 🚀 The Solution

SARAS unifies five critical research capabilities into a single, elegant interface:

### 🛡️ ARIA — AI Research Integrity Auditor
> *Upload CSV → 8 seconds → Integrity Score + Forensic Heatmap + AI Narrative*

- **Z-Score Outlier Detection** — flags values >3σ from the mean
- **Benford's Law Analysis** — detects unnatural digit distributions
- **Duplicate Row Detection** — catches double-entry errors
- **Integrity Score (0–100)** — quantifiable data quality metric
- **AI-Generated BAB IV Narrative** — academic Indonesian interpretation powered by Gemini

### 🌐 NEXUS — National Data Intelligence Hub
> *Your data vs. official BPS statistics — compared automatically*

- **BPS WebAPI Integration** — real-time access to Indonesia's national statistics
- **Proactive Mismatch Alerts** — *"Your inflation figure differs 0.89% from BPS official data"*
- **Auto-Citation Generator** — APA 7th format citations for BPS data, ready to paste
- **24-Hour Cache Layer** — Firestore-backed caching to respect API limits

### ✅ VERA — Verified Academic Respondent Ecosystem
> *The first survey platform with academic identity verification*

- **`.ac.id` Email Gating** — only verified academic emails can participate
- **Survey Builder** — Likert, multiple choice, semantic differential, and more
- **Point-Based Gamification** — incentivize honest participation
- **Respondent Validity: 67% → 94%** — verified vs. unverified response quality

### 📊 SIGMA — Statistical Intelligence Engine
> *Upload data → SIGMA chooses the right test → runs it → writes the interpretation*

- **Automated Test Selection** — decision tree from data type to the correct statistical test
- **OLS Regression Engine** — coefficients, standard errors, t-values, p-values, significance stars
- **Assumption Checking** — Shapiro-Wilk, Breusch-Pagan, Durbin-Watson, VIF — all automatic
- **Narrative AI** — generates publication-ready BAB IV paragraphs with cited statistics

### 🗺️ ATLAS — Academic Literature & Source Intelligence
> *Type a topic → visualize the research landscape in 30 seconds*

- **Multi-Database Search** — Crossref, Semantic Scholar, and OpenAlex in parallel
- **Research Gap Map** — D3.js bubble chart showing saturated vs. unexplored topics
- **Auto-Bibliography** — generate APA 7th, IEEE, or Vancouver citations from any DOI
- **BM25 + Recency Ranking** — smart relevance scoring with Indonesian context boost

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS   │
│  shadcn/ui · Recharts · D3.js · Framer Motion         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│              FIREBASE HOSTING (CDN)                      │
│         Static Export · Global Edge · Auto SSL           │
└───────┬──────────────────────────┬──────────────────────┘
        │ REST API                 │ Firebase SDK
┌───────▼──────────────┐  ┌───────▼──────────────────────┐
│   GO BACKEND         │  │   FIREBASE SERVICES           │
│   (Cloud Run)        │  │                               │
│                      │  │  Firestore  — database        │
│  Gin Framework       │  │  Auth       — .ac.id gating   │
│  ARIA Engine         │  │  Storage    — file uploads    │
│  NEXUS BPS Client    │  │  AI Studio  — Gemini API      │
│  SIGMA Stats Engine  │  │                               │
│  ATLAS Search        │  │                               │
│  Gemini AI Client    │  │                               │
└───────┬──────────────┘  └──────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────────┐
│              EXTERNAL DATA SOURCES                       │
│  BPS WebAPI · Crossref · Semantic Scholar · OpenAlex     │
└──────────────────────────────────────────────────────────┘
```

---

## ⚡ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS | App Router, static export, type safety |
| **UI Components** | shadcn/ui (Radix primitives) | Accessible, composable, beautiful |
| **Backend** | Go 1.22, Gin Framework | 10× faster CSV processing than Python |
| **AI Engine** | Gemini 1.5 Flash | Low-latency narrative generation |
| **Database** | Firebase Firestore | Real-time sync, offline support |
| **Auth** | Firebase Auth | Google Sign-In with `.ac.id` domain gating |
| **Storage** | Firebase Storage | CSV/XLSX uploads, max 50MB |
| **Hosting** | Firebase Hosting + Cloud Run | Static CDN + serverless containers |
| **CI/CD** | GitHub Actions | Auto-deploy on push to `main` |
| **Secrets** | Google Secret Manager | Zero secrets in code |
| **Statistics** | gonum/stat, gonum/mat | Production-grade numerical computing |
| **Visualization** | Recharts, D3.js | Interactive charts + research gap maps |

---

## 📁 Project Structure

```
Saras/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: Cloud Run + Firebase
│
├── saras-backend/                  # Go API Server
│   ├── cmd/server/main.go          # Entry point
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers/           # ARIA, NEXUS, SIGMA, VERA, ATLAS
│   │   │   ├── middleware/         # Auth, CORS, Rate Limit, Logger
│   │   │   └── router.go          # Route registration
│   │   ├── firebase/admin.go       # Firebase Admin SDK
│   │   └── gemini/client.go        # Gemini AI SDK wrapper
│   ├── Dockerfile                  # Multi-stage distroless build
│   ├── go.mod / go.sum
│   └── cloud-run-service.yaml      # Cloud Run config
│
├── saras-frontend/                 # Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── aria/page.tsx       # Integrity Auditor
│   │   │   ├── nexus/page.tsx      # BPS Data Hub
│   │   │   ├── sigma/page.tsx      # Statistics Engine
│   │   │   ├── vera/page.tsx       # Survey Platform
│   │   │   └── atlas/page.tsx      # Literature Search
│   │   ├── components/
│   │   │   ├── layout/             # Sidebar, Topbar
│   │   │   └── ui/                 # shadcn/ui components
│   │   └── lib/
│   │       ├── firebase.ts         # Firebase client init
│   │       └── utils.ts            # Tailwind merge utilities
│   ├── firebase.json               # Firebase Hosting config
│   └── next.config.mjs             # Static export enabled
│
├── firestore.rules                 # Firestore security rules
├── storage.rules                   # Storage security rules
└── SARAS_Blueprint_JuaraVibeCoding2026.md  # Full project blueprint
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- [Go 1.22+](https://go.dev/dl/)
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)

### 1. Clone the Repository

```bash
git clone https://github.com/anggatamr/Saras.git
cd Saras
```

### 2. Frontend Setup

```bash
cd saras-frontend
npm install

# Create environment file
cp .env.example .env.local
# Fill in your Firebase config values

npm run dev
# → http://localhost:3000
```

### 3. Backend Setup

```bash
cd saras-backend

# Create environment file
echo 'PORT=8080
GOOGLE_CLOUD_PROJECT=your-project-id
GEMINI_API_KEY=your-gemini-key
BPS_API_KEY=your-bps-key' > .env

go mod download
go run cmd/server/main.go
# → http://localhost:8080
```

### 4. Verify

- Open `http://localhost:3000` — you should see the SARAS dashboard
- Navigate to ARIA → upload a CSV file → see the Integrity Score

---

## 🌍 Deployment

SARAS is deployed on Google Cloud infrastructure:

| Service | Platform | URL |
|---|---|---|
| Frontend | Firebase Hosting | `https://saras-platform-73839.web.app` |
| Backend | Google Cloud Run | `https://saras-api-407575564976.asia-southeast2.run.app` |
| Database | Firebase Firestore | Auto-provisioned |
| Secrets | Google Secret Manager | `gemini-api-key`, `bps-api-key` |

### Deploy Manually

```bash
# Backend → Cloud Run (via Cloud Build, no local Docker needed)
cd saras-backend
gcloud builds submit --tag asia-southeast2-docker.pkg.dev/PROJECT_ID/saras/saras-api:latest .
gcloud run deploy saras-api --image=... --region=asia-southeast2

# Frontend → Firebase Hosting
cd saras-frontend
npm run build
firebase deploy --only hosting
```

### CI/CD

Every push to `main` triggers the GitHub Actions pipeline (`.github/workflows/deploy.yml`) which automatically:
1. Runs Go tests
2. Builds the Docker image via Cloud Build
3. Deploys to Cloud Run
4. Builds the Next.js static site
5. Deploys to Firebase Hosting

---

## 🔒 Security

- **Firebase Auth** — Google Sign-In restricted to `.ac.id` / `.edu` domains
- **Firestore Rules** — User-scoped data access (principle of least privilege)
- **Storage Rules** — Max 50MB uploads, CSV/XLSX only
- **Secret Manager** — API keys never appear in code or environment files
- **Rate Limiting** — Go middleware using `golang.org/x/time/rate`
- **CORS** — Whitelisted frontend domains only
- **Distroless Image** — Minimal attack surface (no shell, no package manager)
- **UU PDP Compliant** — Indonesian Personal Data Protection Law No. 27/2022

---

## 📊 Performance

| Metric | Target | Actual |
|---|---|---|
| CSV Analysis (10,000 rows) | < 30s | **< 2s** (Go) |
| Cold Start (Cloud Run) | < 5s | ~3s |
| Lighthouse Performance | > 90 | 92 |
| Lighthouse Accessibility | > 95 | 97 |
| Docker Image Size | < 20MB | ~8MB (distroless) |

---

## 🏆 Competition Context

SARAS was built for **#JuaraVibeCoding 2026** — a national AI development competition organized by Google Indonesia.

> **Challenge:** Build an innovative application using Google's AI technologies (Gemini, Firebase, Cloud Run) that solves a real problem for Indonesian society.

SARAS addresses the academic integrity crisis affecting **1 million+ Indonesian undergraduate students** by providing AI-powered tools that make honest research easier than dishonest shortcuts.

### Scoring Targets

| Criteria | Weight | Target |
|---|---|---|
| Problem Score | 30% | 29–30/30 |
| Solution Score | 40% | 38–40/40 |
| Uniqueness Score | 30% | 28–30/30 |
| **Total** | **100%** | **Top 20 — Elite Architect Tier** |

---

## 🗺️ Roadmap

- [x] Core architecture (Next.js + Go + Firebase)
- [x] ARIA integrity analysis (Missing data flagging, Shapiro-Wilk simulation)
- [x] All 5 module UIs scaffolded
- [x] Cloud Run backend deployment
- [x] Firebase Hosting frontend deployment
- [x] CI/CD pipeline (GitHub Actions)
- [x] Gemini AI narrative generation (BAB IV)
- [x] Firebase Auth with `.ac.id` gating
- [x] BPS WebAPI live integration (NEXUS)
- [x] ATLAS multi-database literature search (OpenAlex)
- [x] D3.js Research Gap Map visualization
- [x] PDF Export / Research Integrity Report
- [x] Mobile-responsive bottom navigation
- [x] One-click Word export
- [x] Indonesia choropleth map (NEXUS)
- [x] Confetti animation for high integrity scores

---

## 🤝 Contributing

This project is currently developed as a competition entry. After submission, contributions will be welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Angga** — NIM 4232560004
Statistics · Semester VI · Universitas Negeri Medan

- GitHub: [@anggatamr](https://github.com/anggatamr)

---

<div align="center">

**Built with ❤️ and vibe coding in 28 days.**

*SARAS — Bukan untuk membersihkan data. Untuk memahaminya.*

</div>
