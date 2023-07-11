const users = [];
let currentPlayer = [];

function addUser({ id, name, room }) {
  name = name.trim();
  room = room.trim();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: "User is taken" };
  }

  const usersInThisRoom = getUsersInRoom(room);


  if (usersInThisRoom.length === 0 || usersInThisRoom.every((user) => user.admin === false)) {
    const user = { id, name, room, admin: true};
    users.push(user);
    return { user };
  }
  const user = { id, name, room, admin: false};
  users.push(user);

  return { user };
}

function getRooms() {
  let rooms = users.map((user) => user.room);
  rooms = [...new Set(rooms)];

  const usersNbInRooms = rooms.map((room) => getUsersInRoom(room)).map((users) => users.length);
  return rooms.map((room, index) => ({ name: room, usersNb: usersNbInRooms[index] }));
}

function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    if (users[index].admin) {
      const usersInRoom = getUsersInRoom(users[index].room);
      usersInRoom[1] ? (usersInRoom[1].admin = true) : null;
    }

    return users.splice(index, 1)[0];
  }
}

function modifyUser(id, key, value) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    if (key === 'team') {
      users[index][key] = value;

      if (value === 'teamA') {
        setTeam('teamA');
        setCorrectCards([...teamACards]);
      } else if (value === 'teamB') {
        setTeam('teamB');
        setCorrectCards([...teamBCards]);
      }
    } else {
      users[index][key] = value;
    }
  }
}






function getUser(id) {
  return users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return users.filter((user) => user.room === room);
}

// function setCurrentPlayerTurn(userId, room) {
//   currentPlayer = currentPlayer.filter((player) => player.room !== room);
//   currentPlayer.push({ room: room, id: userId });
// }

// function getCurrentPlayerTurn(room) {
//   const id = currentPlayer.find((player) => player.room === room)?.id;
//   if (!id) return null;
//   return getUser(id);
// }

module.exports = { addUser, modifyUser, removeUser, getUser, getUsersInRoom, getRooms };
