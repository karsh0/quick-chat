import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SignIn } from "./Pages/Signin";
import { SignUp } from "./Pages/Signup";
import { Dashboard } from "./Pages/Dashboard";
import { ChatPage } from "./Pages/ChatPage";
import { useSocket } from "./hooks/useSocket";

function App() {

  const {socket, loading} = useSocket()

  return <BrowserRouter>
  <Routes>
    <Route path="/signin" element={<SignIn/>} />
    <Route path="/signup" element={<SignUp/>} />
    <Route path="/dashboard" element={<Dashboard socket={socket} loading={loading}/>} />
    <Route path="/room/:slug" element={<ChatPage socket={socket} loading={loading}/>} />
  </Routes>
  </BrowserRouter> 

}

export default App;
