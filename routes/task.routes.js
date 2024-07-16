import express from 'express';


import {isUserAuthenticated} from '../middlewares/auth.js'

import { getMyTask, taskPost } from '../controllers/task.controllers.js';

const router = express.Router();


router.post('/postTask',isUserAuthenticated,taskPost)
// router.get('/getAllCars',getTasks);
router.get('/getMyTask',isUserAuthenticated,getMyTask);



export default router;