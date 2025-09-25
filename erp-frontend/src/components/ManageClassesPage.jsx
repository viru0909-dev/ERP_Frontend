import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import ClassModal from './ClassModal.jsx';
import '../styles/StaffList.css'; 
import '../styles/ManageAcademic.css';

const ManageClassesPage = () => {
    const { token } = useAuth();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/master/classes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(response.data);
        } catch (error) {
            setMessage({ text: 'Failed to load classes.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchClasses();
    }, [token]);

    const handleOpenModal = (schoolClass = null) => {
        setCurrentClass(schoolClass);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentClass(null);
    };

    const handleSubmit = async (classData) => {
        try {
            if (classData.classId) { // Update
                await axios.put(`http://localhost:8080/api/master/classes/${classData.classId}`, classData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Class updated successfully!', type: 'success' });
            } else { // Create
                await axios.post('http://localhost:8080/api/master/classes', classData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Class created successfully!', type: 'success' });
            }
            fetchClasses();
        } catch (error) {
            setMessage({ text: error.response?.data || 'Operation failed.', type: 'error' });
        }
    };

    const handleDelete = async (classId) => {
        if (window.confirm('Are you sure you want to delete this class? This can only be done if no students are enrolled.')) {
            try {
                await axios.delete(`http://localhost:8080/api/master/classes/${classId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Class deleted successfully!', type: 'success' });
                fetchClasses();
            } catch (error) {
                setMessage({ text: error.response?.data || 'Failed to delete class.', type: 'error' });
            }
        }
    };

    if (isLoading) return <div className="loading-container">Loading Classes...</div>;

    return (
        <>
            <ClassModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                schoolClass={currentClass}
            />
            <div className="manage-container">
                <div className="manage-header">
                    <h1>Manage Classes & Sections</h1>
                    <button className="add-new-btn" onClick={() => handleOpenModal()}>+ Add New Class</button>
                </div>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Program</th>
                                <th>Section</th>
                                <th>Capacity</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls.classId}>
                                    <td>{cls.gradeLevel}</td>
                                    <td>{cls.section}</td>
                                    <td>{cls.sectionCapacity}</td>
                                    <td className="actions-column">
                                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(cls)}>Edit</button>
                                        <button className="action-btn delete-btn" onClick={() => handleDelete(cls.classId)}>Delete</button>
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

export default ManageClassesPage;