const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite3");
// const db = new sqlite3.Database(":memory:");

/**
todosテーブル
rowid NUMBER？（SQLiteによって自動割り振り）
todo TEXT
**/
// db.run("CREATE TABLE todos (todo TEXT)");

// db.serialize(() => {
//     const stmt = db.prepare("INSERT INTO todos(todo) VALUES(?)");
//     for (let i = 0; i < 10; i++){
//         stmt.run("やること"+i);
//     }
//     stmt.finalize();
// })

//挿入
// db.run("INSERT INTO todos(todo) VALUES(?) ","やること")

//削除
// db.run("DELETE FROM lorem", (err, res) => {
//     if (err) { console.error(err) }
//     else {
//         console.log(`remove rowid=5 ${res}`);
//     }
// })

//更新
db.run("BEGIN TRANSACTION");
db.run("UPDATE todos SET todo=? WHERE rowid=10", "あたらしいやること");
db.run("COMMIT TRANSACTION")
//show table
db.each("SELECT rowid AS id, todo FROM todos", (err, row) => {
    if(err){console.error(err)}
    console.log(`${row.id} ${row.todo}`);
})


db.close();