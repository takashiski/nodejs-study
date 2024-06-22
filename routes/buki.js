import express from 'express';
import { promisify } from 'util';
import sqlite3 from 'sqlite3';


const router = express.Router();

const db = new sqlite3.Database("buki.sqlite3");

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

const bukiNames = await dbAll("SELECT * FROM weapon_name");
const mains = await dbAll("SELECT * FROM main_weapon");
const subs = await dbAll("SELECT * FROM sub_weapon");
const specials = await dbAll("SELECT * FROM special_weapon");


console.log(bukiNames);
/* GET home page. */
router.get('/', async function (req, res, next) {

  //weaponテーブルから全データを取得してbukisを更新
  const bukis = await dbAll("SELECT * FROM weapon");
  console.log("GET bukis");
  const addedBukiNames = await dbAll("SELECT weapon_name.id, weapon_name.name AS name, main_weapon.name AS main, sub_weapon.name AS sub, special_weapon.name AS special FROM weapon_name INNER JOIN weapon ON weapon.weapon_name_id = weapon_name.id JOIN main_weapon ON weapon.main_weapon_id = main_weapon.id JOIN sub_weapon ON weapon.sub_weapon_id = sub_weapon.id JOIN special_weapon ON weapon.special_weapon_id = special_weapon.id");
  console.log("GET addedBukiNames");
  console.log("addedlength", addedBukiNames.length);
  const removeIndexs = [];
  for (const [index, bukiName] of bukiNames.entries()) {
    for (const addedBukiName of addedBukiNames) {
      if (bukiName.id === addedBukiName.id) {
        console.log("remove:", addedBukiName.id, addedBukiName.name);
        removeIndexs.unshift(index);
      }
    }
  }
  removeIndexs.forEach((index) => {
    bukiNames.splice(index, 1);
  });
  console.log("Filter bukiNames");
  res.render('buki', { bukis: addedBukiNames, bukiNames, mains, subs, specials });
});

router.post("/", async (req, res, next) => {
  // res.json(req.body);
  console.log(req.body);
  let bukiNameId;
  // ブキ名が自由記入になっていたらweapon_nameテーブルへのINSERTを行う
  if (req.body.bukiNameFree !== '') {
    const name = req.body.bukiNameFree;
    await dbRun("INSERT INTO weapon_name (name) VALUES (?)", name);
    bukiNameId = await dbAll("SELECT id FROM weapon_name WHERE name = ?", name);
  }
  else {
    bukiNameId = req.body.bukiName;
  }
  console.log(bukiNameId);
  // weaponテーブルへのINSERTを行う
  await dbRun("INSERT INTO weapon (weapon_name_id, main_weapon_id, sub_weapon_id, special_weapon_id) VALUES (?,?,?,?)",
    bukiNameId,
    req.body.main,
    req.body.sub,
    req.body.special
  );
  console.log("Added buki");

  res.redirect("/buki");
});

export default router;
