# Telotia mentor demo

Public presentation pages: `/intro/` and `/test/`. They share the same design.
`/test/` now keeps a visible, flowing rope as it traces the chaotic orbit;
`/intro/` retains the original animation. The portfolio homepage remains independent.

Recovered from Telotia/Limen PR #174, source commit
`7d4ac85754ba9a9b3fcb384c9c758bdb58a6f492` (the final code archived by
`archive/dev-2026-10-23`, merge commit `6fee055`). This preserves the warm paper
texture, Inter typography, EN/FR copy, responsive navigation, scroll logo morph,
and outline-only bridge → chaotic orbit → star → handshake animation.

These are a public design/product introduction, with the product labelled
“In development”. No private task-loop preview, authentication infrastructure,
or production deployment is included. No Telotia dev/prod files are modified.
The pages retain `noindex,nofollow`; this is indexing guidance, not access control.

## Rebuild

For the `/test/` rope revision, start from the source commit above and apply
`git apply /path/to/telotia-demo/patches/test-flowing-rope.patch` before building.
The patch contains only the public animation TypeScript changes; it enables the
flowing rope on `/test/` only. Other routes retain the original motion.

In the archived Limen checkout, install its locked dependencies and run the dev
Astro build with `LIMEN_ENV=dev`. Then run:

```sh
python telotia-demo/export.py /path/to/Limen/dist
```

To update only `/test/`, preserving `/intro/` and its existing bundles:

```sh
python telotia-demo/export.py /path/to/Limen/dist --page test
```

Keep the earlier bundles: the unchanged `/intro/` still references them.

The exporter follows only these pages' compiled bundle dependencies and copies
the allowlisted public brand, font, morph, and paper assets. URLs are namespaced
under `/telotia-demo/` to avoid interfering with the portfolio's `/assets/`.
Fonts and artwork retain their accompanying license/source notices.

GitHub Pages serves the directory index files at the extensionless URLs.
Serve the repository root locally with any static HTTP server for review.
