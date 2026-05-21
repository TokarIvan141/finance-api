const express = require('express');
const cookieParser = require('cookie-parser');
const setupSwagger = require('./shared/utils/swagger');
const apiRouter = require('./api/router');
const errorMiddleware = require('./api/middlewares/error.middleware');
const ApiError = require('./shared/utils/ApiError');

const app = express();
setupSwagger(app);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/', apiRouter);

app.get('/ping', (req, res) => {
  res.json({ message: 'API is running', timestamp: new Date() });
});

app.use((req, res, next) => {
  next(ApiError.NotFound(`Route ${req.originalUrl} not found`));
});

app.use(errorMiddleware);

module.exports = app;
