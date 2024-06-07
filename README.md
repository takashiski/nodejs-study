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

