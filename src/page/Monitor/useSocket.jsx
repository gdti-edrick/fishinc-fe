import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// const SOCKET_SERVER_URL = "http://10.100.0.6:52043";
const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_SOCKET;

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [welcomeData, setWelcomeData] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // Ensure WebSocket transport
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Retry up to 5 times
      reconnectionDelay: 2000, // Wait 2s before retrying
      timeout: 5000, // 5 seconds timeout
    });

    setSocket(newSocket);

    // Connection Events
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server ✅");
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket Connection Error ❌:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("WebSocket Disconnected ⚠️:", reason);
    });

    // Listen for "monitor" event
    newSocket.on("monitor", (data) => {
      console.log("Received monitor data:", data);
      setWelcomeData(data);
    });

    // Listen for "myMessage" event
    newSocket.on("myMessage", (message) => {
      console.log("Received myMessage:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  // Function to send a message
  const sendMessage = (message) => {
    if (socket) {
      socket.emit("myMessage", message);
    } else {
      console.warn("Socket is not connected. Cannot send message.");
    }
  };

  return { socket, messages, welcomeData, sendMessage };
};

export default useSocket;
