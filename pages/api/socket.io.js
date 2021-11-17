import {Server} from "socket.io";
import conn from '../../database/database';

//const localGuysHere = [{name: 'Tom Teichert', list: 'personen'}];

export default function handler(req, res) {

  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    // collect all of our sockets
    const sockets = [];

    io.on('connection', socket => {

      console.log('user connects');

      socket.broadcast.emit('a user connected');

      socket.on('getItems', async (info) => {
        console.log('get items');
        sockets.push({
          list: info.list,
          socket: socket,
        });
        try {
          socket.emit('setItems', await getItems(info));
        } catch (e) {}
      });

      socket.on('addItem', async (item) => {
        try {
          await addItem(item);
          const items = await getItems(item);
          sockets.forEach(({socket, list}) => {
            if (list === item.list) {
              socket.emit('setItems', items);
            }
          })
        } catch (e) {
          console.log(e);
        }
      });
      socket.on('deleteItem', deleteItem);

      socket.on('disconnect', () => {
        for (let i = 0; i < sockets.length; i++) {
          if (sockets[i].socket.id === socket.id) {
            sockets.splice(i, 1);
            break;
          }
        }
      })

    });

    res.socket.server.io = io;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false
  }
}


async function addItem({name, list}) {

  if (!checkParams(name, list)) {
    return null;
  }

  try {
    return await conn.query('INSERT INTO legends (name, list) VALUE (?,?)',
      [name, list]);
    //localGuysHere.push({name, list});
  } catch (e) {
    console.log(e);
  }
}

async function deleteItem({name, list}) {

  if (!checkParams(list, name)) {
    return null;
  }

  try {
    return await conn.query(`UPDATE legends SET list = 'forgotton_legends' WHERE name = ? AND list = ?`,
      {name, list});
  } catch (e) {
    console.log(e);
  }
}

async function getItems({list}) {

  if (!checkParams(list)) {
    return null;
  }

  try {
    return await conn.query('SELECT * from legends WHERE list = ?', list);
  } catch (e) {
    console.log(e);
    return null;
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
