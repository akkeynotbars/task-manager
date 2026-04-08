import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { tasksRouter } from './routes/tasks.js';
import { boardsRouter } from './routes/boards.js';
import { registerSocketHandlers } from './socket/handlers.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true }
});

// Redis pub/sub
const publisher = createClient({ url: process.env.REDIS_URL });
const subscriber = publisher.duplicate();
await Promise.all([publisher.connect(), subscriber.connect()]);

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Attach publisher to every request so routes can publish events
app.use((req, _res, next) => { req.publisher = publisher; next(); });

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/boards', boardsRouter);

// Redis -> Socket.io broadcast
await subscriber.subscribe('task-updates', (message) => {
  const event = JSON.parse(message);
  io.to(`board:${event.boardId}`).emit(event.type, event);
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`API running on :${PORT}`));