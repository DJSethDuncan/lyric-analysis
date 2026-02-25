import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import searchRouter from './routes/search';
import songsRouter from './routes/songs';
import leaderboardRouter from './routes/leaderboard';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/search', searchRouter);
app.use('/api/songs', songsRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
