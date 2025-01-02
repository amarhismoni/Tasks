import React, { useEffect, useState } from "react";
import Task from "../components/Task";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../App.css";
import translations from "../components/translation";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [language, setLanguage] = useState("en");
    const [fullname, setFullname] = useState("");
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ taskDescription: "", taskDate: "", taskTime: "" });
    const [archivedTasks, setArchivedTasks] = useState([]);
    const [showArchivedModal, setShowArchivedModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [navigate]);

    const fetchTasks = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }
        try {
            const response = await fetch("http://localhost:8585/tasks", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setTasks(data.tasks);
                setFilteredTasks(data.tasks);
                setFullname(data.fullname);
            } else {
                console.error("Failed to fetch tasks:", data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const refreshTasks = async () => {
        await fetchTasks();
    };

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === "en" ? "al" : "en"));
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = tasks.filter((task) => task.taskDescription.toLowerCase().includes(query));
        setFilteredTasks(filtered);
    };

    const groupTasksByDateDesc = (tasks) => {
        const grouped = tasks.reduce((acc, task) => {
            const date = task.taskDate || "No date specified";
            if (!acc[date]) acc[date] = [];
            acc[date].push(task);
            return acc;
        }, {});

        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            if (a === "No date specified") return 1;
            if (b === "No date specified") return -1;
            return new Date(b) - new Date(a);
        });

        return sortedKeys.reduce((sortedAcc, key) => {
            sortedAcc[key] = grouped[key];
            return sortedAcc;
        }, {});
    };

    const groupedTasks = groupTasksByDateDesc(filteredTasks);

    const handleAddTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }
        if (newTask.taskDescription.length > 100) {
            setError("Task description cannot exceed 100 characters.");
            return;
        }

        const taskData = {
            ...newTask,
            taskStatus: "Pending",
        };

        const urlencoded = new URLSearchParams(taskData).toString();

        try {
            const response = await fetch("http://localhost:8585/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
                body: urlencoded,
            });

            const data = await response.json();

            if (data.success) {
                alert("Added task successfully");
                setShowModal(false);
                setNewTask({ taskDescription: "", taskDate: "", taskTime: "" });
                await refreshTasks();
            } else {
                console.error("Failed to add task:", data.message);
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const handleEditTask = async (taskId, taskDescription, taskDate, taskTime, taskStatus) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }
        if (taskDescription.length > 100) {
            setError("Task description cannot exceed 100 characters.");
            return;
        }

        const taskData = { taskId, taskDescription, taskDate, taskTime, taskStatus };
        const urlencoded = new URLSearchParams(taskData).toString();
        try {
            const response = await fetch("http://localhost:8585/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
                body: urlencoded,
            });

            const data = await response.json();

            if (data.success) {
                alert("Task updated successfully");
                await refreshTasks();
            } else {
                console.error("Failed to update task:", data.message);
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const handleStatusChange = async (taskId) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }

        const taskStatusData = { taskId };
        const urlencoded = new URLSearchParams(taskStatusData).toString();
        try {
            const response = await fetch("http://localhost:8585/tasks/change-status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
                body: urlencoded,
            });

            const data = await response.json();

            if (data.success) {
                alert("Task status updated successfully");
                await refreshTasks();
            } else {
                console.error("Failed to update task status:", data.message);
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const handleDelete = async (taskId) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }

        const taskDeletionData = { taskId };
        const urlencoded = new URLSearchParams(taskDeletionData).toString();
        try {
            const response = await fetch("http://localhost:8585/tasks", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
                body: urlencoded,
            });

            const data = await response.json();

            if (data.success) {
                alert("Task deleted successfully");
                await refreshTasks();
            } else {
                console.error("Failed to delete task:", data.message);
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const handleArchiveTask = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:8585/tasks/archive-tasks", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                alert("Task status updated successfully");
                await refreshTasks();
            } else {
                console.error("Failed to update task statuses:", data.message);
                setError(data.message);
                alert(error);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const handleShowArchivedTasks = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8585/tasks/archived", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
    
            if (data.success) {
                if (data.tasks.length > 0) {
                    setArchivedTasks(data.tasks); 
                    setShowArchivedModal(true); 
                } else {
                    alert("No archived tasks found."); 
                }
            } else {
                console.error("Failed to fetch tasks:", data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    const handleDeleteArchives = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No token found. Please log in.");
            navigate("/login");
            return;
        }
        if (window.confirm("Are you sure you want to delete all archived tasks?")) {
        try {
            const response = await fetch("http://localhost:8585/tasks/archived", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                alert("Task deleted successfully");
                await refreshTasks();
                setShowArchivedModal(false);
            } else {
                console.error("Failed to delete task:", data.message);
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        }
    }
    };

    return (
        <div>
            <Navbar language={language} toggleLanguage={toggleLanguage} fullname={fullname} onArchiveTask={handleArchiveTask} onShowArchivedTasks={handleShowArchivedTasks} />
            <div className="under-nav">
                <div className="search-container">
                    <label htmlFor="searchTasks">{translations[language].searchTasks}:</label>
                    <input type="text" placeholder={translations[language].searchTasks} name="searchTasks" value={searchQuery} onChange={handleSearch} />
                </div>
                <div className="create-task-container">
                    <button onClick={() => setShowModal(true)}>{translations[language].addNewTask}</button>
                </div>
            </div>

            {Object.keys(groupedTasks).length > 0 ? (
                <div className="task-container">
                    {Object.entries(groupedTasks).map(([date, tasks]) => (
                        <div key={date} className="task-group">
                            <h3>{date}</h3>
                            <div className="task-grid">
                                {tasks.map((task) => (
                                    <Task
                                        key={task.taskId}
                                        taskId={task.taskId}
                                        taskDescription={task.taskDescription || "No description available."}
                                        date={task.taskDate || "No date specified"}
                                        time={task.taskTime || "No time specified"}
                                        status={task.taskStatus}
                                        onEdit={handleEditTask}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-tasks-message">{translations[language].noTasks}</p>
            )}

            {showModal && (
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
                                <input type="date" value={newTask.taskDate} onChange={(e) => setNewTask({ ...newTask, taskDate: e.target.value })} className="modal-input" />
                            </label>
                            <label>
                                {translations[language].time}:
                                <input type="time" value={newTask.taskTime} onChange={(e) => setNewTask({ ...newTask, taskTime: e.target.value })} className="modal-input" />
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
            )}

            {showArchivedModal && (
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
            )}
        </div>
    );
}

export default Tasks;
