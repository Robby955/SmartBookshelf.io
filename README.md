# SmartBookshelf.io

Automated book cataloging from bookshelf photos using detection, OCR, and model-assisted cleanup.

[Live site](https://www.smartbookshelf.io)  
[Current frontend source](https://github.com/Robby955/SmartBookshelfV3)  
[Demo video](https://www.youtube.com/watch?v=bgk3Jo_8e00)

![Welcome](images/welcome.png)

## What this repo is

This public repository is the technical/archive view of SmartBookshelf.

- `backend/` contains the earlier Python backend and detection/OCR experiments
- `my-app/` contains the older frontend/prototype app
- the current polished live frontend is maintained in `SmartBookshelfV3`

If you want the production-facing UI source, use the `SmartBookshelfV3` repository. If you want to understand the earlier pipeline and experiments, this repo is the useful one.

## Core idea

SmartBookshelf takes a real shelf photo and turns it into a reviewable digital catalog.

The pipeline is built around a hard input: narrow vertical book spines with partial text, glare, overlap, and messy shelf conditions.

## Pipeline overview

```
Bookshelf Photo -> Detection -> Per-book crop -> OCR -> Matching / cleanup -> Cataloged results
```

From the public code in this repo, the earlier backend stack includes:

- YOLOv5-based book detection
- per-book image crops
- Google Cloud Vision OCR
- metadata lookup and matching helpers

The current deployed backend appears to be newer than the older `backend/app.py` in this repo and now returns enriched structured data such as title, author, genre, and summaries.

## Why this project is interesting

Bookshelf OCR is much harder than normal document OCR:

- spines are thin and often partially blocked
- text is vertical, curved, stylized, or low contrast
- shelf photos are sensitive to lighting and angle
- OCR fragments often need cleanup before they resemble real books

That is why the system works better as a pipeline than as a single-step OCR demo.

## Public assets

The root image links now work again:

- [Welcome screenshot](images/welcome.png)
- [Results screenshot](images/resultspage.png)

![Results](images/resultspage.png)

## Repositories

- Production/live frontend: [Robby955/SmartBookshelfV3](https://github.com/Robby955/SmartBookshelfV3)
- Public technical/archive repo: [Robby955/SmartBookshelf.io](https://github.com/Robby955/SmartBookshelf.io)

## Live verification note

The live analysis flow is protected by Firebase auth. During testing, the live API accepted a real Firebase email/password account and successfully processed multiple real bookshelf images, returning plausible technical book matches.
