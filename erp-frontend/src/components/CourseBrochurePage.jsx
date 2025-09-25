import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PublicCoursesPage.css'; // Reusing styles
import '../styles/LandingPage.css'; // Reusing button styles

const CourseBrochurePage = () => {
    const { classId } = useParams();
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!classId) return;
            try {
                const response = await axios.get(`http://localhost:8080/api/master/classes/${classId}`);
                setDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch course details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [classId]);

    if (isLoading) {
        return <div className="loading-container">Loading Program Details...</div>;
    }

    if (!details) {
        return <div className="loading-container">Could not find program details.</div>;
    }

    return (
        <div className="brochure-container">
            <div className="brochure-header">
                <h1>{details.gradeLevel} - {details.section}</h1>
            </div>
            <div className="brochure-body">
                <div className="stats-grid">
                    <div className="stat-item">
                        <h3>{details.durationInYears} Years</h3>
                        <p>Program Duration</p>
                    </div>
                    <div className="stat-item">
                        <h3>{details.feeStructure}</h3>
                        <p>Fee Structure</p>
                    </div>
                    <div className="stat-item">
                        <h3>{details.highestPackage}</h3>
                        <p>Highest Placement Package</p>
                    </div>
                </div>

                <p className="lead">{details.programHighlights}</p>

                <div className="subject-list">
                    <h3>Core Subjects</h3>
                    <ul>
                        {details.subjects.map(subject => (
                            <li key={subject.subjectId}>{subject.name}</li>
                        ))}
                    </ul>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/apply" state={{ classId: classId }} className="cta-button primary">
                        Proceed to Application
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseBrochurePage;