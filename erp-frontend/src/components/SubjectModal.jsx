import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const SubjectModal = ({ isOpen, onClose, onSubmit, subject }) => {
    // If we are editing, 'subject' will be an object. If creating, it's null.
    const [name, setName] = useState('');

    useEffect(() => {
        // Pre-fill the form if we are in "edit" mode
        if (subject) {
            setName(subject.name);
        } else {
            setName(''); // Clear form for "create" mode
        }
    }, [subject, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // The onSubmit function is passed from the parent and will handle the API call
        onSubmit({ ...subject, name: name });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{subject ? 'Edit Subject' : 'Add New Subject'}</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Subject Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">
                            {subject ? 'Save Changes' : 'Create Subject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubjectModal;