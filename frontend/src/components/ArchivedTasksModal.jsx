import React from "react";
import translations from "./translation";
import './ArchivedTasksModal.css'

const ArchivedTasksModal = ({
    showArchivedModal,
    setShowArchivedModal,
    archivedTasks,
    handleDeleteArchives,
    language,
    groupTasksByDateDesc,
}) => {
    if (!showArchivedModal) return null;

    return (
        <div className="modal">
            <div className="archive-modal-content">
                <h2>{translations[language].archivedTasks}</h2>
                <div className="archive-modal-body">
                    {Object.keys(groupTasksByDateDesc(archivedTasks)).length > 0 ? (
                        Object.entries(groupTasksByDateDesc(archivedTasks)).map(([date, tasks]) => (
                            <div key={date} className="archived-task-group">
                                <h4>{date}</h4>
                                {tasks.map((task) => (
                                    <div key={task.taskId} className="task archive-task smaller-text">
                                        <p className="archive-task-description">{task.taskDescription}</p>
                                        <div className="archive-right">
                                            <p>
                                                {translations[language].dueTime}: {task.taskTime}
                                            </p>
                                            <p>
                                                {translations[language].status}: {task.taskStatus}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>{translations[language].noArchivedTasks}</p>
                    )}
                </div>
                <div className="archive-modal-actions">
                    <button onClick={handleDeleteArchives} className="archive-close">
                        {translations[language].deleteArchives}
                    </button>
                    <button onClick={() => setShowArchivedModal(false)} className="archive-close">
                        {translations[language].close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArchivedTasksModal;