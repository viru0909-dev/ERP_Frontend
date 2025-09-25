import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import CreateModuleModal from './CreateModuleModal.jsx';
import CreateAssignmentModal from './CreateAssignmentModal.jsx';
import '../styles/CourseDetailPage.css';

// ===== ENHANCED UI COMPONENTS =====
const SkeletonLoader = () => (
    <div className="list-item skeleton-item">
        <div className="skeleton skeleton-h3"></div>
        <div className="skeleton skeleton-p"></div>
        <div className="skeleton skeleton-p-short"></div>
    </div>
);

const EmptyState = ({ title, message, icon }) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{message}</p>
        {/* Floating particles for empty state */}
        <div className="empty-particles">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i}
                    className="particle"
                    style={{
                        left: `${20 + i * 15}%`,
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${3 + i * 0.5}s`
                    }}
                >
                    ✦
                </div>
            ))}
        </div>
    </div>
);

const LoadingOverlay = ({ isVisible }) => {
    if (!isVisible) return null;
    
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="loading-spinner-advanced"></div>
                <p>Processing your request...</p>
                <div className="loading-progress">
                    <div className="progress-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseDetailPage = () => {
    const { classId, subjectId } = useParams();
    const location = useLocation();
    const { token } = useAuth();
    const { userProfile } = useOutletContext();

    // Enhanced state management
    const [modules, setModules] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    
    // Enhanced UI states
    const [animationPhase, setAnimationPhase] = useState('initial');
    const [interactionCount, setInteractionCount] = useState(0);
    const [showParticles, setShowParticles] = useState(false);
    const [processingAction, setProcessingAction] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    
    const { className, subjectName } = location.state || { className: 'Class', subjectName: 'Subject' };

    // Enhanced interaction tracking
    const handleUserInteraction = (action) => {
        setInteractionCount(prev => prev + 1);
        setProcessingAction(action);
        
        // Trigger particle effects periodically
        if (interactionCount > 0 && interactionCount % 4 === 0) {
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 3000);
        }
    };

    // Enhanced data fetching with better UX
    const fetchCourseData = useCallback(async () => {
        if (!token || !classId || !subjectId) return;
        
        setIsLoading(true);
        setError('');
        setAnimationPhase('loading');
        
        try {
            // Add visual delay for better UX
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const [modulesRes, assignmentsRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/courses/${classId}/${subjectId}/modules`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`http://localhost:8080/api/courses/${classId}/${subjectId}/assignments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            setModules(modulesRes.data);
            setAssignments(assignmentsRes.data);
            setAnimationPhase('loaded');
            
        } catch (err) {
            setError('Failed to load course details. Please try again.');
            setAnimationPhase('error');
        } finally {
            setIsLoading(false);
            setProcessingAction(null);
        }
    }, [token, classId, subjectId]);

    useEffect(() => {
        fetchCourseData();
        
        // Add glitch effect data attribute
        if (headerRef.current) {
            const h1 = headerRef.current.querySelector('h1');
            if (h1 && !h1.dataset.text) {
                h1.setAttribute('data-text', h1.textContent);
            }
        }
        
        // Add theme class based on time or user preference
        if (containerRef.current) {
            const hour = new Date().getHours();
            if (hour >= 22 || hour < 6) {
                containerRef.current.classList.add('cyber-theme');
            }
        }
    }, [fetchCourseData]);

    // Enhanced date formatting with relative time
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
            return 'Today';
        } else if (diffDays <= 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-IN', {
                day: 'numeric', 
                month: 'long', 
                year: 'numeric'
            });
        }
    };

    // Enhanced module creation with better feedback
    const handleCreateModule = async (formData) => {
        setProcessingAction('creating-module');
        setAnimationPhase('processing');
        handleUserInteraction('create-module');
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.file) {
            data.append('file', formData.file);
        }

        try {
            // Visual processing delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const response = await axios.post(
                `http://localhost:8080/api/courses/${classId}/${subjectId}/modules`,
                data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            setModules(prevModules => [response.data, ...prevModules]);
            setIsModuleModalOpen(false);
            setSuccessMessage('Module created successfully!');
            setAnimationPhase('success');
            
            // Success particle effect
            setShowParticles(true);
            setTimeout(() => {
                setShowParticles(false);
                setSuccessMessage('');
                setAnimationPhase('loaded');
            }, 2500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create module.');
            setAnimationPhase('error');
        } finally {
            setProcessingAction(null);
        }
    };

    // Enhanced module deletion with confirmation
    const handleDeleteModule = async (moduleId, moduleTitle) => {
        if (window.confirm(`Are you sure you want to delete "${moduleTitle}"? This action cannot be undone.`)) {
            setProcessingAction('deleting-module');
            setAnimationPhase('processing');
            handleUserInteraction('delete-module');
            
            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                
                await axios.delete(`http://localhost:8080/api/courses/modules/${moduleId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setModules(prev => prev.filter(m => m.moduleId !== moduleId));
                setSuccessMessage('Module deleted successfully!');
                setAnimationPhase('success');
                
                setTimeout(() => {
                    setSuccessMessage('');
                    setAnimationPhase('loaded');
                }, 2000);
                
            } catch (err) {
                setError(err.response?.data || "Failed to delete module.");
                setAnimationPhase('error');
            } finally {
                setProcessingAction(null);
            }
        }
    };

    // Enhanced assignment creation
    const handleCreateAssignment = async (formData) => {
        setProcessingAction('creating-assignment');
        setAnimationPhase('processing');
        handleUserInteraction('create-assignment');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const response = await axios.post(
                `http://localhost:8080/api/courses/${classId}/${subjectId}/assignments`,
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            setAssignments(prev => [response.data, ...prev]);
            setIsAssignmentModalOpen(false);
            setSuccessMessage('Assignment created successfully!');
            setAnimationPhase('success');
            
            setShowParticles(true);
            setTimeout(() => {
                setShowParticles(false);
                setSuccessMessage('');
                setAnimationPhase('loaded');
            }, 2500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assignment.');
            setAnimationPhase('error');
        } finally {
            setProcessingAction(null);
        }
    };

    // Enhanced retry function
    const handleRetry = () => {
        setError('');
        setAnimationPhase('initial');
        fetchCourseData();
    };

    // Calculate assignment urgency
    const getAssignmentUrgency = (dueDate) => {
        if (!dueDate) return 'normal';
        
        const due = new Date(dueDate);
        const now = new Date();
        const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return 'overdue';
        if (daysLeft <= 1) return 'urgent';
        if (daysLeft <= 3) return 'soon';
        return 'normal';
    };

    return (
        <>
            <CreateModuleModal
                isOpen={isModuleModalOpen}
                onClose={() => setIsModuleModalOpen(false)}
                onSubmit={handleCreateModule}
            />
            
            <CreateAssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
                onSubmit={handleCreateAssignment}
            />

            <LoadingOverlay isVisible={processingAction !== null} />

            <div 
                className={`course-detail-container ${animationPhase} ${showParticles ? 'show-particles' : ''}`}
                ref={containerRef}
            >
                {/* Enhanced header with glitch support */}
                <div className="course-header" ref={headerRef}>
                    <h1 data-text={subjectName}>{subjectName}</h1>
                    <p>{className} • Interactive Learning Platform</p>
                    
                    {/* Header decorative elements */}
                    <div className="energy-core"></div>
                </div>

                {/* Enhanced success message */}
                {successMessage && (
                    <div className="success-notification">
                        <div className="success-icon">✓</div>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Enhanced error message */}
                {error && (
                    <div className="error-notification">
                        <div className="error-icon">⚠</div>
                        <span>{error}</span>
                        <button className="retry-btn" onClick={handleRetry}>
                            Retry
                        </button>
                    </div>
                )}

                <div className="course-content">
                    {/* Enhanced Modules Section */}
                    <div className="content-section modules-section">
                        <div className="section-header">
                            <h2>📚 Course Modules</h2>
                            {userProfile && userProfile.role === 'ROLE_TEACHER' && (
                                <button 
                                    className={`create-btn ${processingAction === 'creating-module' ? 'processing' : ''}`}
                                    onClick={() => {
                                        setIsModuleModalOpen(true);
                                        handleUserInteraction('open-module-modal');
                                    }}
                                    disabled={processingAction !== null}
                                >
                                    <span>
                                        {processingAction === 'creating-module' ? (
                                            <>
                                                <div className="btn-spinner"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            '+ Create New Module'
                                        )}
                                    </span>
                                </button>
                            )}
                        </div>
                        
                        <div className="item-list modules-list">
                            {isLoading ? (
                                <>
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                </>
                            ) : modules.length > 0 ? (
                                modules.map((module, index) => (
                                    <div 
                                        key={module.moduleId} 
                                        className={`list-item module-item ${processingAction === 'deleting-module' ? 'processing' : ''}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="item-header">
                                            <h3>{module.title}</h3>
                                            {userProfile && userProfile.role === 'ROLE_TEACHER' && (
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteModule(module.moduleId, module.title)}
                                                    disabled={processingAction !== null}
                                                >
                                                    <span>Delete</span>
                                                </button>
                                            )}
                                        </div>
                                        <p>{module.description}</p>
                                        <div className="item-footer">
                                            <div className="footer-left">
                                                {module.fileUrl ? 
                                                    <a 
                                                        href={module.fileUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        onClick={() => handleUserInteraction('view-material')}
                                                    >
                                                        📎 View Material
                                                    </a> : 
                                                    <span className="no-material">No attachments</span>
                                                }
                                            </div>
                                            <div className="footer-right">
                                                <span>
                                                    Posted {formatDate(module.createdAt)} by {module.createdBy}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState 
                                    icon="📚" 
                                    title="No Modules Yet" 
                                    message="No learning modules have been created for this course. Teachers can create modules to share educational content." 
                                />
                            )}
                        </div>
                    </div>

                    {/* Enhanced Assignments Section */}
                    <div className="content-section assignments-section">
                        <div className="section-header">
                            <h2>📝 Assignments</h2>
                            {userProfile && userProfile.role === 'ROLE_TEACHER' && (
                                <button 
                                    className={`create-btn ${processingAction === 'creating-assignment' ? 'processing' : ''}`}
                                    onClick={() => {
                                        setIsAssignmentModalOpen(true);
                                        handleUserInteraction('open-assignment-modal');
                                    }}
                                    disabled={processingAction !== null}
                                >
                                    <span>
                                        {processingAction === 'creating-assignment' ? (
                                            <>
                                                <div className="btn-spinner"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            '+ Create New Assignment'
                                        )}
                                    </span>
                                </button>
                            )}
                        </div>
                        
                        <div className="item-list assignments-list">
                            {isLoading ? (
                                <>
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                </>
                            ) : assignments.length > 0 ? (
                                assignments.map((assignment, index) => {
                                    const urgency = getAssignmentUrgency(assignment.dueDate);
                                    return (
                                        <div 
                                            key={assignment.assignmentId} 
                                            className={`list-item assignment-item urgency-${urgency}`}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="assignment-header">
                                                <h3>{assignment.title}</h3>
                                                {urgency !== 'normal' && (
                                                    <div className={`urgency-badge urgency-${urgency}`}>
                                                        {urgency === 'overdue' && '⚠ OVERDUE'}
                                                        {urgency === 'urgent' && '🔥 DUE TODAY'}
                                                        {urgency === 'soon' && '⏰ DUE SOON'}
                                                    </div>
                                                )}
                                            </div>
                                            <p>{assignment.instructions}</p>
                                            <div className="item-footer">
                                                <div className="footer-left">
                                                    <strong className={`due-date urgency-${urgency}`}>
                                                        📅 Due: {formatDate(assignment.dueDate)}
                                                    </strong>
                                                </div>
                                                <div className="footer-right">
                                                    <span>
                                                        Assigned {formatDate(assignment.assignedAt)} by {assignment.createdBy}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <EmptyState 
                                    icon="📝" 
                                    title="No Assignments Yet" 
                                    message="No assignments have been created for this course. Teachers can create assignments to evaluate student progress." 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Particle system for special effects */}
                {showParticles && (
                    <div className="particle-system">
                        {[...Array(25)].map((_, i) => (
                            <div 
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`
                                }}
                            >
                                {['✦', '◆', '▲', '●'][Math.floor(Math.random() * 4)]}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CourseDetailPage;