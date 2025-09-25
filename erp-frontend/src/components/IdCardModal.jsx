import React from 'react';
import '../styles/Modal.css';
import '../styles/IdCard.css';

const IdCardModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        return nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : name[0].toUpperCase();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="id-card-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} style={{color: '#fff', textShadow: '0 1px 2px #000'}}>&times;</button>
                <div className="id-card-header">
                    <div className="id-card-avatar">{getInitials(user.fullName)}</div>
                    <h2 className="id-card-name">{user.fullName}</h2>
                    <p className="id-card-role">{user.role.replace('ROLE_', '').replace('_', ' ')}</p>
                </div>
                <div className="id-card-body">
                    <div className="id-card-details">
                        <p><span>Email</span> <strong>{user.email}</strong></p>
                        <p><span>Contact No.</span> <strong>{user.contactNumber || 'N/A'}</strong></p>
                        {user.rollNumber && <p><span>Roll Number</span> <strong>{user.rollNumber}</strong></p>}
                        {user.mentorName && <p><span>Mentor</span> <strong>{user.mentorName}</strong></p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdCardModal;