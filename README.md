
# Node.js Sequelize Base Setup

This is a base setup for Node.js projects using Sequelize ORM. It provides a structured foundation for building scalable web applications with a focus on database operations and separation of concerns.

## Project Structure

Base_setup/  
├── src/   
│ ├── config/   
│ ├── controllers/   
│ ├── dao/   
│ ├── middlewares/   
│ ├── models/   
│ ├── routes/   
│ ├── services/   
│ ├── utils/  
│ └── app.js   
├── tests/   
├── migrations/   
├── seeders/   
├── .env   
├── .env.sample   
├── server.js   
└── package.json  

## Key Features

- **Sequelize ORM**: For database operations and management
- **Express.js**: Web application framework
- **Structured Project Layout**: Organized for scalability and maintainability
- **DAO Pattern**: Implements Data Access Object pattern for database interactions
- **Middleware Setup**: Including authentication, error handling, and logging
- **Winston Logger**: Provides separate request and error logs with daily rotation and size limits for efficient log management.
- **Testing Environment**: Ready for implementing unit and integration tests

## DAO Concept

This project utilizes the Data Access Object (DAO) pattern to abstract and encapsulate all access to the data source. The DAO manages the connection with the data source to obtain and store data. It provides a separation between the database and business layers of the application, making it easier to manage and maintain database operations.

## Getting Started

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.sample` to `.env` and configure your environment variables.
4. Set up your database.
5. Run migrations: `npx sequelize-cli db:migrate --config src/config/database.js`.
6. Run seeder: `npx sequelize-cli db:seed:all --config src/config/database.js`.
7. Start the server: `npm start`.

## Scripts

- `npm start`: Start the server.
- `npm test`: Run tests.
- `npm run dev`: Start the server with nodemon for development.

## Database Management

- Use `npx sequelize-cli` for generating models, migrations, and seeders.
- Run migrations: `npx sequelize-cli db:migrate --config src/config/database.js`.
- Create seeders: `npx sequelize-cli seed:generate --name demo-user`.
- Run seeders: `npx sequelize-cli db:seed:all --config src/config/database.js`.

## Winston Logger

This project uses the [Winston](https://github.com/winstonjs/winston) logging library to handle logging for both requests and errors. The logging setup includes:

- **Request Logger**: Logs details about incoming HTTP requests (method, URL, status code, and response time) to `logs/request/request{date}.log`. 
- **Error Logger**: Logs error details to `logs/error/error{date}.log` for easier debugging.
- **Daily Rotation**: The log files are rotated daily, with a maximum size of 5MB for each log file. Once a log file exceeds this size, a new log file is created. Log files are retained for 14 days.
  
Log rotation is managed using the `winston-daily-rotate-file` transport, which helps in keeping log files organized and manageable.
