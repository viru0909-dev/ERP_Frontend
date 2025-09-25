import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/RiskDashboard.css';
import RiskDetailModal from './RiskDetailModal.jsx';

// Array of messages for the enhanced loader
const loadingMessages = [
    "Connecting to database...",
    "Gathering attendance records...",
    "Analyzing exam scores...",
    "Contacting AI Prediction Service...",
    "Compiling risk profiles..."
];

// Reusable loader component with animated text
const EnhancedLoader = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 1800); // Change message every 1.8 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{loadingMessages[messageIndex]}</p>
        </div>
    );
};

// Reusable stat card component with enhanced styling
const StatCard = ({ title, count, color, delay = 0 }) => (
    <div 
        className="risk-stat-card"
        style={{ 
            animationDelay: `${delay}ms`,
            '--stat-color': color 
        }}
    >
        <span className="stat-count" style={{ color }}>{count}</span>
        <span className="stat-title">{title}</span>
    </div>
);

const RiskDashboard = () => {
    const { token } = useAuth();
    const [riskProfiles, setRiskProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentData, setSelectedStudentData] = useState(null);

    useEffect(() => {
        const fetchRiskProfiles = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8080/api/teacher/risk-dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRiskProfiles(res.data);
            } catch (error) {
                console.error("Failed to fetch risk profiles", error);
            } finally {
                // Add minimum loading time for better UX
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
            }
        };
        fetchRiskProfiles();
    }, [token]);
    
    const handleViewDetails = async (studentId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/teacher/risk-profile/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedStudentData(res.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch student details", error);
        }
    };

    const getRiskInfo = (probability) => {
        if (probability >= 0.75) return { 
            level: 'High', 
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)' 
        };
        if (probability >= 0.50) return { 
            level: 'Medium', 
            color: '#f97316',
            bgColor: 'rgba(249, 115, 22, 0.1)' 
        };
        return { 
            level: 'Low', 
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)' 
        };
    };
    
    const filteredProfiles = useMemo(() => {
        if (activeTab === 'All') return riskProfiles;
        return riskProfiles.filter(p => getRiskInfo(p.riskProbability).level === activeTab);
    }, [riskProfiles, activeTab]);

    const riskCounts = useMemo(() => {
        const high = riskProfiles.filter(p => getRiskInfo(p.riskProbability).level === 'High').length;
        const medium = riskProfiles.filter(p => getRiskInfo(p.riskProbability).level === 'Medium').length;
        const low = riskProfiles.filter(p => getRiskInfo(p.riskProbability).level === 'Low').length;
        return { high, medium, low };
    }, [riskProfiles]);

    if (isLoading) return <EnhancedLoader />;

    return (
        <>
            <RiskDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentData={selectedStudentData}
            />
            <div className="risk-dashboard-container">
                <h1>AI-Powered Risk Analytics</h1>
                
                <div className="risk-summary-grid">
                    <StatCard 
                        title="Total Students Monitored" 
                        count={riskProfiles.length} 
                        color="#6366f1"
                        delay={0}
                    />
                    <StatCard 
                        title="High-Risk Students" 
                        count={riskCounts.high} 
                        color="#ef4444"
                        delay={100}
                    />
                    <StatCard 
                        title="Medium-Risk Students" 
                        count={riskCounts.medium} 
                        color="#f97316"
                        delay={200}
                    />
                    <StatCard 
                        title="Low-Risk Students" 
                        count={riskCounts.low} 
                        color="#22c55e"
                        delay={300}
                    />
                </div>

                <div className="risk-tabs">
                    {['All', 'High', 'Medium', 'Low'].map((tab) => (
                        <button 
                            key={tab}
                            className={activeTab === tab ? 'active' : ''}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab} Risk
                            {tab !== 'All' && (
                                <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                                    ({tab === 'High' ? riskCounts.high : 
                                      tab === 'Medium' ? riskCounts.medium : 
                                      riskCounts.low})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="risk-grid">
                    {filteredProfiles.map((student, index) => {
                        const riskInfo = getRiskInfo(student.riskProbability);
                        const percentage = Math.round(student.riskProbability * 100);
                        return (
                            <div 
                                key={student.studentId} 
                                className="student-risk-card"
                                data-risk={riskInfo.level}
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <div className="progress-container">
                                    <CircularProgressbar
                                        value={percentage}
                                        text={`${percentage}%`}
                                        styles={buildStyles({
                                            textSize: '18px',
                                            textColor: riskInfo.color,
                                            pathColor: riskInfo.color,
                                            trailColor: 'rgba(100, 116, 139, 0.2)',
                                            pathTransition: 'stroke-dasharray 0.5s ease 0s',
                                            strokeLinecap: 'round'
                                        })}
                                    />
                                </div>
                                <div className="student-info">
                                    <span className="student-name">
                                        {student.studentName}
                                    </span>
                                    <span 
                                        className="risk-level" 
                                        style={{ color: riskInfo.color }}
                                    >
                                        {riskInfo.level} Risk Alert
                                    </span>
                                </div>
                                <button 
                                    className="view-details-btn" 
                                    onClick={() => handleViewDetails(student.studentId)}
                                >
                                    View Profile
                                </button>
                            </div>
                        );
                    })}
                </div>

                {filteredProfiles.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.1rem'
                    }}>
                        No students found in the {activeTab.toLowerCase()} risk category.
                    </div>
                )}
            </div>
        </>
    );
};

export default RiskDashboard;