import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        email: "",
    });

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
                    email: "",
                });
            } else {
                alert(data.message || "Regjistrimi nuk u kry, Provoni prap");
                setFormData({
                    fullname: "",
                    username: "",
                    password: "",
                    email: "",
                });
            }
        } catch (error) {
            console.error("Gabim gjate regjistrimit:", error);
            alert("Kemi nje gabim. Provoni prap me vone");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullname">Full Name:</label> <br />
                <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="username">Username:</label> <br />
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="email">Email:</label> <br />
                <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label> <br />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
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
