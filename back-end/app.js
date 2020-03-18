const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const usersRouter = require('./routes/users');
const vacationsRouter = require('./routes/vacations');
const adminRouter = require('./routes/admin');

const app = express();

/*Cors Config When Production*/
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use('/users', usersRouter);
app.use('/vacations', vacationsRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json(err.message);
});

module.exports = app;
