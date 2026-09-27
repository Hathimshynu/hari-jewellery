# 3D ASSET REQUIREMENTS

The site renders **procedural stand-in jewellery** until real models are
supplied. These stand-ins are code-built illustrations, not scans or models of
Sri Hari Jewellers' actual pieces. Add a `.glb` with one of the names below and
it replaces the stand-in automatically on the next build (detection:
`lib/utils/assets.ts`; loading: `components/3d/ModelLoader.tsx`). A missing or
broken file never crashes the page — the stand-in is shown instead.

| File | Piece | Appears in |
| --- | --- | --- |
| `bridal-necklace.glb` | Temple / bridal necklace (hero piece) | Homepage film, finale, product scenes |
| `gold-ring.glb` | Solitaire ring | Homepage film, product scenes |
| `jhumka-earrings.glb` | Pair of jhumkas | Homepage film, product scenes |
| `bangle.glb` | Bangle / kada | Homepage film, product scenes |
| `pendant-necklace.glb` | Chain with pendant | Collections & gold product scenes |
| `stud-earrings.glb` | Pair of studs | Collections product scene |

## Blender workflow

```
Blender model → clean geometry → UVs → PBR textures → export GLB → compress (Draco or Meshopt) → /public/models
```

1. **Geometry** — apply all modifiers and transforms. Remove hidden, helper and
   duplicate objects, unused materials and empty nodes. Merge by distance.
2. **Polygon budget** — hero necklace ≤ 250k triangles; other pieces ≤ 80k.
   Use normal maps for fine engraving instead of geometry where possible.
3. **UVs** — non-overlapping UVs for any textured surface.
4. **Materials (glTF Principled BSDF)**
   - Gold: Metallic 1, Roughness 0.12–0.28, base colour ≈ `#F6CD7E` (yellow).
   - Name gold materials with the word **`gold`** (e.g. `gold_polished`,
     `gold_satin`) and the site applies its own tuned gold automatically, so
     every piece matches. Include `satin` or `matte` for brushed areas.
     Use a name without "gold" to keep your own material.
   - Gems: glTF transmission + volume (`KHR_materials_transmission`,
     `KHR_materials_volume`, `KHR_materials_ior`); diamonds IOR 2.42.
   - Pearls: low roughness dielectric with sheen (`KHR_materials_sheen`).
5. **Textures** — 2048 px maximum (1024 px for small pieces); WebP or KTX2
   where possible. Share texture sets between pieces.
6. **Orientation & scale** — **Forward +Z** (front of the piece faces the
   camera), **Up +Y**, origin at the visual centre, ~1 unit = 1 metre.
   Scale and origin are normalised automatically (`ModelNormalizer.tsx`
   centres the bounding box and fits the largest side), so a different scale
   still works — but orientation must be correct.
7. **Framing** — hang necklaces as if worn (pendant lowest, clasp at the back).
   Rings upright with the stone at the top. Earrings as a pair, side by side.
8. **Export** — glTF 2.0 Binary (`.glb`), +Y up, apply modifiers, include
   custom normals, no cameras or lights.
9. **Compress** — e.g. `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`
   (Meshopt also works). The Draco decoder is self-hosted in `/public/draco`.

**Size targets:** hero necklace < 5–8 MB, other pieces < 3–5 MB. Never ship a
50–100 MB model; optimise it first.

After adding files, run `npm run build` and check the homepage film and the
product scenes on `/collections`, `/gold-jewellery` and `/bridal`.
