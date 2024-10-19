const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./utils/errorHandler');

const { requestLogger } = require('./middlewares/logger');

const app = express();

// Helmet to set various HTTP headers for security
app.use(helmet());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// Data sanitization against XSS attacks
app.use(xssClean());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Enable cookie parsing
app.use(cookieParser());

// Enable compression for better performance
app.use(compression());

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (Winston)
app.use(requestLogger);

const routes = require('./routes/v1');

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

module.exports = app;
