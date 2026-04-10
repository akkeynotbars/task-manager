import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { authRouter } from './routes/auth.js';
import { tasksRouter } from './routes/tasks.js';
import { boardsRouter } from './routes/boards.js';
import { registerSocketHandlers } from './socket/handlers.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: true, credentials: true }
});

const publisher = createClient({ url: process.env.REDIS_URL });
const subscriber = publisher.duplicate();

async function connectRedis() {
  let retries = 10;
  while (retries > 0) {
    try {
      await Promise.all([publisher.connect(), subscriber.connect()]);
      console.log('Redis connected');
      return;
    } catch (e) {
      console.log(`Redis not ready, retrying... (${retries} left) — ${e.message}`);
      retries--;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Could not connect to Redis');
}

await connectRedis();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use((req, _res, next) => { req.publisher = publisher; next(); });

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/boards', boardsRouter);

await subscriber.subscribe('task-updates', (message) => {
  const event = JSON.parse(message);
  io.to(`board:${event.boardId}`).emit(event.type, event);
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`API running on :${PORT}`));