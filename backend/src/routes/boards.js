import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { db } from '../db/pool.js';

export const boardsRouter = Router();
boardsRouter.use(authMiddleware);

boardsRouter.get('/', async (req, res) => {
  const { rows } = await db.query(
    `SELECT b.* FROM boards b
     JOIN board_members bm ON b.id = bm.board_id
     WHERE bm.user_id = $1`,
    [req.user.id]
  );
  res.json(rows);
});

boardsRouter.post('/', async (req, res) => {
  const { name } = req.body;
  const { rows } = await db.query(
    'INSERT INTO boards (name, owner_id) VALUES ($1,$2) RETURNING *',
    [name, req.user.id]
  );
  // Auto-add creator as a member
  await db.query(
    'INSERT INTO board_members (board_id, user_id) VALUES ($1,$2)',
    [rows[0].id, req.user.id]
  );
  res.status(201).json(rows[0]);
});