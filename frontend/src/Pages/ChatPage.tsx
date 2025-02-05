import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { BACKEND_URL } from "../config"

export  function ChatPage({socket, loading}:{socket: WebSocket | null, loading: Boolean}){
    const { slug } = useParams()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const roomIdRef = useRef<Number | null>(null)
    const [messages, setMessages] = useState<string[]>([])

    useEffect(()=>{
        async function main(){
            const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
            roomIdRef.current = Number(response.data.roomId); 
        }
        main()
    },[])

    if(!socket){
        return;
    }

    socket.onmessage = (ev) =>{
        const data = JSON.parse(ev.data)
        console.log(data)
        if(data.type == "NEW_MESSAGE"){
            console.log(data.message)
            setMessages((prev) => [...prev, data.message])
        }
    }

    async function SendMessage(){
        const message = inputRef.current?.value;
        console.log(roomIdRef.current)

        //FIX: Lag due to posting data in db, find easier way
        // try{
            
        //     const response = await axios.post(`${BACKEND_URL}/chat/${roomIdRef.current}`,{
        //         message,
        //     },{
        //         headers:{
        //             token: localStorage.getItem('token')
        //         }
        //     })
        // }catch(e){
        //     console.log(e)
        // }
        if(socket && !loading){
            socket.send(JSON.stringify({
                type: "CHAT",
                message,
                roomId: roomIdRef.current
            }))
        }
        
    }
    
    return <div>
        Chat page
        <br/>
        <span>Room name : {slug}</span>
        <div>
       {messages.map((m, index) =>  <span key={index}>{m}</span>)}
        </div>
        <input type="text" placeholder="Start you conversation" ref={inputRef}/>
        <button onClick={SendMessage}>SEND</button>
    </div>
}