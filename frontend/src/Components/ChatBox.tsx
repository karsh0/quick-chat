import { useState } from "react";
import { useSocket } from "../useSocket";




export function ChatBox({ selectedUser, user }: any) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const roomId = '1';

  
  const socket = useSocket()


  const sendMessage = () => {
    if (socket && message.trim()) {
  
      socket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {username: user?.username, roomId },
        })
      );

      
      socket.send(
        JSON.stringify({
          type: "CHAT",
          payload: { message, username: user?.username, roomId },
        })
      );
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div>
      <h3>Chat with {selectedUser.username}</h3>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      {JSON.stringify(user)}
      {JSON.stringify(selectedUser)}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatWindow: {
    height: "300px",
    overflowY: "scroll" as const,
    border: "1px solid #ddd",
    padding: "10px",
  },
  inputContainer: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
