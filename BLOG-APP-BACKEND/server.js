import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/userAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/CommonAPI.js'
import cors from 'cors'
config()  //process.env

const app=exp()  //exp() function 
//use cors middleware
// app.use(cors({origin:['http://localhost:5173']}))
app.use(cors({
 origin: 'http://localhost:5173',
 credentials: true
}))
//add body parser middleware
app.use(exp.json())

app.use(cookieParser())

app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use('/common-api',commonRouter)

//connect to DB
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connection success")
        //start http server
        app.listen(process.env.PORT,()=>console.log("Server started"))
    }catch(err){
        console.log("Error in DB connection",err)
    }
    
}

connectDB()

// commonRouter.get('/logout',(req,res)=>{
//   res.clearCookie("token",{
//     httpOnly:true,
//     secure:false,
//     samesite:'Lax'
//   });
//   res.status(200).json({message:"logout success"});
// });




//dealing with invalid path
app.use((req,res,next)=>{
    //res.json({message:req.url + " is Invalid path"})
    res.json({message:`${req.url}  is Invalid path`})

});


//error handling middleware
app.use((err,req,res,next)=>{
    console.log("err:",err)
    res.json({message:"error",reason:err.message})
})


// let a=10,b=20,c=30;
// console.log("a is ",a,"b is ",b,"c is ",c)
// //template literal
// console.log(`a is ${a} b is ${b} c is ${c}`)

 //the below error handling are applicable to any other application of backend
app.use((err, req, res, next) => {
    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
        });
    }
    // Invalid ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format",
        });
    }
    // Duplicate key
    if (err.code === 11000) {
        return res.status(409).json({
            message: "Duplicate field value",
        });
    }
    //all 500's status code related to the server side
    res.status(500).json({
        message: "Internal Server Error",
    });



    app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});
});