# Jewellery photography

Every jewellery image is registered in **`lib/constants/jewellery.ts`** —
components never reference image paths directly.

The current files are **illustrative studio renders** of the site's
procedural 3D jewellery (not photographs of Sri Hari Jewellers' pieces).
Each shows a small "Illustrative render" label on the site.

## Replacing with real photographs

1. Photograph on a clean ivory / warm cream background (the page colour is
   `#FAF8F3`) with a large soft key light and a neutral rim light.
2. Export WebP (or JPEG), **2000 px+** on the long side for product and hero
   images. Don't worry about mobile sizes — `next/image` generates responsive
   AVIF/WebP variants automatically.
3. Save over the file with the same name below.
4. In `lib/constants/jewellery.ts`, update that entry's `width`/`height` and
   rewrite its `alt` to describe the actual piece.
5. When every image is a real photograph, set `USING_ILLUSTRATIVE_RENDERS = false`.
6. Rebuild. A missing file never breaks a page — a placeholder is shown and the
   build log names the file.

| File | Used for | Framing |
| --- | --- | --- |
| `hero/hero-necklace.webp` | Opening frame (landscape), "The art of gold" | 16:9, necklace centred, space inside the loop for the title |
| `hero/hero-necklace-portrait.webp` | Opening frame (phones) | ~9:19.5, necklace centred slightly below middle |
| `necklaces/temple-necklace-01.webp` | Temple necklace (front) | 4:5 |
| `necklaces/temple-necklace-02.webp` | Temple necklace (three-quarter) | 4:5 |
| `necklaces/fine-pendant-01.webp` | Pendant necklace | 4:5 |
| `bridal/bridal-set-01.webp` | Complete bridal set | 4:5 |
| `rings/solitaire-ring-01.webp` | Ring (front) | 4:5 |
| `rings/solitaire-ring-02.webp` | Ring (three-quarter) | 4:5 |
| `bangles/temple-bangle-01.webp` | Single bangle | 4:5 |
| `bangles/bangle-pair-01.webp` | Pair of bangles | 4:5 |
| `earrings/jhumka-pair-01.webp` | Jhumkas (pair) | 4:5 |
| `earrings/diamond-studs-01.webp` | Stud earrings | 4:5 |
| `jhumkas/jhumka-detail-01.webp` | Single jhumka, close | 4:5 |
| `traditional/temple-set-01.webp` | Traditional set | 4:5 |
| `contemporary/contemporary-set-01.webp` | Contemporary set | 4:5 |
| `wedding/wedding-set-01.webp` | Wedding set | 16:10 landscape |
| `everyday/everyday-set-01.webp` | Everyday pieces | 4:5 |
| `macro/pendant-detail-01.webp` | Macro — pendant | 4:5 |
| `macro/gemstone-detail-01.webp` | Macro — stone setting | 4:5 |
| `macro/gold-texture-01.webp` | Macro — gold texture | 4:5 |
| `macro/chain-detail-01.webp` | Macro — chain / pattern | 4:5 |

The social sharing image is `public/images/og-image.jpg` (1200 × 630).

Only add categories the store actually offers; to show a new category (for
example long harams), add its image here, register it in `jewellery.ts`, and
reference it from the relevant page.
