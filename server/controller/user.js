const { messaging } = require("firebase-admin");
const Task = require("../models/task");
const User = require('../models/user');



exports.createTask = async (req, res) => {
    try {
        const { title, description, date, category, status } = req.body;

        const { user } = req
        if (!title || !description || !date || !category || !status) {

            return res.status(500).json({
                success: false,
                message: "All feilds required"
            })
        }


        const newTask = await Task.create({
            title,
            description,
            category,
            status,
            dueDate: date,
            owner: user._id
        })



        if (newTask) {

            const userData = await User.findByIdAndUpdate({ _id: user._id }, {
                $push: {
                    'tasks': newTask._id
                }
            }).populate('tasks')

            // const task = await Task.find({})
            return res.status(200).json({
                success: true,
                message: "Task added successfully",
                data: newTask
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Error creating task"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { title, description, dueDate, category, status, _id } = req.body;
        const { user } = req

        const task = await Task.findById(_id)

        if (title) {
            task.title = title
        }

        if (description) {
            task.description = description
        }

        if (dueDate) {
            task.dueDate = dueDate
        }
        if (category) {
            task.category = category
        }

        if (status) {
            task.status = status
        }

        await task.save()

        res.status(200).json({
            success: true,
            message: 'Task updated Successfully',
            task
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.body
        const { user } = req
        console.log(taskId);

        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Task Id requires'
            })
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (deletedTask) {
            await User.findByIdAndUpdate(user._id, {
                $pull: {
                    tasks: deletedTask._id
                }

            })

            return res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
                deletedTask
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}