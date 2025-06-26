import express from 'express';
import routes from './routes';
import mongo from './connector/mongo';
import cors from 'cors';
import cron from 'node-cron';
import reminderService from './service/reminder.service';

async function app() {
    const server = express();
    server.use(express.json());
    server.use(cors({
        origin: '*', // Allow all origins, you can specify specific origins if needed
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
    }));
    server.use('/api', routes);
    await mongo.connectDB();
    cron.schedule("* * * * *", async function () {
        console.log(`Executing reminder cron at: ${new Date().toLocaleTimeString('en-US', {
            timeStyle: 'short',
        })}...`);
        await reminderService.fetchCurrentRemindersAndExecute();
        console.log('Reminder cron executed !');
    });
    return server;
}

export default app;
