# Image-sequence fallback

Pre-rendered frames of the homepage film, scrubbed by scroll on a 2D canvas
(`components/hero/ImageSequence.tsx`). Used automatically when a device has no
WebGL, or when a phone cannot sustain the live 3D frame rate.

```
necklace-portrait/frame-001.webp … frame-048.webp   (phones / portrait)
necklace-wide/frame-001.webp … frame-048.webp       (landscape)
```

Frames are numbered from 001, cover the whole film (scroll 0 → 100%) at even
steps, and are detected at build time (`getSequenceSources()` in
`lib/utils/assets.ts`) — any count ≥ 2 works.

The current frames were rendered from the site's 3D scene. When Blender
animations of real pieces exist, export the same camera move as a WebP
sequence (portrait ~720 × 1560, landscape ~1440 × 810, quality ~70) and replace
these files. Keep each sequence around 1 MB.
