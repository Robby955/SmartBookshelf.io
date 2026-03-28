# SmartBookshelf.io

**Automated book cataloging from bookshelf photos using object detection, OCR, and LLM-based matching.**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![GCP](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com)
[![Live](https://img.shields.io/badge/Live-SmartBookshelf.io-00C853)](https://smartbookshelf.io)

![Welcome](my-app/public/welcome.png)

## How It Works

```
Bookshelf Photo → YOLOv5 Detection → Per-Book Crop → Cloud Vision OCR → LLM Matching → Cataloged Results
```

1. User uploads a bookshelf photo.
2. **YOLOv5** detects and localizes individual book spines with bounding boxes. An **SSD model** handles secondary image cropping for tightly framed extractions.
3. Each cropped spine is sent to **Google Cloud Vision API** for OCR text extraction.
4. Extracted text (often noisy, partial, or misspelled) is passed to an **LLM** that resolves fragments into structured book metadata (title, author).
5. Results are returned with confidence indicators. User corrections are captured and stored alongside image metadata, building a labeled dataset for future model improvement.

![Results](images/resultspage.png)

## Why This Is Hard

Book spine OCR is a significantly harder problem than standard document OCR:

- **Thin, vertical text** -- spines are narrow; characters are compressed and often rotated 90 degrees.
- **Artistic and variable fonts** -- publishers use decorative typefaces that break standard OCR assumptions.
- **Partial occlusion** -- books overlap, lean, or are obscured by neighboring volumes.
- **Uneven lighting and curvature** -- shelf shadows and spine curvature distort character geometry.
- **No standardized layout** -- unlike barcodes or license plates, spine text has no predictable structure.

A single-model approach fails here. The hybrid pipeline (detection → OCR → LLM) handles each failure mode at the appropriate stage.

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| **YOLOv5 for detection** | Real-time inference speed with strong small-object performance. Single-stage architecture keeps the pipeline latency low enough for interactive use. |
| **OCR + LLM hybrid** | Raw OCR output from book spines is frequently garbled. The LLM acts as a fuzzy matching layer -- resolving partial titles, correcting OCR artifacts, and disambiguating editions against known book data. Neither layer alone is sufficient. |
| **Feedback collection** | User corrections on misidentified books are captured and stored with metadata. Each correction becomes a labeled training sample, building a growing dataset for iterative model improvement. |
| **SSD secondary crop** | YOLOv5 bounding boxes can include background noise. A secondary SSD pass produces tighter crops, improving downstream OCR quality. |

## Tech Stack

| Layer | Technology |
|---|---|
| **Object Detection** | YOLOv5, SSD |
| **OCR** | Google Cloud Vision API |
| **Book Matching** | LLM Integration |
| **Backend** | Flask (Python) |
| **Frontend** | React (JavaScript) |
| **Auth** | Firebase OAuth (Google, GitHub, Email) |
| **Storage** | Google Cloud Storage |
| **Database** | Cloud SQL + Cloud SQL Proxy |
| **Deployment** | Docker → GCP Cloud Run |

---

**Live at [SmartBookshelf.io](https://smartbookshelf.io)**
