import { readJsonFile } from '../utils/helpers.js';

/**
 * Retrieves all 8 college sports from sports.json.
 */
export function getAllSports() {
  return readJsonFile('sports.json');
}

/**
 * Returns the 6 marquee sports featured on the public landing page.
 */
export function getFeaturedSports(limit = 6) {
  const sports = getAllSports();
  return sports.slice(0, limit);
}

/**
 * Finds a sport by its URL slug or ID.
 */
export function getSportBySlug(slug) {
  const sports = getAllSports();
  return sports.find((sport) => sport.slug === slug || sport.id === slug);
}
