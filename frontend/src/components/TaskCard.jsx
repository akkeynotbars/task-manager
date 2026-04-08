import { useTaskStore } from '../store/taskStore';
import { api } from '../lib/api';

export function TaskCard({ taskId }) {
  const task = useTaskStore(s => s.tasks[taskId]);
  const setTask = useTaskStore(s => s.setTask);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setTask({ ...task, status: newStatus }); // optimistic update
    try {
      const { data } = await api.patch(`/tasks/${task.id}`, { status: newStatus });
      setTask(data);
    } catch {
      setTask(task); // rollback
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${task.id}`);
    // Real-time event from socket will remove it from store
  }

  if (!task) return null;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <p style={{ margin: '0 0 8px', fontWeight: 500 }}>{task.title}</p>
      <select value={task.status} onChange={handleStatusChange}>
        <option value="todo">To do</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <button onClick={handleDelete} style={{ marginLeft: 8 }}>Delete</button>
    </div>
  );
}