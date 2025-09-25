// Create new file: src/components/MentorAssignmentModal.jsx

import React, { useState } from 'react';
import '../styles/Modal.css';

const MentorAssignmentModal = ({ isOpen, onClose, onSubmit, teachers }) => {
    const [selectedMentorId, setSelectedMentorId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (selectedMentorId) {
            onSubmit(selectedMentorId);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Assign Mentor</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-form">
                    <div className="form-group">
                        <label htmlFor="mentorSelect">Select a Teacher to be the Mentor</label>
                        <select id="mentorSelect" value={selectedMentorId} onChange={(e) => setSelectedMentorId(e.target.value)} required>
                            <option value="" disabled>-- Select a Teacher --</option>
                            {teachers.map(teacher => (
                                <option key={teacher.userId} value={teacher.userId}>
                                    {teacher.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-submit" onClick={handleSubmit} disabled={!selectedMentorId}>
                        Confirm Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MentorAssignmentModal;