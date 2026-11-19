import express from 'express';
import { renderHomePage } from '../controllers/homeController.js';

const router = express.Router();

// Public Home Page
router.get('/', renderHomePage);

export default router;
