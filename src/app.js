const express = require('express');

const app = express();

app.use(express.json());

app.get('/ping', (req, res) => {
    res.json({ message: 'API is running', timestamp: new Date() });
});

module.exports = app;