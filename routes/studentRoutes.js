import express from 'express';
import {
  renderStudentDashboard,
  renderStudentSports,
  renderStudentProfile,
  renderStudentMatches,
  renderStudentResults,
  renderStudentLeaderboard,
} from '../controllers/studentController.js';

const router = express.Router();

// Student Portal Routes
router.get('/dashboard', renderStudentDashboard);
router.get('/sports', renderStudentSports);
router.get('/profile', renderStudentProfile);
router.get('/matches', renderStudentMatches);
router.get('/results', renderStudentResults);
router.get('/leaderboard', renderStudentLeaderboard);

export default router;
