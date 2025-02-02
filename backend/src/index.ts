import WebSocket, { WebSocketServer } from "ws"

const wss = new WebSocketServer({port:8080},()=>
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