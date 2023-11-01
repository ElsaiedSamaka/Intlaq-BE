// Load environment variables from .env file
require("dotenv").config();

// Import necessary libraries
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const setupSocket = require("./app/socketio/socket.io");

// Import routes and database models
const authRouter = require("./app/routes/auth.routes");
const usersRouter = require("./app/routes/users.routes");
const postsRouter = require("./app/routes/posts.routes");
const tagsRouter = require("./app/routes/tags.routes");
const commentsRouter = require("./app/routes/comments.routes");
const conversationRouter = require("./app/routes/conversation.routes");
const repliesRouter = require("./app/routes/replies.routes");
const programmingLanguagesRouter = require("./app/routes/programming-languages.routes");
const jobsRouter = require("./app/routes/jobs.routes");
const db = require("./app/models");

// Create a new Express app instance
const app = express();

// Set up rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  headers: true, // Return rate limit info in the headers
});

// Apply rate limiting middleware to all requests
app.use(limiter);

// Use Helmet!
app.use(helmet())
// Use Morgen!
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}))
// Set up Passport.js middleware for authentication
require("./app/utils/passport.serializetion");
require("./app/utils/passport.strategies");
app.use(passport.initialize());
app.use(passport.session());

// Set up Swagger documentation
const swaggerDocument = require("./app/helper/swaggerDocument");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable cross-origin requests
app.use(cors({
  origin:'http://localhost:4200',
  credentials:true
}));
// cookie parser
app.use(cookieParser())
// express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  saveUninitialized: true,
}))
// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded())
// parse application/json
app.use(bodyParser.json())
// Set up error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// Set headers to allow certain HTTP methods and credentials
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Synchronize database models with database schema
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('[1;32m' , "Database synchronized");
  })
  .catch((err) => {
    console.error(err);
  });

// Define a simple route for testing purposes
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the server");
});

// Set up routes for handling authentication
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts",postsRouter);
app.use("/api/tags",tagsRouter);
app.use("/api/comments",commentsRouter);
app.use("/api/conversations",conversationRouter);
app.use("/api/replies",repliesRouter);
app.use("/api/programming-languages",programmingLanguagesRouter);
app.use("/api/jobs/applications",jobsRouter);
// Define the port to listen on
const PORT = process.env.NODE_APP_PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up a Socket.IO server for real-time communication
setupSocket(server)