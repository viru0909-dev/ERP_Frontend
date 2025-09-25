import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PublicCoursesPage.css';

const PublicCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/master/classes');
                setCourses(response.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // --- NEW LOGIC: Group courses by gradeLevel (e.g., BCA, MCA) ---
    const groupedCourses = useMemo(() => {
        return courses.reduce((acc, course) => {
            const { gradeLevel } = course;
            if (!acc[gradeLevel]) {
                acc[gradeLevel] = [];
            }
            acc[gradeLevel].push(course);
            return acc;
        }, {});
    }, [courses]);


    if (isLoading) {
        return <div className="loading-container">Loading Programs...</div>;
    }

    return (
        <div className="courses-container">
            <h1 className="page-title">Our Academic Programs</h1>
            <p className="page-subtitle">Explore the programs we offer and find the right path for your future.</p>
            
            {/* Map over the grouped programs */}
            {Object.entries(groupedCourses).map(([gradeLevel, sections]) => (
                <div key={gradeLevel} className="program-group">
                    <h2 className="program-group-title">{gradeLevel}</h2>
                    <div className="section-grid">
                        {/* Map over the sections within each program */}
                        {sections.map(section => (
                            <Link to={`/admissions/brochure/${section.classId}`} key={section.classId} className="section-card-link">
                                <div className="section-card">
                                    <h3>Section: {section.section}</h3>
                                    <p>Click to view details and apply</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PublicCoursesPage;