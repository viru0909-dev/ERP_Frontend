import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/LoginPage.css';

// CHANGE 1: Get the API base URL from the environment variable.
const API_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeRole, setActiveRole] = useState('student');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // CHANGE 2: Use the API_URL variable to build the full request URL.
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            if (response.data && response.data.token) {
                login(response.data.token);
            } else {
                setError('Login failed: Invalid response from server.');
            }
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    const roleConfig = {
        student: {
            icon: (
                <svg className="role-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zM18.82 9L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
            ),
            title: 'Student Portal',
            subtitle: 'Access your courses, grades, and assignments'
        },
        faculty: {
            icon: (
                <svg className="role-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.98C11.8 13.33 12 13.65 12 14v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2c0-.35.2-.67.52-.93l2.98-3.98A3.99 3.99 0 0 1 15 7h3.54c1.5 0 2.81 1.01 3.19 2.46L24 16.5V22h-4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z"/>
                </svg>
            ),
            title: 'Faculty Portal',
            subtitle: 'Manage classes, grades, and student records'
        },
        admin: {
            icon: (
                <svg className="role-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
                </svg>
            ),
            title: 'Admin Portal',
            subtitle: 'System administration and management'
        }
    };

    const testimonials = [
        {
            name: "Dr. Sarah Johnson",
            role: "Computer Science Professor",
            content: "SmartCampus has revolutionized how we manage our academic processes. The interface is intuitive and the features are comprehensive.",
            rating: 5,
            initials: "SJ"
        },
        {
            name: "Mark Thompson",
            role: "Student, Final Year",
            content: "Everything I need for my studies is in one place. From assignments to grades, it's all perfectly organized.",
            rating: 5,
            initials: "MT"
        }
    ];

    const features = [
        "Real-time grade tracking and analytics",
        "Seamless assignment submissions",
        "Smart class scheduling system",
        "Direct faculty communication",
        "Advanced face recognition login"
    ];

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Left Side - Login Form */}
                <div className="login-form-section">
                    <div className="login-header">
                        <div className="logo">SC</div>
                        <h1 className="login-title">SmartCampus</h1>
                        <p className="login-subtitle">
                            Sign in to access your dashboard and continue optimizing your academic process.
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="role-selection">
                        <label className="role-label">Select Your Role</label>
                        <div className="role-options">
                            {Object.keys(roleConfig).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setActiveRole(role)}
                                    className={`role-option ${activeRole === role ? 'active' : ''}`}
                                >
                                    {roleConfig[role].icon}
                                    <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Role Info */}
                    <div className="active-role-info">
                        <div className="role-info-header">
                            {roleConfig[activeRole].icon}
                            <h3 className="role-info-title">{roleConfig[activeRole].title}</h3>
                        </div>
                        <p className="role-info-subtitle">{roleConfig[activeRole].subtitle}</p>
                    </div>

                    {/* Login Form */}
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <input
                                className="form-input"
                                id="email"
                                type="email"
                                placeholder="you@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                className="form-input"
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="login-button">
                            Sign In
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                            </svg>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">Or</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Face Login */}
                    <Link to="/face-login" className="face-login-button">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 6c0-2.67 5.33-4 8-4s8 1.33 8 4v2H6v-2z"/>
                            <path d="M9 0h6v24H9z" fill="none"/>
                            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Login with Face Recognition
                    </Link>

                    {/* Return to Home */}
                    <div className="home-link">
                        <Link to="/">← Return to Home</Link>
                    </div>
                </div>

                {/* Right Side - Marketing Content */}
                <div className="marketing-section">
                    <div className="marketing-content">
                        <div className="marketing-header">
                            <h2 className="marketing-title">
                                One-click for <span className="highlight">Education Excellence</span>
                            </h2>
                            <p className="marketing-subtitle">
                                Dive into the art of smart education, where innovative ERP technology meets academic expertise
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="features-list">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <svg className="feature-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Testimonials */}
                        <div className="testimonials">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="testimonial">
                                    <div className="testimonial-rating">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} className="star" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="testimonial-text">"{testimonial.content}"</p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">{testimonial.initials}</div>
                                        <div className="author-info">
                                            <h4>{testimonial.name}</h4>
                                            <p>{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="stats-section">
                            <p className="stats-text">Trusted by 500+ educational institutions worldwide</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;