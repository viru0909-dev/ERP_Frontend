import React, { useState, useEffect } from 'react';
import axios from 'axios';
// --- THIS IS THE FIX: Add 'useLocation' to the import list ---
import { Link, useLocation } from 'react-router-dom';
import '../styles/UserManagement.css'; // Reusing styles

const AdmissionFormPage = () => {
    const location = useLocation();
    const [allClasses, setAllClasses] = useState([]);
    const [formData, setFormData] = useState({
        applicantName: '',
        applicantEmail: '',
        contactNumber: '',
        previousEducationDetails: '',
        // Pre-fill the class ID if it was passed from the brochure page
        applyingClassId: location.state?.classId || '' 
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
};

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/master/classes');
                setAllClasses(response.data);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            const response = await axios.post('http://localhost:8080/api/public/admissions/apply', formData);
            setMessage({ text: response.data, type: 'success' });
            setIsSubmitted(true);
        } catch (err) {
            setMessage({ text: err.response?.data || 'Application failed.', type: 'error' });
        }
    };

    if (isSubmitted) {
        return (
            <div className="user-management-container" style={{textAlign: 'center', paddingTop: '5rem'}}>
                <div className="registration-card">
                    <h2>Application Submitted!</h2>
                    <p className="message success">{message.text}</p>
                    <p>Thank you for applying. We will review your application and contact you via email with the next steps.</p>
                    <Link to="/" style={{color: 'var(--color-primary-start)'}}>Return to Home</Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="user-management-container">
            <div style={{textAlign: 'center', padding: '2rem 0'}}>
                <h1>Admission Application</h1>
            </div>
            
            <div className="registration-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Full Name</label><input type="text" name="applicantName" value={formData.applicantName} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="applicantEmail" value={formData.applicantEmail} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Contact Number</label><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} /></div>
                    <div className="form-group"><label>Previous Education (e.g., 12th Marks)</label><textarea name="previousEducationDetails" value={formData.previousEducationDetails} onChange={handleChange}></textarea></div>
                    <div className="form-group">
                        <label>Select Program to Apply For</label>
                        <select name="applyingClassId" value={formData.applyingClassId} onChange={handleChange} required>
                            <option value="" disabled>-- Select a Program --</option>
                            {allClasses.map(cls => (
                                <option key={cls.classId} value={cls.classId}>
                                    {cls.gradeLevel} - Section {cls.section}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
    <label className="checkbox-label" style={{flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
        <input type="checkbox" name="wantsHostel" checked={formData.wantsHostel || false} onChange={handleCheckboxChange} />
        <span>Apply for Hostel Accommodation</span>
    </label>
</div>
                    <button type="submit" className="register-button">Submit Application</button>
                    {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdmissionFormPage;