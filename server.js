require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/sequelizeConfig');
const { reqLogger, logger } = require('./src/middlewares/logger');

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
  .then(() => {
    reqLogger.info('MySQL connected successfully via Sequelize');
  })
  .catch((err) => {
    logger.error('Unable to connect to MySQL:', err);
  });

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  reqLogger.info(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
