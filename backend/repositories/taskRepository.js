const { Tasks } = require("../models/model");

exports.findTasksByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User object or user ID is invalid");
    }
    try {
        const tasks = await Tasks.findAll({
            where: { userId: userId },
        });
        return tasks || [];
    } catch (error) {
        console.error("Error in findTasksByUser:", error);
        throw new Error("Unable to fetch tasks for the user");
    }
};

exports.addTask = async (taskData) => {
    if (!taskData || !taskData.title || !taskData.userId) {
        throw new Error("Missing required task data");
    }
    try {
        const task = await Tasks.create(taskData);
        return task;
    } catch (error) {
        console.error("Error in addTask:", error);
        throw new Error("Unable to add task");
    }
};

exports.editTasks = async (taskId, taskData) => {
    if (!taskId || !taskData) {
        throw new Error("Task ID or update data is missing");
    }
    try {
        const editedTask = await Tasks.update(taskData, {
            where: { id: taskId },
        });
        return editedTask;
    } catch (error) {
        console.error("Error in editTasks:", error);
        throw new Error("Unable to edit task");
    }
};
