import Task from "../models/task.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";


export const taskPost = asyncErrorHandler(async (req, res, next) => {

    const user = req.user;
    const userId = user._id;
    const userName = user.name;

    const { title, description } = req.body;


    if (!title || !description) {
        return next(new ErrorHandler("Fill the credentials to collab with us"));
    }

    const task = await Task.create({
        title,
        description,
        owner: userId,
        ownerName: userName,
    });


    res.status(201).json({
        success: true,
        message: "Your task has been created successfully",
        task
    });
});

// export const getTasks = asyncErrorHandler(
//     async (req, res, next) => {
//         const tasks = await Task.find();
//         if (!tasks) {
//             return next(new ErrorHandler("No tasks found", 404));
//         }
//         res.status(200).json({
//             success: true,
//             tasks,
//         });
//     }
// );




// get My task
export const getMyTask = asyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    const userId = user._id;

    const tasks = await Task.find({ owner: userId });
    if (!tasks) {
        return next(new ErrorHandler("No task found", 404));
    }
    res.status(200).json({
        success: true,
        tasks
    });
})
