import { verifyToken } from '../middleware/auth.js';

export function registerSocketHandlers(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const user = verifyToken(token);
    if (!user) return next(new Error('Unauthorized'));
    socket.user = user;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.email} connected`);

    socket.on('board:join', (boardId) => {
      socket.join(`board:${boardId}`);
    });

    socket.on('board:leave', (boardId) => {
      socket.leave(`board:${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.email} disconnected`);
    });
  });
}