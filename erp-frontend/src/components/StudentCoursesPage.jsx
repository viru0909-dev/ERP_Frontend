import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/MyCoursesPage.css'; // We can reuse the same CSS

const StudentCoursesPage = () => {
    const { token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudentCourses = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:8080/api/student/my-courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(response.data);
            } catch (err) {
                setError('Failed to load your courses.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudentCourses();
    }, [token]);

    if (isLoading) {
        return <div className="loading-container">Loading Your Courses...</div>;
    }
     if (error) {
        return <div className="loading-container">{error}</div>;
    }

    return (
        <div className="my-courses-container">
            <h1>My Courses</h1>
            {courses.length > 0 ? (
                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.classId} className="course-card">
                            <div className="card-header">
                                <h3 className="class-title">{course.gradeLevel}</h3>
                                <p className="class-section">Section {course.section}</p>
                            </div>
                            <div className="card-body">
                                <h4 className="subjects-heading">Subjects</h4>
                                <div className="subjects-list">
                                    {course.subjects.map(subject => (
                                        <Link 
                                            key={subject.subjectId} 
                                            to={`/course-details/${course.classId}/${subject.subjectId}`} 
                                            className="subject-link"
                                            state={{ className: `${course.gradeLevel} - Section ${course.section}`, subjectName: subject.name }}
                                        >
                                            {subject.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-courses-message">
                    <p>You are not currently enrolled in any courses.</p>
                    <p>If you believe this is an error, please contact a staff member.</p>
                </div>
            )}
        </div>
    );
};

export default StudentCoursesPage;