import exp from 'express'
export const commonRouter =exp.Router()
import { authenticate } from '../services/authService.js'
import jwt from 'jsonwebtoken'
import { UserTypeModel } from '../models/UserModel.js'
import { hash,compare } from 'bcryptjs'


import { ArticleModel } from '../models/ArticleModel.js'

// Get public articles
commonRouter.get('/articles', async (req, res) => {
    try {
        const articles = await ArticleModel.find({ isArticleActive: true }).populate("author", "firstName lastName");
        res.status(200).json({ message: "Public articles", payload: articles });
    } catch (err) {
        res.status(500).json({ message: "Error fetching articles", error: err.message });
    }
});

// Get single public article
commonRouter.get('/articles/:articleId', async (req, res) => {
    try {
        const article = await ArticleModel.findById(req.params.articleId).populate("author", "firstName lastName");
        res.status(200).json({ message: "Public article", payload: article });
    } catch (err) {
        res.status(500).json({ message: "Error fetching article", error: err.message });
    }
});

//login
commonRouter.post('/login',async(req,res)=>{
    let userCred=req.body
        //authenticate the user
        let {token,user}=await authenticate(userCred)
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false
        })
        //send 
        res.status(200).json({message:"login Successfull",payload:user})
})


//logout
// commonRouter.get('/')
commonRouter.get('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true, //Must Match original settings
        secure:false,  //Must Match original settings
        sameSite:"lax"  //Must Match original settings
    })
    res.status(200).json({message:"logout successfull"})
})


//Change Password
commonRouter.put('/change-password',async(req,res)=>{
    //get current password and new password
    let {email,currentPassword,newPassword}=req.body
    //check if user present or not
    let userObj=await UserTypeModel.findOne({email:email})
    if(!userObj){
        return res.status(401).json({message:"User not found"})
    }
    //check current password is correct or not
    let isMatched=await compare(currentPassword,userObj.password)
    if(!isMatched){
        return res.status(401).json({message:"old Password is InValid"})
    }
    //if matched 
    let newHashedPassword=await hash(newPassword,10);

    //set newpassword to database
    await UserTypeModel.findByIdAndUpdate(userObj._id,{$set:{password:newHashedPassword}})
    //return response
    res.status(200).json({message:"password changed successfully"})


})