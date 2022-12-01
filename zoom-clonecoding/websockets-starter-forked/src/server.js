import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 2000);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(process.env.PORT, handleListen);

// import http from "http";
// import WebSocket from "ws";
// import express from "express";
// import path from 'path';
// const __dirname = path.resolve();
// const app = express();

// app.set("view engine", "pug");
// app.set("views", __dirname + "/views");
// app.use("/public", express.static(__dirname + "/public"));
// app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_, res) => res.redirect("/"));

// const handleListen = () => console.log(`Listening on http://localhost:3000`);

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const sockets = []

// wss.addListener("connection", (socket) => {
//     sockets.push(socket)
//     socket["nickname"] = "Anon"
//     console.log("Connected to browser")
//     socket.on("close", () => {
//         console.log("Disconnect from browser")
//     })
//     socket.on("message", (message) => {
//         const parsed = JSON.parse(message)
//         if (parsed.type === "new_message") {
//             sockets.forEach(aSocket => {
//                 if (socket["nickname"] !== aSocket["nickname"]) {
//                     aSocket.send(`${socket.nickname}: ${parsed.payload}`)
//                 }})
//         } else if (parsed.type === "nickname") {
//             socket["nickname"] = parsed.payload
//         }
//     })
// })
// server.listen(3000, handleListen);
