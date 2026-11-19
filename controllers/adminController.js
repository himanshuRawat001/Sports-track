import { getAllStudents, getLeaderboard } from '../models/studentModel.js';
import { getAllSports } from '../models/sportModel.js';
import { getAllMatches, getCompletedResults } from '../models/matchModel.js';
import { getPlatformSummary } from '../utils/helpers.js';

/**
 * Admin Overview Dashboard (GET /admin/dashboard)
 */
export function renderAdminDashboard(req, res) {
  const students = getAllStudents();
  const sports = getAllSports();
  const matches = getAllMatches();
  const completedResults = getCompletedResults();
  const stats = getPlatformSummary(students, sports, matches);

  const recentActivities = [
    { action: 'Result verified', detail: 'Chess Round 7 · Siddharth Verma defeated Tanvi Deshpande', time: '2 hours ago' },
    { action: 'Live fixture started', detail: 'Cricket Grand Final · MCA Mavericks vs MBA Royals', time: '4 hours ago' },
    { action: 'Squad registration', detail: '12 athletes confirmed for 100m Track Championship', time: 'Yesterday' },
    { action: 'Scorecard logged', detail: 'Basketball Quarterfinal · MCA Falcons 68 - 61 ECE Mavericks', time: '2 days ago' },
  ];

  res.render('admin/dashboard', {
    pageTitle: 'Admin Dashboard — Track',
    activePortal: 'admin',
    activePage: 'dashboard',
    stats,
    sports,
    students: students.slice(0, 6),
    completedResults: completedResults.slice(0, 4),
    recentActivities,
  });
}

/**
 * Manage Students Directory (GET /admin/students)
 */
export function renderAdminStudents(req, res) {
  const students = getAllStudents();
  const sports = getAllSports();
  const departments = [...new Set(students.map((s) => s.department))];

  res.render('admin/students', {
    pageTitle: 'Manage Students — Track Admin',
    activePortal: 'admin',
    activePage: 'students',
    students,
    sports,
    departments,
  });
}

/**
 * Manage Sports Catalog (GET /admin/sports)
 */
export function renderAdminSports(req, res) {
  const sports = getAllSports();

  res.render('admin/sports', {
    pageTitle: 'Manage Sports — Track Admin',
    activePortal: 'admin',
    activePage: 'sports',
    sports,
  });
}

/**
 * Manage Matches Schedule (GET /admin/matches)
 */
export function renderAdminMatches(req, res) {
  const matches = getAllMatches();
  const sports = getAllSports();

  res.render('admin/matches', {
    pageTitle: 'Manage Matches — Track Admin',
    activePortal: 'admin',
    activePage: 'matches',
    matches,
    sports,
  });
}

/**
 * Manage Match Results & Score Entry (GET /admin/results)
 */
export function renderAdminResults(req, res) {
  const matches = getAllMatches();
  const completedResults = getCompletedResults();
  const pendingMatches = matches.filter((m) => m.status !== 'Completed');
  const sports = getAllSports();

  res.render('admin/results', {
    pageTitle: 'Manage Results — Track Admin',
    activePortal: 'admin',
    activePage: 'results',
    completedResults,
    pendingMatches,
    sports,
  });
}

/**
 * Admin Performance Rankings Overview (GET /admin/rankings)
 */
export function renderAdminRankings(req, res) {
  const leaderboard = getLeaderboard('All');
  const sports = getAllSports();
  const mostWins = [...leaderboard].sort((a, b) => b.wins - a.wins).slice(0, 5);
  const highestPoints = [...leaderboard].sort((a, b) => b.points - a.points).slice(0, 5);

  res.render('admin/rankings', {
    pageTitle: 'Rankings & Standings — Track Admin',
    activePortal: 'admin',
    activePage: 'rankings',
    leaderboard,
    sports,
    mostWins,
    highestPoints,
  });
}
