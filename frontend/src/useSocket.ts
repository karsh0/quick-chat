import { useEffect, useState } from "react";

let socketInstance: WebSocket | null = null;

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(socketInstance);

  useEffect(() => {
    if (!socketInstance) {
      const ws = new WebSocket("ws://localhost:3000");
      socketInstance = ws;

      ws.onclose = () => {
        socketInstance = null;
      };

    }

    setSocket(socketInstance);
  }, []);

  return socket;
};