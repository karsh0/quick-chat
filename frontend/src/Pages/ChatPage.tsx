import axios from "axios"
import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { BACKEND_URL } from "../config"
import { useSocket } from "../hooks/useSocket";

export  function ChatPage(){
    const { slug } = useParams()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const roomIdRef = useRef<Number | null>(null)

    const {socket, loading} = useSocket()

    useEffect(()=>{
        async function main(){
            const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
            roomIdRef.current = Number(response.data.roomId); 
            const messageArray = await axios.get(`${BACKEND_URL}/chat/${roomIdRef.current}`)
            console.log(messageArray.data)
        }
        main()
    },[])


    async function SendMessage(){
        const message = inputRef.current?.value;

        const response = await axios.post(`${BACKEND_URL}/chat/${roomIdRef.current}`,{
            message,
        },{
            headers:{
                token: localStorage.getItem('token')
            }
        })
        if(socket && !loading){
            socket.send(JSON.stringify({
                type: "CHAT",
                roomId: roomIdRef.current
            }))
        }
        console.log(response)
        
    }
    
    return <div>
        Chat page
        <br/>
        <span>Room name : {slug}</span>
        <div>
       
        </div>
        <input type="text" placeholder="Start you conversation" ref={inputRef}/>
        <button onClick={SendMessage}>SEND</button>
    </div>
}