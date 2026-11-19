import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve project root directory in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Reads and parses a static JSON file from the /data directory.
 * Used in place of a database connection for this frontend prototype.
 */
export function readJsonFile(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawContent);
}

/**
 * Calculates win percentage rounded to one decimal place.
 */
export function calculateWinPercentage(wins, matchesPlayed) {
  if (!matchesPlayed || matchesPlayed <= 0) {
    return 0;
  }
  return Number(((wins / matchesPlayed) * 100).toFixed(1));
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a clean readable date (e.g. "19 Nov 2026").
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generates up to two uppercase initials for student avatar placeholders.
 */
export function getInitials(fullName) {
  if (!fullName) return 'TR';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns institutional summary metrics for the public landing page and admin overview.
 */
export function getPlatformSummary(students, sports, matches) {
  const safeSports = Array.isArray(sports) ? sports : [];
  const safeMatches = Array.isArray(matches) ? matches : [];
  const completedInSample = safeMatches.filter((m) => m.status === 'Completed').length;
  const upcomingInSample = safeMatches.filter((m) => m.status === 'Upcoming').length;
  const ongoingInSample = safeMatches.filter((m) => m.status === 'Ongoing').length;

  return {
    totalStudents: 450,
    registeredAthletes: 180,
    availableSports: safeSports.length,
    matchesCompleted: 64,
    sampleCompletedMatches: completedInSample,
    sampleUpcomingMatches: upcomingInSample,
    sampleOngoingMatches: ongoingInSample,
    totalScheduledMatches: safeMatches.length,
    directoryCount: Array.isArray(students) ? students.length : 12,
  };
}
