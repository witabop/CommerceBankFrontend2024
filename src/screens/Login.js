// Verify login information then create a session (probably through local storage)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../images/commercelogo.png';
import RequestHandler from '../components/RequestHandler';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (session) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await RequestHandler('auth', { username: username, password: password })

        if (response.authenticated) {
            localStorage.setItem('session', `${response.uid}`);
            localStorage.setItem('apps', response.applications.toString());
            localStorage.setItem('admin', response.admin);
            navigate('/');
        } else {
            setError('Incorrect username or password.');
        }

    };
    return (
        <div className="login-page">
            <nav className="navbar">
                <img src={logo} className="brand-logo" alt="logo" />
            </nav>
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <h2 className="signin-text">Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
