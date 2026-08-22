const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  
  if (err.code === 'P2025') { // Prisma: record not found
    return res.status(404).json({ error: 'Record not found' });
  }

  if (err.code === 'P2002') { // Prisma: unique constraint
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
