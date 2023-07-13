import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
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

    if (clickedWord.teams === "teamD") {
      handleEndGame();
    }

    if (clickedWord.teams === currentTeam.team) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setScore((prevScore) => prevScore - 1);
    }
  };

  const TeamButton = (team) => {
    const currentTeam = users.find((user) => user.name === roomData.name).team;

    return !currentTeam ? (
      <div>
        <div className="float-left bg-blue-500 h-80 ml-2 mr-2 w-40 rounded-2xl justify-center items-center flex">
          <button
            className="border bg-blue-500"
            onClick={() => {
              joinTeam("teamA");
            }}
          >
            Join Team A
          </button>
        </div>
        <div className="float-right bg-red-500 h-80 mr-2 ml-2 w-40 rounded-2xl justify-center items-center flex">
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
      </div>
    ) : null;
  };

  const checkTeam = (word) => {
    socket.emit("check-Team", (res) => {
      console.log("checkTeam", res);
      if (!res.ok) return toast.error(res.error);
      handleClick(word);
    });
  };

  const handleEndGame = () => {
    setGameOver(true);
    setTeam(null);
  };

  const joinTeam = (team) => {
    const { id } = roomData;
    socket.emit("joinTeam", { id, team });
  };

  return (
    <div className="text-white max-h-fit">
      <div className="flex justify-center">
        <h1 className="text-4xl font-extrabold">VengaNames</h1>
      </div>
      <div className="flex-row flow-root">
        {users.length != 0 ? <TeamButton /> : <p> Loading... </p>}
        <div className="items-center justify-center flex">
          <p>Score: {score}</p>
        </div>
        {!gameOver ? (
          <div className="ml-32 mr-32">
            <ul className="grid grid-cols-5 gap-4 h-2/5">
              {words.map((word, index) => (
                <li
                  key={index}
                  onClick={() => {
                    checkTeam(word.word);
                  }}
                  className={`flex items-center justify-center h-32 rounded-lg cursor-pointer ${
                    word.teams === "teamA"
                      ? "bg-blue-500"
                      : word.teams === "teamB"
                      ? "bg-red-500"
                      : word.teams === "teamC"
                      ? "bg-stone-700"
                      : "bg-black"
                  }`}
                >
                  <Card sx={{ maxWidth: 75 }}>
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
            <p> Type clues here : </p>
          </div>
        ) : (
          <p>Game Over!</p>
        )}
      </div>
    </div>
  );
};
//<button onClick={handleEndGame}>End Game</button>

export default NavigatorGame;
