
import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { verifyToken } from '../middlewares/validateToken.js'

export const adminRoute=exp.Router()

// Authenticate admin
// Read all articles
adminRoute.get('/articles',verifyToken,async(req,res)=>{
    //get all articles from ArticlesModel
    let articles = await ArticleModel.find().populate("author", "firstName email")
    res.status(200).json({message: "All articles", payload: articles})
})

// Get all users
adminRoute.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await UserTypeModel.find({ role: { $ne: 'ADMIN' } });
        res.status(200).json({ message: "All users", payload: users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});

// Unblock User
adminRoute.patch('/unblock/:userId', verifyToken, async (req, res) => {
    let userId = req.params.userId;
    let userObjDb = await UserTypeModel.findById(userId);
    if (!userObjDb) {
        return res.status(404).json({ message: "User not found" });
    }
    if (userObjDb.isActive === true) {
        return res.status(400).json({ message: "User is already unblocked" });
    }
    let unblockedUser = await UserTypeModel.findByIdAndUpdate(userId, { $set: { isActive: true } }, { new: true });
    res.status(200).json({ message: "User successfully unblocked", payload: unblockedUser });
});

// Block User
adminRoute.patch('/block/:userId', verifyToken, async (req, res) => {
    let userId = req.params.userId;
    let userObjDb = await UserTypeModel.findById(userId);
    if (!userObjDb) {
        return res.status(404).json({ message: "User not found" });
    }
    if (userObjDb.isActive === false) {
        return res.status(400).json({ message: "User is already blocked" });
    }
    let blockedUser = await UserTypeModel.findByIdAndUpdate(userId, { $set: { isActive: false } }, { new: true });
    res.status(200).json({ message: "User successfully blocked", payload: blockedUser });
});
