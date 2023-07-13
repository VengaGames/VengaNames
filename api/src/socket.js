const { Server } = require("socket.io");
const {
  addUser,
  removeUser,
  getUsersInRoom,
  setCurrentPlayerTurn,
  getCurrentPlayerTurn,
  modifyUser,
  getUser,
} = require("./utils/users");

exports.connectToIoServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      try {
        const { user } = addUser({ id: socket.id, name, room });
        if (!user)
          callback({ error: "User already exists", code: 400, ok: false });

        socket.join(user.room);

        const usersInRoom = getUsersInRoom(user.room);

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: usersInRoom,
        });
        io.to(socket.id).emit("deck", { cards: user.cards });
        if (callback) callback({ ok: true });
      } catch (e) {
        console.log(e);
      }
    });

    //require("./controllers/cards").handleSocket(socket, io);
    require("./controllers/room").handleSocket(socket, io);
    require("./controllers/team").handleSocket(socket, io);

    socket.on("disconnect", () => {
      try {
        const user = removeUser(socket.id);
        if (!user) return;

        const usersInRoom = getUsersInRoom(user.room);

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("joinTeam", (team) => {
      try {
        const user = getUser(socket.id);
        console.log("joinTeam", team);
        modifyUser(socket.id, "team", team);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
