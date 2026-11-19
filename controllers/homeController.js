import { getFeaturedSports, getAllSports } from '../models/sportModel.js';
import { getFeaturedAthletes, getLeaderboard } from '../models/studentModel.js';
import { getAllMatches, getMatchesByStatus } from '../models/matchModel.js';
import { getPlatformSummary } from '../utils/helpers.js';

/**
 * Renders the public Track landing page (GET /).
 */
export function renderHomePage(req, res) {
  const allSports = getAllSports();
  const featuredSports = getFeaturedSports(6);
  const allMatches = getAllMatches();
  const upcomingMatches = getMatchesByStatus('Upcoming');
  const ongoingMatches = getMatchesByStatus('Ongoing');
  const featuredAthletes = getFeaturedAthletes(4);
  const topLeaderboard = getLeaderboard('All').slice(0, 5);
  const platformStats = getPlatformSummary([], allSports, allMatches);

  res.render('home', {
    pageTitle: 'Track — College Sports Management & Performance Tracking',
    activeNav: 'home',
    platformStats,
    featuredSports,
    upcomingMatches: [...ongoingMatches, ...upcomingMatches].slice(0, 4),
    featuredAthletes,
    topLeaderboard,
  });
}
