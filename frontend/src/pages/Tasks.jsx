import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModal";
import ArchivedTasksModal from "../components/ArchivedTasksModal";
import translations from "../components/translation";
import "../App.css";
import Task from '../components/Task'

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
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
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

        const today = new Date().toISOString().split("T")[0];
        if (newTask.taskDate < today) {
            setError("Task date cannot be in the past.");
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
                alert("Tasks archived successfully");
                await refreshTasks();
            } else {
                console.error("Failed to archive tasks:", data.message);
                setError(data.message);
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
                console.error("Failed to fetch archived tasks:", data.message);
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
                    alert("Archived tasks deleted successfully");
                    await refreshTasks();
                    setShowArchivedModal(false);
                } else {
                    console.error("Failed to delete archived tasks:", data.message);
                    setError(data.message);
                }
            } catch (err) {
                console.error(err);
                setError(err.message || "An unexpected error occurred.");
            }
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer); 
    }, []);

    useEffect(() => {
        const checkDueTasks = () => {
            const now = new Date();
            const today = now.toISOString().split("T")[0];

            tasks.forEach((task) => {
                if (task.taskStatus === "Pending" && task.taskDate === today) {
                    const taskDateTime = new Date(`${task.taskDate}T${task.taskTime}`);
                    const timeDifference = taskDateTime - now;

                    if (timeDifference > 0 && timeDifference <= 300000) {
                        showToastNotification(task);
                    }
                }
            });
        };

        const interval = setInterval(checkDueTasks, 60000); 
        return () => clearInterval(interval); 
    }, [tasks]);

    const showToastNotification = (task) => {
        toast.info(
            <div>
                <p>Task Due Soon: {task.taskDescription}</p>
                <p>Time: {task.taskTime}</p>
                <button onClick={() => toast.dismiss()}>OK</button>
            </div>,
            {
                autoClose: 5000, 
                closeButton: false,
            }
        );
    };

    return (
        <div>
            <Navbar language={language} toggleLanguage={toggleLanguage} fullname={fullname} onArchiveTask={handleArchiveTask} onShowArchivedTasks={handleShowArchivedTasks} />
            <div className="clock" style={{ visibility: "hidden" }}>
                <p>Current Time: {currentTime}</p>
            </div>
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
                                        saveText={translations[language].save}
                                        cancelText={translations[language].cancel}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-tasks-message">{translations[language].noTasks}</p>
            )}

            <TaskModal
                showModal={showModal}
                setShowModal={setShowModal}
                handleAddTask={handleAddTask}
                newTask={newTask}
                setNewTask={setNewTask}
                language={language}
            />

            <ArchivedTasksModal
                showArchivedModal={showArchivedModal}
                setShowArchivedModal={setShowArchivedModal}
                archivedTasks={archivedTasks}
                handleDeleteArchives={handleDeleteArchives}
                language={language}
                groupTasksByDateDesc={groupTasksByDateDesc}
            />

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={true} />
        </div>
    );
}

export default Tasks;