import { readJsonFile, calculateWinPercentage, getInitials } from '../utils/helpers.js';

/**
 * Retrieves all student athletes enriched with computed win rates and initials.
 */
export function getAllStudents() {
  const students = readJsonFile('students.json');
  return students.map((student) => ({
    ...student,
    initials: getInitials(student.name),
    winPercentage: calculateWinPercentage(student.wins, student.matchesPlayed),
  }));
}

/**
 * Finds a single student by ID (e.g. "STU001"). Falls back to the primary demo student.
 */
export function getStudentById(studentId) {
  const students = getAllStudents();
  const found = students.find((student) => student.id === studentId);
  return found || students[0];
}

/**
 * Returns the default demonstration student profile (Aarav Sharma - STU001).
 */
export function getDefaultStudent() {
  return getStudentById('STU001');
}

/**
 * Returns top featured athletes sorted by points for the public landing page.
 */
export function getFeaturedAthletes(limit = 4) {
  const students = getAllStudents();
  return [...students]
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

/**
 * Returns leaderboard rankings optionally filtered by sport name.
 */
export function getLeaderboard(sportFilter = 'All') {
  const leaderboard = readJsonFile('leaderboard.json');
  const enriched = leaderboard.map((entry) => ({
    ...entry,
    initials: getInitials(entry.name),
    winPercentage: calculateWinPercentage(entry.wins, entry.matchesPlayed),
  }));

  if (!sportFilter || sportFilter === 'All') {
    return enriched;
  }

  return enriched
    .filter((entry) => entry.sport.toLowerCase() === sportFilter.toLowerCase())
    .map((entry, idx) => ({ ...entry, sportRank: idx + 1 }));
}
