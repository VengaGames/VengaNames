//require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const { connectToIoServer } = require("./socket");
const allowedOrigins = ["http://localhost:5173"];

app.use(cors(allowedOrigins));

const deployDate = new Date().toLocaleString();

app.get("/", async (req, res) => {
  return res.status(200).send({ message: "Hello world", last_deployed_at: deployDate });
});

app.use("/room", require("./controllers/room"));
//app.use("/cards", require("./controllers/cards"));

const server = http.createServer(app);
connectToIoServer(server);

server.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});

module.exports = app;
