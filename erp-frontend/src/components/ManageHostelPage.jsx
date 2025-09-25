// Replace the content of src/components/ManageHostelPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import HostelApprovalModal from './HostelApprovalModal.jsx';
import '../styles/StaffList.css';
import '../styles/RiskDashboard.css'; // Reusing tab styles

const ManageHostelPage = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [regsRes, roomsRes] = await Promise.all([
                axios.get('http://localhost:8080/api/hostel-staff/registrations', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:8080/api/hostel-staff/rooms', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setApplications(regsRes.data);
            setAllRooms(roomsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { if (token) fetchData(); }, [token]);

    const handleApproveClick = (app) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    const handleApprovalSubmit = async (roomId) => {
        if (!selectedApp) return;
        try {
            await axios.post(
                `http://localhost:8080/api/hostel-staff/registrations/${selectedApp.registrationId}/approve`,
                { roomId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData(); // Refresh list
        } catch (error) { console.error("Failed to approve", error); }
    };

    const handleMarkAsPaid = async (regId) => { /* ... your existing function ... */ };
    
    // Filter applications based on status
    const pendingApps = useMemo(() => applications.filter(a => a.status === 'PENDING'), [applications]);
    const awaitingPaymentApps = useMemo(() => applications.filter(a => a.status === 'ACCEPTED_BY_STUDENT'), [applications]);

    if (isLoading) return <div className="loading-container">Loading...</div>;

    return (
        <>
            <HostelApprovalModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleApprovalSubmit}
                allRooms={allRooms.filter(r => r.capacity > 0)} // Pass only available rooms
            />
            <div className="staff-list-container">
                <h1>Manage Hostel Registrations</h1>
                
                {/* --- THIS IS THE MISSING PENDING APPLICATIONS TABLE --- */}
                <h2>Pending Applications ({pendingApps.length})</h2>
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr><th>Student Name</th><th>Email</th><th>Requested On</th><th className="actions-column">Action</th></tr>
                        </thead>
                        <tbody>
                            {pendingApps.length > 0 ? pendingApps.map(app => (
                                <tr key={app.registrationId}>
                                    <td>{app.studentName}</td>
                                    <td>{app.studentEmail}</td>
                                    <td>{new Date(app.requestedAt).toLocaleDateString()}</td>
                                    <td className="actions-column">
                                        <button className="action-btn edit-btn" onClick={() => handleApproveClick(app)}>Approve</button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="4" style={{textAlign: 'center'}}>No pending applications.</td></tr>}
                        </tbody>
                    </table>
                </div>

                <h2 style={{marginTop: '2rem'}}>Awaiting Payment ({awaitingPaymentApps.length})</h2>
                <div className="staff-table-wrapper">
                    {/* ... your existing Awaiting Payment table ... */}
                </div>
            </div>
        </>
    );
};

export default ManageHostelPage;