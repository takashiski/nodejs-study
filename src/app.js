const express = require("express");
const app = express();
const port = 3000;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite3");



app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`example app listening on port ${port} http://127.0.0.1:3000 `);
})