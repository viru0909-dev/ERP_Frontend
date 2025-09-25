// Replace the entire content of src/components/ClassDesignerPage.jsx with this:

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/ClassDesignerPage.css';

const ClassDesignerPage = () => {
    const { token } = useAuth();
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]); // This will hold detailed teacher profiles

    const [selectedClassId, setSelectedClassId] = useState('');
    const [designedCourses, setDesignedCourses] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    // Step 1: Fetch all master data on initial load
    useEffect(() => {
        const fetchMasterData = async () => {
            if (!token) return;
            try {
                const [classesRes, subjectsRes, teachersRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/master/classes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/master/subjects', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/staff/registered-teachers', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setAllClasses(classesRes.data);
                setAllSubjects(subjectsRes.data);
                setAllTeachers(teachersRes.data);
            } catch (error) {
                setMessage({ text: 'Failed to load required data.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchMasterData();
    }, [token]);

    // Step 2: Fetch the existing curriculum when a class is selected
    useEffect(() => {
        const fetchDesign = async () => {
            if (!selectedClassId) {
                setDesignedCourses([]);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:8080/api/academic/class/${selectedClassId}/design`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDesignedCourses(res.data.map(c => ({ subjectId: c.subjectId, teacherId: c.teacherId })));
            } catch (error) {
                console.error("Could not fetch existing design", error);
                setDesignedCourses([]);
            }
        };
        fetchDesign();
    }, [selectedClassId, token]);

    const handleAddCourseRow = () => {
        setDesignedCourses([...designedCourses, { subjectId: '', teacherId: '' }]);
    };

    const handleRemoveCourseRow = (index) => {
        setDesignedCourses(designedCourses.filter((_, i) => i !== index));
    };

    const handleCourseChange = (index, field, value) => {
        const newCourses = [...designedCourses];
        newCourses[index][field] = value;
        if (field === 'subjectId') {
            newCourses[index]['teacherId'] = ''; // Reset teacher when subject changes
        }
        setDesignedCourses(newCourses);
    };

    const handleSaveChanges = async () => {
        const payload = designedCourses.filter(c => c.subjectId && c.teacherId);
        if (!selectedClassId || payload.length === 0) {
            setMessage({ text: 'Please add at least one complete subject-teacher pair.', type: 'error' });
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/academic/class/${selectedClassId}/design`, payload, { headers: { Authorization: `Bearer ${token}` } });
            setMessage({ text: 'Curriculum saved successfully!', type: 'success' });
        } catch (err) {
            setMessage({ text: err.response?.data || 'Failed to save curriculum.', type: 'error' });
        }
    };

    const selectedSubjectIds = useMemo(() => new Set(designedCourses.map(c => c.subjectId)), [designedCourses]);

    return (
        <div className="class-designer-container">
            <h1>Class Curriculum Designer</h1>
            {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
            
            <div className="designer-controls">
                <label htmlFor="class-select">Select a Class to Design:</label>
                <select id="class-select" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} disabled={isLoading}>
                    <option value="" disabled>-- Select a Class --</option>
                    {allClasses.map(cls => <option key={cls.classId} value={cls.classId}>{cls.gradeLevel} - {cls.section}</option>)}
                </select>
            </div>

            {selectedClassId && (
                <div className="designer-canvas">
                    {designedCourses.map((course, index) => {
                        const availableTeachers = course.subjectId 
                            ? allTeachers.filter(teacher => teacher.taughtSubjects.some(s => s.subjectId === course.subjectId))
                            : [];

                        return (
                            <div key={index} className="course-row">
                                <select value={course.subjectId} onChange={(e) => handleCourseChange(index, 'subjectId', e.target.value)}>
                                    <option value="" disabled>-- Select Subject --</option>
                                    {allSubjects.map(sub => (
                                        <option key={sub.subjectId} value={sub.subjectId} disabled={selectedSubjectIds.has(sub.subjectId) && course.subjectId !== sub.subjectId}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                                <select value={course.teacherId} onChange={(e) => handleCourseChange(index, 'teacherId', e.target.value)} disabled={!course.subjectId}>
                                    <option value="" disabled>-- Select Teacher --</option>
                                    {availableTeachers.map(t => <option key={t.userId} value={t.userId}>{t.fullName}</option>)}
                                </select>
                                <button className="remove-row-btn" onClick={() => handleRemoveCourseRow(index)}>&times;</button>
                            </div>
                        );
                    })}
                    <button className="add-row-btn" onClick={handleAddCourseRow}>+ Add Subject to Curriculum</button>
                </div>
            )}
            
            {selectedClassId && (
                <div className="designer-actions">
                    <button className="save-btn" onClick={handleSaveChanges}>Save Curriculum Changes</button>
                </div>
            )}
        </div>
    );
};

export default ClassDesignerPage;