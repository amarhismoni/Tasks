import React, { useEffect } from "react";
import { useState } from "react";
import Task from "../components/Task"

function Tasks() {
    const [tasks, setTasks] = useState();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("no token. please log in");
            }

            try {
                const response = await fetch("http://localhost:3000/tasks", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                const data = await response.json();
                setTasks(data.tasks);
            } catch (err) {
                throw new Error(err);
            }
        };

        fetchTasks();
    }, []);

    return <div>
      {tasks.map((task, index)=>{
        <Task key={index} taskName={task.taskName} taskDescription={task.taskDescription} date={task.date} />
      })}
    </div>;
}

export default Tasks;
