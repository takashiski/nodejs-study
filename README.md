# express + sqliteを使ったアプリケーション開発の練習

## 必須事項

* expressを使う
* SQLiteを使う（!= sqlite3ライブラリ）
* SQLを取り扱うにあたって次の二つを考慮する
  * Placeholderを使うこと
  * トランザクション管理をすること

## express-generatorを使って初期ファイルを生成する

https://expressjs.com/en/starter/generator.html

```sh
npx express-generator
npm install
```


## ルーティング

https://expressjs.com/en/starter/basic-routing.html

get,post,put,deleteでCRUD実現できそう

## テスト用コマンド

powershellで各操作を呼ぶコマンド

### 一覧取得

GETで/todosを呼ぶ

```powershell
Invoke-Webrequest -Method GET -Uri "http://127.0.0.1/todos"
```

### 新規追加

新しいtodoを追加する

```powershell
Invoke-Webrequest -Method POST -Body @{todo="新しいTODO"} -Uri "http://127.0.0.1:3000/todos"
```

### 既存TODOの更新

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:3000/todos/15" -Method PUT -Body '{"todo":"new todo"}' -ContentType "application/json"
```

### 既存TODOの削除

```powershell
Invoke-Webrequest -Method DELETE -Uri "http://127.0.0.1:3000/todos/18"
```


