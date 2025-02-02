import { useEffect, useState } from "react";
import axios from "axios";
import { Contact } from "../Components/Contact";
import { ChatBox } from "../Components/ChatBox";
import { useSocket } from "../useSocket";

interface User {
  username: string;
  roomId: string;
}

function ChatPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    axios.get("http://localhost:3000/dashboard", {
      headers: { token: localStorage.getItem("token") },
    }).then((response) => setUser(response.data.user));

    axios.get("http://localhost:3000/bulk", {
      headers: { token: localStorage.getItem("token") },
    }).then((response) => setAllUsers(response.data.users));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.usersList}>
        <h3>Users</h3>
        {allUsers.map((user, index) => (
          <button key={user.roomId || index} style={styles.userButton} onClick={() => {
            setSelectedUser(user)}
            
            }>
            {user.username}
          </button>
        ))}
      </div>

      <div style={styles.chatBox}>
        {selectedUser ? <ChatBox selectedUser={selectedUser} user={user} /> : <p>Select a user to chat</p>}
      </div>
    </div>
  );
}

export default ChatPage;

const styles = {
  container: {
    display: "flex",
    height: "90vh",
    border: "1px solid #ddd",
  },
  usersList: {
    width: "30%",
    borderRight: "1px solid #ddd",
    padding: "20px",
  },
  userButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    background: "#f4f4f4",
    border: "none",
    textAlign: "left" as const,
  },
  chatBox: {
    width: "70%",
    padding: "20px",
  },
};
