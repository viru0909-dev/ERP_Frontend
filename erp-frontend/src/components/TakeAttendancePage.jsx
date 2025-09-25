import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/TakeAttendancePage.css';

const TakeAttendancePage = () => {
    const { slotId, classId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    const [slotDetails, setSlotDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!token || !classId || !slotId) return;
            try {
                // Fetch both students and timetable data for the header
                const [studentsRes, timetableRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/teacher/class/${classId}/students`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:8080/api/timetable/class/${classId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                
                const currentSlot = timetableRes.data.find(s => s.slotId === slotId);
                setSlotDetails(currentSlot);

                setStudents(studentsRes.data);
                const initialStatuses = {};
                studentsRes.data.forEach(student => {
                    initialStatuses[student.userId] = 'PRESENT';
                });
                setStatuses(initialStatuses);

            } catch (error) {
                setMessage({ text: 'Failed to load class data.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [classId, slotId, token]);

    const handleStatusChange = (studentId, status) => {
        setStatuses(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        const payload = {
            timetableSlotId: slotId,
            studentStatuses: statuses
        };
        try {
            const response = await axios.post('http://localhost:8080/api/teacher/attendance', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data);
            navigate('/time-table');
        } catch (err) {
            setMessage({ text: err.response?.data || 'Failed to submit attendance.', type: 'error' });
        }
    };
    
    // Calculate summary for the header
    const presentCount = useMemo(() => {
        return Object.values(statuses).filter(status => status === 'PRESENT').length;
    }, [statuses]);

    if (isLoading) {
        return <div className="loading-container">Loading students...</div>;
    }

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h1>Take Attendance</h1>
                {slotDetails && (
                    <p>{slotDetails.subject.name} for {slotDetails.schoolClass.gradeLevel} - {slotDetails.schoolClass.section}</p>
                )}
                <div className="attendance-summary">
                    {presentCount} / {students.length} students marked as present
                </div>
            </div>

            {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
            
            <div className="student-grid">
                {students.map(student => (
                    <div key={student.userId} className="student-card">
                        <div className="student-name">{student.fullName}</div>
                        <div className="status-toggles">
                            <button 
                                className={`status-btn present ${statuses[student.userId] === 'PRESENT' ? 'active' : ''}`}
                                onClick={() => handleStatusChange(student.userId, 'PRESENT')}>
                                Present
                            </button>
                            <button 
                                className={`status-btn absent ${statuses[student.userId] === 'ABSENT' ? 'active' : ''}`}
                                onClick={() => handleStatusChange(student.userId, 'ABSENT')}>
                                Absent
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="submit-attendance-btn" onClick={handleSubmit} disabled={students.length === 0}>
                Submit Attendance
            </button>
        </div>
    );
};

export default TakeAttendancePage;