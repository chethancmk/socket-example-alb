const io = require("socket.io-client");
try {
// ioClient = io.connect("http://15.206.178.171:5000/");   
// ioClient = io.connect("http://52.66.252.176:5000/",{'reconnect':true});  
ioClient = io.connect("http://sockettest-1892254045.ap-south-1.elb.amazonaws.com/");  
        ioClient.on("connect", (msg) => {
            console.log("connection established " + ioClient.io.engine.id);
            ioClient.emit('join', 'room1');
        });

    ioClient.emit('join', 'room1');

    // To receive data    
    ioClient.on('new_msg', (data) => {
         console.log("Recieved Server Data for---",JSON.stringify(data));
    });   
  
} catch (e) { console.log(e); }
