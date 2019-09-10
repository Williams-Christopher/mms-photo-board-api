require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
const { CLIENT_ORIGIN } = require('./config');

app.use(morgan(morganOption));
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(helmet());

// Our route handlers
app.use('/api/users', usersRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'Server error' } };
    } else {
        response = { error };
    };
    res.status(500).json(response);
});

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

module.exports = app;
