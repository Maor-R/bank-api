import express from 'express';
import dotenv from 'dotenv';
// import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fileDirName from './utils/file-dir-name.js';

import users from './routes/userRoutes.js';
import accounts from './routes/accountRoutes.js'

import errorHandler from './middleware/errorHandler.js';

import connectDB from './config/db.js';

const { __dirname, __filename } = fileDirName(import.meta);
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
// app.use("/", express.static("client/build"));

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Body parser middleware
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bank API'
  });
});

app.use('/api/v1/users', users);
app.use('/api/v1/accounts', accounts);

app.use(errorHandler);


app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});


const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});