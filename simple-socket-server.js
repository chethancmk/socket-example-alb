const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

app.get('/test', function (req, res) {
    res.status(200).send('Healthy Server 1');
});

// Socket setup
const io = socket(server);

const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Made socket connection");

    setInterval(intervalFunc, 1500);

    socket.on("new user", function (data) {
        console.log("New User Joined")
        socket.userId = data;
        activeUsers.add(data);
        console.log(activeUsers)
        io.emit("new_users", [...activeUsers]);
    });


    socket.on('join', function (data) {
        console.log('======Joined Room========== ');
        console.log(data);
        // Json Parse String To Access Child Elements        
        const room = data;
        socket.join(room);
    });

    function intervalFunc() {
        console.log('Sending messages to rooms', 'room1 , room2')

        socket.broadcast.to('room1').emit('new_msg', {
            msg: { "name": "room1", time: new Date().toISOString(), server: 'Server1' }
        });

        socket.broadcast.to('room2').emit('new_msg', {
            msg: { "name": "room2", time: new Date().toISOString(), server: 'Server1' }
        });
    }

    socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });

});