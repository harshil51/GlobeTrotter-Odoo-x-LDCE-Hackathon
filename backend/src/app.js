const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security HTTP Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Global Rate Limiter: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Allow both port 5173 and 5174 (Vite's dev server)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'GlobeTrotter API is running' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'GlobeTrotter API is running' }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trips.routes'));
app.use('/api/stops', require('./routes/stops.routes'));
app.use('/api/cities', require('./routes/cities.routes'));
app.use('/api/trip-activities', require('./routes/activities.routes'));
app.use('/api/expenses', require('./routes/expenses.routes'));
app.use('/api/public', require('./routes/public.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/travel', require('./routes/travel.routes'));

// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));

// Global error handler
app.use(errorHandler);

module.exports = app;
