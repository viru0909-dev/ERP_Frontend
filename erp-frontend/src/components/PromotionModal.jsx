// Create new file: src/components/PromotionModal.jsx

import React, { useState } from 'react';
import '../styles/Modal.css';

const PromotionModal = ({ isOpen, onClose, onSubmit, classes }) => {
    const [targetClassId, setTargetClassId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (targetClassId) {
            onSubmit(targetClassId);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Promote Students</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-form">
                    <div className="form-group">
                        <label htmlFor="targetClass">Select New Class for Promotion</label>
                        <select id="targetClass" value={targetClassId} onChange={(e) => setTargetClassId(e.target.value)} required>
                            <option value="" disabled>-- Select a class --</option>
                            {classes.map(cls => (
                                <option key={cls.classId} value={cls.classId}>
                                    {cls.gradeLevel} - Section {cls.section}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-submit" onClick={handleSubmit} disabled={!targetClassId}>
                        Confirm Promotion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromotionModal;