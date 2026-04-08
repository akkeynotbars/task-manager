import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useTaskStore } from '../store/taskStore';

export function useSocket(boardId, token) {
  const { setTask, removeTask } = useTaskStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!boardId || !token) return;

    socketRef.current = io(import.meta.env.VITE_API_URL, { auth: { token } });
    socketRef.current.emit('board:join', boardId);

    socketRef.current.on('task:created', ({ task }) => setTask(task));
    socketRef.current.on('task:updated', ({ task }) => setTask(task));
    socketRef.current.on('task:deleted', ({ taskId }) => removeTask(taskId));

    return () => {
      socketRef.current.emit('board:leave', boardId);
      socketRef.current.disconnect();
    };
  }, [boardId, token]);
}