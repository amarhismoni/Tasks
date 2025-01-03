import React from "react";
import translations from "./translation";

const TaskModal = ({ showModal, setShowModal, handleAddTask, newTask, setNewTask, language }) => {
    if (!showModal) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{translations[language].addNewTask}</h2>
                <form onSubmit={handleAddTask} className="modal-form">
                    <label>
                        {translations[language].taskDescription}:
                        <input
                            type="text"
                            value={newTask.taskDescription}
                            onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
                            placeholder={translations[language].taskDescription}
                            className="modal-input"
                            maxLength={100}
                        />
                    </label>
                    <p style={{ fontSize: "12px", color: "#666" }}>Characters remaining: {100 - newTask.taskDescription.length}</p>
                    <label>
                        {translations[language].date}:
                        <input
                            type="date"
                            value={newTask.taskDate}
                            onChange={(e) => setNewTask({ ...newTask, taskDate: e.target.value })}
                            className="modal-input"
                        />
                    </label>
                    <label>
                        {translations[language].time}:
                        <input
                            type="time"
                            value={newTask.taskTime}
                            onChange={(e) => setNewTask({ ...newTask, taskTime: e.target.value })}
                            className="modal-input"
                            step="600"
                        />
                    </label>
                    <div className="modal-actions">
                        <button type="submit">{translations[language].save}</button>
                        <button type="button" onClick={() => setShowModal(false)}>
                            {translations[language].cancel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;