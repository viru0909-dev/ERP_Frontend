// Create new file: src/components/MentorAssignmentPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import MentorAssignmentModal from './MentorAssignmentModal.jsx';
import '../styles/StaffList.css'; 
import '../styles/StudentProgressionPage.css';

const MentorAssignmentPage = () => {
    const { token } = useAuth();
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [studentsByClass, setStudentsByClass] = useState({});
    const [activeClassId, setActiveClassId] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [classesRes, teachersRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/master/classes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/master/teachers', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setClasses(classesRes.data);
                setTeachers(teachersRes.data);
            } catch (error) {
                setMessage({ text: 'Failed to load initial data.', type: 'error' });
            }
        };
        fetchData();
    }, [token]);

    const handleClassToggle = async (classId) => {
        const newActiveClassId = activeClassId === classId ? null : classId;
        setActiveClassId(newActiveClassId);
        if (newActiveClassId && !studentsByClass[newActiveClassId]) {
            const res = await axios.get(`http://localhost:8080/api/academic/class/${classId}/students`, { headers: { Authorization: `Bearer ${token}` } });
            setStudentsByClass(prev => ({ ...prev, [classId]: res.data }));
            setSelectedStudents(prev => ({...prev, [classId]: []}));
        }
    };

    const handleSelectStudent = (classId, studentId) => {
        const currentSelection = selectedStudents[classId] || [];
        const newSelection = currentSelection.includes(studentId) ? currentSelection.filter(id => id !== studentId) : [...currentSelection, studentId];
        setSelectedStudents(prev => ({...prev, [classId]: newSelection}));
    };
    
    const handleAssignMentor = async (mentorId) => {
        const studentIdsToAssign = selectedStudents[activeClassId] || [];
        if (studentIdsToAssign.length === 0) return;

        try {
            await axios.post('http://localhost:8080/api/academic/students/assign-mentor', {
                studentIds: studentIdsToAssign,
                mentorId: mentorId
            }, { headers: { Authorization: `Bearer ${token}` } });
            setMessage({ text: 'Mentor assigned successfully!', type: 'success' });
            // Optionally clear selection or refresh data
        } catch (err) {
            setMessage({ text: err.response?.data || 'Assignment failed.', type: 'error' });
        }
    };

    const totalSelected = activeClassId ? (selectedStudents[activeClassId]?.length || 0) : 0;

    return (
        <>
            <MentorAssignmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAssignMentor}
                teachers={teachers}
            />
            <div className="staff-list-container">
                <h1>Assign Mentors</h1>
                <p>Select a class, choose students, and assign a teacher as their mentor.</p>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                
                <div className="class-grid">
                    {classes.map(cls => (
                        <div key={cls.classId} className="class-card" onClick={() => handleClassToggle(cls.classId)}>
                            <h3>{cls.gradeLevel} - Section {cls.section}</h3>
                        </div>
                    ))}
                </div>

                {activeClassId && (
                    <div className="student-list-container">
                        <h2>Students in {classes.find(c => c.classId === activeClassId)?.gradeLevel}</h2>
                        {studentsByClass[activeClassId] ? (
                            <>
                                <div className="table-actions">
                                    <button onClick={() => setIsModalOpen(true)} disabled={totalSelected === 0}>
                                        Assign Mentor to Selected ({totalSelected})
                                    </button>
                                </div>
                                <div className="staff-table-wrapper">
                                    <table className="staff-table">
                                        <thead><tr><th></th><th>Name</th><th>Current Mentor</th></tr></thead>
                                        <tbody>
                                            {studentsByClass[activeClassId].map(student => (
                                                <tr key={student.userId}>
                                                    <td>
                                                        <input type="checkbox"
                                                            checked={selectedStudents[activeClassId]?.includes(student.userId)}
                                                            onChange={() => handleSelectStudent(activeClassId, student.userId)}
                                                        />
                                                    </td>
                                                    <td>{student.fullName}</td>
                                                    <td>{student.mentorName || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : <p>Loading students...</p>}
                    </div>
                )}
            </div>
        </>
    );
};

export default MentorAssignmentPage;