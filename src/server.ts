import app from './app';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 8000;

app().then((server) => {
  server.listen(PORT, () => {
    console.log(`Reminder server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start the server:', error);
});
