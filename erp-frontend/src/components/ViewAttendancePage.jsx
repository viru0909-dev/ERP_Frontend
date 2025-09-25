import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/ViewAttendancePage.css';
import '../styles/StaffList.css'; // Reusing table styles

const ViewAttendancePage = () => {
    const { token } = useAuth();
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:8080/api/student/attendance/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecords(response.data);
            } catch (error) {
                console.error("Failed to fetch attendance", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAttendance();
    }, [token]);

    const calculateSummary = () => {
        if (records.length === 0) return { percentage: 0, present: 0, total: 0 };
        const presentCount = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
        const totalCount = records.length;
        const percentage = Math.round((presentCount / totalCount) * 100);
        return { percentage, present: presentCount, total: totalCount };
    };

    const summary = calculateSummary();

    if (isLoading) {
        return <div className="loading-container">Loading Attendance...</div>
    }

    return (
        <div className="view-attendance-container">
            <h1>My Attendance</h1>
            <div className="attendance-summary">
                <h2>Overall Attendance</h2>
                <div className="attendance-percentage">{summary.percentage}%</div>
                <div className="attendance-details">({summary.present} out of {summary.total} classes attended)</div>
            </div>
            <div className="staff-table-wrapper">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(record => (
                            <tr key={record.attendanceId}>
                                <td>{new Date(record.date).toLocaleDateString('en-IN')}</td>
                                <td>{record.subjectName}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAttendancePage;