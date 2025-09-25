import React from 'react';
import '../styles/RiskDetailModal.css';

const RiskDetailModal = ({ isOpen, onClose, studentData }) => {
    if (!isOpen || !studentData) return null;

    const getRiskInfo = (probability) => {
        if (probability >= 0.75) return { 
            level: 'High Risk', 
            color: '#ef4444',
            description: 'Immediate intervention required' 
        };
        if (probability >= 0.50) return { 
            level: 'Medium Risk', 
            color: '#f97316',
            description: 'Close monitoring recommended' 
        };
        return { 
            level: 'Low Risk', 
            color: '#22c55e',
            description: 'Student performing well' 
        };
    };

    const riskInfo = getRiskInfo(studentData.riskProbability);

    const getPerformanceStatus = (value, type) => {
        switch (type) {
            case 'attendance':
                if (value >= 85) return { status: 'excellent', color: '#22c55e' };
                if (value >= 75) return { status: 'good', color: '#f97316' };
                return { status: 'poor', color: '#ef4444' };
            case 'exam':
                if (value >= 80) return { status: 'excellent', color: '#22c55e' };
                if (value >= 60) return { status: 'average', color: '#f97316' };
                return { status: 'poor', color: '#ef4444' };
            default:
                return { status: 'neutral', color: '#6366f1' };
        }
    };

    const attendanceStatus = getPerformanceStatus(studentData.attendancePercentage, 'attendance');
    const examStatus = getPerformanceStatus(studentData.lastExamScore, 'exam');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="risk-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                
                <div className="modal-header">
                    <h2>Risk Profile Analysis</h2>
                    <div className="modal-summary">
                        <div>
                            <span className="summary-label">Student</span>
                            <div style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: '700', 
                                color: 'var(--color-text-primary)',
                                marginTop: '0.25rem' 
                            }}>
                                {studentData.studentName}
                            </div>
                        </div>
                        <div>
                            <span className="summary-label">Risk Level</span>
                            <div 
                                className="summary-value" 
                                style={{ color: riskInfo.color }}
                            >
                                {riskInfo.level}
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    fontWeight: '500',
                                    opacity: '0.8',
                                    marginTop: '0.25rem' 
                                }}>
                                    {(studentData.riskProbability * 100).toFixed(1)}% Probability
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <h3>Performance Indicators</h3>
                    <div className="factors-grid">
                        <div className="factor-item">
                            <div className="factor-label">
                                Attendance Rate
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    opacity: '0.7', 
                                    marginTop: '0.25rem' 
                                }}>
                                    Class participation tracking
                                </div>
                            </div>
                            <div className="factor-value" style={{ color: attendanceStatus.color }}>
                                {studentData.attendancePercentage.toFixed(1)}%
                                <div style={{ 
                                    fontSize: '0.7rem', 
                                    textTransform: 'uppercase',
                                    marginTop: '0.25rem',
                                    opacity: '0.8' 
                                }}>
                                    {attendanceStatus.status}
                                </div>
                            </div>
                        </div>

                        <div className="factor-item">
                            <div className="factor-label">
                                Latest Exam Score
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    opacity: '0.7', 
                                    marginTop: '0.25rem' 
                                }}>
                                    Most recent assessment
                                </div>
                            </div>
                            <div className="factor-value" style={{ color: examStatus.color }}>
                                {studentData.lastExamScore.toFixed(1)}%
                                <div style={{ 
                                    fontSize: '0.7rem', 
                                    textTransform: 'uppercase',
                                    marginTop: '0.25rem',
                                    opacity: '0.8' 
                                }}>
                                    {examStatus.status}
                                </div>
                            </div>
                        </div>

                        <div className="factor-item">
                            <div className="factor-label">
                                Fee Payment Status
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    opacity: '0.7', 
                                    marginTop: '0.25rem' 
                                }}>
                                    Financial standing
                                </div>
                            </div>
                            <div className={`factor-value ${studentData.isFeePaid ? 'paid' : 'unpaid'}`}>
                                {studentData.isFeePaid ? 'Paid ✓' : 'Unpaid ⚠'}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}>
                        <h4 style={{
                            margin: '0 0 1rem',
                            color: 'var(--color-text-primary)',
                            fontSize: '1.1rem',
                            fontWeight: '600'
                        }}>
                            AI Recommendation
                        </h4>
                        <p style={{
                            margin: 0,
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            {riskInfo.description}. {
                                riskInfo.level === 'High Risk' 
                                    ? 'Schedule immediate mentoring session and academic counseling.'
                                    : riskInfo.level === 'Medium Risk'
                                    ? 'Regular check-ins and performance monitoring suggested.'
                                    : 'Continue current support level and acknowledge good performance.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskDetailModal;