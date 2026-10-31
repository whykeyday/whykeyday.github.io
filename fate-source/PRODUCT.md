# Fate public adaptation

User requested publishing the existing 紫微书房 feature to https://whykeyday.github.io/fate/ . Preserve original portfolio and other routes. Retain beginner-oriented Chinese form, local browser chart calculation, 13-topic complete v4 readings, courses, books and generated artistic images.
GitHub Pages static hosting; do not deploy private Bird/Brain data, saved notes, local databases or credentials. No public endpoint to the home GPU. Pre-generated thematic artwork is explicitly distinguished from personalized live generation. Site is for noncommercial traditional-culture learning.

## Platform
Web, static GitHub Pages subdirectory /fate/.

## Stack
Vite / React, reused TypeScript engine, browser worker for Zstandard streaming lookup.

## Named saved charts
User requested saving generated results by name and reopening them later. A name triggers automatic browser IndexedDB saving of normalized birth input, original form settings and the full 13-topic reading. Saved results can be searched by name and reopened without downloading the year archive again. Same name with different chart keys remains distinct. Storage is private to the current browser and origin, with no cloud sync. JSON backup download is available. No saved personal results are committed or uploaded.
