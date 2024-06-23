import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs';

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
const bukiList = await dbAll('SELECT ' + items + '  FROM weapon INNER JOIN main_weapon ON weapon.main_weapon_id = main_weapon.id INNER JOIN sub_weapon ON weapon.sub_weapon_id = sub_weapon.id INNER JOIN special_weapon ON weapon.special_weapon_id = special_weapon.id JOIN main_weapon_type ON main_weapon.type_id = main_weapon_type.id');

fs.writeFileSync("bukiList.json", JSON.stringify(bukiList, null, 2));