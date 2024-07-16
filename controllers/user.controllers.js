import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'



// REGISTER User->
export const registerUser = asyncErrorHandler(async (req, res,next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar Required!", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported", 400));
  }
  const { name,  gender, phone, email, password,role } = req.body;
  if (!name ||  !gender || !phone || !email || !role || !password ) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User already exist", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    gender,
    phone,
    role,
    password: hashedPassword,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  

  const tokenu = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRETU,
    {
      expiresIn: process.env.JWT_EXPIRESU,
    }
  );
  user.token = tokenu;
  
  await user.save();
  res
    .status(200)
 
    .cookie("tokenu", tokenu, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "User successfully created",
      user,
    });
});




// LOGIN User->
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not registered", 400));
  }
  const passwordCompare =  bcrypt.compareSync(password, user.password);
  if (!passwordCompare) {
    return next(new ErrorHandler("Correct your password", 400));
  }

  const UserRole = user.role;
  if(UserRole!==role){
    return next(new ErrorHandler("User not associated with this role", 400));
  }

 
  const tokenu = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRETU,
    {
      expiresIn: process.env.JWT_EXPIRESU,
    }
  );
  user.token = tokenu;
  
  res
    .status(200)
    .cookie("tokenu", tokenu, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
      httpOnly:true
    })
 
    .json({
      success: true,
      message: "User successfully login",
      user
    });
});




// LOGOUT User->
export const logOutUser = asyncErrorHandler(async (req, res, next) => {
  res
  .status(200)
  .cookie("tokenu", "",{
    expiresIn: new Date(Date.now()),
    httpOnly:true,
  })

  .json({
    message: "Logged Out",
    success:true,
  });
});



// DELETE User
export const deleteUser = asyncErrorHandler(async (req, res,next) => {
    const user = req.user;
    const userId = user._id;
    const findUser = await User.findById(userId);
    if(!findUser){
      return next(new ErrorHandler("Cannot find User",400))
    }
    await findUser.deleteOne()
    res
    .status(200)
    .json({message:"User deleted",success:true})
    
});


// Our Profile->
export const getParticularUser = asyncErrorHandler(async (req, res,next) => {
    let user = req.user;
    const userId = user._id;
     user = await User.findById(userId);
    if(!user){
        return next(new ErrorHandler("User not found",400))
    }
    res
    .status(200)
    .json({message:"user achieved",success:true,user});
});


// Get Users->
export const getUsers = asyncErrorHandler(async (req, res,next) => {
     const users = await User.find({role:"User"});

    if(!users){
        return next(new ErrorHandler("Users not found",400))
    }
    res
    .status(200)
    .json({message:"user achieved",success:true,users});
});



// Update User Details->
export const updateUserDetails = asyncErrorHandler(async (req, res, next) => {
  
  const userId = req.user._id;

  const {
    name,
   phone,
   email,
  } = req.body;

  const findUser = User.findById(userId);
  if (!findUser) {
    return next(new ErrorHandler("Cannot find User", 400));
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      name,
      phone,
      email,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res
    .status(200)
    .json({ message: "User Details Updated", success: true, user });
});


export const updateUserPassword = asyncErrorHandler(async (req, res, next) => {
  
    const user = req.user;
    const userId = user._id;
  
    const {
      oldPassword,
      newPassword
    } = req.body;
  
    const findUser = User.findById(userId);
    if (!findUser) {
      return next(new ErrorHandler("Cannot find User", 400));
    }
    const isPasswordCorrect = bcrypt.compareSync(oldPassword,user.password)
    if(!isPasswordCorrect){
        return next(new ErrorHandler("Password do not match"));
    }
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        password:newPassword
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );
  
    res
      .status(200)
      .json({ message: "User Password Updated", success: true, userUpdated });
  });
  
  
  