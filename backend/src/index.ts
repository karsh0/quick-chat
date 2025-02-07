import WebSocket, { WebSocketServer } from "ws"
import http from "http"
import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import router from "./router";
require('dotenv').config()

const app = express()
const server = http.createServer(app); // Create HTTP server
const wss = new WebSocketServer({server},()=>
console.log("server listening at port 8080"))

interface User{
    socket: WebSocket,
    rooms: string[],
    userId: string
}

let users: User[] = []  

function checkUser(token: string): string | null{
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET || "");

    if(typeof verifiedToken === "string"){
        return null
    }
    if(!verifiedToken || !verifiedToken.userId){
        console.log("token validation failed")
        return null
    }
    return verifiedToken.userId
}



wss.on("connection", (socket, request)=>{

    const url = request.url;
    if(!url){
        return
    }
    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get("token") ?? ""

    const userId = checkUser(token)

    if(!userId){
        socket.close()
        return;
    }

    users.push({
        socket,
        userId,
        rooms: []
    })


    socket.on("message", (message)=>{
        const parsedMessage = JSON.parse(message as unknown as string)
        if(parsedMessage.type === "JOIN_ROOM"){
            const user = users.find(u => u.socket === socket);
            user?.rooms.push(parsedMessage.roomId)
            socket.send(JSON.stringify({
                message: `${user?.userId} Joined the room`
            }))
        }

        if(parsedMessage.type === "CHAT"){
            const {roomId, message} = parsedMessage;
            users.forEach(u =>{
                if(u.rooms.includes(roomId)){
                    u.socket.send(JSON.stringify({
                        type:"NEW_MESSAGE",
                        message,
                        roomId,
                    }))
                }
            })
        }
    })
})

//HTTP

app.use(express.json())
app.use(cors())
app.use('/', router)

server.listen(3000, ()=>{
    console.log("http running on port 3000")
})