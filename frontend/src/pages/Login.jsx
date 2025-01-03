import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [username, setUsername] = useState("");
    const [secretAnswer, setSecretAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSecretAnswer, setShowSecretAnswer] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const urlencoded = new URLSearchParams(formData).toString();

        try {
            const response = await fetch("http://localhost:8585/auth/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlencoded,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed.");
            }

            localStorage.setItem("jwtToken", result.token);
            navigate("/home");
        } catch (err) {
            console.error("Login error:", err.message);
            setError(err.message);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotPasswordModal(true);
    };

    const handleResetPasswordRequest = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8585/auth/password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, resetToken: secretAnswer, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            if (data.success) {
                alert("Password reset successfully. Please log in again.");
                setShowForgotPasswordModal(false);
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Password reset error:", err.message);
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    const closeModal = () => {
        setShowForgotPasswordModal(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="login-form">
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
                    <label htmlFor="password">Password:</label> <br />
                    <input
                        type={showLoginPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="password-toggle-button"
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                        {showLoginPassword ? "🙈" : "👁️"}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Log in</button>
                <div className="change-page">
                    <Link to="/register" className="link">
                        Register
                    </Link>
                </div>
                <p className="forgot-password">
                    Keni harruar fjalekalimin? - Shtyp{" "}
                    <a href="#" onClick={handleForgotPassword}>
                        ketu
                    </a>
                </p>
            </form>

            {showForgotPasswordModal && (
                <div className="modal-overlay">
                    <div className="forgot-password-modal">
                        <h3>Reset Password</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleResetPasswordRequest}>
                            <label>Enter your username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <div style={{ position: "relative" }}>
                                <label>Enter your secret answer:</label>
                                <input
                                    type={showSecretAnswer ? "text" : "password"}
                                    value={secretAnswer}
                                    onChange={(e) => setSecretAnswer(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecretAnswer(!showSecretAnswer)}
                                    className="password-toggle-button-reset"
                                    aria-label={showSecretAnswer ? "Hide secret answer" : "Show secret answer"}
                                >
                                    {showSecretAnswer ? "🙈" : "👁️"}
                                </button>
                            </div>
                            <div style={{ position: "relative" }}>
                                <label>Enter your new password:</label>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="password-toggle-button-reset"
                                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                >
                                    {showNewPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            <div className="reset-modal-actions">
                                <button type="submit">Reset password</button>
                                <button type="button" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;