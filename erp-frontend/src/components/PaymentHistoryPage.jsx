// Create new file: src/components/PaymentHistory.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import '../styles/StaffList.css'; // Reusing table styles

const PaymentHistoryPage = () => {
    const { token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8080/api/student/payments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(res.data);
            } catch (error) {
                console.error("Failed to fetch payment history", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPayments();
    }, [token]);

    const handleDownloadReceipt = async (transactionId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/student/receipts/${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important: tells axios to handle the response as a file
            });
            
            // Create a URL for the blob and trigger a download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt-${transactionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download receipt", error);
        }
    };

    if (isLoading) return <div className="loading-container">Loading Payment History...</div>;

    return (
        <div className="staff-list-container">
            <h1>My Payment History</h1>
            <div className="staff-table-wrapper">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Purpose</th>
                            <th>Amount</th>
                            <th className="actions-column">Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? payments.map(tx => (
                            <tr key={tx.id}>
                                <td>{new Date(tx.paymentDate).toLocaleString('en-IN')}</td>
                                <td>{tx.purpose.replace('_', ' ')}</td>
                                <td>₹{tx.amount.toFixed(2)}</td>
                                <td className="actions-column">
                                    <button className="action-btn edit-btn" onClick={() => handleDownloadReceipt(tx.id)}>
                                        Download
                                    </button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="4" style={{textAlign: 'center'}}>No payments found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistoryPage;