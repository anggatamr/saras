# 🔐 SARAS Security Protocol & Architecture (UU PDP Compliance)

SARAS handles extremely sensitive academic data prior to publication. As such, maintaining confidentiality and complying with Indonesia's *Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022* is our highest priority. 

This document outlines the zero-trust architecture and data security lifecycle implemented in SARAS.

## 1. Identity Verification & Authentication

### 1.1 Strict Academic Email Gating (VERA Module)
To prevent Sybil attacks and ensure the integrity of respondents, SARAS strictly enforces authentication via Firebase Auth using `.ac.id` or `.edu` domains. 

- **Frontend Enforcement:** The `AuthContext` actively checks the Google OAuth payload and immediately forces a sign-out if the email domain is unauthorized.
- **Backend Validation:** The Go middleware (`middleware/auth.go`) intercepts all requests to `/api/v1/vera/*` endpoints, decrypts the JWT Bearer token, and verifies the `email` claim against the allowed domain list before permitting access.

## 2. Personally Identifiable Information (PII) Scrubbing

### 2.1 The Problem
When utilizing the Gemini API to generate Chapter IV narratives, researchers often upload raw datasets that might contain sensitive personal information of respondents (names, student IDs/NIM, phone numbers, emails). 

### 2.2 Stateless Regex Scrubber (ARIA Module)
Before any data payload is sent from the backend to the Google AI Studio, it passes through the `internal/gemini/scrubber.go` pipeline.
This pipeline uses rigorous regex patterns to automatically identify and redact PII *in memory* before it ever leaves the server.

- **Emails:** Redacted to `[EMAIL_REDACTED]`
- **Phone Numbers (Indonesian):** Redacted to `[PHONE_REDACTED]`
- **NIM (Nomor Induk Mahasiswa):** Redacted to `[NIM_REDACTED]`

## 3. Data Storage & Lifecycle Management

### 3.1 Ephemeral Storage Policy
SARAS operates under a strict principle of data minimization.
- **Uploads:** Raw CSV datasets are processed entirely in memory whenever possible.
- **Firebase Storage Bucket Policy:** Any file uploaded to the storage bucket is tagged with a timestamp. A Cloud Function / Lifecycle rule automatically deletes all raw datasets after 24 hours. 
- **User Guarantee:** We guarantee users that their unpublished experimental data is never used for training internal models and is completely wiped from our infrastructure daily.

## 4. API & Network Security

- **CORS Configuration:** Strictly limited to the frontend domain (`https://saras-platform-73839.web.app`) in production.
- **Rate Limiting:** The API gateway enforces a rate limit of 100 requests per hour per authenticated user to prevent scraping and DDoS attacks.
- **Secret Management:** The `GEMINI_API_KEY` and Firebase credentials are never hardcoded. They are injected at runtime via Google Cloud Secret Manager into the Cloud Run environment.

---
*Document Version: 1.0.0 (Prepared for JuaraGCP 2026 Assessment)*
