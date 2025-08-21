import React, { useRef } from "react";

const Sound = () => {
  const audioRef = useRef(new Audio());

  const playSound = (filename) => {
    audioRef.current.src = `/assets/sounds/${filename}`;
    audioRef.current.play();
  };

  return (
    <div>
      <button onClick={() => playSound("01.mp3")}>Play 01</button>
      <button onClick={() => playSound("02.mp3")}>Play 02</button>
      <button onClick={() => playSound("03.mp3")}>Play 03</button>
      <button onClick={() => playSound("04.mp3")}>Play 04</button>
    </div>
  );
};

export default Sound;
