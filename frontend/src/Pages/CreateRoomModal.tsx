import axios from "axios";
import { useRef } from "react"
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function CreateRoomModal(){

    const inputRef = useRef<HTMLInputElement | null>(null) 
    const navigate = useNavigate()
   
    async function CreateRoom(){
        const slug = inputRef.current?.value;

        await axios.post(`${BACKEND_URL}/room`, {
           slug
        },{
            headers:{
                token: localStorage.getItem('token')
            }
        })
        navigate(`/room/${slug}`)
    }

    return <div>
        <input type="text" placeholder="Enter room name" ref={inputRef}/>
        <button onClick={CreateRoom}>Create Room</button>
    </div>
}