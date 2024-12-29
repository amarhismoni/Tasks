import React from "react";
import "./Task.css"

function Task({ taskName, taskDescription, date }) {
    return (
        <div>
            <div className="task">
                <h3 className="task-name">{taskName}</h3>
                <p className="task-description">{taskDescription}</p>
                <p className="task-date">Due Date: {date}</p>
            </div>
        </div>
    );
}

export default Task;
