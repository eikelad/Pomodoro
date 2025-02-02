import React, { useState, useEffect } from "react";
import { FaApple } from "react-icons/fa"; 
import "./styles.css";

export default function PomodoroTimer() {
  const [inputMinutes, setInputMinutes] = useState(25);
  const [time, setTime] = useState(inputMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isBreakTime, setIsBreakTime] = useState(false);

  const messages = [
    "Ótimo trabalho! Continue assim! 🚀",
    "Você está no caminho certo! 🎯",
    "Cada minuto focado é um passo para o sucesso! 💡",
    "Persistência leva à perfeição! 💪",
    "A disciplina é a ponte entre metas e realizações! 🏆"
  ];

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
      setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
      playSound();
      showNotification("Pomodoro concluído! 🚀 Hora de uma pausa!");
      setIsBreakTime(true);
      setTime(5 * 60); // Pausa curta automática
    }
    document.title = formatTime(time) + " - Pomodoro";
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const playSound = () => {
    const audio = new Audio("/success.mp3");
    audio.play();
  };

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(inputMinutes * 60);
    setIsBreakTime(false);
  };

  const handleInputChange = (e) => {
    const newMinutes = parseInt(e.target.value, 10);
    if (!isNaN(newMinutes) && newMinutes > 0) {
      setInputMinutes(newMinutes);
      setTime(newMinutes * 60);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={`container ${theme}`}>
      <h1><FaApple className="tomato" /></h1>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
      </button>
      <label htmlFor="time-input" className="time-label">Digite os minutos:</label>
      <input
        id="time-input"
        type="number"
        min="1"
        value={inputMinutes}
        onChange={handleInputChange}
        className="time-input"
      />
      <div className="timer">{formatTime(time)}</div>
      <div className="buttons">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pausar" : "Iniciar"}
        </button>
        <button onClick={resetTimer}>Resetar</button>
      </div>
      <div className="session-info">
        <p>⏳ Sessões concluídas: {completedSessions}</p>
      </div>
      {motivationalMessage && (
        <div className="motivational-message">
          <p>{motivationalMessage}</p>
        </div>
      )}
      {isBreakTime && (
        <p className="break-message">🎉 Agora é hora de uma pausa de 5 minutos!</p>
      )}
    </div>
  );
}
