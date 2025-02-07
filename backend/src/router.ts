import { Router } from "express";
import { userMiddleware } from "./middleware";
import { SignupType } from "./config";
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET
const client = new PrismaClient()

router.post('/signup', async (req,res)=>{
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

router.post('/signin', async (req,res)=>{
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
    const token = jwt.sign({username: user.username.toString()}, JWT_SECRET || "")

    res.json({
        message: "user signup success",
        token
    })
})


router.post('/room', userMiddleware, async (req,res)=>{
    const {slug} = req.body;
    try{

        const room = await client.room.create({
           data:{
                slug,
                username: req.username
           }
        })
        res.json({
            roomId: room.id
        })
    }catch(e){
        console.log(e)
    }
})

router.get('/room/:slug', async(req,res)=>{
    const slug = req.params.slug;

    const room = await client.room.findFirst({
        where:{
            slug
        }
    })
    if(!room){
        res.status(404).json({
            message:"Room not found"
        })
        return;
    }

    res.json({
        roomId: room.id
    })
})

router.post('/chat/:roomId', userMiddleware, async(req,res)=>{
    const roomId = Number(req.params.roomId);
    const { message } = req.body;

    const user = await client.chat.create({
        data:{
            message,
            roomId,
            username: req.username
        }        
    })

    res.json({
        user
    })
})


router.get('/chat/:roomId', async(req, res)=>{
    const roomId = Number(req.params.roomId);

    const messages = await client.chat.findMany({
        where:{
            roomId
        },
        orderBy:{
            id:"desc"
        },
        take: 50
    })
    
    res.json({
        messages
    })    
})

export default router