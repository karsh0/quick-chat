import axios from "axios";
import { useRef } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function SignIn() {
    const usernameRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!username || !password) {
      alert("Both fields are required!");
      return;
    }

    const response = await axios.post(`${BACKEND_URL}/signin`,{
        username, password
    })
    localStorage.setItem('token', response.data.token)
    navigate('/chat')
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="username"
          placeholder="Enter your email"
          ref={usernameRef}
        />
        <input
          type="password"
          placeholder="Enter your password"
          ref={passwordRef}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

