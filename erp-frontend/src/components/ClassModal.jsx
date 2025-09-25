import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const ClassModal = ({ isOpen, onClose, onSubmit, schoolClass }) => {
    const [formData, setFormData] = useState({ gradeLevel: '', section: '', sectionCapacity: 0 });

    useEffect(() => {
        if (schoolClass) {
            setFormData({
                gradeLevel: schoolClass.gradeLevel || '',
                section: schoolClass.section || '',
                sectionCapacity: schoolClass.sectionCapacity || 0
            });
        } else {
            setFormData({ gradeLevel: '', section: '', sectionCapacity: 50 }); // Default capacity
        }
    }, [schoolClass, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...schoolClass, ...formData });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{schoolClass ? 'Edit Class' : 'Add New Class'}</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Program Name (e.g., BCA)</label>
                        <input type="text" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Section (e.g., FY, SY, A)</label>
                        <input type="text" name="section" value={formData.section} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Section Capacity</label>
                        <input type="number" name="sectionCapacity" value={formData.sectionCapacity} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">
                            {schoolClass ? 'Save Changes' : 'Create Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassModal;