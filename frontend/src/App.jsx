import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/LoginForm';
import { Board } from './components/Board';
import { api } from './lib/api';

export default function App() {
  const { user, logout } = useAuthStore();
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);

  async function loadBoards() {
    const { data } = await api.get('/boards');
    setBoards(data);
    if (data.length > 0) setActiveBoardId(data[0].id);
  }

  async function createBoard() {
    const name = prompt('Board name:');
    if (!name) return;
    const { data } = await api.post('/boards', { name });
    setBoards(b => [...b, data]);
    setActiveBoardId(data.id);
  }

  if (!user) return <LoginForm />;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <strong>Task Manager</strong>
        <span style={{ color: '#888' }}>— {user.name}</span>
        <button onClick={loadBoards}>Load boards</button>
        <button onClick={createBoard}>+ New board</button>
        <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {boards.map(b => (
          <button key={b.id} onClick={() => setActiveBoardId(b.id)}
            style={{ fontWeight: b.id === activeBoardId ? 'bold' : 'normal' }}>
            {b.name}
          </button>
        ))}
      </div>

      {activeBoardId && <Board boardId={activeBoardId} />}
    </div>
  );
}