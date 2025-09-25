// Replace src/components/ProfilePage.jsx with this
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { userProfile } = useOutletContext();
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!userProfile) return <div>Loading profile...</div>;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    if (newPassword !== confirmPassword) {
        setMessage({ text: 'New passwords do not match.', type: 'error' });
        return;
    }
    try {
        const response = await axios.post('http://localhost:8080/api/users/me/change-password', 
            { oldPassword, newPassword }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ text: response.data, type: 'success' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (err) {
        setMessage({ text: err.response?.data || 'An error occurred.', type: 'error' });
    }
  };

  return (
    <div className="profile-container">
        {/* PERSONAL INFORMATION CARD */}
        <div className="profile-card">
          <div className="profile-header"><h3>Personal Information</h3></div>
          <div className="profile-body">
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Full Name</span><span className="info-value">{userProfile.fullName}</span></div>
              <div className="info-item"><span className="info-label">User ID (UUID)</span><span className="info-value monospace">{userProfile.userId}</span></div>
              <div className="info-item"><span className="info-label">Email Address</span><span className="info-value">{userProfile.email}</span></div>
              <div className="info-item"><span className="info-label">Contact Number</span><span className="info-value">{userProfile.contactNumber || 'Not Provided'}</span></div>
              <div className="info-item full-width"><span className="info-label">Role</span><span className="info-value">{userProfile.role.replace('ROLE_', '').replace('_', ' ')}</span></div>
              {userProfile.role === 'ROLE_STUDENT' && (
                <>
                  <div className="info-item"><span className="info-label">Roll Number</span><span className="info-value">{userProfile.rollNumber || 'Not Assigned'}</span></div>
                  <div className="info-item"><span className="info-label">Assigned Mentor</span><span className="info-value">{userProfile.mentorName || 'Not Assigned'}</span></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD CARD */}
        <div className="profile-card">
            <div className="profile-header"><h3>Change Password</h3></div>
            <div className="profile-body">
                <form onSubmit={handlePasswordChange}>
                    <div className="info-grid">
                        <div className="info-item full-width">
                            <label className="info-label">Current Password</label>
                            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                        </div>
                        <div className="info-item">
                            <label className="info-label">New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                        </div>
                        <div className="info-item">
                            <label className="info-label">Confirm New Password</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                    </div>
                    {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;