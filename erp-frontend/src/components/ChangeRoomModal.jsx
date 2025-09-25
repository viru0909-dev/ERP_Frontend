// Create new file: src/components/ChangeRoomModal.jsx
import React, { useState } from 'react';
import '../styles/Modal.css';

const ChangeRoomModal = ({ isOpen, onClose, onSubmit, allRooms, currentRoomNumber }) => {
    const [newRoomId, setNewRoomId] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Change Room</h2>
                <p>Current Room: <strong>{currentRoomNumber}</strong></p>
                <div className="form-group">
                    <label>Select New Room</label>
                    <select value={newRoomId} onChange={(e) => setNewRoomId(e.target.value)}>
                        <option value="" disabled>-- Select an available room --</option>
                        {allRooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.roomNumber} ({room.roomType.replace('_', ' ')})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn-submit" onClick={() => onSubmit(newRoomId)} disabled={!newRoomId}>Confirm Change</button>
                </div>
            </div>
        </div>
    );
};
export default ChangeRoomModal;