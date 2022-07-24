const express = require('express');
const router = express.Router();
const isAuth = require('../isAuth');
const pool = require('../db');

//TODO
router.get('/account', isAuth, (req, res) => {
  const user = {
    ...req.user,
    loggedIn: true,
  };
  res.json(user);
});

router.get('/get_panels', isAuth, async (req, res) => {
  const board_id = req.query.board_id;
  const panels = await pool.query(
    'SELECT p.id,p.panel_name,p.board_id FROM panels p INNER JOIN boards b ON p.board_id = b.id WHERE b.id = $1 and b.author_id = $2',
    [board_id, req.user.id]
  );
  res.json(panels);
});

router.get('/get_tasks', isAuth, async (req, res) => {
  const board_id = req.query.board_id;
  const tasks = await pool.query(
    'SELECT t.id, t.task_name, t.description, t.status, t.panel_id FROM tasks t INNER JOIN panels p ON t.panel_id = p.id WHERE p.board_id = $1',
    [board_id]
  );
  res.json(tasks);
});

router.post('/new_panel', isAuth, async (req, res) => {
  await pool.query(
    'INSERT INTO panels (id ,panel_name, board_id) VALUES ((SELECT MAX(id)+1 FROM panels),$1, $2)',
    [req.body.panelName, req.body.board_id]
  );

  res.status(200).send();
});

router.post('/new_task', isAuth, async (req, res) => {
  await pool.query(
    'INSERT INTO tasks (id ,panel_name, board_id) VALUES ((SELECT MAX(id)+1 FROM panels),$1, $2)',
    [req.body.panelName, req.body.board_id]
  );

  res.status(200).send();
});

router.post('/del_panel', isAuth, async (req, res) => {
  await pool.query('DELETE FROM panels WHERE id=$1', [req.body.panelId]);

  res.status(200).send();
});

router.post('/new_board', isAuth, async (req, res) => {
  await pool.query(
    'INSERT INTO boards (board_name, description, author_id) VALUES ($1, $2, $3)',
    [req.body.boardName, req.body.description, req.user.id]
  );

  res.status(200).send();
});

router.get('/dashboard', isAuth, async (req, res) => {
  const cursor = req.query.cursor;
  const boards = await pool.query(
    'SELECT b.id, b.board_name, b.description FROM boards b INNER JOIN users u ON u.id = b.author_id ORDER BY b.id DESC LIMIT 5 OFFSET $1',
    [cursor]
  );
  res.send({ cursor: cursor * 1 + 5, boards: boards.rows });
});

//TODO
router.get('/my_posts', isAuth, async (req, res) => {
  const cursor = req.query.cursor;
  //const posts = await pool.query(
  //  'SELECT u.username, u.img, p.body FROM users u INNER JOIN posts p ON u.id = p.author_id WHERE p.author_id = $1 ORDER BY p.id DESC LIMIT 5 OFFSET $2',
  //  [req.user.id, cursor]
  //);
  res.status(200).send();
});
module.exports = router;
