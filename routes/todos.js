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
  db.serialize(() => { 
    db.run("BEGIN TRANSACTION");
    db.run('UPDATE todos SET todo = ? WHERE rowid = ?', todo, rowid, (err, result) => {
      if (err) {
        db.run("ROLLBACK", (err) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            console.log("rollbacked");
          }
        });
        return console.log(err.message);
      }
    });
    db.run("COMMIT", (err, result) => {
      if (err) {
        console.error(err);
        res.status(400).json("something wrong for updating");
      }
      else {
        console.log(result);
        res.status(200).json(`update ${rowid}'s TODO`);
      }
    });
    
  });
});


//PUT /todos/
router.put('/', (req, res) => {
  const rowid = req.body.rowid;
  const todo = req.body.todo;
  db.serialize(() => {
    db.run("BEGIN TRANSACTION",()=>{console.log("begin transaction")});
    db.run('UPDATE todos SET todo = ? WHERE rowid = ?', todo, rowid, (err, result) => {
      if (err) {
        console.error(err);
        db.run("ROLLBACK", (err) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            console.log("rollbacked");
          }
        });
        return console.log(err.message);
      }
      console.log(result);
    });
    db.run("COMMIT", (err, result) => {
      if (err) {
        console.error(err);
        res.status(400).json("something wrong for updating");
      }
      else {
        console.log(result);
        res.status(200).json(`update ${rowid}'s TODO`);
      }
    });

  });
});

//DELETE /todos/:rowid
//todosからdonesに移動する
router.delete('/:rowid', (req, res) => {
  const rowid = req.params.rowid;
  let todo = "";
  //トランザクション開始
  try {
    db.run("BEGIN TRANSACTION",() => { 
      //移動元から該当データ取得
      db.all("SELECT rowid,todo FROM todos WHERE rowid=?", rowid, (err, result) => {
        if (err) {
          // if (err || result.length == 0) {
          console.error(err);
          throw new Error(errorMessage);
        }
        else if(result.length==0){
          const errorMessage = "not found such a rowid"
          throw new Error(errorMessage);
        }
        else {
          todo = result[0].todo;
          console.log(result)
          //該当データを元テーブルから削除
          db.run('DELETE FROM todos WHERE rowid = ?', rowid, (err) => {
            if (err) {
              const errorMessage = "canoot delete the rowid"
              throw new Error(errorMessage);
            }
            else {
              //該当データを移動先テーブルに追加
              db.run("INSERT INTO dones(todo) VALUES(?)", todo, (err) => {
                if (err) {
                  console.error(err);
                  const errorMessage = "cannot add todo"
                  throw new Error(errorMessage);
                }
                //トランザクション終了
                db.run("COMMIT", (err) => {
                  if (err) {
                    console.error(err)
                    throw new Error(err);
                  }
                  else {
                    res.json({ message: 'success' });
                  }
                });
              });
            }
          });
        }
      });
    });
  }
  catch (e) {
    db.run("ROLLBACK", () => {
      res.status(400).json(e.message);
    });
  }

});



// //DELETE /todos/:rowid
// //todosからdonesに移動する
// router.delete('/:rowid', (req, res) => {
//   const rowid = req.params.rowid;
//   let todo = "";
//   //トランザクション開始
//   db.run("BEGIN TRANSACTION", () => {
//     //移動元から該当データ取得
//     db.run("SELECT rowid,todo,done FROM todos WHERE rowid=?", rowid, (err, result) => {
//       if (err || result == []) {
//         db.run("ROLLBACK", () => {
//           db.close();
//           const errorMessage = "not found such a rowid"
//           res.status(400).json({ message: errorMessage });
//           // return errorMessage;
//           return new Error(errorMessage);
//         });
//       }
//       else {
//         todo = result;
//         //該当データを元テーブルから削除
//         db.run('DELETE FROM todos WHERE rowid = ?', rowid, (err) => {
//           if (err) {
//             db.run("ROLLBACK", (err) => {
//               db.close();
//               const errorMessage = "canoot delete the rowid"
//               res.status(400).json({ message: errorMessage });
//               return errorMessage;
//             });
//           }
//           else {
//             //該当データを移動先テーブルに追加
//             db.run("INSERT INTO dones(todo) VALUES(?)", todo, (err) => {
//               if (err) {
//                 db.run("ROLLBACK", (err) => {
//                   db.close();
//                   const errorMessage = "cannot add todo"
//                   res.status(400).json({ message: errorMessage });
//                   return errorMessage;
//                 });
//               }
//               //トランザクション終了
//               db.run("COMMIT", (err) => {
//                 db.close()
//                 if (err) {
//                   console.error(err)
//                 }
//                 else {
//                   res.json({ message: 'success' });
//                 }
//               });
//             });
            
//           }
//         });
//       }
//     });
    
//   });
// });

module.exports = router;