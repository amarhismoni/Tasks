import React, { useState } from "react";
import "./Task.css";

function Task({
    taskId,
    taskDescription,
    date,
    time,
    status,
    onEdit,
    onDelete,
    onStatusChange,
    saveText, 
    cancelText, 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({
        editedTaskDescription: taskDescription,
        editedTaskDate: date,
        editedTaskTime: time,
    });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        onEdit(
            taskId,
            editedTask.editedTaskDescription,
            editedTask.editedTaskDate,
            editedTask.editedTaskTime,
            status
        );
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleStatusChange = () => {
        if (status !== "Done") {
            onStatusChange(taskId);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            onDelete(taskId);
        }
    };

    return (
        <div className={`task ${isEditing ? "task-editing" : ""}`}>
            {isEditing ? (
                <div className="task-editing">
                    <label htmlFor="">Description</label>
                    <input
                        type="text"
                        value={editedTask.editedTaskDescription}
                        onChange={(e) =>
                            setEditedTask({
                                ...editedTask,
                                editedTaskDescription: e.target.value,
                            })
                        }
                        placeholder="Enter task description"
                        className="edit-input-description"
                    />
                    <div className="editing-date-time">
                        <div className="date-time-title">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                value={editedTask.editedTaskDate}
                                onChange={(e) =>
                                    setEditedTask({
                                        ...editedTask,
                                        editedTaskDate: e.target.value,
                                    })
                                }
                                className="edit-input"
                            />
                        </div>
                        <div className="date-time-title">
                            <label htmlFor="time">Time:</label>
                            <input
                                type="time"
                                value={editedTask.editedTaskTime}
                                onChange={(e) =>
                                    setEditedTask({
                                        ...editedTask,
                                        editedTaskTime: e.target.value,
                                    })
                                }
                                className="edit-input"
                            />
                        </div>
                    </div>
                    <div className="editing-actions">
                        <button className="save-btn" onClick={handleSave}>
                            {saveText} 
                        </button>
                        <button className="cancel-btn" onClick={handleCancel}>
                            {cancelText}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="task-item-container">
                    <div className="task-content">
                        <div className="task-description-frame">
                            <p className="task-description"> &gt; {taskDescription}</p>
                        </div>

                        <div className="date-time">
                            <p className="task-date">📅 {date}</p>
                            <p className="task-time">⏰ {time}</p>
                        </div>
                    </div>
                    <div className="task-actions">
                        <div className="task-actions-left">
                            <p className="task-status">Status: {status}</p>
                        </div>
                        <div className="task-actions-right">
                            <button onClick={handleEditToggle} title="Edit Task">
                                ✏️
                            </button>
                            <button onClick={handleStatusChange} title="Mark as Done">
                                ✔️
                            </button>
                            <button onClick={handleDelete} title="Delete Task">
                                ❌
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Task;
