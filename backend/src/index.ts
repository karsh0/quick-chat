import WebSocket, { WebSocketServer } from "ws"
import http from "http"
import express from "express"
import { userMiddleware } from "./middleware";
import { SignupType } from "./config";
import jwt from "jsonwebtoken"
import cors from "cors"
import { PrismaClient } from "@prisma/client";
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

const JWT_SECRET = process.env.JWT_SECRET

function checkUser(token: string): string | null{
    const verifiedToken = jwt.verify(token, JWT_SECRET || "");

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

    //verify the token
    const userId = checkUser(token)

    if(!userId){
        socket.close()
        return;
    }
    console.log(users)

    users.push({
        socket,
        userId,
        rooms: []
    })
    console.log(users)


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
                        type:"CHAT",
                        message,
                        roomId
                    }))
                }
            })
        }
    })
})

//HTTP

const client = new PrismaClient()

app.use(express.json())
app.use(cors())

app.post('/signup', async (req,res)=>{
    const parsedData = SignupType.safeParse(req.body)
    if(!parsedData.success){
        res.json({
            message:"Invalid inputs"
        })
        return;
    }
    await client.user.create({
       data:{
            username: parsedData.data.username,
            password: parsedData.data.password
       }
    })
    res.json({
        message: "user signup success"
    })
})

app.post('/signin', async (req,res)=>{
    const parsedData = SignupType.safeParse(req.body)
    const user = await client.user.findFirst({
        where:{
            username: parsedData.data?.username
        }
    })
    if(!user){
        console.log("user not found")
        return;
    }
    const token = jwt.sign({userId: user.id.toString()}, JWT_SECRET || "")

    res.json({
        message: "user signup success",
        token
    })
})


app.post('/room', userMiddleware, async (req,res)=>{
    const {slug} = req.body;
    try{

        const room = await client.room.create({
           data:{
                slug,
                adminId: req.userId
           }
        })
        res.json({
            roomId: room.id
        })
    }catch(e){
        console.log(e)
    }
})

server.listen(3000, ()=>{
    console.log("http running on port 3000")
})