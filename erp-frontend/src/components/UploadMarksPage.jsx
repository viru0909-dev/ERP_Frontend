import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { useOutletContext } from 'react-router-dom';
import '../styles/UploadMarksPage.css';

const UploadMarksPage = () => {
    const { token } = useAuth();
    const { userProfile: teacherProfile } = useOutletContext();
    
    // Enhanced state management
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examType, setExamType] = useState('FINAL_EXAM');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Enhanced UI states
    const [animationPhase, setAnimationPhase] = useState('initial');
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [focusedInput, setFocusedInput] = useState(null);
    const [showParticles, setShowParticles] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    
    const containerRef = useRef(null);
    const formRef = useRef(null);

    // Enhanced student fetching with better UX
    useEffect(() => {
        if (!selectedClass || !token) {
            setStudents([]);
            setAnimationPhase('no-class');
            return;
        }
        
        const fetchStudents = async () => {
            setAnimationPhase('loading-students');
            setIsProcessing(true);
            
            try {
                // Visual delay for better UX
                await new Promise(resolve => setTimeout(resolve, 600));
                
                const res = await axios.get(`http://localhost:8080/api/academic/class/${selectedClass}/students`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setStudents(res.data);
                setAnimationPhase('students-loaded');
                
                // Initialize marks state with enhanced structure
                const initialMarks = {};
                res.data.forEach(student => { 
                    initialMarks[student.userId] = {
                        value: '',
                        isValid: true,
                        hasChanged: false
                    }; 
                });
                setMarks(initialMarks);
                
            } catch (error) {
                setMessage({ 
                    text: 'Failed to load students. Please check your connection and try again.', 
                    type: 'error' 
                });
                setAnimationPhase('error');
            } finally {
                setIsProcessing(false);
            }
        };
        
        fetchStudents();
    }, [selectedClass, token]);

    // Enhanced mark validation
    const validateMark = (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return { isValid: false, error: 'Must be a number' };
        if (numValue < 0) return { isValid: false, error: 'Cannot be negative' };
        if (numValue > 100) return { isValid: false, error: 'Cannot exceed 100' };
        return { isValid: true, error: null };
    };

    // Enhanced mark change handler
    const handleMarkChange = (studentId, value) => {
        const validation = validateMark(value);
        
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                value: value,
                isValid: validation.isValid,
                hasChanged: true
            }
        }));
        
        setValidationErrors(prev => ({
            ...prev,
            [studentId]: validation.error
        }));
        
        // Trigger visual feedback for invalid input
        if (!validation.isValid && value !== '') {
            setAnimationPhase('validation-error');
            setTimeout(() => setAnimationPhase('students-loaded'), 1000);
        }
    };

    // Enhanced input focus handlers
    const handleInputFocus = (studentId) => {
        setFocusedInput(studentId);
        setAnimationPhase('input-focused');
    };

    const handleInputBlur = () => {
        setFocusedInput(null);
        setAnimationPhase('students-loaded');
    };

    // Calculate statistics
    const getMarkStatistics = () => {
        const validMarks = Object.values(marks)
            .filter(mark => mark.value !== '' && mark.isValid)
            .map(mark => parseFloat(mark.value));
            
        if (validMarks.length === 0) return null;
        
        const average = validMarks.reduce((sum, mark) => sum + mark, 0) / validMarks.length;
        const highest = Math.max(...validMarks);
        const lowest = Math.min(...validMarks);
        const passCount = validMarks.filter(mark => mark >= 40).length;
        
        return {
            average: average.toFixed(1),
            highest,
            lowest,
            passCount,
            totalEntered: validMarks.length
        };
    };

    // Enhanced form submission with progress tracking
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsProcessing(true);
        setAnimationPhase('processing');
        
        // Validate all marks
        const invalidMarks = Object.entries(marks).filter(([_, mark]) => 
            mark.value !== '' && !mark.isValid
        );
        
        if (invalidMarks.length > 0) {
            setMessage({ 
                text: `Please fix ${invalidMarks.length} invalid mark(s) before submitting.`, 
                type: 'error' 
            });
            setAnimationPhase('validation-error');
            setIsProcessing(false);
            return;
        }
        
        const payload = {
            subjectId: selectedSubject,
            examType: examType,
            studentMarks: Object.entries(marks)
                .filter(([_, mark]) => mark.value !== '' && mark.isValid)
                .map(([studentId, mark]) => ({
                    studentId: studentId,
                    marksObtained: parseFloat(mark.value)
                }))
        };
        
        if (payload.studentMarks.length === 0) {
            setMessage({ 
                text: 'Please enter at least one valid mark before submitting.', 
                type: 'error' 
            });
            setAnimationPhase('validation-error');
            setIsProcessing(false);
            return;
        }
        
        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);
            
            const res = await axios.post('http://localhost:8080/api/teacher/marks/upload', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            setMessage({ 
                text: `${res.data} Successfully uploaded marks for ${payload.studentMarks.length} students!`, 
                type: 'success' 
            });
            setAnimationPhase('success');
            setShowParticles(true);
            
            // Reset form after success
            setTimeout(() => {
                setShowParticles(false);
                setUploadProgress(0);
                setAnimationPhase('students-loaded');
            }, 3000);
            
        } catch (err) {
            setUploadProgress(0);
            setMessage({ 
                text: err.response?.data || 'Failed to upload marks. Please try again.', 
                type: 'error' 
            });
            setAnimationPhase('error');
        } finally {
            setIsProcessing(false);
        }
    };

    // Get grade from mark
    const getGrade = (mark) => {
        const numMark = parseFloat(mark);
        if (numMark >= 90) return 'A+';
        if (numMark >= 80) return 'A';
        if (numMark >= 70) return 'B+';
        if (numMark >= 60) return 'B';
        if (numMark >= 50) return 'C+';
        if (numMark >= 40) return 'C';
        return 'F';
    };

    const stats = getMarkStatistics();

    return (
        <>
            {/* Upload Progress Bar */}
            {uploadProgress > 0 && (
                <div className="upload-progress">
                    <div 
                        className="upload-progress-bar" 
                        style={{ '--upload-progress': `${uploadProgress}%` }}
                    ></div>
                </div>
            )}

            <div 
                className={`upload-marks-container ${animationPhase} ${isProcessing ? 'processing' : ''}`}
                ref={containerRef}
            >
                <h1>Upload Student Marks</h1>

                {/* Enhanced success/error messages */}
                {message.text && (
                    <div className={`message ${message.type}`}>
                        <div className="message-icon">
                            {message.type === 'success' ? '✓' : '⚠'}
                        </div>
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} ref={formRef}>
                    {/* Enhanced Controls Grid */}
                    <div className="controls-grid">
                        <div className="form-group">
                            <label>Select Class</label>
                            <select 
                                value={selectedClass} 
                                onChange={e => setSelectedClass(e.target.value)} 
                                required
                                disabled={isProcessing}
                            >
                                <option value="" disabled>-- Choose a Class --</option>
                                {teacherProfile?.taughtClasses.map(cls => (
                                    <option key={cls.classId} value={cls.classId}>
                                        {cls.gradeLevel} - {cls.section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Subject</label>
                            <select 
                                value={selectedSubject} 
                                onChange={e => setSelectedSubject(e.target.value)} 
                                required
                                disabled={isProcessing}
                            >
                                <option value="" disabled>-- Choose a Subject --</option>
                                {teacherProfile?.taughtSubjects.map(sub => (
                                    <option key={sub.subjectId} value={sub.subjectId}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Exam Type</label>
                            <select 
                                value={examType} 
                                onChange={e => setExamType(e.target.value)} 
                                required
                                disabled={isProcessing}
                            >
                                <option value="FINAL_EXAM">Final Exam</option>
                                <option value="MID_TERM">Mid-Term</option>
                            </select>
                        </div>
                    </div>

                    {/* Enhanced Statistics Panel */}
                    {stats && (
                        <div className="statistics-panel">
                            <h3>Current Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">Average</span>
                                    <strong className="stat-value">{stats.average}%</strong>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Highest</span>
                                    <strong className="stat-value">{stats.highest}%</strong>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Lowest</span>
                                    <strong className="stat-value">{stats.lowest}%</strong>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Pass Count</span>
                                    <strong className="stat-value">{stats.passCount}/{stats.totalEntered}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Enhanced Marks Table */}
                    {students.length > 0 && (
                        <div className="marks-table-wrapper">
                            <div className="table-header">
                                <h3>Enter Marks (Out of 100)</h3>
                                <div className="progress-indicator">
                                    {stats ? `${stats.totalEntered}/${students.length} students` : '0 marks entered'}
                                </div>
                            </div>

                            <div className="table-container">
                                <table className="staff-table marks-table">
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Roll Number</th>
                                            <th>Marks Obtained</th>
                                            <th>Grade</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => {
                                            const studentMark = marks[student.userId];
                                            const hasError = validationErrors[student.userId];
                                            const isFocused = focusedInput === student.userId;
                                            const grade = studentMark?.value ? getGrade(studentMark.value) : '-';
                                            const numMark = parseFloat(studentMark?.value || 0);
                                            
                                            return (
                                                <tr 
                                                    key={student.userId}
                                                    className={`
                                                        ${isFocused ? 'focused' : ''} 
                                                        ${hasError ? 'error' : ''} 
                                                        ${studentMark?.hasChanged ? 'changed' : ''}
                                                    `}
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <td className="student-name">
                                                        <div className="name-container">
                                                            <span>{student.fullName}</span>
                                                            {studentMark?.hasChanged && (
                                                                <div className="change-indicator">●</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="roll-number">
                                                        {student.rollNumber || 'N/A'}
                                                    </td>
                                                    <td className="marks-cell">
                                                        <div className="input-container">
                                                            <input 
                                                                type="number" 
                                                                className={`marks-input ${hasError ? 'invalid' : ''} ${isFocused ? 'focused' : ''}`}
                                                                min="0"
                                                                max="100"
                                                                step="0.5"
                                                                value={studentMark?.value || ''}
                                                                onChange={e => handleMarkChange(student.userId, e.target.value)}
                                                                onFocus={() => handleInputFocus(student.userId)}
                                                                onBlur={handleInputBlur}
                                                                placeholder="0-100"
                                                                disabled={isProcessing}
                                                            />
                                                            {hasError && (
                                                                <div className="error-tooltip">
                                                                    {hasError}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="grade-cell">
                                                        <span className={`grade-badge grade-${grade.toLowerCase().replace('+', 'plus')}`}>
                                                            {grade}
                                                        </span>
                                                    </td>
                                                    <td className="status-cell">
                                                        <div className="status-indicators">
                                                            {studentMark?.value && numMark >= 40 ? (
                                                                <span className="status-pass">PASS</span>
                                                            ) : studentMark?.value && numMark < 40 ? (
                                                                <span className="status-fail">FAIL</span>
                                                            ) : (
                                                                <span className="status-pending">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Enhanced Submit Button */}
                            <button 
                                type="submit" 
                                className={`submit-button ${isProcessing ? 'processing' : ''} ${stats?.totalEntered > 0 ? 'ready' : 'disabled'}`}
                                disabled={isProcessing || !stats?.totalEntered}
                            >
                                <span>
                                    {isProcessing ? (
                                        <>
                                            <div className="processing-spinner"></div>
                                            Uploading Marks...
                                        </>
                                    ) : stats?.totalEntered > 0 ? (
                                        `Submit Marks for ${stats.totalEntered} Students`
                                    ) : (
                                        'Enter Marks to Continue'
                                    )}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Loading state for students */}
                    {selectedClass && students.length === 0 && !isProcessing && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading students...</p>
                        </div>
                    )}
                </form>

                {/* Particle system for celebrations */}
                {showParticles && (
                    <div className="particle-system">
                        {[...Array(20)].map((_, i) => (
                            <div 
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`
                                }}
                            >
                                {['⭐', '📈', '🎯', '✨'][Math.floor(Math.random() * 4)]}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default UploadMarksPage;