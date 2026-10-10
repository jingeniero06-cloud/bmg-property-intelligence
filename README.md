# Bay Property Management Group — Property Intelligence & Forensic SEO Suite

[![Deploy to GitHub Pages](https://github.com/jingeniero06-cloud/bmg-property-intelligence/actions/workflows/deploy.yml/badge.svg)](https://github.com/jingeniero06-cloud/bmg-property-intelligence/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-1078BE?style=flat&logo=github)](https://jingeniero06-cloud.github.io/bmg-property-intelligence/)
[![Audit Score](https://img.shields.io/badge/Audit%20Score-86%2F100-success?style=flat)](https://jingeniero06-cloud.github.io/bmg-property-intelligence/audit.html)
[![Targets Audited](https://img.shields.io/badge/Crawl%20Corpus-500%20Pages-1B4073?style=flat)](https://jingeniero06-cloud.github.io/bmg-property-intelligence/audit.html)
[![White-Hat Quality](https://img.shields.io/badge/White--Hat-100%25%20No%20PBNs-FD9204?style=flat)](https://jingeniero06-cloud.github.io/bmg-property-intelligence/backlinks.html)

> **Official Property Intelligence, Forensic SEO Architecture, and Landlord Statutory Compliance Portal for Bay Property Management Group ([baymgmtgroup.com](https://www.baymgmtgroup.com/)).**

---

## 🌐 Live Application URL

- **Production GitHub Pages:** [https://jingeniero06-cloud.github.io/bmg-property-intelligence/](https://jingeniero06-cloud.github.io/bmg-property-intelligence/)

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Forensic SEO Audit & 500-Page Live Crawl Explorer (`audit.html`)
- **Weighted 7-Dimension Scorecards:** Technical SEO (98/100), Content Quality (91/100), On-Page (89/100), Images (82/100), Performance (75/100), Schema (62/100), AI/GEO Readiness (60/100) — Composite Health Score: **86 / 100**.
- **Interactive 500-Page Database Explorer:**
  - Real-time client-side instant search across all 500 crawled URLs, titles, and meta descriptions.
  - Multi-parameter filtering: HTTP status codes, content depth (<400 thin, 400-1500, >1500 pillar), meta description length, heading structure (missing H1, multiple H1), and Cloudflare TTFB response times (<500ms, 500-1000ms, >1000ms).
  - Page-level forensics inspection modal displaying canonical status, response times, word counts, and outlinks.
  - Client-side data export to **CSV** and **JSON** with 1 click.
- **Prioritized Defect Matrix:** Ready-to-deploy copy-paste remediation code snippets (e.g., `RealEstateAgent` schema JSON-LD, Cloudflare Edge Cache rules, and 410 redirects).

### 2. 🎯 100% White-Hat Backlinks Outreach CRM (`backlinks.html`)
- **Strict Quality Guarantee:** 100% White-Hat, Zero PBNs, Zero Sponsored Brokers, Zero Casino/Gambling/Crypto Spam.
- **23 Vetted High-Authority Targets:**
  - **Market 1:** Baltimore & Central Maryland (Baltimore City DHCD, Downtown Partnership of Baltimore, Johns Hopkins University, Towson University, UMBC, Baltimore REIA, MAREIA, MMHA).
  - **Market 2:** Greater Philadelphia & Southeastern PA (Center City District, Old City District, UPenn, Temple University, Drexel University, DIG REIA, PAA).
  - **Market 3:** Washington D.C. & Northern Virginia (Fairfax County FCHCD, George Washington University, Georgetown University, George Mason University, PMA DC/MD/VA, NOVA REIA).
  - **Market 4:** Tier-1 Digital PR & Business Journalism (Baltimore Business Journal, Philadelphia Business Journal, Washington Business Journal).
- **Outreach Features:**
  - Average Domain Rating: **74.2 DR** across ~1.8M+ monthly organic reach.
  - Interactive pitch modal with customized, pre-filled email pitch scripts.
  - 1-click "Copy Pitch to Clipboard" and 1-click "Launch Email Client (`mailto:`)" pre-filling recipient, subject, and body.
  - Outreach status tracking (Not Contacted, Pitched, Followed Up, Secured) persisted in browser `localStorage`.

### 3. ⚖️ Maryland Landlord Compliance Calculators (`calculators.html`)
- **Maryland 10-Day Eviction Notice & Timeline Calculator (Real Property § 8-401):**
  - Calculates exact 10-day notice expiry date, first legal District Court filing date (Form DC-CV-082), projected court hearing dates, right of redemption (pay-and-stay) rules, and 60-day warrant of restitution deadlines.
  - Custom jurisdiction alerts for Baltimore City DHCD rental licensing, lead inspection certificate requirements, and cold weather eviction rules.
- **Security Deposit Statutory Cap & Interest Validator (2024 HB 693 & § 8-203):**
  - Audits deposits against Maryland's strict **1-month statutory cap**.
  - Flags illegal overcharges and calculates the 3x statutory penalty risk under Maryland law.
  - Computes simple escrow interest accrual and generates an active countdown to the mandatory 45-day itemized deduction return deadline.
- **Landlord ROI & Self-Management Cost Estimator:**
  - Compares the financial cost of self-management turnover delays against BMG's 21-day average turnover and 99.8% collection rate.

### 4. 📰 2026 Maryland Landlord-Tenant Law & Eviction Guide (`blog.html`)
- Full 2,259-word flagship legal article styled in BMG's exact live Flatsome/Elementor 2-column theme.
- Features Patrick Freeze (Founder & Managing Partner) author bio, executive key takeaways callout box, MDE lead paint cert guidance, and interactive FAQ accordion.
- Includes 2 inline dark-mode SVG charts:
  - *Maryland Summary Ejectment vs. Eviction Timeline (Days)*
  - *Maximum Allowable Security Deposit Caps (Maryland vs. Regional Competitors)*

### 5. 📁 Executive Deliverables & Resource Hub (`downloads.html`)
- Direct download center for all official deliverables:
  - `BMG_Enterprise_SEO_Audit_Report.pdf` (586 KB)
  - `BMG_Targeted_Backlinks_Outreach_Guide.pdf` (723 KB)
  - `2026-maryland-landlord-tenant-law-eviction-guide.pdf` (1.00 MB)
  - `BMG_Outreach_Q1_NicheHybrid_v3.xlsx` (56 KB)
  - `full_500_audit_results.json` (554 KB)

---

## 🛠️ Tech Stack & Architecture

- **Front-End:** Semantic HTML5, CSS Custom Properties (BMG Brand System: Navy `#1B4073`, Blue `#1078BE`, Orange `#FD9204`), Vanilla ES6 JavaScript (Zero third-party runtime package dependencies).
- **Client-Side Data Engine:** Pre-compiled `js/data.js` containing 500 crawl records, 23 link targets, and pitch templates for instantaneous client-side searching and sorting.
- **CI/CD & Hosting:** GitHub Actions workflow (`deploy.yml`) with automated static deployment to GitHub Pages on pushes to `main`.

---

## 📜 License & Ownership

Developed for **Bay Property Management Group (BMG)**. All rights reserved. Equal Housing Opportunity.
