import express from 'express';

import { deleteUser, getParticularUser, getUsers, logOutUser, loginUser, registerUser, updateUserDetails, updateUserPassword } from '../controllers/user.controllers.js';
import {isAuthenticated, isUserAuthenticated} from '../middlewares/auth.js'

const router = express.Router();


router.post('/registerUser',registerUser)
router.post('/loginUser',loginUser);
router.get('/logoutUser',isUserAuthenticated,logOutUser);

router.delete('/deleteUser',isUserAuthenticated,deleteUser);

router.get('/getUserProfile',isUserAuthenticated,getParticularUser);
router.get('/getUsers',isAuthenticated,getUsers);

router.put('/updateUserDetails',isUserAuthenticated,updateUserDetails);
router.put('/updateUserPassword',isUserAuthenticated,updateUserPassword);




export default router;