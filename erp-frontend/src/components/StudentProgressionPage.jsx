import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import PromotionModal from './PromotionModal.jsx';
import StudentDetailsModal from './StudentDetailsModal.jsx';
import '../styles/StaffList.css'; 
import '../styles/StudentProgressionPage.css'; 

const StudentProgressionPage = () => {
    const { token } = useAuth();
    const [classes, setClasses] = useState([]);
    const [studentsByClass, setStudentsByClass] = useState({});
    const [activeClassId, setActiveClassId] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState({});
    
    // State for the two modals
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    
    // State for managing modals and messages
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/master/classes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setClasses(res.data);
            } catch (error) {
                setMessage({ text: 'Failed to load classes.', type: 'error' });
            }
        };
        if (token) fetchClasses();
    }, [token]);

    const handleClassToggle = async (classId) => {
        const newActiveClassId = activeClassId === classId ? null : classId;
        setActiveClassId(newActiveClassId);
        if (newActiveClassId && !studentsByClass[newActiveClassId]) {
            try {
                const res = await axios.get(`http://localhost:8080/api/academic/class/${classId}/students`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                setStudentsByClass(prev => ({ ...prev, [classId]: res.data }));
                setSelectedStudents(prev => ({...prev, [classId]: []}));
            } catch (error) {
                setMessage({ text: 'Failed to load students for this class.', type: 'error' });
            }
        }
    };

    const handleSelectStudent = (classId, studentId) => {
        const currentSelection = selectedStudents[classId] || [];
        const newSelection = currentSelection.includes(studentId)
            ? currentSelection.filter(id => id !== studentId)
            : [...currentSelection, studentId];
        setSelectedStudents(prev => ({...prev, [classId]: newSelection}));
    };
    
    const handlePromoteSubmit = async (targetClassId) => {
        const studentIdsToPromote = selectedStudents[activeClassId] || [];
        if (studentIdsToPromote.length === 0) return;

        try {
            await axios.post('http://localhost:8080/api/academic/students/promote', {
                studentIds: studentIdsToPromote,
                nextClassId: targetClassId
            }, { headers: { Authorization: `Bearer ${token}` } });
            setMessage({ text: 'Students promoted successfully! Page will refresh.', type: 'success' });
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setMessage({ text: err.response?.data || 'Promotion failed.', type: 'error' });
        }
    };
    
    const handleStatusUpdate = async (studentId, statusData) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/academic/students/${studentId}/status`,
                { feePaid: statusData.feePaid, academicStatus: statusData.academicStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const updatedStudent = response.data;
            setStudentsByClass(prev => ({
                ...prev,
                [activeClassId]: prev[activeClassId].map(s => 
                    s.userId === studentId ? updatedStudent : s
                )
            }));
            setMessage({ text: 'Student status updated successfully!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to update status.', type: 'error' });
        }
    };

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setIsDetailsModalOpen(true);
    };

    return (
        <>
            <PromotionModal 
                isOpen={isPromotionModalOpen}
                onClose={() => setIsPromotionModalOpen(false)}
                onSubmit={handlePromoteSubmit}
                classes={classes}
            />
            <StudentDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                student={selectedStudent}
                onSubmit={handleStatusUpdate}
            />
            <div className="staff-list-container">
                <h1>Student Progression</h1>
                <p>Select a class to view and manage its students.</p>
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
                                    <button 
                                        onClick={() => setIsPromotionModalOpen(true)}
                                        disabled={!selectedStudents[activeClassId]?.length}
                                    >
                                        Promote Selected ({selectedStudents[activeClassId]?.length || 0})
                                    </button>
                                </div>
                                <div className="staff-table-wrapper">
                                    <table className="staff-table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Roll Number</th>
                                                <th>Fee Status</th>
                                                <th>Academic Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentsByClass[activeClassId].map(student => (
                                                <tr key={student.userId} onClick={() => handleRowClick(student)} style={{ cursor: 'pointer' }}>
                                                    <td>
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedStudents[activeClassId]?.includes(student.userId)}
                                                            onChange={(e) => {
                                                                e.stopPropagation(); // Prevents row click when clicking checkbox
                                                                handleSelectStudent(activeClassId, student.userId);
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{student.fullName}</td>
                                                    <td>{student.rollNumber || 'N/A'}</td>
                                                    <td>{student.feePaid ? 'Paid' : 'Pending'}</td>
                                                    <td>{student.academicStatus || 'PENDING'}</td>
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

export default StudentProgressionPage;