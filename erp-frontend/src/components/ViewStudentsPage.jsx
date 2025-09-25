import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import IdCardModal from './IdCardModal.jsx'; // <-- Import the new modal
import '../styles/StaffList.css';

const ViewStudentsPage = () => {
    const { token } = useAuth();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NEW STATE FOR THE MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!token) return;
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/staff/registered-students', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStudents(response.data);
            } catch (err) {
                setError('Failed to fetch students.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [token]);
    
    // --- NEW HANDLER TO OPEN THE MODAL ---
    const handleRowClick = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedUser(response.data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch user details.');
        }
    };

    if (isLoading) return <div className="loading-container">Loading Students...</div>;

    return (
        <>
            <IdCardModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
            />
            <div className="staff-list-container">
                <h1>My Registered Students</h1>
                {error && <div className="message error">{error}</div>}
                
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Roll Number</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.userId} onClick={() => handleRowClick(student.userId)} style={{cursor: 'pointer'}}>
                                    <td>{student.fullName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.rollNumber || 'N/A'}</td>
                                    <td>{student.contactNumber || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ViewStudentsPage;