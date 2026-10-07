# CoordinateWatch AI 🔍

> **"Don't judge the review. Investigate the pattern."**

**CoordinateWatch AI** is an explainable coordinated-review intelligence platform engineered to uncover multi-agent manipulation campaigns across ecommerce and digital content platforms.

Rather than making black-box accusations against individual reviewers, CoordinateWatch synthesizes statistical correlation, phrase cloning, temporal activity velocity, and rating polarization into transparent risk indices and explainable evidence.

---

## 🎨 Design System: "Butter + Cherry"

* **Canvas:** `#FFFDF4` (Warm editorial ivory)
* **Surface:** `#FFFFFF` (Crisp paper white)
* **Cherry:** `#E94B4B` (Critical action / elevated threat indicator)
* **Butter:** `#FFE59A` (Evidence highlighting / badges)
* **Peach:** `#FFB86B` (Medium risk accents)
* **Dark Ink:** `#30252A` (Borders / structural headings)
* **Mint:** `#79C99A` (Organic baseline / verified status)
* **Border:** `#E9E2D4` (2px ink structure)

---

## 🏗️ Architecture & Project Structure

```
coordinatewatch-ai/
├── backend/
│   ├── analytics/
│   │   ├── preprocessing.py    # Cleaning, normalization, timestamp parsing
│   │   ├── engine.py           # Multi-signal coordination detection engine
│   │   └── pdf_generator.py    # ReportLab SOC 2-aligned PDF generator
│   ├── generate_data.py        # Benchmark synthetic dataset generator
│   ├── main.py                 # FastAPI REST API & scan endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClearanceGate.jsx         # Access verification screen
│   │   │   ├── Home.jsx                  # Editorial product showcase
│   │   │   ├── TheWatch.jsx              # Operational dashboard & watchlist
│   │   │   ├── CaseFiles.jsx             # Deep dive & evidence review
│   │   │   ├── SignalScanner.jsx         # Live multi-review comparative scanner
│   │   │   ├── CoordinationLab.jsx       # Threat simulation & defense trace
│   │   │   ├── ThePosture.jsx            # Executive charts & risk matrix
│   │   │   ├── Reports.jsx               # SOC 2-aligned PDF audit reports
│   │   │   ├── FieldGuide.jsx            # 11-part complete field guide
│   │   │   └── SettingsMethodology.jsx   # Weight & threshold configuration
│   │   ├── App.jsx                       # Navigation & routing
│   │   └── index.css                     # Design system variables & styles
│   ├── tailwind.config.js
│   └── package.json
├── extension/
│   ├── manifest.json           # Chrome Manifest V3
│   ├── popup.html / popup.css / popup.js
│   ├── content.js              # Amazon & generic page extraction adapters
│   ├── background.js           # Extension service worker
│   └── icon.png
├── data/
│   └── amazon_reviews_synthetic.csv
└── docs/
```

---

## 🚀 Quick Start Guide

### 1. Backend (FastAPI)
```bash
cd backend
.\venv\Scripts\activate      # On Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation available at: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open application at: `http://localhost:5173/`

### 3. WatchLens Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle switch in the top-right corner).
3. Click **Load unpacked**.
4. Select the directory: `coordinatewatch-ai/extension`.
5. Navigate to any Amazon product page or sample review page and click the WatchLens extension icon to run real-time scans!

---

## 🧪 Analytical Pipeline & Signal Dimensions

| Signal Dimension | Algorithm & Method | Weight |
|---|---|---|
| **Text Similarity** | TF-IDF vectorization + Cosine Similarity clustering | 35% |
| **Temporal Burst** | Rolling 48h window z-score volume spike detection | 30% |
| **Rating Pattern** | Polarized 1-star / 5-star distribution skew analysis | 20% |
| **Reviewer Behaviour** | Velocity tracking & extreme-sentiment propensity scoring | 15% |

**Risk Index Bands:**
* `0 - 30`: **LOW RISK** (Organic baseline)
* `31 - 70`: **MEDIUM RISK** (Anomalies detected)
* `71 - 100`: **HIGH RISK** (Elevated coordination probability)

---

## 📋 Compliance & Disclosure

CoordinateWatch AI generates *SOC 2–aligned analytical reports* for internal Trust & Safety audit archives. The platform provides probabilistic evidence rather than subjective intent claims.
