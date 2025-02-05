import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading, setLoading] = useState<Boolean>(true)
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const token = localStorage.getItem('token')

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () =>{
            setSocket(ws)
            setLoading(false)
        }

  
       
    },[])

    return {socket, loading}
}