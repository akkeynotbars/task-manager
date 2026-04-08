import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { TaskCard } from './TaskCard';
import { api } from '../lib/api';

const COLUMNS = ['todo', 'in_progress', 'done'];

export function Board({ boardId }) {
  const { tasks, setTasks, setTask } = useTaskStore();
  const { token } = useAuthStore();
  useSocket(boardId, token);

  useEffect(() => {
    api.get(`/tasks/board/${boardId}`).then(r => setTasks(r.data));
  }, [boardId]);

  async function createTask() {
    const title = prompt('Task title:');
    if (!title) return;
    await api.post('/tasks', { boardId, title });
    // Real-time event from socket will add it to the store
  }

  const byStatus = (status) =>
    Object.values(tasks).filter(t => t.status === status);

  return (
    <div>
      <button onClick={createTask}>+ Add task</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
        {COLUMNS.map(col => (
          <div key={col}>
            <h3>{col.replace('_', ' ')}</h3>
            {byStatus(col).map(task => (
              <TaskCard key={task.id} taskId={task.id} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}