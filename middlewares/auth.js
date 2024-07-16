import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';


// ADMIN AUTHENTICATION AND AUTHORIZATION->
export const isAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokena } = req.cookies
    if(!tokena){
        return next(new ErrorHandler("Admin Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokena,process.env.JWT_SECRETA);
    req.user = await User.findById(decoded.id);

    //AUTHORIZATION->
    if(req.user.role !== "Admin"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})



// USER AUTHNETICATION AND AUTHORIZATION->
export const isUserAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokenu } = req.cookies

    if(!tokenu){
        return next(new ErrorHandler("User Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokenu,process.env.JWT_SECRETU);
    req.user = await User.findById(decoded.id);
    
    // AUTHORIZATION->
    if(req.user.role !=="User"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})

