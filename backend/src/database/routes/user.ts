import { Router } from "express";
import { userMiddleware } from "../middleware";
import { roomModel } from "../db";

const router = Router()

router.post('/', userMiddleware, async(req,res)=>{
    //creating a room
    const {receiverId} = req.body;
    const userId = req.userId;
    const roomId = `${userId}-${receiverId}`
    await roomModel.create({roomId})
    res.json({
        userId,
        receiverId,
        roomId
    })
})


export default router