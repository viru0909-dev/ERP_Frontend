import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { useOutletContext, Link } from 'react-router-dom'; // Make sure Link is imported
import '../styles/ManageTimetablesPage.css'; // Reuse the same styles

const TimeTablePage = () => {
    const { token } = useAuth();
    const { userProfile } = useOutletContext();
    const [timetable, setTimetable] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!token || !userProfile?.role) return;

            const isStudent = userProfile.role === 'ROLE_STUDENT';
            const endpoint = isStudent 
                ? 'http://localhost:8080/api/student/timetable/me' 
                : 'http://localhost:8080/api/teacher/timetable/me';

            try {
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTimetable(response.data);
            } catch (error) {
                console.error("Failed to fetch timetable", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimetable();
    }, [token, userProfile]);

    // --- UPDATED LOGIC ---
    // This function now only checks if the class is scheduled for the current day.
    const isClassForToday = (slot) => {
        if (!slot) return false;
        const now = new Date();
        const dayMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const currentDay = dayMap[now.getDay()];
        return slot.dayOfWeek === currentDay;
    };

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const timeSlots = [
        { start: '09:00:00', end: '10:00:00' }, { start: '10:00:00', end: '11:00:00' },
        { start: '11:00:00', end: '12:00:00' }, { start: '12:00:00', end: '13:00:00' },
        { start: '14:00:00', end: '15:00:00' }, { start: '15:00:00', end: '16:00:00' },
        { start: '16:00:00', end: '17:00:00' }, { start: '17:00:00', end: '18:00:00' }
    ];
    
    if (isLoading) {
        return <div className="loading-container">Loading Timetable...</div>
    }

    return (
        <div className="timetable-container">
            <h1>My Timetable</h1>
            <div className="timetable-grid">
                <div className="grid-header">Time</div>
                {days.map(day => <div key={day} className="grid-header">{day.substring(0,3)}</div>)}
                {timeSlots.map(timeSlot => (
                    <React.Fragment key={timeSlot.start}>
                        <div className="grid-header time-slot">{timeSlot.start.substring(0, 5)}</div>
                        {days.map(day => {
                            const slotData = timetable.find(slot => slot.dayOfWeek === day && slot.startTime === timeSlot.start);
                            const cellKey = `${day}-${timeSlot.start}`;
                            if (slotData) {
                                return (
                                    <div key={cellKey} className="grid-cell slot-card">
                                        <div className="slot-details">
                                            <p>{slotData.subject.name}</p>
                                            {userProfile.role === 'ROLE_STUDENT' ? (
                                                <span>{slotData.teacher.fullName}</span>
                                            ) : (
                                                <span>{slotData.schoolClass.gradeLevel} - {slotData.schoolClass.section}</span>
                                            )}
                                        </div>
                                        {/* --- UPDATED CONDITIONAL RENDERING --- */}
                                        {userProfile.role === 'ROLE_TEACHER' && (
    <Link to={`/take-attendance/${slotData.slotId}/${slotData.schoolClass.classId}`} className="take-attendance-btn">
        Take Attendance
    </Link>
)}
                                        {slotData.classroom?.roomNumber && (
                                            <span className="slot-classroom">{slotData.classroom.roomNumber}</span>
                                        )}
                                    </div>
                                );
                            }
                            return <div key={cellKey} className="grid-cell" style={{ cursor: 'default', borderStyle: 'solid' }}></div>;
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default TimeTablePage;