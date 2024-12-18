import React from "react";
import { useState } from "react";

function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
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

        let formData = new window.FormData(e.target);

        let urlencoded = new URLSearchParams(formData).toString();
        console.log(urlencoded);
        const response = await fetch("http://localhost:3000/auth/register", {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullname">Full Name:</label>
                <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default Register;
