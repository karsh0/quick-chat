import express from "express"
import { userModel } from "./db"
import { JWT_SECRET, SignupType } from "./config"
import jwt from "jsonwebtoken"
import { userMiddleware } from "./middleware"

const app = express()

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
    const token = jwt.sign({userId: user._id}, JWT_SECRET)

    res.json({
        message: "user signup success",
        token
    })
})

app.get('/dashboard', userMiddleware, async(req,res)=>{
    const user = await userModel.findOne({userId: req.userId});
    res.json({
        user
    })
})


app.listen(3000)