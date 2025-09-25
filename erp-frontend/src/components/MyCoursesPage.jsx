import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import '../styles/MyCoursesPage.css';

const MyCoursesPage = () => {
    const { userProfile } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);

    if (!userProfile) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Your Courses...</p>
            </div>
        );
    }

    // Check if the teacher has any classes or subjects assigned
    const hasCourses = userProfile.taughtClasses?.length > 0 && userProfile.taughtSubjects?.length > 0;

    // Get total counts for dashboard stats
    const totalClasses = userProfile.taughtClasses?.length || 0;
    const totalSubjects = userProfile.taughtSubjects?.length || 0;
    const totalCombinations = totalClasses * totalSubjects;

    // Helper function to get subject-specific icons
    const getSubjectIcon = (subjectName) => {
        const iconMap = {
            'Mathematics': '🔢',
            'Math': '🔢',
            'Science': '🧪',
            'Physics': '⚛️',
            'Chemistry': '🧪',
            'Biology': '🧬',
            'English': '📝',
            'Literature': '📖',
            'History': '📜',
            'Geography': '🌍',
            'Computer Science': '💻',
            'Programming': '⌨️',
            'Art': '🎨',
            'Music': '🎵',
            'Physical Education': '⚽',
            'PE': '⚽',
            'Languages': '🗣️',
            'Social Studies': '🏛️',
            'Economics': '💰'
        };
        
        // Find matching icon or use default
        const matchedKey = Object.keys(iconMap).find(key => 
            subjectName.toLowerCase().includes(key.toLowerCase())
        );
        
        return iconMap[matchedKey] || '📚';
    };

    return (
        <div className="my-courses-container">
            {/* Page Header */}
            <div className="page-header">
                <h1>My Courses</h1>
                <p className="page-subtitle">
                    Manage your teaching assignments and course materials
                </p>
            </div>
            
            {/* Stats Section */}
            {hasCourses && (
                <div className="stats-section">
                    <div className="stat-card">
                        <span className="stat-number">{totalClasses}</span>
                        <span className="stat-label">Classes</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{totalSubjects}</span>
                        <span className="stat-label">Subjects</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{totalCombinations}</span>
                        <span className="stat-label">Total Courses</span>
                    </div>
                </div>
            )}
            
            {hasCourses ? (
                <div className="courses-section">
                    <div className="section-title">
                        <h2>Your Teaching Assignments</h2>
                    </div>
                    
                    <div className="courses-grid">
                        {userProfile.taughtClasses.map((cls) => (
                            <div key={cls.classId} className="course-card">
                                <div className="card-header">
                                    <h3 className="class-title">{cls.gradeLevel}</h3>
                                    <p className="class-section">Section {cls.section}</p>
                                </div>
                                
                                <div className="card-body">
                                    <div className="subjects-heading">
                                        <span>Subjects Taught</span>
                                        <span className="subjects-count">
                                            {userProfile.taughtSubjects.length}
                                        </span>
                                    </div>
                                    
                                    <div className="subjects-list">
                                        {userProfile.taughtSubjects.map((subject) => (
                                            <Link 
                                                key={subject.subjectId} 
                                                to={`/course-details/${cls.classId}/${subject.subjectId}`} 
                                                className="subject-link"
                                                state={{ 
                                                    className: `${cls.gradeLevel} - Section ${cls.section}`, 
                                                    subjectName: subject.name 
                                                }}
                                            >
                                                <span className="subject-name">
                                                    {getSubjectIcon(subject.name)} {subject.name}
                                                </span>
                                                <span className="link-arrow">→</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-courses-section">
                    <div className="no-courses-card">
                        <div className="empty-state-icon">
                            <span className="icon-symbol">📚</span>
                        </div>
                        
                        <div className="empty-state-content">
                            <h3>No Courses Assigned Yet</h3>
                            <p>You are not currently assigned to any courses.</p>
                            <p>Please contact an administrator to be assigned to classes and subjects.</p>
                        </div>
                        
                        <div className="empty-state-actions">
                            <button 
                                className="contact-admin-btn"
                                onClick={() => window.location.href = 'mailto:admin@smartcampus.edu'}
                            >
                                <span>📞</span>
                                Contact Administrator
                            </button>
                        </div>
                    </div>
                    
                    <div className="help-section">
                        <h4>Getting Started</h4>
                        <div className="help-cards">
                            <div className="help-card">
                                <div className="help-icon">👥</div>
                                <h5>Class Assignment</h5>
                                <p>Get assigned to grade levels and sections you'll be teaching</p>
                            </div>
                            <div className="help-card">
                                <div className="help-icon">📖</div>
                                <h5>Subject Assignment</h5>
                                <p>Choose subjects that match your expertise and qualifications</p>
                            </div>
                            <div className="help-card">
                                <div className="help-icon">🚀</div>
                                <h5>Start Teaching</h5>
                                <p>Begin managing your courses and student progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage;