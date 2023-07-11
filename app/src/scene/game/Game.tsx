import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { NavLink, useNavigate } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import toast from "react-hot-toast";
import useSocket from "../../hook/socket";

const NavigatorGame = () => {
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const roomData = { name: query.get("name"), room: query.get("room") };
  const [users, setUsers] = useState([]);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [teams, setTeam] = useState(null);

  const [words, setWords] = useState([
    { word: "a", teams: "teamA" },
    { word: "b", teams: "teamA" },
    { word: "c", teams: "teamB" },
    { word: "d", teams: "teamA" },
    { word: "e", teams: "teamC" },
    { word: "f", teams: "teamB" },
    { word: "g", teams: "teamA" },
    { word: "h", teams: "teamC" },
    { word: "i", teams: "teamA" },
    { word: "j", teams: "teamB" },
    { word: "k", teams: "teamC" },
    { word: "l", teams: "teamB" },
    { word: "m", teams: "teamA" },
    { word: "n", teams: "teamC" },
    { word: "o", teams: "teamB" },
    { word: "p", teams: "teamC" },
    { word: "q", teams: "teamA" },
    { word: "r", teams: "teamD" },
    { word: "s", teams: "teamC" },
    { word: "t", teams: "teamB" },
    { word: "u", teams: "teamB" },
    { word: "v", teams: "teamC" },
    { word: "w", teams: "teamA" },
    { word: "x", teams: "teamC" },
    { word: "y", teams: "teamB" },

    // Add more words here...
  ]);

  useEffect(() => {
    if (!isConnected) return;
    // initUser
    const { name, room } = roomData;
    socket.emit("join", { name, room }, (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return navigate("/");
      }
    });
    socket.on("roomData", ({ users }) => {
      setUsers([...users]);
      console.log("users", users);
    });
  }, [isConnected]);

  const handleClick = (word) => {
    if (gameOver) return;

    const clickedWord = words.find((w) => w.word === word);
    //help to find the current user's team
    const currentTeam = users.find((user) => user.name === roomData.name).team;

    if (clickedWord.teams === currentTeam.team) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setScore((prevScore) => prevScore - 1);
    }
  };

  const handleEndGame = () => {
    setGameOver(true);
    setTeam(null);
  };

  const joinTeam = (team) => {
    //console.log("joinTeam", team);
    const { id } = roomData;
    socket.emit("joinTeam", { id, team });
  };

  return (
    <div className="text-white">
      <h1>VengaNames</h1>

      {teams ? (
        <p>Team: {teams}</p>
      ) : (
        <div>
          <button
            className="border bg-blue-500"
            onClick={() => {
              joinTeam("teamA");
            }}
          >
            Join Team A
          </button>
          <button
            className="border bg-red-500"
            onClick={() => {
              console.log(teams);
              joinTeam("teamB");
            }}
          >
            Join Team B
          </button>
        </div>
      )}

      <p>Score: {score}</p>
      {!gameOver ? (
        <div>
          <h2>Words:</h2>
          <ul className="grid grid-cols-5 gap-4">
            {words.map((word, index) => (
              <li
                key={index}
                onClick={() => handleClick(word.word)}
                className={`p-4 text-center ${
                  word.teams === "teamA"
                    ? "bg-blue-500"
                    : word.teams === "teamB"
                    ? "bg-red-500"
                    : word.teams === "teamC"
                    ? "bg-stone-700"
                    : "bg-black"
                }`}
              >
                <Card sx={{ maxWidth: 200 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography
                        className="text-center"
                        gutterBottom
                        variant="h5"
                        component="div"
                      >
                        {word.word}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </li>
            ))}
          </ul>
          <button onClick={handleEndGame}>End Game</button>
        </div>
      ) : (
        <p>Game Over!</p>
      )}
    </div>
  );
};

export default NavigatorGame;
