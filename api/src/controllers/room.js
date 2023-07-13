const express = require("express");
const router = express.Router();
const { getRooms, removeUser, getUsersInRoom, getCurrentPlayerTurn } = require("../utils/users");

router.get("/", async (req, res) => {
  try {
    const rooms = getRooms();
    res.status(200).send({ data: rooms, ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

router.get("/current/:room", async (req, res) => {
  try {
    const currentPlayer = getCurrentPlayerTurn(req.params.room);
    res.status(200).send({ data: currentPlayer, ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

router.get("/name/available", async (req, res) => {
  try {
    const { name, room } = req.query;
    const users = getUsersInRoom(room);
    const isAvailable = users.every((user) => user.name !== name);
    if (isAvailable) {
      res.status(200).send({ ok: true });
    } else {
      res.status(200).send({ message: "Nom déjà pris !", ok: false });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

const roomController = (module.exports = router);

roomController.handleSocket = (socket, io) => {
  socket.on("leave-room", () => {
    try {
      const user = removeUser(socket.id);
      if (!user) return;
      const usersInRoom = getUsersInRoom(user.room);
      if (usersInRoom.length === 0) {
        setStack(user.room, null);
      }

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: usersInRoom,
      });

      io.to(user.room).emit("player-left");
    } catch (error) {
      console.log(error);
    }
  });
};
