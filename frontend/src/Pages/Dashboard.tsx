import { useRef, useState } from "react";
import { CreateRoomModal } from "./CreateRoomModal";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Dashboard({socket, loading}:{socket: WebSocket | null, loading: Boolean}){
    const [modal, setModal] = useState<Boolean>(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()


    async function JoinRoom(){
        const slug = inputRef.current?.value;
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
        const roomId = response.data.roomId;

        if(socket && !loading){
            socket.send(JSON.stringify({
                type: "JOIN_ROOM",
                roomId
            }))
        }

        navigate(`/room/${slug}`)
    }


    return <div>
        <span className="text-2xl">Hey chat</span>
        <div>
        <input type="text" placeholder="Enter room name" ref={inputRef}/>
        <button onClick={JoinRoom}>JOIN ROOM</button>
        </div>
        <div>
            <button onClick={()=>{
                setModal(true)
            }}>CREATE ROOM</button>
        </div>
        {modal && <CreateRoomModal/>}
    </div>
}