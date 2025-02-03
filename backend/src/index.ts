import WebSocket, { WebSocketServer } from "ws"
import http from "http"
import express from "express"
import { roomModel, userModel } from "./database/db";
import { userMiddleware } from "./database/middleware";
import { JWT_SECRET, SignupType } from "./database/config";
import router from "./database/routes/user";
import jwt from "jsonwebtoken"
import cors from "cors"

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
    const verifiedToken = jwt.verify(token, JWT_SECRET);

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

    socket.on("message", (message)=>{
        const parsedMessage = JSON.parse(message as unknown as string)
        if(parsedMessage.type === "JOIN_ROOM"){
            const user = users.find(u => u.socket === socket);
            user?.rooms.push(parsedMessage.roomId)
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


app.use(express.json())
app.use('/user', router)
app.use(cors())

app.post('/signup', async (req,res)=>{
    const {username, password} = SignupType.parse(req.body)
    await userModel.create({
        username,
        password
    })
    res.json({
        message: "user signup success"
    })
})

app.post('/signin', async (req,res)=>{
    const {username} = req.body
    const user = await userModel.findOne({username})
    if(!user){
        console.log("user not found")
        return;
    }
    const token = jwt.sign({userId: user._id.toString()}, JWT_SECRET)

    res.json({
        message: "user signup success",
        token
    })
})

let globalRoomId = 0;

app.post('/room', userMiddleware, async (req,res)=>{
    const {slug} = req.body;
    try{

        const room = await roomModel.create({
            roomId: globalRoomId++,
            slug,
            AdminId: req.userId
        })
        res.json({
            roomId: room.roomId
        })
    }catch(e){
        console.log(e)
    }
})

server.listen(3000, ()=>{
    console.log("http running on port 3000")
})