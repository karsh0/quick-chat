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
        if(data.type == "NEW_MESSAGE"){
            setMessages((prev) => [...prev, data.message])
        }
    }

    async function SendMessage(){
        const message = inputRef.current?.value;

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
    
    return <div className="bg-gradient-to-br from-gray-900  to-black w-screen h-screen flex flex-col gap-5 text-white justify-center items-center">
        <span className="text-3xl font-semibold">Room name : {slug}</span>
        <div className="text-white border border-white rounded-xl p-6 h-2/3 w-96 relative">
        <div className="flex flex-col space-y-2">
            {JSON.stringify(messages)}
                    {messages.map((m, index) => (
                        <div key={index} className="bg-gray-800 p-2 rounded-lg w-max max-w-xs">
                            {m}
                        </div>
                    ))}
        </div>
        <div className="flex max-w-full absolute bottom-4">
        <input type="text" className="w-64 px-5 rounded-lg text-black rounded-r-none" placeholder="Start you conversation" ref={inputRef}/>
        <button onClick={SendMessage} className="px-4 py-2 rounded-lg rounded-l-none bg-blue-600 hover:bg-blue-500 transition-all text-white text-lg shadow-lg">SEND</button>
        </div>
        </div>
    </div>
}