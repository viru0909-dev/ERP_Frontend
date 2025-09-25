import React, { useState } from 'react';
import '../styles/Modal.css';

const CreateAssignmentModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // The ISO string is the format the backend expects for LocalDateTime
        await onSubmit({ title, instructions, dueDate: new Date(dueDate).toISOString() });
        setIsSubmitting(false);
        // Clear form for next time
        setTitle('');
        setInstructions('');
        setDueDate('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Assignment</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Assignment Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructions">Instructions</label>
                        <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input type="datetime-local" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting || !title}>
                            {isSubmitting ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssignmentModal;