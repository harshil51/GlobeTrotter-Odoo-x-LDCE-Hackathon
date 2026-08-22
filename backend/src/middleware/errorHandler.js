const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err);

  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }

  if (err.code === 'P2025') { // Prisma: record not found
    return res.status(404).json({ error: 'Record not found' });
  }

  if (err.code === 'P2002') { // Prisma: unique constraint
    return res.status(409).json({ error: 'Resource already exists or duplicate entry' });
  }

  const status = err.status || err.statusCode || 500;
  const isCustomError = !!(err.status || err.statusCode);
  const message = isCustomError ? err.message : 'An internal server error occurred';

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
