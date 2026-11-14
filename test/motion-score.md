# Telotia line animation score — v12

535 frames at 24 fps; 22.292 seconds. Rendering interpolates at the display refresh rate.
Fixed figure paths are revealed by a traveling head. Figures never interpolate or scale into one another.

| Motif | Travel | Anticipation | Drawing | Pen lifts | Follow-through | Read hold |
|---|---:|---:|---|---:|---:|---:|
| Spark | 8f | 4f | 20f | — | 5f | 5f |
| Spiral | 7f | 2f | 25f | — | 4f | — |
| Chaos | 10f | 4f | 78f | — | 7f | 12f |
| Bridge | 10f | 5f | 10 / 10 / 12 / 24 / 5f | 4 × 2f | 8f | 12f |
| Handshake | 10f | 4f | 12 / 5 / 30 / 9 / 9f | 4 × 2f | 7f | 18f |
| Brand | 12f | 4f | T 46f / dot 7f | 8f | 9f | 42f |

Timing and spacing: each stroke has an explicit duration instead of sharing a uniform length-based speed. Monotone cubic spacing accelerates the middle, with readable beginnings and endings. Curvature adds time at the turns without stopping at each sample.

Anticipation: the head makes a small reverse preparation at the next starting point. Arcs: pen-up motion follows shallow curves. Follow-through: the light tail finishes after the leading pen has stopped. Overlap: the preceding stroke recedes as the head leaves; it clears before meaningful new ink.

Squash/stretch is restricted to the leading light and preserves its area. Staging keeps one active head, fixed centered figures, and quiet holds. Secondary action places the dot after the T and makes light reinforce the principal action. Exaggeration is in restrained speed contrast. Solid drawing preserves all contour coordinates; the rounded original icon assets support appeal. Pose-to-pose planning defines beats; straight-ahead tracing performs them.

Chaos uses six consecutive balanced Lorenz turns, three on either side, rather than the dense earlier 30-turn trace. The dot diameter is 19% of the T bar width; gap approximately 10% of the bar width. The T itself is retained from the original logo.

References: [Disney Animation](https://www.disneyanimation.com/process/animation/), [Toon Boom: animation principles](https://helpcentre.toonboom.com/hc/en-ca/articles/57087608774931-About-the-12-Principles-of-Animation).
