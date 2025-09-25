import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const CreateTimetableSlotModal = ({ isOpen, onClose, onSubmit, slotInfo, allTeachers, allSubjects, allClassrooms }) => {
    const [subjectId, setSubjectId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [classroomId, setClassroomId] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- SMART FILTER LOGIC ---
    useEffect(() => {
        if (subjectId) {
            // Filter teachers who are assigned the selected subject
            const teachersForSubject = allTeachers.filter(teacher => 
                teacher.taughtSubjects.some(subject => subject.subjectId === subjectId)
            );
            setFilteredTeachers(teachersForSubject);
            setTeacherId(''); // Reset teacher selection when subject changes
        } else {
            setFilteredTeachers([]);
        }
    }, [subjectId, allTeachers]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit({ subjectId, teacherId, classroomId });
        setIsSubmitting(false);
        onClose();
    };
    
    const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Schedule New Class</h2>
                    {/* A cleaner display for the slot info */}
                    <p>{slotInfo?.dayOfWeek} at {formatTime(slotInfo?.startTime)} - {formatTime(slotInfo?.endTime)}</p>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <select id="subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                            <option value="" disabled>-- Select a subject --</option>
                            {allSubjects.map(subject => (
                                <option key={subject.subjectId} value={subject.subjectId}>{subject.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="teacher">Teacher</label>
                        <select id="teacher" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required disabled={!subjectId}>
                            <option value="" disabled>-- Select a teacher --</option>
                            {filteredTeachers.map(teacher => (
                                <option key={teacher.userId} value={teacher.userId}>{teacher.fullName}</option>
                            ))}
                        </select>
                    </div>

                    {/* --- NEW CLASSROOM DROPDOWN --- */}
                    <div className="form-group">
                        <label htmlFor="classroom">Classroom (Optional)</label>
                        <select id="classroom" value={classroomId} onChange={(e) => setClassroomId(e.target.value)}>
                            <option value="">-- No specific room --</option>
                            {allClassrooms.map(room => (
                                <option key={room.classroomId} value={room.classroomId}>{room.roomNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting || !teacherId || !subjectId}>
                            {isSubmitting ? 'Scheduling...' : 'Add to Timetable'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTimetableSlotModal;