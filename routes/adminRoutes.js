import express from 'express';
import {
  renderAdminDashboard,
  renderAdminStudents,
  renderAdminSports,
  renderAdminMatches,
  renderAdminResults,
  renderAdminRankings,
} from '../controllers/adminController.js';

const router = express.Router();

// Admin Portal Routes
router.get('/dashboard', renderAdminDashboard);
router.get('/students', renderAdminStudents);
router.get('/sports', renderAdminSports);
router.get('/matches', renderAdminMatches);
router.get('/results', renderAdminResults);
router.get('/rankings', renderAdminRankings);

export default router;
