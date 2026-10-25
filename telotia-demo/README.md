# Telotia mentor demo

Public presentation pages: `/intro/` and `/test/`. They share the same design.
`/test/` uses the supplied light/dark Telotia wordmark, a theme switch, and a
short drifting thread that leads into the chaotic orbit. `/test/` also uses the
updated "Empowering people. Connecting organizations." hero with its supplied
supporting sentence and an equivalent French translation. `/intro/` retains its
original branding, copy and animation. The portfolio homepage remains independent.

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

For the current `/test/` revision, start from the source commit above and apply
`git apply /path/to/telotia-demo/patches/test-themes-and-leading-thread.patch`
before building. This is a complete patch against the archived source commit;
do not apply the earlier `test-flowing-rope.patch` first. The earlier patch is
retained as revision history only. The current patch contains public Astro,
TypeScript and supplied brand SVG changes. No private preview source is included.

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

## Test page themes and motion

Use `?theme=light` or `?theme=dark` to share an explicit theme. Otherwise the
saved choice takes priority over the system preference. The header switch saves
the choice locally; EN/FR also translates its accessible label. Reduced motion
keeps a static bridge and disables continuous motion.

- Light: existing warm paper `#F8F6F2`, existing typography and page rhythm.
- Dark: blue graphite `#101C26`, primary text `#F7F9F8`, secondary `#B7C6CF`,
  accent `#56D5C9`, surfaces `#172934` / `#1D323F`.
- Branding: native SVG companions of the supplied scale1/2/3 PNGs. Their
  outlines are identical, with exact approved ink `#282D32` / `#F7F9F8` and dot
  `#00B9AC`. The first letter remains the exact supplied tau outline on scroll;
  the original dot moves smoothly above it as the suffix fades.
- Hero: "Empowering people. Connecting organizations." with "Helping
  professionals work more efficiently and organizations collaborate with
  confidence." Responsive type preserves two desktop lines without shrinking
  the whole page. The French switch uses a corresponding localized headline.
- Motion: the bridge gathers into a short line on the left (normalized width
  0.23, down from 0.58). It floats right for 1.2 seconds with a soft fading tail,
  then its final endpoint traces the orbit. Tail opacity affects only the spare
  thread; already drawn orbit lines remain visible. Star/handshake timing,
  pause/resume and reduced-motion behavior are preserved.

The custom palette is informed by [NHS colour and contrast guidance](https://service-manual.nhs.uk/design-system/styles/colour)
and [IBM Carbon's role-based theme/layer model](https://www.carbondesignsystem.com/building-blocks/foundations/themes/overview).
These are design references, not claims that the demo uses their components.
Measured text/button contrast on the base surfaces: light secondary 6.61:1,
light CTA 8.39:1, dark secondary 9.86:1, dark CTA 9.67:1.

The exporter follows only these pages' compiled bundle dependencies and copies
the allowlisted public brand, font, morph, and paper assets. URLs are namespaced
under `/telotia-demo/` to avoid interfering with the portfolio's `/assets/`.
Fonts and artwork retain their accompanying license/source notices.

GitHub Pages serves the directory index files at the extensionless URLs.
Serve the repository root locally with any static HTTP server for review.
