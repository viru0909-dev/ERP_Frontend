// Replace src/components/HostelApprovalModal.jsx

import React, { useState } from 'react';
import '../styles/Modal.css';

const HostelApprovalModal = ({ isOpen, onClose, onSubmit, allRooms }) => {
    const [roomId, setRoomId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (roomId) {
            onSubmit(roomId);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Approve & Assign Room</h2>
                <div className="form-group">
                    <label>Select an Available Room</label>
                    <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                        <option value="" disabled>-- Select a room --</option>
                        {allRooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.roomNumber} ({room.roomType.replace('_', ' ')}) - Fee: ₹{room.fee}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-submit" onClick={handleSubmit} disabled={!roomId}>Confirm Approval</button>
                </div>
            </div>
        </div>
    );
};

export default HostelApprovalModal;