// Create new file: src/components/HostelBrochurePage.jsx

import React from 'react';
import '../styles/HostelBrochurePage.css'; // We will create this

const HostelBrochurePage = () => {
  return (
    <div className="brochure-container">
      <h1>Hostel Information</h1>

      <div className="brochure-card">
        <h2>Fee Structure</h2>
        <ul>
          <li><strong>Double Sharing Room:</strong> ₹80,000 per year</li>
          <li><strong>Triple Sharing Room:</strong> ₹65,000 per year</li>
          <li><strong>Mess Fee (Mandatory):</strong> ₹30,000 per year</li>
          <li><strong>Security Deposit (Refundable):</strong> ₹5,000 one-time</li>
        </ul>
      </div>

      <div className="brochure-card">
        <h2>Facilities Provided</h2>
        <ul>
          <li>24/7 High-Speed Wi-Fi</li>
          <li>Housekeeping and laundry services</li>
          <li>Common room with TV and recreational activities</li>
          <li>24/7 Security with CCTV surveillance</li>
          <li>On-campus medical assistance</li>
        </ul>
      </div>

      <div className="brochure-card">
        <h2>Rules and Regulations</h2>
        <ol>
          <li>Hostel gate closes at 10:00 PM for all residents.</li>
          <li>Visitors are only allowed in designated areas during visiting hours.</li>
          <li>Use of any electrical appliances other than laptops and mobile chargers is prohibited.</li>
          <li>Residents are responsible for the upkeep of their rooms.</li>
        </ol>
      </div>
    </div>
  );
};

export default HostelBrochurePage;