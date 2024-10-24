import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import env from 'env-var';
import dotenv from 'dotenv';

import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import {
  authRouter,
  userRouter,
  resourceRouter,
  itemRouter,
  noteRouter,
} from './routers';

import * as constants from './util/constants';

require('dotenv').config();

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// declare routers
app.use('/auth', authRouter); // NOTE: Not secured
app.use('/users', userRouter); // NOTE: Completely secured to users
app.use('/resources', resourceRouter); // NOTE: Partially secured to users
app.use('/items', itemRouter);
app.use('/notes', noteRouter); // NOTE: Partially secured to users

// default index route
app.get('/', (req, res) => {
  res.send('Welcome to backend!');
});

// Custom 404 middleware
app.use((req, res) => {
  res.status(404).json({ message: 'The route you\'ve requested doesn\'t exist' });
});

app.use(validationErrorHandler);
app.use(errorHandler);

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    const port = process.env.PORT || 9090;
    app.listen(port);

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
