import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css'; // Reusing our existing modal styles

const FinalizeAdmissionModal = ({ isOpen, onClose, onSubmit, application, token }) => {
    const [mentors, setMentors] = useState([]);
    const [selectedMentorId, setSelectedMentorId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch the list of available teachers to act as mentors
        const fetchMentors = async () => {
            if (isOpen && token) {
                try {
                    // We use the new /api/master/teachers endpoint
                    const response = await axios.get('http://localhost:8080/api/master/teachers', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMentors(response.data);
                } catch (error) {
                    console.error("Failed to fetch mentors", error);
                }
            }
        };
        fetchMentors();
    }, [isOpen, token]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setIsLoading(true);
        // Pass both the application ID and the selected mentor ID up to the parent handler
        onSubmit(application.applicationId, selectedMentorId);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Finalize Admission</h2>
                    <p>For applicant: <strong>{application.applicantName}</strong></p>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-form">
                    <div className="form-group">
                        <label htmlFor="mentor">Assign a Mentor</label>
                        <select id="mentor" value={selectedMentorId} onChange={(e) => setSelectedMentorId(e.target.value)} required>
                            <option value="" disabled>-- Select a teacher --</option>
                            {mentors.map(mentor => (
                                <option key={mentor.userId} value={mentor.userId}>{mentor.fullName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-submit" onClick={handleSubmit} disabled={isLoading || !selectedMentorId}>
                        {isLoading ? 'Registering...' : 'Complete Registration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalizeAdmissionModal;