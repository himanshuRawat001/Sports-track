import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import homeRoutes from './routes/homeRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as the server-side templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets (CSS, JS, generated sports images, vendor libs)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount application routers
app.use('/', homeRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// Catch-all 404 handler for invalid routes
app.use((req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found — Track',
    requestedUrl: req.originalUrl,
  });
});

// Start Express server on port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Track server running at http://localhost:${PORT}`);
});
