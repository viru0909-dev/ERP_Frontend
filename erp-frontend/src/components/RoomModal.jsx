// Create new file: src/components/RoomModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const RoomModal = ({ isOpen, onClose, onSubmit, room }) => {
    const [formData, setFormData] = useState({ roomNumber: '', roomType: 'DOUBLE_SHARING', capacity: 2, fee: '' });

    useEffect(() => {
        if (room) setFormData(room);
    }, [room]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>{room ? 'Edit Room' : 'Add New Room'}</h2>
                    <div className="form-group">
                        <label>Room Number</label>
                        <input name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Room Type</label>
                        <select name="roomType" value={formData.roomType} onChange={handleChange}>
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE_SHARING">Double Sharing</option>
                            <option value="TRIPLE_SHARING">Triple Sharing</option>
                            <option value="DORMITORY">Dormitory</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label>Capacity</label>
                        <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label>Fee (Per Year)</label>
                        <input name="fee" type="number" value={formData.fee} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Save Room</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RoomModal;