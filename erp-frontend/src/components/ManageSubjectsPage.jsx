import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import SubjectModal from './SubjectModal.jsx';
import '../styles/StaffList.css'; // Reusing table styles
import '../styles/ManageAcademic.css'; // New page styles

const ManageSubjectsPage = () => {
    const { token } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null); // null for create, object for edit

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/master/subjects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data);
        } catch (error) {
            setMessage({ text: 'Failed to load subjects.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchSubjects();
    }, [token]);

    const handleOpenModal = (subject = null) => {
        setCurrentSubject(subject);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSubject(null);
    };

    const handleSubmit = async (subjectData) => {
        try {
            if (subjectData.subjectId) { // If it has an ID, we are updating
                await axios.put(`http://localhost:8080/api/master/subjects/${subjectData.subjectId}`, subjectData.name, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' }
                });
                setMessage({ text: 'Subject updated successfully!', type: 'success' });
            } else { // Otherwise, we are creating
                await axios.post('http://localhost:8080/api/master/subjects', subjectData.name, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' }
                });
                setMessage({ text: 'Subject created successfully!', type: 'success' });
            }
            fetchSubjects(); // Refresh the list
        } catch (error) {
            setMessage({ text: 'Operation failed.', type: 'error' });
        }
    };

    const handleDelete = async (subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await axios.delete(`http://localhost:8080/api/master/subjects/${subjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Subject deleted successfully!', type: 'success' });
                fetchSubjects(); // Refresh the list
            } catch (error) {
                setMessage({ text: 'Failed to delete subject.', type: 'error' });
            }
        }
    };

    if (isLoading) return <div className="loading-container">Loading Subjects...</div>;

    return (
        <>
            <SubjectModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                subject={currentSubject}
            />
            <div className="manage-container">
                <div className="manage-header">
                    <h1>Manage Subjects</h1>
                    <button className="add-new-btn" onClick={() => handleOpenModal()}>+ Add New Subject</button>
                </div>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Subject Name</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.subjectId}>
                                    <td>{subject.name}</td>
                                    <td className="actions-column">
                                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(subject)}>Edit</button>
                                        <button className="action-btn delete-btn" onClick={() => handleDelete(subject.subjectId)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageSubjectsPage;