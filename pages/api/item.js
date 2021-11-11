import mariadb from 'mariadb';
import {databaseConfig} from "../../config/config";

// create mariadb connection
const pool = mariadb.createPool(databaseConfig);
let conn = null;

const localGuysHere = [{name: 'Tom Teichert', list: 'personen'}];

export default async function handler(req, res) {

  if (!conn) {
    try {
      conn = await pool.getConnection();
    } catch (e) {
      res.status(500).end();
      console.log(e)
      return;
    }
  }

  switch (req.method) {
    case 'POST':
      await addItem(req, res);
      break;
    case 'DELETE':
      await deleteItem(req, res);
      break;
    case 'GET':
      await getItems(req, res);
      break;
    default:
      res.status(404).end();
  }

}

async function addItem(req, res) {

  const {name, list} = req.body;

  if (!checkParams(list, name)) {
    res.status(400).end();
    return;
  }

  try {
    await conn.query('INSERT INTO legends (name, list) VALUE (?,?)',
      [name, list]);
    //localGuysHere.push({name, list});
    res.end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function deleteItem(req, res) {

  const {name, list} = req.query;

  if (!checkParams(list, name)) {
    res.status(400).end();
    return;
  }

  try {
    conn.query(`UPDATE legends SET list = 'forgotton_legends' WHERE name = ? AND list = ?`,
      {name, list})
    res.end('Legends never die!');
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getItems(req, res) {

  const {list} = req.query;

  if (!checkParams(list)) {
    res.status(400).end();
    return;
  }

  try {
    res.json(await conn.query('SELECT * from legends WHERE list = ?', list));
    //res.json(localGuysHere);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

function checkParams() {
  const args = [...arguments];
  for (const arg of args) {
    if (!(typeof arg === 'string' && arg.length < 256)) {
      return false;
    }
  }
  return true;
}
