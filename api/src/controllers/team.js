const express = require("express");
const router = express.Router();
const {
  getUser,
  getRooms,
  removeUser,
  getUsersInRoom,
  getCurrentPlayerTurn,
} = require("../utils/users");

const isTeamSet = (users) => {
  if (!users.team) return { error: "Pick a Team !", ok: false };

  return { ok: true };
};

const roomController = (module.exports = router);
roomController.handleSocket = (socket, io) => {
  socket.on("check-Team", (callback) => {
    try {
      const user = getUser(socket.id);
      console.log("callback", callback);

      const TeamOk = isTeamSet(user);
      if (!TeamOk.ok) return callback(TeamOk);
    } catch (error) {
      console.log(error);
    }
  });
};
