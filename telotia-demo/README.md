# Telotia mentor demo

Public presentation pages: `/intro/` and `/test/`. They share the same design.
`/test/` uses the supplied light/dark Telotia wordmark, a theme switch, and a
short drifting thread that leads into the chaotic orbit. `/test/` also uses the
updated "Empowering people. Connecting organizations." hero with its supplied
supporting sentence and an equivalent French translation. `/intro/` retains its
original branding, copy and animation. The portfolio homepage remains independent.

The current `/test/` lower page is a company-level preview: About Telotia,
People/Organizations perspective switch, working principles, a general first-
product teaser, and contact. The earlier pharmacy product block, pharmacy About
copy, and pharmacy/pharmacist cards are removed from this route in EN and FR.

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
TypeScript and supplied brand SVG/PNG changes. No private preview source is included.

Also copy this repository's `telotia-demo/assets/resource-intro/editorial/`
directory into the archived source's `public/assets/resource-intro/editorial/`
before building. Large generated PNGs are kept as assets rather than duplicated
inside the source patch. The prompt/provenance record is `editorial/PROMPTS.md`.

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
  `#00B9AC`. On scroll the first letter crossfades into the curved-entry hook
  from the original public brand paths. The dot first arrives above the T, then
  rises another half-diameter (37.74 SVG units). Its final edge-to-edge gap above
  the hook is about 0.66 dot diameters, half a diameter closer than the previous
  revision. The travel uses a visible upward arc (160 SVG units above the
  straight interpolation at mid-travel), with the same arrival/final positions.
- Favicon: `test-favicon-rounded.svg` clips the supplied white-background black
  tau PNG to a rounded square (86-unit radius in a 538-unit viewBox). The embedded
  PNG bytes and T artwork are unchanged; corners are transparent. The icon is
  used in both themes and is independent of header-dot/theme switching.
- Hero: "Empowering people. Connecting organizations." with "Helping
  professionals work more efficiently and organizations collaborate with
  confidence." Responsive type preserves two desktop lines without shrinking
  the whole page. The French switch uses a corresponding localized headline.
- Motion: the bridge gathers into a short line on the left (normalized length
  about 0.23). A single arc-length route joins its rightward flight to the orbit,
  with one timing curve for the complete journey. The head and tail sample that
  same route continuously, so there is no stop/restart or reanchoring at the
  orbit entry. The moving tail fades until drawing begins; already drawn orbit
  lines remain visible. Star/handshake timing, pause/resume and reduced-motion
  behavior are preserved. Entry checks at 1 ms intervals measured approximately
  0.12% speed difference and 0.08 degrees of direction change across the join.

## Company preview

`TestCompanySections.astro`, `resource-test.ts`, and `company-experience.ts`
maintain the company content and interactions in the archived source. Content
follows the navigation order: Home, Products, About, Approach, then Contact.
The People / Organizations perspective section has been removed. The hero
keeps one contact button; the redundant approach shortcut has been removed.
Scroll entrances use IntersectionObserver; reduced motion shows all content
without entrance animation.

Products uses two opaque cards, Product 1 and Product 2. Native CSS sticky
positioning holds each card below the measured navigation while the next card
slides over it; no scroll interception or synthetic screenshots are used.
Product 1 is marked in development; Product 2 is a general upcoming placeholder.
Both keep only a short stay-tuned line. Reduced motion and short landscape
viewports use ordinary sequential cards. The abstract About artwork uses
intersecting horizontal and vertical alpha masks to fade all four edges, and
the footer phrases are separated with a centered middle dot.

Product cards now contain only text and the small card index; their decorative
icons and rings have been removed. About uses a clipped scroll window: the
artwork stays fixed in the viewport while its section reveals and conceals it,
then clips it completely before the next section. No scroll interception or
continuous JavaScript loop is needed. Ink opacity is 0.46 in light mode and
0.42 in dark mode. Reduced-motion and short viewports show a static inline image.
The fixed artwork anchor is lowered by one third of its rendered height from
the original centered position, one sixth of an image higher than the previous
half-height offset, to reveal more of the artwork during the scroll window.

The two editorial PNGs were generated with the built-in image_gen tool. They
are conceptual artwork, not actual team/customer/product photographs. Files and
full prompts are documented in `assets/resource-intro/editorial/PROMPTS.md`.
The About section now uses `care-connections-abstract.png`, an abstract teal/navy
ink wash with fine contour lines, replacing the landscape. Its full prompt and
official company-copy references are in `assets/resource-intro/editorial/ABOUT-ART.md`.
The dark theme uses pale blue-green ink on the existing navy surface; the
worktable remains a warm editorial photograph-style illustration. Earlier art
is retained as provenance but is no longer referenced by the About section.

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
