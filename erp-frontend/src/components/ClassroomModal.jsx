import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const ClassroomModal = ({ isOpen, onClose, onSubmit, classroom }) => {
    const [formData, setFormData] = useState({ roomNumber: '', capacity: 0 });

    useEffect(() => {
        if (classroom) {
            setFormData({
                roomNumber: classroom.roomNumber || '',
                capacity: classroom.capacity || 0
            });
        } else {
            setFormData({ roomNumber: '', capacity: 30 }); // Default capacity
        }
    }, [classroom, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...classroom, ...formData });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{classroom ? 'Edit Classroom' : 'Add New Classroom'}</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Room Number (e.g., C-101, Lab-A)</label>
                        <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Capacity</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">
                            {classroom ? 'Save Changes' : 'Create Classroom'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassroomModal;