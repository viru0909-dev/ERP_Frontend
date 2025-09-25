// Create new file: src/components/HostelResidentsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import ChangeRoomModal from './ChangeRoomModal.jsx';
import '../styles/StaffList.css';

const HostelResidentsPage = () => {
    const { token } = useAuth();
    const [residents, setResidents] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [selectedResident, setSelectedResident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        const [regsRes, roomsRes] = await Promise.all([
            axios.get('http://localhost:8080/api/hostel-staff/registrations', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('http://localhost:8080/api/hostel-staff/rooms', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const activeResidents = regsRes.data.filter(r => ['APPROVED', 'ACCEPTED_BY_STUDENT', 'COMPLETED'].includes(r.status));
        setResidents(activeResidents);
        setAllRooms(roomsRes.data);
    };

    useEffect(() => { if(token) fetchData(); }, [token]);

    const handleChangeRoomClick = (resident) => {
        setSelectedResident(resident);
        setIsModalOpen(true);
    };

    const handleRoomChangeSubmit = async (newRoomId) => {
        try {
            const res = await axios.put(
                `http://localhost:8080/api/hostel-staff/registrations/${selectedResident.registrationId}/change-room`,
                { newRoomId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data);
            fetchData(); // Refresh data
            setIsModalOpen(false);
        } catch (err) {
            setMessage(err.response?.data || 'Failed to change room.');
        }
    };

    return (
        <>
            <ChangeRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleRoomChangeSubmit}
                allRooms={allRooms}
                currentRoomNumber={selectedResident?.roomNumber}
            />
            <div className="staff-list-container">
                <h1>Hostel Residents</h1>
                {message && <p className="message success">{message}</p>}
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead><tr><th>Student Name</th><th>Email</th><th>Room Number</th><th>Room Type</th><th>Action</th></tr></thead>
                        <tbody>
                            {residents.map(res => (
                                <tr key={res.registrationId}>
                                    <td>{res.studentName}</td>
                                    <td>{res.studentEmail}</td>
                                    <td>{res.roomNumber || 'N/A'}</td>
                                    <td>{res.roomType ? res.roomType.replace('_', ' ') : 'N/A'}</td>
                                    <td>
                                        <button className="action-btn edit-btn" onClick={() => handleChangeRoomClick(res)}>
                                            Change Room
                                        </button>
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
export default HostelResidentsPage;