//Expressのミドルウェア。データベースとのやりとりをする。データベースはsqliteで、ファイル名はdatabase.sqlite3。テーブル名はtodos。
//todosテーブルはrowidとtodoのカラムを持つ。
//トランザクション管理を行う
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite3');

const util = require("util");

const db_run = util.promisify(db.run.bind(db));
const db_get = util.promisify(db.get.bind(db));
const db_all = util.promisify(db.all.bind(db));

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
router.put('/:rowid', async(req, res) => {
  const rowid = req.params.rowid;
  const todo = req.body.todo;
  try {
    //トランザクション開始
    await db_run("BEGIN TRANSACTION");
    //存在確認
    let data = await db_all("SELECT rowid FROM todos WHERE rowid=?", rowid);
    if (data.length == 0) {
      throw new Error("No such rowid");
    }
    //更新操作
    await db_run("UPDATE todos SET todo=? WHERE rowid=?", todo, rowid);
    //トランザクション終了
    await db_run("COMMIT");
    res.status(200).json(`update ${rowid}'s TODO`);
  }
  catch (e) {
    await db_run("ROLLBACK");
    res.status(400).json({ "Error": { "message": e.message } });
    console.error("transaction failed", e);
  }
});


//PUT /todos/
router.put('/', async(req, res) => {
  const rowid = req.body.rowid;
  const todo = req.body.todo;

  try {
    //トランザクション開始
    await db_run("BEGIN TRANSACTION");
    //存在確認
    let data = await db_all("SELECT rowid FROM todos WHERE rowid=?", rowid);
    if (data.length == 0) {
      throw new Error("No such rowid");
    }
    //更新操作
    await db_run("UPDATE todos SET todo=? WHERE rowid=?", todo, rowid);
    //トランザクション終了
    await db_run("COMMIT");
    res.status(200).json(`update ${rowid}'s TODO`);
  }
  catch (e) {
    await db_run("ROLLBACK");
    res.status(400).json(e.message);
    console.error("transaction failed", e);
  }
});

//DELETE /todos/:rowid
//todosからdonesに移動する
router.delete('/:rowid', async (req, res) => {
  const rowid = req.params.rowid;
  let todo = "";
  try {
    //トランザクション開始
    await db_run("BEGIN TRANSACTION");
    //移動元テーブルから該当データを取得する
    let data = await db_get("SELECT todo FROM todos WHERE rowid=?", rowid);
    //長さ確認して存在チェック
    if (data.length == 0) {
      throw new Error("No such rowid");
    }
    console.log(data);
    //移動元テーブルから該当データを削除する
    await db_run("DELETE FROM todos WHERE rowid=?", rowid);
    //移動先テーブルに該当データを挿入する
    await db_run("INSERT INTO dones(todo) VALUES(?)", data.todo);
    //トランザクション終了
    await db_run("COMMIT");
    res.status(200).json(`success to move ${rowid}:data.todo`);
  }
  catch (e) {
    await db_run("ROLLBACK");
    console.error(e);
    res.status(400).json(e);
    console.error("transaction failed");
  }

});

module.exports = router;