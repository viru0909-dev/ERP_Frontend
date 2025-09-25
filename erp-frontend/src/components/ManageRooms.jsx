// Create new file: src/components/ManageRooms.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import RoomModal from './RoomModal.jsx';
import '../styles/StaffList.css';

const ManageRoomsPage = () => {
    const { token } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRooms = async () => {
        const res = await axios.get('http://localhost:8080/api/hostel-staff/rooms', { headers: { Authorization: `Bearer ${token}` } });
        setRooms(res.data);
    };

    useEffect(() => { if(token) fetchRooms(); }, [token]);

    const handleSubmit = async (roomData) => {
        // Logic to create or update a room via API call
        await axios.post('http://localhost:8080/api/hostel-staff/rooms', roomData, { headers: { Authorization: `Bearer ${token}` } });
        fetchRooms(); // Refresh list
        setIsModalOpen(false);
    };

    return (
        <>
            <RoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
            <div className="staff-list-container">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1>Manage Hostel Rooms</h1>
                    <button onClick={() => setIsModalOpen(true)} className="add-new-btn">+ Add New Room</button>
                </div>
                <div className="staff-table-wrapper">
                    <table className="staff-table">
                        <thead><tr><th>Room No.</th><th>Type</th><th>Capacity</th><th>Fee</th><th>Actions</th></tr></thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.id}>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.roomType.replace('_', ' ')}</td>
                                    <td>{room.capacity}</td>
                                    <td>₹{room.fee}</td>
                                    <td>{/* Edit/Delete Buttons */}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
export default ManageRoomsPage;