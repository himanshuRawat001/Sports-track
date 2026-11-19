import { readJsonFile, formatDisplayDate } from '../utils/helpers.js';

/**
 * Retrieves all matches enriched with formatted display dates.
 */
export function getAllMatches() {
  const matches = readJsonFile('matches.json');
  return matches.map((match) => ({
    ...match,
    formattedDate: formatDisplayDate(match.date),
  }));
}

/**
 * Filters matches by status: "Upcoming", "Ongoing", or "Completed".
 */
export function getMatchesByStatus(status) {
  const matches = getAllMatches();
  return matches.filter((match) => match.status.toLowerCase() === status.toLowerCase());
}

/**
 * Returns completed matches sorted by most recent date first.
 */
export function getCompletedResults() {
  return getMatchesByStatus('Completed').sort((a, b) => b.date.localeCompare(a.date));
}
