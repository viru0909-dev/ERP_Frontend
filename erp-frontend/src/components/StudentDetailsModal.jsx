// Create new file: src/components/StudentDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const StudentDetailsModal = ({ isOpen, onClose, student, onSubmit }) => {
    const [feePaid, setFeePaid] = useState(false);
    const [academicStatus, setAcademicStatus] = useState('PENDING');

    useEffect(() => {
        if (student) {
            setFeePaid(student.feePaid);
            setAcademicStatus(student.academicStatus || 'PENDING');
        }
    }, [student]);

    if (!isOpen || !student) return null;

    const handleSave = () => {
        onSubmit(student.userId, { feePaid, academicStatus });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Student Profile</h2>
                    <p>{student.fullName} ({student.rollNumber})</p>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-form">
                    <div className="form-group">
                        <label>Fee Status</label>
                        <select value={feePaid} onChange={(e) => setFeePaid(e.target.value === 'true')}>
                            <option value={true}>Paid</option>
                            <option value={false}>Pending</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Academic Status</label>
                        <select value={academicStatus} onChange={(e) => setAcademicStatus(e.target.value)}>
                            <option value="PENDING">Pending</option>
                            <option value="PASS">Pass</option>
                            <option value="FAIL">Fail</option>
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-submit" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;