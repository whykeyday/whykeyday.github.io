# Keying daily Art and News archive

Routes: `/art/`, `/news/`. Original Limen resource design recovered from
`7d4ac85754ba9a9b3fcb384c9c758bdb58a6f492`: connected three-dimensional topic
field, card reader, keyboard/touch controls, chronological archive, paper and ink,
typewriter heading, typography, navigation and footer effects. The route chooses
the initial topic. Navigation and editorial identity now point to Keying's site.
Daily articles retain their own complete HTML/CSS, source links, images,
bilingual editions, card designs and media. This is separate from the portfolio
homepage and Telotia mentor demo routes.

## Daily publishing

The existing local daily-finance and daily-art generation timers supply the
dated public output under `Library/knowledge/{finance,art}/YYYY/MM/DD/`.
A daily Codex follow-up publishes that output to this repository. It checks
actual dates, never relabels an old article as today's, and preserves history.
It is a local scheduled workflow, so execution depends on the host being awake.

```powershell
python daily-site/update.py --library C:/Users/whyke/Nextcloud/Library/knowledge --push
```

Use a dedicated clean checkout. The runner refuses the wrong repository or
uncommitted changes, pulls main, syncs only public article assets, builds both
pages, checks catalog links, and stages only archive/data/bundle paths.
It never copies private finance/trading state, scripts, source notes or credentials.
Dependencies: Python with Pillow, Node, npm. `npm ci --ignore-scripts` runs only
when the local Astro dependency is missing. The pinned lockfile supports rebuilds.

Images use WebP at quality 86 with a maximum 1600px edge; layout and aspect ratios
are preserved. This keeps the full historical archive within the shared Pages
site's size budget. Original external image/provenance URLs remain unchanged.
Social card HTML remains available beside each article as `cards.html`.

To rebuild without syncing or publishing:

```sh
cd daily-site
npm ci --ignore-scripts
npm run build
python publish_build.py
```

Built bundles and design assets live under `/daily-assets/`. No changes to the
portfolio root, `/intro/`, `/test/`, Telotia dev/prod, or private previews.
