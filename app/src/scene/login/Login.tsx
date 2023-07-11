import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../service/api";
import { HiArrowLeft } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import vengaicon from "../asset/vengaicon.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const getRooms = async () => {
    const { data } = await API.get("/room");
    setRooms(data);
  };

  useEffect(() => {
    getRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const room = e.target.elements.room.value;
    const name = e.target.elements.name.value;
    const { ok } = await API.get(`/room/name/available?room=${room}&name=${name}`);
    if (!ok) {
      alert("Nom de joueur déjà pris");
      return;
    }
    navigate(`/game?room=${room}&name=${name}`);
  };
  return (
    <div>
      <nav className="p-3 border-gray-700 bg-[#242531]">
        <div className="container flex flex-wrap items-center justify-center mx-auto">
          <div className="flex flex-row justify-center items-center">
            <img src={vengaicon} className="h-6 mr-3 sm:h-10 " alt="Venga Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VengaGAMES</span>
          </div>
        </div>
      </nav>
      <NavLink to="https://lejeudelaplaylist.onrender.com/" end>
        <HiArrowLeft className="text-white ml-2 mt-2 w-10 h-10 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ..." alt="icone fleche retour" />
      </NavLink>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="justify-center flex flex-col items-center mt-14">
          <h1 className="mt-5 mb-2 text-xl font-semibold text-white">VengaNames</h1>
          <form onSubmit={handleSubmit} className="flex flex-col bg-[#1e1f29] rounded-xl">
            <input
              placeholder="Nom de la room..."
              autoComplete="off"
              className="mt-6 bg-[#494B5A] !ring-0 !outline-none rounded-lg text-white shadow-md shadow-[rgba(0, 0, 0, 0.25)] p-6 py-3 font-semibold mr-6 ml-6  "
              required
              type="text"
              name="room"
              id="room"
              maxLength={15}
              onInvalid={(e) => {
                e.target.setCustomValidity("Choisis une salle !");
              }}
            />

            <input
              placeholder="Ton Pseudo..."
              autoComplete="off"
              className="bg-[#494B5A] !ring-0 !outline-none rounded-lg text-white shadow-md shadow-[rgba(0, 0, 0, 0.25)] p-6 py-3 font-semibold mt-2 mr-6 ml-6 "
              required
              type="text"
              name="name"
              maxLength={15}
              onInvalid={(e) => {
                e.target.setCustomValidity("Choisis un pseudo !");
              }}
            />
            <div className="flex flex-col items-center">
              <button className="bg-[#FDFDFD] rounded-3xl text-center flex flex-row justify-center items-center mt-4 mb-2 w-24 font-semibold" type="submit">
                Rejoindre
              </button>
            </div>
          </form>
        </div>
        {rooms.length > 0 ? (
          <div className="mt-8">
            <h1 className="text-lg mb-2 text-white">Salles disponibles :</h1>
            <div className="flex flex-col gap-2">
              {rooms.map((room) => (
                <div key={room.name} className="flex gap-2 cursor-pointer" onClick={() => (document.getElementById("room").value = room.name)}>
                  <div className="text-white">{room.name}</div>
                  <div className="text-white">
                    ({room.usersNb} joueur{room.usersNb > 1 ? "s" : ""})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="fixed bottom-0 flex justify-center w-full bg-[#242531]">
        <h3 className="text-white"> Vengaboys © - 2023</h3>
      </div>
    </div>
  );
};

export default Login;
