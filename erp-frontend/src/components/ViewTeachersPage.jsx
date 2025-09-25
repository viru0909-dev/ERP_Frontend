import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/StaffList.css';

const ViewTeachersPage = () => {
    const { token } = useAuth();
    const [teachers, setTeachers] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const [teachersRes, classesRes] = await Promise.all([
                axios.get('http://localhost:8080/api/staff/registered-teachers', { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get('http://localhost:8080/api/master/classes', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            setTeachers(teachersRes.data);
            setAllClasses(classesRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleFilterChange = async (classId) => {
        if (classId === 'all') {
            fetchData(); // Refetch all teachers
        } else {
            try {
                const response = await axios.get(`http://localhost:8080/api/staff/teachers/by-class/${classId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                setTeachers(response.data);
            } catch (err) {
                setError('Failed to fetch filtered teachers.');
            }
        }
    };

    const handleRemove = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to remove ${userName}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/staff/user/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                fetchData(); // Refresh data after removal
            } catch (err) {
                setError(err.response?.data || 'Failed to remove teacher.');
            }
        }
    };
    
    if (isLoading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="staff-list-container">
            <h1>My Registered Teachers</h1>
            {error && <div className="message error">{error}</div>}

            <div className="filter-container">
                <label htmlFor="classFilter">Filter by Class: </label>
                <select id="classFilter" onChange={(e) => handleFilterChange(e.target.value)}>
                    <option value="all">All Classes</option>
                    {allClasses.map(cls => (
                        <option key={cls.classId} value={cls.classId}>
                            {cls.gradeLevel} - Section {cls.section}
                        </option>
                    ))}
                </select>
            </div>

            <div className="staff-table-wrapper">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => (
                            <tr key={teacher.userId}>
                                <td>{teacher.fullName}</td>
                                <td>{teacher.email}</td>
                                <td>{teacher.contactNumber || 'N/A'}</td>
                                <td><button className="remove-button" onClick={() => handleRemove(teacher.userId, teacher.fullName)}>Remove</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTeachersPage;