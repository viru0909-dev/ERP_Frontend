import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import ClassroomModal from './ClassroomModal.jsx';
import '../styles/StaffList.css'; 
import '../styles/ManageAcademic.css';

const ManageClassroomsPage = () => {
    const { token } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClassroom, setCurrentClassroom] = useState(null);

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/master/classrooms', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClassrooms(response.data);
        } catch (error) {
            setMessage({ text: 'Failed to load classrooms.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchClassrooms();
    }, [token]);

    const handleOpenModal = (classroom = null) => {
        setCurrentClassroom(classroom);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentClassroom(null);
    };

    const handleSubmit = async (classroomData) => {
        const payload = { roomNumber: classroomData.roomNumber, capacity: parseInt(classroomData.capacity, 10) };
        try {
            if (classroomData.classroomId) { // Update
                await axios.put(`http://localhost:8080/api/master/classrooms/${classroomData.classroomId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Classroom updated successfully!', type: 'success' });
            } else { // Create
                await axios.post('http://localhost:8080/api/master/classrooms', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Classroom created successfully!', type: 'success' });
            }
            fetchClassrooms();
        } catch (error) {
            setMessage({ text: error.response?.data || 'Operation failed.', type: 'error' });
        }
    };

    const handleDelete = async (classroomId) => {
        if (window.confirm('Are you sure you want to delete this classroom?')) {
            try {
                await axios.delete(`http://localhost:8080/api/master/classrooms/${classroomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Classroom deleted successfully!', type: 'success' });
                fetchClassrooms();
            } catch (error) {
                setMessage({ text: error.response?.data || 'Failed to delete classroom.', type: 'error' });
            }
        }
    };

    if (isLoading) return <div className="loading-container">Loading Classrooms...</div>;

    return (
        <>
            <ClassroomModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                classroom={currentClassroom}
            />
            <div className="manage-container">
                <div className="manage-header">
                    <h1>Manage Classrooms</h1>
                    <button className="add-new-btn" onClick={() => handleOpenModal()}>+ Add New Classroom</button>
                </div>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Room Number</th>
                                <th>Capacity</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classrooms.map((room) => (
                                <tr key={room.classroomId}>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.capacity}</td>
                                    <td className="actions-column">
                                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(room)}>Edit</button>
                                        <button className="action-btn delete-btn" onClick={() => handleDelete(room.classroomId)}>Delete</button>
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

export default ManageClassroomsPage;