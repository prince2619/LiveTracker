const express = require("express");
const app = express ();
const path = require("path");
const http =require("http");

const socketio = require("socket.io");

const server = http.createServer(app); // creating server

const io = socketio(server); // calling socketio function passing server store in io.

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); // for accessing the css,hmtl images file easily.

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id,...data});
    });

    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    })
    // console.log("connected");
});

app.get("/",function(req,res){
    res.render("index");
});

server.listen(3000);


// const express = require("express");
// const app = express();
// const path = require("path");
// const http = require("http");

// const socketio = require("socket.io");

// const server = http.createServer(app);
// const io = socketio(server);

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

// const connectedUsers = {}; // To store usernames and their socket IDs

// io.on("connection", (socket) => {
//     socket.on("set-username", (name) => {
//         if (Object.values(connectedUsers).includes(name)) {
//             socket.emit("name-taken"); // Name is already taken
//         } else {
//             connectedUsers[socket.id] = name;
//             socket.emit("name-accepted"); // Name is available
//         }
//     });

//     socket.on("send-location", (data) => {
//         io.emit("receive-location", { username: connectedUsers[socket.id], ...data });
//     });

//     socket.on("disconnect", () => {
//         const username = connectedUsers[socket.id];
//         if (username) {
//             io.emit("user-disconnected", username);
//             delete connectedUsers[socket.id]; // Remove user from the list
//         }
//     });
// });

// app.get("/", (req, res) => {
//     res.render("index");
// });

// server.listen(3000, () => {
//     console.log("Server running on port 3000");
// });
