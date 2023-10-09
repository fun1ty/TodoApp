const http = require("http");
const express = require("express");
const db = require("./models");
const dotenv = require("dotenv");
const cors = require("cors");
const controller = require("./controller/Ctodo");

dotenv.config();

const PORT = 8000;
const app = express();
const server = http.createServer(app);

//body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

//정적파일 설정 (외부에서 내부파일로 접근할때)
// app.use(express.static("static/css"));
app.use(express.static(__dirname + "/client/build"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.get("/todo", (req, res) => {
  controller.ToDoList(req, res);
});

app.post("/todo", (req, res) => {
  controller.ToDoCreate(req, res);
});

app.patch("/todo/:id", (req, res) => {
  controller.ToDoUpdate(req, res);
});

app.delete("/todo/:id", (req, res) => {
  controller.ToDoDelete(req, res);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

//server start
db.sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
