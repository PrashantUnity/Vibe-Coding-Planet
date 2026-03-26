/** Simulated Lighthouse-style scores driving world scale */
export const parsedWebsiteData = {
  performanceScore: 85,
  accessibilityScore: 90,
  seoScore: 100,
  warningsAndErrors: 12,
};

export const PLANET_RADIUS = 50 + parsedWebsiteData.performanceScore;

/** Sea surface radius (matches terrain + water mesh). */
export const WATER_LEVEL_OFFSET = 0.5;
export const WATER_LEVEL_RADIUS = PLANET_RADIUS - WATER_LEVEL_OFFSET;
export const TREE_COUNT = parsedWebsiteData.seoScore * 8;
export const ROCK_COUNT = Math.floor(TREE_COUNT * 0.6);
/** Short grass blades (instanced cones) on dry, moderate slopes. */
export const GRASS_COUNT = Math.min(3200, Math.floor(TREE_COUNT * 3));
export const ANIMAL_COUNT = Math.floor(parsedWebsiteData.accessibilityScore / 2);
export const ENEMY_COUNT = parsedWebsiteData.warningsAndErrors;

export const PLAYER_SPEED = 24;
export const PLAYER_HEIGHT = 2.0;
export const PITCH_LIMIT = Math.PI / 2 - 0.1;
export const DAY_SPEED = 0.05;

export const gameConfig = {
  parsedWebsiteData,
  PLANET_RADIUS,
  WATER_LEVEL_OFFSET,
  WATER_LEVEL_RADIUS,
  TREE_COUNT,
  ROCK_COUNT,
  GRASS_COUNT,
  ANIMAL_COUNT,
  ENEMY_COUNT,
  PLAYER_SPEED,
  PLAYER_HEIGHT,
  PITCH_LIMIT,
  DAY_SPEED,
};
