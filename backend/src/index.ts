import WebSocket, { WebSocketServer } from "ws"
import http from "http"
import express from "express"
import { userModel } from "./database/db";
import { userMiddleware } from "./database/middleware";
import { JWT_SECRET, SignupType } from "./database/config";
import router from "./database/routes/user";
import jwt from "jsonwebtoken"

const app = express()
const server = http.createServer(app); // Create HTTP server

const wss = new WebSocketServer({server},()=>
console.log("server listening at port 8080"))

interface Users{
    socket: WebSocket,
    username: string,
    roomId: string
}

let allUsers: Users[] = []

wss.on("connection", (socket)=>{
    socket.on("message", (message)=>{
        const parsedMessage = JSON.parse(message as unknown as string)
        if(parsedMessage.type === "JOIN_ROOM"){
            allUsers.push({
                socket,
                username: parsedMessage.payload.username,
                roomId: parsedMessage.payload.roomId

            })
        }

        if(parsedMessage.type === "CHAT"){
            const user = allUsers.find((u) => u.socket == socket);
            const rooms = allUsers.filter(u => u.roomId == user?.roomId)
            rooms.map(room => room.socket.send(parsedMessage.payload.message))
        }
    })
})


//HTTP


app.use(express.json())
app.use('/user', router)

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

app.get('/dashboard', userMiddleware, async(req,res)=>{
    const user = await userModel.findOne({_id: req.userId});
    res.json({
        user
    })
})


server.listen(3000, ()=>{
    console.log("http running on port 3000")
})