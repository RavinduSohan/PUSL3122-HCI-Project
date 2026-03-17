import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import roomRoutes from './routes/rooms';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'furniture-visualiser-api',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found', code: 'NOT_FOUND', status: 404 });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
