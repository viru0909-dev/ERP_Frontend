// Enhanced SuperAdminDashboard.jsx with SmartCampus Theme

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    ArcElement,
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import '../styles/SuperAdminDashboard.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    ArcElement,
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend
);

// Enhanced StatCard with subtle animations
const StatCard = ({ title, value, icon, color = '#6366f1', delay = 0 }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const cardRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration = 1000;
            const increment = value / (duration / 50);
            let current = 0;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setAnimatedValue(value);
                    clearInterval(counter);
                } else {
                    setAnimatedValue(Math.floor(current));
                }
            }, 50);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div 
            ref={cardRef}
            className="stat-card"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="stat-icon" style={{ color }}>{icon}</div>
            <div className="stat-info">
                <span className="stat-value">{animatedValue}</span>
                <span className="stat-title">{title}</span>
            </div>
        </div>
    );
};

// Enhanced AnalyticsCard component
const AnalyticsCard = ({ title, children, delay = 0 }) => (
    <div 
        className="analytics-card" 
        style={{ animationDelay: `${delay}ms` }}
    >
        <h3 style={{ 
            color: '#ffffff', 
            marginBottom: '1.5rem',
            fontSize: '1.2rem',
            fontWeight: '600'
        }}>
            {title}
        </h3>
        {children}
    </div>
);

// Progress Bar Component
const ProgressBar = ({ percentage, color = '#6366f1', label }) => (
    <div style={{ marginBottom: '1rem' }}>
        {label && (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem'
            }}>
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
        )}
        <div className="progress-bar">
            <div 
                className="progress-fill"
                style={{ 
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, #a5b4fc)`
                }}
            />
        </div>
    </div>
);

const SuperAdminDashboard = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chartAnimated, setChartAnimated] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8080/api/admin/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnalytics(res.data);
                
                // Trigger chart animation after data loads
                setTimeout(() => setChartAnimated(true), 500);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    if (isLoading) return <div className="loading-container">Loading Analytics Dashboard...</div>;
    if (!analytics) return <div className="loading-container">Could not load analytics data.</div>;

    // Enhanced chart configurations
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
                labels: {
                    color: '#ffffff',
                    font: { size: 12, weight: '500' }
                }
            },
            title: { 
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#6366f1',
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(99, 102, 241, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.8)' }
            },
            y: {
                grid: { color: 'rgba(99, 102, 241, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.8)' }
            }
        },
        animation: {
            duration: chartAnimated ? 1200 : 0,
            easing: 'easeOutQuart'
        }
    };

    // Bar Chart Data
    const chartData = {
        labels: Object.keys(analytics.studentsPerClass || {}),
        datasets: [{
            label: 'Number of Students',
            data: Object.values(analytics.studentsPerClass || {}),
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    // Doughnut Chart Data for Grade Distribution
    const gradeData = {
        labels: ['A Grade', 'B Grade', 'C Grade', 'D Grade', 'F Grade'],
        datasets: [{
            data: [25, 30, 20, 15, 10], // Sample data
            backgroundColor: [
                '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'
            ],
            borderColor: '#1e293b',
            borderWidth: 2,
            hoverOffset: 10
        }]
    };

    // Line Chart Data for Attendance Trends
    const attendanceData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
            label: 'Average Attendance %',
            data: [85, 90, 88, 92, 87, 83],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            fill: true
        }]
    };

    return (
        <div className="admin-dashboard-container">
            <h1>🏛️ SmartCampus Analytics</h1>
            
            {/* Main Stats Grid */}
            <div className="stats-grid">
                <StatCard 
                    title="Total Students" 
                    value={analytics.totalStudents} 
                    icon="🎓" 
                    color="#10b981"
                    delay={50}
                />
                <StatCard 
                    title="Total Teachers" 
                    value={analytics.totalTeachers} 
                    icon="🧑‍🏫" 
                    color="#3b82f6"
                    delay={100}
                />
                <StatCard 
                    title="Hostel Residents" 
                    value={analytics.hostelResidents} 
                    icon="🏨" 
                    color="#f59e0b"
                    delay={150}
                />
                <StatCard 
                    title="Active Classes" 
                    value={Object.keys(analytics.studentsPerClass || {}).length} 
                    icon="🏛️" 
                    color="#8b5cf6"
                    delay={200}
                />
            </div>

            {/* Charts Grid */}
            <div className="analytics-grid">
                <div className="chart-container">
                    <h2>📊 Students Per Class</h2>
                    <div style={{ height: '400px' }}>
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>

                <AnalyticsCard title="📈 Performance Metrics" delay={200}>
                    <div style={{ marginBottom: '2rem' }}>
                        <ProgressBar percentage={87} color="#10b981" label="Overall Pass Rate" />
                        <ProgressBar percentage={92} color="#3b82f6" label="Attendance Rate" />
                        <ProgressBar percentage={78} color="#f59e0b" label="Assignment Completion" />
                        <ProgressBar percentage={85} color="#8b5cf6" label="Student Satisfaction" />
                    </div>
                </AnalyticsCard>
            </div>

            <div className="analytics-grid">
                <div className="chart-container">
                    <h2>📈 Weekly Attendance Trends</h2>
                    <div style={{ height: '300px' }}>
                        <Line 
                            options={{
                                ...chartOptions,
                                scales: {
                                    ...chartOptions.scales,
                                    y: {
                                        ...chartOptions.scales.y,
                                        min: 70,
                                        max: 100
                                    }
                                }
                            }} 
                            data={attendanceData} 
                        />
                    </div>
                </div>

                <div className="chart-container">
                    <h2>🎯 Grade Distribution</h2>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '280px', height: '280px' }}>
                            <Doughnut 
                                options={{
                                    ...chartOptions,
                                    scales: undefined,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                color: '#ffffff',
                                                font: { size: 11 },
                                                padding: 15
                                            }
                                        }
                                    }
                                }} 
                                data={gradeData} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Metrics Cards */}
            <div className="analytics-grid">
                <AnalyticsCard title="🏆 Top Performing Classes" delay={300}>
                    {Object.entries(analytics.studentsPerClass || {})
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([className, count], index) => (
                            <div key={className} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                padding: '0.75rem',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${['#10b981', '#3b82f6', '#f59e0b'][index]}`
                            }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
                                    #{index + 1} {className}
                                </span>
                                <span style={{ 
                                    color: '#ffffff', 
                                    fontWeight: '700',
                                    fontSize: '1.1rem'
                                }}>
                                    {count} students
                                </span>
                            </div>
                        ))
                    }
                </AnalyticsCard>

                <AnalyticsCard title="📱 Quick Stats" delay={400}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem', color: '#10b981', fontWeight: '700' }}>96%</div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Active Students</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem', color: '#3b82f6', fontWeight: '700' }}>24</div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Events Today</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem', color: '#f59e0b', fontWeight: '700' }}>12</div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Pending Tasks</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem', color: '#8b5cf6', fontWeight: '700' }}>8.9</div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Avg Rating</div>
                        </div>
                    </div>
                </AnalyticsCard>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;