const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trips.routes'));
app.use('/api/stops', require('./routes/stops.routes'));
app.use('/api/cities', require('./routes/cities.routes'));
app.use('/api/trip-activities', require('./routes/activities.routes'));
app.use('/api/expenses', require('./routes/expenses.routes'));
app.use('/api/public', require('./routes/public.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use(errorHandler);

module.exports = app;
