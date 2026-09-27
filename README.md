# Sri Hari Jewellers — website

Scroll-driven, WebGL-led website for **Sri Hari Jewellers, Kappukadu, Tamil Nadu**.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · three.js /
React Three Fiber / drei · GSAP ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start
```

**`NEXT_PUBLIC_SITE_URL` is required for production builds** (see `.env.example`) — `next build` stops with an error if it is missing or points at localhost, so canonical URLs, the sitemap, robots.txt and JSON-LD always use the live domain.

## Everyday updates

| Task | Where |
| --- | --- |
| Today's gold rate | `lib/constants/goldRate.ts` (leave `null` to show "on request") |
| Phone, address, rating, WhatsApp, hours, profiles | `lib/constants/business.ts` |
| Collection names and copy | `lib/constants/collections.ts` |
| Photography (all image paths + alt text) | `lib/constants/jewellery.ts` → files in `public/images/jewellery/` |
| Pieces offered in each 3D product scene | `lib/constants/3dScenes.ts` |
| 3D models (Blender → GLB) | `public/models/` — see **3D ASSET REQUIREMENTS** there |
| Image-sequence fallback frames | `public/images/sequences/` |
| Hero film | `public/videos/` |

Only verified details are published. Opening hours, map coordinates, social
profiles and WhatsApp stay hidden (and out of structured data) until they are
filled in `business.ts`.

## How the jewellery experience works

**Loading.** Poster first → the visitor's first interaction → WebGL. Nothing
3D is downloaded before engagement, and reduced-motion / data-saver visitors
never download it.

**Device tiers** (`lib/utils/deviceCapability.ts`, `useDeviceCapability`):
full (high-end desktop: refraction, dispersion, ray-traced diamonds, contact
shadows) → optimized (desktop/tablet) → light (phones) → image (reduced
motion, data saver, no WebGL, 2G). A phone that cannot hold its frame rate
switches to the pre-rendered image sequence.

**Homepage film** (`components/3d/JewelleryStage.tsx`, `StoryRig.tsx`,
`choreography.ts`). One ScrollTrigger scrubs both the HTML chapters and the
3D. Keyframe tracks drive the camera (`CameraRig`), every piece, the moving
studio light (`AnimatedStudioLighting`) and the contact shadow; the rig damps
everything for a heavy, cinematic feel. Chapters: intro → approach → macro →
orbit → ring → jhumkas & bangle → invitation. The same stage returns behind the
final call to action.

**Product scenes** (`components/3d/ModelViewer.tsx`,
`components/jewellery/JewellerySelector.tsx`). Selecting a piece moves the
outgoing piece back into the set and brings the next forward, re-frames the
camera and passes a light over it. Drag to turn. Used on Home, Collections,
Gold and Bridal; Wedding, About and Contact stay WebGL-free.

**Materials** (`components/3d/materials/`): gold in yellow / rose / white
with micro-surface roughness, faceted gems, pearls, and `DiamondSurface`
(ray-traced refraction on the full tier). Gem glints are driven by the sweep
light (`GemGlints.tsx`).

**Models** (`JewelleryModel` → `ModelLoader` → `ModelNormalizer`): a
supplied `.glb` replaces the procedural piece automatically and is centred and
scaled to fit; failures fall back to the procedural piece.

**Imagery** (`JewelleryImage`): next/image with responsive sizes, lazy
loading, AVIF/WebP, preload only for the LCP image, and a branded placeholder
if a file is missing. "The art of gold" (`JewelleryReveal`) is the
image-based fullscreen product moment.

**Reveals** are declarative `data-reveal` attributes handled by
`components/ui/ScrollReveals.tsx` (wired up on first engagement, time-sliced).
