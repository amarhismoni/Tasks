import React from "react";
import { useState } from "react";

function Login() {
    const [formData, setFormData] = useState({
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

        let formDataObject = new window.FormData(e.target);

        let urlencoded = new URLSearchParams(formDataObject).toString();
        console.log(urlencoded);
        const response = await fetch("http://localhost:8585/auth/login", {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded,
        });

        const result = await response.json();

        localStorage.setItem("jwtToken", result.token);
    };

    return (
        <form onSubmit={handleSubmit}>
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

export default Login;
// import React from 'react'

// function Login() {
//   return (
//     <div>Login</div>
//   )
// }

// export default Login