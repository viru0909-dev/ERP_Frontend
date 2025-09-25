import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import '../styles/UserManagement.css'; // Reusing form styles
import '../styles/TrackApplicationPage.css'; // New status styles

const TrackApplicationPage = () => {
    const [email, setEmail] = useState('');
    const [application, setApplication] = useState(null);
    const [registrationDetails, setRegistrationDetails] = useState(null); // To store final login details
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setApplication(null);
        setRegistrationDetails(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/public/admissions/status?email=${email}`);
            setApplication(response.data);
        } catch (err) {
            setError(err.response?.data || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- NEW FUNCTION TO FINALIZE REGISTRATION ---
    const handleFinalize = async () => {
        if (!application) return;
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`http://localhost:8080/api/public/admissions/${application.applicationId}/finalize`);
            setRegistrationDetails(response.data);
            setApplication(null); // Hide the old status card
        } catch (err) {
            setError(err.response?.data || 'An error occurred during finalization.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyPassword = () => {
        if (registrationDetails?.password) {
            navigator.clipboard.writeText(registrationDetails.password);
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy'), 2000); // Reset after 2 seconds
        }
    };

    const StatusBadge = ({ status }) => {
        const statusClass = status.toLowerCase().replace('_', '-');
        return <span className={`status-badge ${statusClass}`}>{status.replace('_', ' ')}</span>;
    };

    // --- RENDER FINAL REGISTRATION DETAILS IF AVAILABLE ---
if (registrationDetails) {
        return (
            <>
                {/* --- 4. THE CONFETTI EFFECT! --- */}
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={400}
                />
                <div className="track-container">
                    <div className="status-card welcome-card">
                        <div className="welcome-icon">✓</div>
                        <div className="status-header">
                            <h3 style={{ color: '#166534' }}>Registration Complete!</h3>
                        </div>
                        <div className="status-details">
                            <p>Welcome, <strong>{registrationDetails.fullName}</strong>! Your account has been created.</p>
                            <p>You can now log in to the student portal using your email and the temporary password below:</p>
                            <div className="password-display">
                                <span className="password-text">{registrationDetails.password}</span>
                                <button className="copy-btn" onClick={handleCopyPassword}>{copyButtonText}</button>
                            </div>
                            <p style={{marginTop: '1rem', color: 'var(--color-text-secondary)'}}>
                                You will be asked to change this password upon your first login.
                            </p>
                        </div>
                        <Link to="/login" className="register-button" style={{textDecoration: 'none', textAlign: 'center', marginTop: '1rem'}}>
                            Proceed to Login
                        </Link>
                    </div>
                </div>
            </>
        );
    }
    
    
    return (
        
        
        <div className="track-container">
            <div className="track-card">
                <h2>Track Your Application</h2>
                <p>Enter the email address you used to apply to see your current application status.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Check Status'}
                    </button>
                </form>
            </div>
            
            {error && <p className="message error" style={{marginTop: '1rem'}}>{error}</p>}
            
            {application && (
                <div className="status-card">
                    <div className="status-header"><h3>Application Details</h3></div>
                    <div className="status-details">
                        <p>Applicant Name: <span>{application.applicantName}</span></p>
                        <p>Status: <StatusBadge status={application.status} /></p>
                    </div>
                    {/* --- SHOW THE FINALIZE BUTTON IF APPROVED --- */}
                    {application.status === 'APPROVED' && (
                        <div style={{marginTop: '1.5rem'}}>
                            <p style={{ color: '#166534', fontWeight: '500' }}>Congratulations! Your application has been approved.</p>
                            <button className="register-button" onClick={handleFinalize} disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Pay Fee & Complete Registration'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        
    );
};

export default TrackApplicationPage;