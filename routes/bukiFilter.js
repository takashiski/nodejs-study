//ブキの絞り込み機能のルーティング

import express from 'express';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const router = express.Router();
const db = new sqlite3.Database('buki.sqlite3');
const dbAll = promisify(db.all).bind(db);
const items = "weapon.name AS name,"
    + "weapon.id AS id,"
    + "main_weapon.name AS mainWeaponName,"
    + "sub_weapon.name AS subWeaponName,"
    + "special_weapon.name AS specialWeaponName,"
    + "main_weapon_type.name AS mainWeaponTypeName,"
    + "weapon.main_weapon_id AS mainWeaponId,"
    + "weapon.sub_weapon_id AS subWeaponId,"
    + "weapon.special_weapon_id AS specialWeaponId,"
    + "main_weapon.type_id AS mainWeaponTypeId";
console.log(items);
const results = Promise.all([
    dbAll('SELECT ' + items + '  FROM weapon INNER JOIN main_weapon ON weapon.main_weapon_id = main_weapon.id INNER JOIN sub_weapon ON weapon.sub_weapon_id = sub_weapon.id INNER JOIN special_weapon ON weapon.special_weapon_id = special_weapon.id JOIN main_weapon_type ON main_weapon.type_id = main_weapon_type.id'),
    dbAll('SELECT * FROM sub_weapon'),
    dbAll('SELECT * FROM special_weapon')
])
const [bukiList, subWeaponList, specialWeaponList] = await results;
router.get('/', async (req, res, next) => {
    // try {
    res.render('bukiFilter', { title: 'ブキ絞り込み', bukiList, subWeaponList, specialWeaponList });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send();
    // }
});

export default router;