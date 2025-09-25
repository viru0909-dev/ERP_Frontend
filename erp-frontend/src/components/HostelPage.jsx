import React, { useState, useEffect, useRef } from 'react';
import '../styles/HostelPage.css';

const HostelPage = () => {
    const [hostelStatus, setHostelStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [progressWidth, setProgressWidth] = useState(0);
    const [animationPhase, setAnimationPhase] = useState('initial');
    
    // Mock data for demonstration
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setHostelStatus({
                status: 'APPROVED',
                roomNumber: 'A-204',
                feeAmount: 25000,
                registrationId: 'REG001'
            });
            setIsLoading(false);
            setProgressWidth(66);
        }, 1500);
    }, []);

    // Enhanced status icons with better mapping
    const getStatusIcon = (status) => {
        const icons = {
            'PENDING': '⏳',
            'APPROVED': '🎉',
            'ACCEPTED_BY_STUDENT': '💳',
            'COMPLETED': '🏠',
            'REJECTED_BY_STAFF': '❌',
            'REJECTED_BY_STUDENT': '❌',
            'apply': '🚀'
        };
        return icons[status] || '⚙️';
    };

    // Enhanced status badge component
    const StatusBadge = ({ status }) => {
        const statusClass = status.toLowerCase().replace(/_/g, '-');
        return (
            <div className="status-badge-container">
                <span className={`status-badge ${statusClass}`}>
                    <span className="badge-dot"></span>
                    {status.replace(/_/g, ' ')}
                </span>
            </div>
        );
    };

    // Enhanced progress component with steps
    const ProgressIndicator = ({ width }) => (
        <div className="progress-indicator">
            <div className="progress-header">
                <h4>Application Progress</h4>
                <span className="progress-percentage">{width}%</span>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${width}%` }}
                >
                    <div className="progress-shine"></div>
                </div>
            </div>
            <div className="progress-steps">
                <div className={`step ${width >= 33 ? 'active' : ''}`}>
                    <div className="step-dot"></div>
                    <span>Applied</span>
                </div>
                <div className={`step ${width >= 66 ? 'active' : ''}`}>
                    <div className="step-dot"></div>
                    <span>Review</span>
                </div>
                <div className={`step ${width >= 100 ? 'active' : ''}`}>
                    <div className="step-dot"></div>
                    <span>Complete</span>
                </div>
            </div>
        </div>
    );

    // Enhanced loading component
    const LoadingSpinner = () => (
        <div className="loading-container">
            <div className="loading-spinner-wrapper">
                <div className="loading-spinner"></div>
                <div className="loading-glow"></div>
            </div>
            <div className="loading-content">
                <h3>Loading your hostel status...</h3>
                <p>Please wait while we fetch your information</p>
            </div>
        </div>
    );

    // Enhanced timeline component
    const StatusTimeline = ({ currentStatus }) => {
        const timelineSteps = [
            { id: 'applied', label: 'Application Submitted', icon: '✅', completed: true },
            { id: 'review', label: 'Under Review', icon: '📋', active: currentStatus === 'PENDING' },
            { id: 'decision', label: 'Decision Made', icon: '🎯', completed: ['APPROVED', 'ACCEPTED_BY_STUDENT', 'COMPLETED'].includes(currentStatus) }
        ];

        return (
            <div className="status-timeline">
                <h4>Application Timeline</h4>
                <div className="timeline-track">
                    {timelineSteps.map((step, index) => (
                        <div key={step.id} className={`timeline-item ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                            <div className="timeline-dot">
                                <span className="timeline-icon">{step.icon}</span>
                            </div>
                            <div className="timeline-content">
                                <span className="timeline-label">{step.label}</span>
                            </div>
                            {index < timelineSteps.length - 1 && <div className="timeline-line"></div>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Enhanced feature highlights
    const FeatureHighlights = () => (
        <div className="feature-highlights">
            <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h4>Secure Environment</h4>
                <p>24/7 security with digital access</p>
            </div>
            <div className="feature-item">
                <div className="feature-icon">📶</div>
                <h4>High-Speed WiFi</h4>
                <p>Unlimited internet connectivity</p>
            </div>
            <div className="feature-item">
                <div className="feature-icon">🍽️</div>
                <h4>Quality Meals</h4>
                <p>Nutritious dining options</p>
            </div>
        </div>
    );

    // Mock handlers (replace with your actual API calls)
    const handleApply = async () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setShowSuccessAnimation(true);
            setTimeout(() => setShowSuccessAnimation(false), 2000);
            setIsProcessing(false);
        }, 2000);
    };

    const handleAccept = async () => {
        setIsProcessing(true);
        setTimeout(() => {
            setShowSuccessAnimation(true);
            setTimeout(() => setShowSuccessAnimation(false), 2000);
            setIsProcessing(false);
        }, 1500);
    };

    const handleReject = async () => {
        if (window.confirm("Are you sure you want to reject this offer?")) {
            setIsProcessing(true);
            setTimeout(() => setIsProcessing(false), 1000);
        }
    };

    // Enhanced content rendering
    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;

        if (!hostelStatus) {
            return (
                <div className="content-section apply-section">
                    <div className="status-icon-wrapper">
                        <div className="status-icon">{getStatusIcon('apply')}</div>
                        <div className="icon-glow"></div>
                    </div>
                    
                    <div className="section-header">
                        <h2>Apply for Hostel</h2>
                        <p className="section-subtitle">Secure your place in our modern hostel facility</p>
                    </div>
                    
                    <div className="status-description">
                        You have not yet applied for hostel accommodation. 
                        Submit your application to secure a place in our state-of-the-art hostel facility.
                    </div>
                    
                    <FeatureHighlights />
                    
                    <div className="action-section">
                        <button 
                            className={`primary-button apply-button ${isProcessing ? 'processing' : ''}`}
                            onClick={handleApply}
                            disabled={isProcessing}
                        >
                            <span className="button-content">
                                {isProcessing ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Submitting Application...
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">🚀</span>
                                        Submit Hostel Application
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            );
        }

        switch (hostelStatus.status) {
            case 'PENDING':
                return (
                    <div className="content-section pending-section">
                        <div className="status-icon-wrapper">
                            <div className="status-icon">{getStatusIcon(hostelStatus.status)}</div>
                            <div className="icon-glow pending-glow"></div>
                        </div>
                        
                        <div className="section-header">
                            <h2>Application Under Review</h2>
                            <StatusBadge status={hostelStatus.status} />
                        </div>
                        
                        <div className="status-description">
                            Your application is being carefully reviewed by our hostel administration team. 
                            We'll notify you as soon as a decision is made.
                        </div>
                        
                        <StatusTimeline currentStatus={hostelStatus.status} />
                        <ProgressIndicator width={progressWidth} />
                    </div>
                );

            case 'APPROVED':
                return (
                    <div className="content-section approved-section">
                        <div className="status-icon-wrapper">
                            <div className="status-icon celebration">{getStatusIcon(hostelStatus.status)}</div>
                            <div className="icon-glow approved-glow"></div>
                        </div>
                        
                        <div className="section-header">
                            <h2>Congratulations! Offer Received</h2>
                            <StatusBadge status={hostelStatus.status} />
                        </div>
                        
                        <div className="status-description">
                            Your application has been approved! Review your room assignment and fee details below, 
                            then choose to accept or decline this offer.
                        </div>
                        
                        <div className="status-details">
                            <div className="detail-card room-card">
                                <div className="detail-icon">🏠</div>
                                <div className="detail-content">
                                    <span className="detail-label">Assigned Room</span>
                                    <strong className="detail-value">{hostelStatus.roomNumber}</strong>
                                </div>
                                <div className="card-decoration"></div>
                            </div>
                            <div className="detail-card fee-card">
                                <div className="detail-icon">💰</div>
                                <div className="detail-content">
                                    <span className="detail-label">Total Fee</span>
                                    <strong className="detail-value">₹{hostelStatus.feeAmount.toLocaleString()}</strong>
                                </div>
                                <div className="card-decoration"></div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button 
                                className={`secondary-button reject-button ${isProcessing ? 'processing' : ''}`}
                                onClick={handleReject}
                                disabled={isProcessing}
                            >
                                <span className="button-content">
                                    <span className="button-icon">❌</span>
                                    Decline Offer
                                </span>
                            </button>
                            <button 
                                className={`primary-button accept-button ${isProcessing ? 'processing' : ''}`}
                                onClick={handleAccept}
                                disabled={isProcessing}
                            >
                                <span className="button-content">
                                    {isProcessing ? (
                                        <>
                                            <div className="button-spinner"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="button-icon">✅</span>
                                            Accept & Proceed to Pay
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="content-section default-section">
                        <div className="status-icon-wrapper">
                            <div className="status-icon">⚙️</div>
                        </div>
                        <div className="status-description">
                            Your application is being processed. Please check back soon.
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="hostel-container">
            {/* Enhanced background decoration */}
            <div className="background-decoration">
                <div className="bg-gradient-1"></div>
                <div className="bg-gradient-2"></div>
                <div className="bg-dots"></div>
            </div>
            
            {/* Success animation overlay */}
            {showSuccessAnimation && (
                <div className="success-overlay">
                    <div className="success-animation">
                        <div className="success-checkmark">✓</div>
                        <h3>Success!</h3>
                        <p>Your request has been processed successfully</p>
                    </div>
                </div>
            )}
            
            {/* Enhanced header */}
            <div className="hostel-header">
                <div className="header-content">
                    <h1>Hostel Dashboard</h1>
                    <p className="header-subtitle">Manage your accommodation journey</p>
                </div>
                <a href="/hostel-brochure" className="brochure-link">
                    <span className="link-icon">📋</span>
                    <div className="link-content">
                        <span className="link-title">Hostel Details</span>
                        <span className="link-subtitle">View facilities & fees</span>
                    </div>
                </a>
            </div>
            
            {/* Enhanced main card */}
            <div className="hostel-card">
                <div className="card-decoration-top"></div>
                {renderContent()}
            </div>
        </div>
    );
};

export default HostelPage;