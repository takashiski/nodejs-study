var express = require('express');
var router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite3");



/* GET home page. */
router.get('/', function (req, res, next) {
  let todos = [];
  let dones = [];
  db.serialize(() => {
    db.all("SELECT rowid, todo FROM todos", (err,result) => {
      todos = result;
      console.log(result);
      // console.log(result);
      db.all("SELECT rowid, todo FROM dones", (err, result) => {
        dones = result
        console.log(result);
        res.render('todolist', { todos: todos,dones:dones });
      })
    })
  })
});

router.post("/", (req, res,next) => {
  const todo = req.body.todo;
  db.run("INSERT INTO todos(todo) VALUES(?)", todo, (err) => {
    res.redirect("/todolist");
  });
});

module.exports = router;
