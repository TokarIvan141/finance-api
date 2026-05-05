require('dotenv').config();
const app = require('./src/app.js');
const connectMongo = require('./src/shared/database/mongo');
const pool = require('./src/shared/database/postgres');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectMongo();

        const pgClient = await pool.connect();
        console.log('PostgreSQL Connected');
        pgClient.release();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();