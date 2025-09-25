import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/ResultPage.css';

const ResultPage = () => {
    const { token } = useAuth();
    
    // State management
    const [resultData, setResultData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState('FINAL_EXAM');
    const [error, setError] = useState(null);
    
    // Enhanced result fetching
    const fetchResult = useCallback(async () => {
        if (!token) return;
        
        setIsLoading(true);
        setResultData(null);
        setError(null);
        
        try {
            const res = await axios.get('http://localhost:8080/api/student/result', {
                headers: { Authorization: `Bearer ${token}` },
                params: { examType: selectedExam }
            });
            
            setResultData(res.data);
        } catch (error) {
            console.error("Failed to fetch result", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token, selectedExam]);

    useEffect(() => {
        fetchResult();
    }, [fetchResult]);

    // Calculate overall percentage
    const calculateOverallPercentage = (data) => {
        if (!data || !data.subjectResults || data.subjectResults.length === 0) return 0;
        
        const totalMarks = data.subjectResults.reduce((sum, result) => sum + result.totalMarks, 0);
        const obtainedMarks = data.subjectResults.reduce((sum, result) => sum + result.marksObtained, 0);
        
        return totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100) : 0;
    };

    // Get grade from percentage
    const getGradeFromPercentage = (percentage) => {
        if (percentage >= 90) return { grade: 'A+', class: 'excellent' };
        if (percentage >= 80) return { grade: 'A', class: 'very-good' };
        if (percentage >= 70) return { grade: 'B+', class: 'good' };
        if (percentage >= 60) return { grade: 'B', class: 'satisfactory' };
        if (percentage >= 50) return { grade: 'C+', class: 'average' };
        if (percentage >= 40) return { grade: 'C', class: 'below-average' };
        return { grade: 'F', class: 'fail' };
    };

    // Get subject grade
    const getSubjectGrade = (obtained, total) => {
        const percentage = total > 0 ? (obtained / total) * 100 : 0;
        return getGradeFromPercentage(percentage);
    };

    // Determine overall pass/fail status
    const getOverallStatus = (data) => {
        if (!data || !data.subjectResults || data.subjectResults.length === 0) {
            return { status: 'unknown', class: 'unknown' };
        }
        
        const hasFailedSubject = data.subjectResults.some(result => {
            const percentage = result.totalMarks > 0 ? (result.marksObtained / result.totalMarks) * 100 : 0;
            return percentage < 40;
        });
        
        const overallPercentage = calculateOverallPercentage(data);
        
        if (hasFailedSubject || overallPercentage < 40) {
            return { status: 'FAIL', class: 'fail' };
        }
        
        return { status: 'PASS', class: 'pass' };
    };

    // Enhanced retry function
    const handleRetry = () => {
        fetchResult();
    };

    // Render loading state
    const renderLoadingState = () => (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3>Loading Your Results</h3>
            <p>Please wait while we fetch your examination results...</p>
        </div>
    );

    // Render no results state
    const renderNoResultsState = () => (
        <div className="loading-container no-results">
            <div className="no-results-icon">📊</div>
            <h3>Results Not Available</h3>
            <p>Results for the {selectedExam.replace('_', ' ').toLowerCase()} have not been published yet.</p>
            <p>Please check back later or contact your instructor for more information.</p>
            <button className="retry-btn" onClick={handleRetry}>
                Check Again
            </button>
        </div>
    );

    // Render error state
    const renderErrorState = () => (
        <div className="loading-container no-results">
            <div className="no-results-icon">⚠️</div>
            <h3>Error Loading Results</h3>
            <p>There was an error loading your results. Please try again.</p>
            {error && <p>Error: {error}</p>}
            <button className="retry-btn" onClick={handleRetry}>
                Try Again
            </button>
        </div>
    );

    // Render result content
    const renderResult = () => {
        if (isLoading) return renderLoadingState();
        if (error) return renderErrorState();
        if (!resultData || !resultData.subjectResults || resultData.subjectResults.length === 0) {
            return renderNoResultsState();
        }

        const overallPercentage = calculateOverallPercentage(resultData);
        const overallGrade = getGradeFromPercentage(overallPercentage);
        const overallStatus = getOverallStatus(resultData);

        return (
            <div className={`result-card ${overallStatus.class}`}>
                {/* Results table */}
                <div className="table-container">
                    <table className="result-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Marks Obtained</th>
                                <th>Total Marks</th>
                                <th>Percentage</th>
                                <th>Grade</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultData.subjectResults.map((result) => {
                                const percentage = result.totalMarks > 0 ? 
                                    ((result.marksObtained / result.totalMarks) * 100).toFixed(1) : 0;
                                const subjectGrade = getSubjectGrade(result.marksObtained, result.totalMarks);
                                const isPass = parseFloat(percentage) >= 40;
                                
                                return (
                                    <tr key={result.subjectName}>
                                        <td className="subject-name">
                                            <span className="name">{result.subjectName}</span>
                                        </td>
                                        <td className="marks-obtained">
                                            <span className="mark-value">{result.marksObtained}</span>
                                        </td>
                                        <td className="total-marks">
                                            <span className="mark-value">{result.totalMarks}</span>
                                        </td>
                                        <td className="percentage">
                                            <div className="percentage-container">
                                                <span className={`percentage-value ${subjectGrade.class}`}>
                                                    {percentage}%
                                                </span>
                                                <div className="percentage-bar">
                                                    <div 
                                                        className={`percentage-fill ${subjectGrade.class}`}
                                                        style={{ 
                                                            width: `${Math.min(percentage, 100)}%`,
                                                            '--progress-width': `${Math.min(percentage, 100)}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="grade">
                                            <span className={`grade-badge grade-${subjectGrade.grade.toLowerCase().replace('+', 'plus')}`}>
                                                {subjectGrade.grade}
                                            </span>
                                        </td>
                                        <td className="status">
                                            <span className={`status-badge ${isPass ? 'status-pass' : 'status-fail'}`}>
                                                {isPass ? 'PASS' : 'FAIL'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Result summary */}
                <div className="result-summary">
                    <div className="summary-item">
                        <span>Overall Percentage</span>
                        <strong className={overallGrade.class}>
                            {overallPercentage.toFixed(1)}%
                        </strong>
                    </div>
                    
                    <div className="summary-item">
                        <span>Overall Grade</span>
                        <strong className={overallGrade.class}>
                            {overallGrade.grade}
                        </strong>
                    </div>
                    
                    <div className="summary-item">
                        <span>Final Result</span>
                        <div className={`result-status ${overallStatus.class}`}>
                            <div className="status-icon">
                                {overallStatus.status === 'PASS' ? '✓' : '✗'}
                            </div>
                            <strong>{overallStatus.status}</strong>
                        </div>
                    </div>
                </div>

                {/* Additional statistics */}
                <div className="result-statistics">
                    <div className="stat-row">
                        <div className="stat-item">
                            <span>Total Subjects</span>
                            <strong>{resultData.subjectResults.length}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Subjects Passed</span>
                            <strong className="pass-count">
                                {resultData.subjectResults.filter(r => 
                                    (r.marksObtained / r.totalMarks) * 100 >= 40
                                ).length}
                            </strong>
                        </div>
                        <div className="stat-item">
                            <span>Highest Score</span>
                            <strong className="high-score">
                                {Math.max(...resultData.subjectResults.map(r => 
                                    r.totalMarks > 0 ? (r.marksObtained / r.totalMarks) * 100 : 0
                                )).toFixed(1)}%
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="result-container">
            {/* Page header */}
            <div className="result-header">
                <h1>My Results</h1>
                <div className="header-controls">
                    <div className="form-group">
                        <label>Select Exam</label>
                        <select 
                            value={selectedExam} 
                            onChange={e => setSelectedExam(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="FINAL_EXAM">Final Exam</option>
                            <option value="MID_TERM">Mid-Term Exam</option>
                        </select>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="exam-status">
                        <div className={`status-dot ${isLoading ? 'loading' : 'ready'}`}></div>
                        <span>{isLoading ? 'Loading...' : 'Ready'}</span>
                    </div>
                </div>
            </div>

            {/* Main result content */}
            {renderResult()}
        </div>
    );
};

export default ResultPage;