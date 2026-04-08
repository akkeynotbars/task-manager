import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { db } from '../db/pool.js';

export const tasksRouter = Router();
tasksRouter.use(authMiddleware);

// Get all tasks for a board
tasksRouter.get('/board/:boardId', async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM tasks WHERE board_id=$1 ORDER BY position',
    [req.params.boardId]
  );
  res.json(rows);
});

// Create a task
tasksRouter.post('/', async (req, res) => {
  const { boardId, title, description } = req.body;
  const { rows } = await db.query(
    'INSERT INTO tasks (board_id, title, description) VALUES ($1,$2,$3) RETURNING *',
    [boardId, title, description]
  );
  await req.publisher.publish('task-updates', JSON.stringify({
    type: 'task:created', boardId, task: rows[0]
  }));
  res.status(201).json(rows[0]);
});

// Update a task
tasksRouter.patch('/:id', async (req, res) => {
  const { status, title, assigneeId } = req.body;
  const { rows } = await db.query(
    `UPDATE tasks SET status=COALESCE($1,status), title=COALESCE($2,title),
     assignee_id=COALESCE($3,assignee_id), updated_at=NOW()
     WHERE id=$4 RETURNING *`,
    [status, title, assigneeId, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
  await req.publisher.publish('task-updates', JSON.stringify({
    type: 'task:updated', boardId: rows[0].board_id, task: rows[0]
  }));
  res.json(rows[0]);
});

// Delete a task
tasksRouter.delete('/:id', async (req, res) => {
  const { rows } = await db.query(
    'DELETE FROM tasks WHERE id=$1 RETURNING *', [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
  await req.publisher.publish('task-updates', JSON.stringify({
    type: 'task:deleted', boardId: rows[0].board_id, taskId: rows[0].id
  }));
  res.sendStatus(204);
});