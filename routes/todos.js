//Expressのミドルウェア。データベースとのやりとりをする。データベースはsqliteで、ファイル名はdatabase.sqlite3。テーブル名はtodos。
//todosテーブルはrowidとtodoのカラムを持つ。
//トランザクション管理を行う
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite3');

//GET /todos
router.get('/', (req, res) => {
  db.all('SELECT rowid, todo FROM todos', (err, rows) => {
    res.json(rows);
  });
});

//POST /todos
router.post('/', (req, res) => {
  const todo = req.body.todo;
  console.log(req.body)
  console.log(req.params)
  db.run('INSERT INTO todos(todo) VALUES(?)', todo, (err) => {
    res.json({ message: 'success' });
  });
});

//PUT /todos/:rowid
router.put('/:rowid', (req, res) => {
  const rowid = req.params.rowid;
  const todo = req.body.todo;
  db.run('UPDATE todos SET todo = ? WHERE rowid = ?', todo, rowid, (err) => {
    res.json({ message: 'success' });
  });
});

//DELETE /todos/:rowid
router.delete('/:rowid', (req, res) => {
  const rowid = req.params.rowid;
  db.run('DELETE FROM todos WHERE rowid = ?', rowid, (err) => {
    res.json({ message: 'success' });
  });
});

module.exports = router;