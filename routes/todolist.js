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
    // db.close();
  })
});

module.exports = router;
