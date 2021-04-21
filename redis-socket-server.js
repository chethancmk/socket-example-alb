var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    });

redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'socket1.rfubw4.ng.0001.aps1.cache.amazonaws.com', port: 6379 }));
var base_namespace = io.of('/');

app.get('/test', (req, res) => {
    res.status(200).send('Welcome to icici soket server 1');
});

base_namespace.on('connection', async (socket) => {

    const socketss = await io.of('/').adapter.sockets(new Set());
    console.log(socketss); // a Set containing all the connected socket ids

    
    function intervalFunc() {
        console.log('Sending messages to rooms', 'room1 , room2')

        // Change server to server 2 in the second server
        socket.broadcast.to('room1').emit('new_msg', {
            msg: { "name": "room1", time: new Date().toISOString(), server: 'Server1' }
        });

        socket.broadcast.to('room2').emit('new_msg', {
            msg: { "name": "room2", time: new Date().toISOString(), server: 'Server1' }
        });
    }

    setInterval(intervalFunc, 1500);

    socket.on('join', function (rooms) {
        console.log('Socket %s subscribed to %s', socket.id, rooms);
        if (Array.isArray(rooms)) {
            rooms.forEach(function (room) {
                socket.join(room);
            });
        } else {
            socket.join(rooms);
        }
    });

    socket.on('leave', function (rooms) {
        if (Array.isArray(rooms)) {
            rooms.forEach(function (room) {
                socket.join(room)
            })
        } else {
            socket.join(rooms)
        }
    });

    socket.on('disconnect', function () {
        console.log('User disconnected. totalcount. Socket id %s', socket.id);
    });
});

base_namespace.on('error', function (error) {
    console.log(error);
})

http.listen(5000, function () {
    console.log('listening on: 80');
});