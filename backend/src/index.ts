import { WebSocketServer } from "ws"

const wss = new WebSocketServer({port:8080})


wss.on("connection", (ws)=>{
    ws.on("message", (message)=>{
        const parsedMessage = JSON.parse(message as unknown as string)
        ws.send("pong")
        ws.send(parsedMessage.message)
    })
})