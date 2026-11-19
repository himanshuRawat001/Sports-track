import { getAllSports } from '../models/sportModel.js';
import { getDefaultStudent, getStudentById, getLeaderboard } from '../models/studentModel.js';
import { getAllMatches, getMatchesByStatus, getCompletedResults } from '../models/matchModel.js';

/**
 * Student Portal Dashboard (GET /student/dashboard)
 */
export function renderStudentDashboard(req, res) {
  const student = getDefaultStudent();
  const allMatches = getAllMatches();
  const recentMatches = allMatches.slice(0, 5);
  const leaderboard = getLeaderboard('All');
  const studentRankEntry = leaderboard.find((item) => item.studentId === student.id);

  res.render('student/dashboard', {
    pageTitle: 'Student Dashboard — Track',
    activePortal: 'student',
    activePage: 'dashboard',
    student,
    studentRank: studentRankEntry ? studentRankEntry.rank : 3,
    recentMatches,
  });
}

/**
 * Explore Sports Catalog (GET /student/sports)
 */
export function renderStudentSports(req, res) {
  const sports = getAllSports();
  const student = getDefaultStudent();

  res.render('student/sports', {
    pageTitle: 'Explore Sports — Track Student Portal',
    activePortal: 'student',
    activePage: 'sports',
    sports,
    student,
  });
}

/**
 * Student Profile & Performance History (GET /student/profile)
 */
export function renderStudentProfile(req, res) {
  const requestedId = req.query.id || 'STU001';
  const student = getStudentById(requestedId);
  const allMatches = getAllMatches();
  const leaderboard = getLeaderboard('All');
  const rankEntry = leaderboard.find((item) => item.studentId === student.id);

  const relevantMatches = allMatches.filter((m) =>
    student.registeredSports.includes(m.sport)
  );

  res.render('student/profile', {
    pageTitle: `${student.name} · Athlete Profile — Track`,
    activePortal: 'student',
    activePage: 'profile',
    student,
    studentRank: rankEntry ? rankEntry.rank : '-',
    relevantMatches: relevantMatches.slice(0, 6),
  });
}

/**
 * Student Matches Schedule (GET /student/matches)
 */
export function renderStudentMatches(req, res) {
  const upcomingMatches = getMatchesByStatus('Upcoming');
  const ongoingMatches = getMatchesByStatus('Ongoing');
  const completedMatches = getMatchesByStatus('Completed');
  const sports = getAllSports();
  const student = getDefaultStudent();

  res.render('student/matches', {
    pageTitle: 'Matches & Fixtures — Track Student Portal',
    activePortal: 'student',
    activePage: 'matches',
    upcomingMatches,
    ongoingMatches,
    completedMatches,
    allMatches: [...ongoingMatches, ...upcomingMatches, ...completedMatches],
    sports,
    student,
  });
}

/**
 * Completed Match Results (GET /student/results)
 */
export function renderStudentResults(req, res) {
  const results = getCompletedResults();
  const sports = getAllSports();
  const student = getDefaultStudent();

  res.render('student/results', {
    pageTitle: 'Match Results — Track Student Portal',
    activePortal: 'student',
    activePage: 'results',
    results,
    sports,
    student,
  });
}

/**
 * Student Leaderboard Rankings (GET /student/leaderboard)
 */
export function renderStudentLeaderboard(req, res) {
  const leaderboard = getLeaderboard('All');
  const sports = getAllSports();
  const student = getDefaultStudent();

  res.render('student/leaderboard', {
    pageTitle: 'Leaderboard — Track Student Portal',
    activePortal: 'student',
    activePage: 'leaderboard',
    leaderboard,
    topThree: leaderboard.slice(0, 3),
    sports,
    student,
  });
}
