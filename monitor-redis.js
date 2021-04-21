
const Server =  require('socket.io').Server;
const redisAdapter = require('socket.io-redis');

const io = new Server(3000);
io.adapter(redisAdapter({ host: 'socket1.rfubw4.ng.0001.aps1.cache.amazonaws.com', port: 6379 }));


var base_namespace = io.of('/');

const test =async() => {
// const sockets = await io.of('/').adapter.sockets(new Set());
// console.log(sockets); // a Set containing all the connected socket ids

const rooms = await io.of('/').adapter.allRooms();
console.log(rooms);
}

setInterval(test,1500)