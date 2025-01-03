const { Tasks } = require("../models/model");
const { Op } = require("sequelize");

exports.findTasksByUserId = async (userId) => {
    try {
        const tasks = await Tasks.findAll({
            where: {
                userId,
                taskStatus: {
                    [Op.or]: ["Pending", "Done"], 
                },
            },
        });

        return tasks;
    } catch (error) {
        console.error("Error fetching tasks by userId:", error);
        throw new Error("Unable to fetch tasks");
    }
};

exports.addTask = async (taskDescription, userId, taskDate, taskTime) => {
    if (!taskDescription || !userId || !taskDate || !taskTime) {
        throw new Error("Missing required task data");
    }

    const taskStatus = "Pending";

    try {
        const task = await Tasks.create({
            userId,
            taskDescription,
            taskDate,
            taskTime,
            taskStatus,
        });
        return task;
    } catch (error) {
        console.error("Error in addTask:", error);
        throw new Error("Unable to add task");
    }
};

exports.updateTask = async (taskId, taskDescription, userId, taskDate, taskTime, taskStatus) => {
    if (!taskId || !taskDescription || !userId || !taskDate || !taskTime || !taskStatus) {
        throw new Error("Missing required task data for update");
    }

    console.log("Updating task with ID:", taskId); 
    console.log("Update data:", { taskDescription, userId, taskDate, taskTime, taskStatus }); 

    try {
        
        const [updatedRowsCount] = await Tasks.update(
            {
                userId: userId,
                taskDescription: taskDescription,
                taskDate: taskDate,
                taskTime: taskTime,
                taskStatus: taskStatus,
            },
            {
                where: { taskId: taskId },
            }
        );

        if (updatedRowsCount === 0) {
            console.warn(`Task with ID ${taskId} not found or no changes were made.`);
            return null;
        }

        const updatedTask = await Tasks.findOne({ where: { taskId } });
        console.log("Updated task:", updatedTask); 

        return updatedTask;
    } catch (error) {
        console.error("Error in updateTask:", error.stack || error.message);
        throw new Error("Unable to update task");
    }
};

exports.updateTaskStatus = async (taskId) => {
    if (!taskId) {
        console.warn("task not found");
    }

    try {
        const [updatedRowsCount] = await Tasks.update(
            { taskStatus: "Done" },
            {
                where: {
                    taskId: taskId,
                    taskStatus: "Pending", 
                },
            }
        );

        if (updatedRowsCount === 0) {
            console.warn(`Task with ID ${taskId} not found or status was not "Pending".`);
            return null;
        }
        const updatedTask = await Tasks.findOne({ where: { taskId } });
        return updatedTask;
    } catch (error) {
        console.error("Error updating task status:", error);
        throw new Error("Unable to update task status");
    }
};

exports.deleteTask = async (taskId) => {
    try {
        const deletedTask = await Tasks.destroy({
            where: {
                taskId: taskId,
            },
        });

        console.log("task deleted");
    } catch (error) {
        console.error(error);
    }
};

exports.archiveTasks = async (userId) => {
    try {
        const [updatedRowsCount] = await Tasks.update(
            { taskStatus: "Archived" },
            {
                where: {
                    taskStatus: "Done",
                    userId,
                },
            }
        );

        if (updatedRowsCount === 0) {
            console.warn(`No tasks with status "Done" were found for user ${userId}.`);
        }

        return updatedRowsCount; 
    } catch (error) {
        console.error("Error updating task statuses:", error);
        throw new Error("Unable to update task statuses");
    }
};

exports.findArchivedTasks = async (userId) => {
    try {
        const tasks = await Tasks.findAll({
            where: {
                userId,
                taskStatus: "Archived",
            },
        });

        return tasks;
    } catch (error) {
        console.error("Error fetching tasks by userId:", error);
        throw new Error("Unable to fetch tasks");
    }
};

exports.deleteArchivedTasks = async (userId) => {
    try {
        const deletedArchivedTask = await Tasks.destroy({
            where: {
                userId: userId,
                taskStatus: "Archived",
            },
        });
        console.log("tasks deleted");

        return deletedArchivedTask;
    } catch (error) {
        console.error(error);
    }
};
