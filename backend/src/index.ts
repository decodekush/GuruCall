import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config, { validateConfig } from './config/index.js';
import { connectDatabase } from './utils/database.js';
import logger from './utils/logger.js';
import { twilioRoutes, apiRoutes } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate configuration
validateConfig();

// Initialize Express app
const app: Express = express();

// Middleware
app.use(cors({
  origin: config.nodeEnv === 'development' ? '*' : [config.baseUrl, config.frontendUrl],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Increase body size limit for audio data (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (audio responses)
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));

// Request logging middleware (skip health checks)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    // Skip logging for health check endpoint
    if (req.originalUrl === '/api/health') {
      return;
    }
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api/twilio', twilioRoutes);
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'GuruCall API',
    version: '1.0.0',
    description: 'Voice-based AI Tutor Backend',
    status: 'running',
    endpoints: {
      health: '/api/health',
      categories: '/api/categories',
      testAI: 'POST /api/test-ai',
      testTTS: 'POST /api/test-tts',
      twilioVoice: 'POST /api/twilio/voice',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error',
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(config.port, () => {
      logger.info(`🚀 GuruCall server running on http://localhost:${config.port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(`🤖 AI Model: Groq ${config.groq.model}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer();

export default app;
