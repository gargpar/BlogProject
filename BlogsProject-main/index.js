const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./config/database");
const blog = require("./routes/blog");
const user = require("./routes/user");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const hbs = require('hbs');

const PORT = process.env.PORT || 3000;

dbConnect();

const server = createServer(app);
const io = new Server(server);
const home = join(__dirname, "static", "index.hbs");

app.use(express.static(join(__dirname, 'static')));
app.use(cookieParser());
app.use(express.json());
app.set("view engine","hbs");

app.use("/users", user);
app.use("/blogs", blog);

app.get("/", (req, res) => {
  res.render(home);
});

io.on("connection", (socket) => {
  // console.log(socket);
  console.log("a user connected");

  socket.join("room1");
  socket.on("hello",(msg)=>{
    console.log(msg);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Server Started", PORT);
});
