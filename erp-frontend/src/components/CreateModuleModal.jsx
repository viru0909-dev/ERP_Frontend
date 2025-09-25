import React, { useState } from 'react';
import '../styles/Modal.css';

const CreateModuleModal = ({ isOpen, onClose, onSubmit }) => {
    // --- UPDATE STATE TO HANDLE A FILE OBJECT ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // We will now pass the raw data to the onSubmit prop
        await onSubmit({ title, description, file });
        setIsSubmitting(false);
        // Clear form
        setTitle('');
        setDescription('');
        setFile(null);
        e.target.reset(); // Also reset the file input
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Module</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                {/* Note: no 'enctype' needed with FormData and Axios */}
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Module Title</label>
                        <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    {/* --- REPLACE URL INPUT WITH FILE INPUT --- */}
                    <div className="form-group">
                        <label htmlFor="file">Upload File (PDF, PPT, etc.)</label>
                        <input type="file" id="file" name="file" onChange={handleFileChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting || !title}>
                            {isSubmitting ? 'Creating...' : 'Create Module'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModuleModal;