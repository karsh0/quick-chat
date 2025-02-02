import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SignIn } from "./Pages/Signin";
import ChatPage from "./Pages/ChatPage";

function App() {
  return <BrowserRouter>
  <Routes>
    <Route path="/signin" element={<SignIn/>} />
    <Route path="/chat" element={<ChatPage/>} />
  </Routes>
  </BrowserRouter> 

}

export default App;
