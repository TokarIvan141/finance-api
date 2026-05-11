require('dotenv').config();
const app = require('./src/app.js');
const connectMongo = require('./src/shared/database/mongo');
const prisma = require('./src/shared/database/prisma');


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectMongo();

        await prisma.$connect();
        console.log('PostgreSQL (Prisma) Connected');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();