import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import FinalizeAdmissionModal from './FinalizeAdmissionModal.jsx';
import '../styles/StaffList.css';

const ManageAdmissionsPage = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/staff/admissions/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(response.data);
        } catch (error) {
            setMessage({ text: 'Failed to load applications.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchApplications();
        }
    }, [token]);

    const handleApprove = async (appId) => {
        try {
            await axios.post(`http://localhost:8080/api/staff/admissions/${appId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Application approved! You can now finalize registration.', type: 'success' });
            fetchApplications(); 
        } catch (err) {
            setMessage({ text: err.response?.data || 'Failed to approve application.', type: 'error' });
        }
    };

    const handleFinalizeClick = (application) => {
        setSelectedApp(application);
        setIsModalOpen(true);
    };

    const handleFinalizeSubmit = async (appId, mentorId) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/staff/admissions/${appId}/register-student`, 
                { mentorId: mentorId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newUser = response.data;
            alert(`Student ${newUser.fullName} registered!\nRoll Number: ${newUser.rollNumber}\nTemp Password: ${newUser.password}`);
            setIsModalOpen(false);
            fetchApplications();
        } catch (err) {
            setMessage({ text: err.response?.data || 'Failed to finalize registration.', type: 'error' });
        }
    };

    if (isLoading) return <div className="loading-container">Loading Pending Applications...</div>;

    return (
        <>
            <FinalizeAdmissionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFinalizeSubmit}
                application={selectedApp}
                token={token}
            />
            <div className="staff-list-container">
                <h1>Manage Admissions</h1>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Applicant Name</th>
                                <th>Email</th>
                                <th>Applying For</th>
                                <th>Applied On</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length > 0 ? applications.map((app) => (
                                <tr key={app.applicationId}>
                                    <td>{app.applicantName}</td>
                                    <td>{app.applicantEmail}</td>
                                    <td>{app.programName}</td>
                                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                    <td className="actions-column">
                                        {app.status === 'PENDING' ? (
                                            <button className="remove-button" style={{backgroundColor: '#dcfce7', color: '#166534'}} onClick={() => handleApprove(app.applicationId)}>Approve</button>
                                        ) : (
                                            <button className="remove-button" style={{backgroundColor: '#dbeafe', color: '#1e40af'}} onClick={() => handleFinalizeClick(app)}>Finalize Registration</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No pending applications.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageAdmissionsPage;