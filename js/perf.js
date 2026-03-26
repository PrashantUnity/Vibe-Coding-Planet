/**
 * Central tuning knobs for CPU/GPU cost vs visual fidelity.
 */
export const PERF = {
  /** Planet land mesh (width × height segments). ~80² ≈ 6.5k verts vs 128² ≈ 16k. */
  landSphereWidthSegs: 80,
  landSphereHeightSegs: 80,
  /** Icosahedron subdivision for water (3 = fewer triangles than 4). */
  waterIcosahedronDetail: 3,
  /** Background sky sphere segments. */
  skyDomeSegs: 24,
  /** Cap DPR on high-DPI displays (saves fill rate). */
  maxPixelRatio: 1.75,
  /** Directional shadow map resolution (1024 is a good balance). */
  shadowMapSize: 1024,
  /** Point sprites updated each frame. */
  fireflyCount: 600,
  /** Starfield point count. */
  starCount: 1200,
};
