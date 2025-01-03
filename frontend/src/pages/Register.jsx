import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        secretAnswer: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSecretAnswer, setShowSecretAnswer] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8585/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Regjistrimi u kry me sukses. Lajmerohuni tani");
                setFormData({
                    fullname: "",
                    username: "",
                    password: "",
                    secretAnswer: "",
                });
            } else {
                alert(data.message || "Regjistrimi nuk u kry, Provoni prap");
                setFormData({
                    fullname: "",
                    username: "",
                    password: "",
                    secretAnswer: "",
                });
            }
        } catch (error) {
            console.error("Gabim gjate regjistrimit:", error);
            alert("Kemi nje gabim. Provoni prap me vone");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <div>
                <label htmlFor="fullname">Full Name:</label> <br />
                <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="username">Username:</label> <br />
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div style={{ position: "relative" }}>
                <label htmlFor="secretAnswer">Secret answer:</label> <br />
                <input
                    type={showSecretAnswer ? "text" : "password"} 
                    id="secretAnswer"
                    name="secretAnswer"
                    value={formData.secretAnswer}
                    onChange={handleChange}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowSecretAnswer(!showSecretAnswer)}
                    className="password-toggle-button"
                    aria-label={showSecretAnswer ? "Hide secret answer" : "Show secret answer"}
                >
                    {showSecretAnswer ? "🙈" : "👁️"} 
                </button>
            </div>
            <div style={{ position: "relative" }}>
                <label htmlFor="password">Password:</label> <br />
                <input
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>
            </div>
            <button type="submit">Register</button>
            <div className="change-page">
                <Link to="/login" className="link">
                    Login
                </Link>
            </div>
        </form>
    );
}

export default Register;