import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/ManageTimetablesPage.css';
import CreateTimetableSlotModal from './CreateTimetableSlotModal.jsx';

const ManageTimetablesPage = () => {
    const { token } = useAuth();
    const [allClasses, setAllClasses] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allClassrooms, setAllClassrooms] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [timetable, setTimetable] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);

    useEffect(() => {
        const fetchMasterData = async () => {
            if (!token) return;
            setMessage({ text: '', type: '' });
            try {
                const [classesRes, teachersRes, subjectsRes, classroomsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/master/classes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/staff/registered-teachers', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/master/subjects', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/master/classrooms', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setAllClasses(classesRes.data);
                setAllTeachers(teachersRes.data);
                setAllSubjects(subjectsRes.data);
                setAllClassrooms(classroomsRes.data);
                if (classesRes.data.length > 0) {
                    setSelectedClassId(classesRes.data[0].classId);
                }
            } catch (error) {
                setMessage({ text: "Failed to load master data.", type: "error" });
            }
        };
        fetchMasterData();
    }, [token]);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!selectedClassId || !token) return;
            try {
                const response = await axios.get(`http://localhost:8080/api/timetable/class/${selectedClassId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTimetable(response.data);
            } catch (error) {
                setMessage({ text: "Failed to fetch timetable.", type: "error" });
                setTimetable([]);
            }
        };
        fetchTimetable();
    }, [selectedClassId, token]);

    const handleCellClick = (day, timeSlot) => {
        setSelectedSlotInfo({ 
            dayOfWeek: day, 
            startTime: timeSlot.start, 
            endTime: timeSlot.end 
        });
        setIsModalOpen(true);
    };
    
    const handleCreateSlot = async (formData) => {
        const payload = {
            ...selectedSlotInfo,
            classId: selectedClassId,
            subjectId: formData.subjectId,
            teacherId: formData.teacherId,
            classroomId: formData.classroomId || null
        };
        try {
            const response = await axios.post('http://localhost:8080/api/staff/timetable', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimetable(prev => [...prev, response.data].sort((a,b) => a.dayOfWeek.localeCompare(b.dayOfWeek) || a.startTime.localeCompare(b.startTime)));
            setMessage({ text: "Class scheduled successfully!", type: "success" });
        } catch (error) {
            setMessage({ text: "Failed to schedule class.", type: "error" });
        }
    };

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const timeSlots = [
        { start: '09:00:00', end: '10:00:00' }, { start: '10:00:00', end: '11:00:00' },
        { start: '11:00:00', end: '12:00:00' }, { start: '12:00:00', end: '13:00:00' },
        { start: '14:00:00', end: '15:00:00' }, { start: '15:00:00', end: '16:00:00' },
        { start: '16:00:00', end: '17:00:00' }, { start: '17:00:00', end: '18:00:00' }
    ];

    return (
        <>
            <CreateTimetableSlotModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateSlot}
                slotInfo={selectedSlotInfo}
                allTeachers={allTeachers}
                allSubjects={allSubjects}
                allClassrooms={allClassrooms}
            />
            <div className="timetable-container">
                <h1>Manage Timetables</h1>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                
                {/* This is the control that was missing */}
                <div className="timetable-controls">
                    <label htmlFor="class-selector">Select Class:</label>
                    <select id="class-selector" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                        {allClasses.map(cls => (
                            <option key={cls.classId} value={cls.classId}>
                                {cls.gradeLevel} - Section {cls.section}
                            </option>
                        ))}
                    </select>
                </div>
                
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
                                                <span>{slotData.teacher.fullName}</span>
                                            </div>
                                            {slotData.classroom?.roomNumber && (
                                                <span className="slot-classroom">{slotData.classroom.roomNumber}</span>
                                            )}
                                        </div>
                                    );
                                }
                                // This onClick handler makes the cells interactive
                                return <div key={cellKey} className="grid-cell" onClick={() => handleCellClick(day, timeSlot)}></div>;
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ManageTimetablesPage;