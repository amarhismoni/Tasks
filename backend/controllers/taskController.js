const Router = require("express").Router();
const express = require("express");
const taskRepository = require("../repositories/taskRepository");
const passport = require("passport");

// Middleware to parse JSON and URL-encoded data
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        if (!req.user || !req.user.id || !req.user.fullname) {
            return res.status(400).json({
                success: false,
                message: "User information is missing.",
            });
        }

        const userId = req.user.id;
        const fullname = req.user.fullname;

        const groupedTasks = await taskRepository.findTasksByUserId(userId);

        return res.status(200).json({
            success: true,
            tasks: groupedTasks,
            fullname,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching tasks.",
        });
    }
});

Router.get("/archived", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({
                success: false,
                message: "User information is missing.",
            });
        }

        const userId = req.user.id;

        const groupedTasks = await taskRepository.findArchivedTasks(userId);

        return res.status(200).json({
            success: true,
            tasks: groupedTasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching tasks.",
        });
    }
});


// Add a new task
Router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    express.urlencoded({ extended: true }), // Parse x-www-form-urlencoded
    async (req, res) => {
        const userId = req.user.id;
        const { taskDescription, taskDate, taskTime } = req.body;

        if (!taskDescription || !taskDate || !taskTime) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        try {
            const task = await taskRepository.addTask(taskDescription, userId, taskDate, taskTime);
            res.status(201).json({
                success: true,
                message: "Task added successfully",
                task,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error adding task.",
            });
        }
    }
);

Router.put("/", passport.authenticate("jwt", { session: false }), express.urlencoded({ extended: true }), async (req, res) => {
    const { taskId, taskDescription, taskDate, taskTime, taskStatus } = req.body;
    const userId = req.user.id;

    // Validate the required fields
    if (!taskId || !taskDescription || !taskDate || !taskTime || !taskStatus) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        // New task details to be updated
        const updatedTask = await taskRepository.updateTask(taskId, taskDescription, userId, taskDate, taskTime, taskStatus);

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or not updated",
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.error("Error updating task:", error.stack || error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the task",
        });
    }
});

Router.patch("/change-status", passport.authenticate("jwt", { session: false }), express.urlencoded({ extended: true }), async (req, res) => {
    const { taskId } = req.body;

    // Validate the required fields
    if (!taskId) {
        return res.status(400).json({
            success: false,
            message: "failed to change status",
        });
    }

    try {
        // New task details to be updated
        const updatedTask = await taskRepository.updateTaskStatus(taskId);

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or not updated",
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.error("Error updating task:", error.stack || error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the task",
        });
    }
});

Router.patch("/archive-tasks", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const userId = req.user.id;

    try {
        // Archive tasks with status "Done" for the user
        const updatedRowsCount = await taskRepository.archiveTasks(userId);

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: `No tasks with status "Done" were found for user ${userId}.`,
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: `${updatedRowsCount} tasks updated to "Archived".`,
        });
    } catch (error) {
        console.error("Error updating task statuses:", error.stack || error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the task statuses.",
        });
    }
});


Router.delete("/", passport.authenticate("jwt", { session: false }), express.urlencoded({ extended: true }), async (req,res)=>{
    const { taskId } = req.body;

    // Validate the required fields
    if (!taskId) {
        return res.status(400).json({
            success: false,
            message: "failed to delete",
        });
    }

    try {
        // New task details to be updated
        const deletedTask = await taskRepository.deleteTask(taskId);

        // Success response
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task:", error.stack || error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the task",
        });
    }
});


module.exports = Router;