import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx'; // THE FIX
import '../styles/StaffList.css';

const StaffListPage = () => {
    const { token } = useAuth();
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStaffList(response.data);
        } catch (err) {
            setError('Failed to fetch staff members. You may not have permission.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
           fetchStaff();
        }
    }, [token]);

    const handleRemoveStaff = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to remove ${userName}? This action cannot be undone.`)) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/admin/staff/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSuccessMessage(response.data);
                // Refresh the list after successful deletion
                fetchStaff();
            } catch (err) {
                setError(err.response?.data || 'Failed to remove staff member.');
            }
        }
    };

    if (isLoading) return <div className="loading-container">Loading Staff List...</div>;

    return (
        <div className="staff-list-container">
            <h1>Registered Staff Members</h1>
            {error && <div className="message error">{error}</div>}
            {successMessage && <div className="message success">{successMessage}</div>}
            
            {staffList.length === 0 ? (
                <p>No staff members have been registered yet.</p>
            ) : (
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.userId}>
                                    <td>{staff.fullName}</td>
                                    <td>{staff.email}</td>
                                    <td>{staff.contactNumber || 'N/A'}</td>
                                    <td>
                                        <button 
                                            className="remove-button"
                                            onClick={() => handleRemoveStaff(staff.userId, staff.fullName)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StaffListPage;