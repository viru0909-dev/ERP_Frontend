import React from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import '../styles/HostelPage.css'; // Reusing styles

const FeePaymentPage = () => {
    const { token } = useAuth();
    const { userProfile } = useOutletContext();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [message, setMessage] = React.useState('');

    // For this example, we'll use a fixed fee amount
    const feeAmount = 85000.00;

    const handlePayTuition = async () => {
        if (window.confirm(`Are you sure you want to pay the fee of ₹${feeAmount}?`)) {
            try {
                await axios.post('http://localhost:8080/api/student/tuition/pay', 
                    { amount: feeAmount },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setShowConfetti(true);
                alert("Payment successful!");
                navigate('/payment-history'); // Redirect to payment history
            } catch (err) {
                setMessage(err.response?.data || 'Payment failed.');
            }
        }
    };
    
    return (
        <div className="hostel-container">
            {showConfetti && <Confetti recycle={false} />}
            <h1>College Fee Payment</h1>
            <div className="hostel-card">
                {userProfile.feePaid ? (
                    <div className="content-section completed-section">
                        <div className="status-icon celebration">✅</div>
                        <h2>Fees Paid</h2>
                        <p className="status-description">
                            Your tuition fee for the current academic year has been paid. Thank you!
                        </p>
                    </div>
                ) : (
                    <div className="content-section payment-section">
                        <div className="status-icon">💳</div>
                        <h2>Pay Your Tuition Fee</h2>
                        <p className="status-description">
                            Please complete your payment to finalize your registration for the academic year.
                        </p>
                        <div className="payment-info">
                            <div className="payment-amount">
                                <span>Amount Due:</span>
                                <strong>₹{feeAmount.toFixed(2)}</strong>
                            </div>
                        </div>
                        <button className="apply-button pay-button" onClick={handlePayTuition}>
                            Pay Now
                        </button>
                        {message && <p className="message error">{message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeePaymentPage;