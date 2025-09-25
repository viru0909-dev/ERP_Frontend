import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../styles/UserManagement.css';

const UserManagementPage = () => {
    const { token } = useAuth();
    const { userProfile } = useOutletContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', contactNumber: '', role: ''});
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [newUser, setNewUser] = useState(null);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Set a sensible default role when the page loads based on the logged-in user
    useEffect(() => {
        if (userProfile?.role === 'ROLE_SUPER_STAFF') {
            setFormData(prev => ({ ...prev, role: 'ROLE_ADMISSIONS_STAFF' }));
        } else if (userProfile?.role === 'ROLE_ACADEMIC_ADMIN') {
            setFormData(prev => ({ ...prev, role: 'ROLE_STUDENT' }));
        }
    }, [userProfile]);

    // Fetch master data (subjects & classes) needed for the forms
    useEffect(() => {
        const fetchMasterData = async () => {
            if (!token) return;
            const userRole = userProfile?.role;
            // Only fetch this data if the user is an admin who can actually register students/teachers
            if (userRole === 'ROLE_ACADEMIC_ADMIN' || userRole === 'ROLE_SUPER_STAFF') {
                setIsLoading(true);
                try {
                    const [subjectsRes, classesRes] = await Promise.all([
                        axios.get('http://localhost:8080/api/master/subjects', { headers: { 'Authorization': `Bearer ${token}` } }),
                        axios.get('http://localhost:8080/api/master/classes', { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);
                    setAllSubjects(subjectsRes.data);
                    setAllClasses(classesRes.data);
                } catch (error) {
                    setMessage({ text: 'Could not load master data.', type: 'error' });
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchMasterData();
    }, [token, userProfile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (id, selectedItems, setter) => {
        const newSelection = selectedItems.includes(id)
            ? selectedItems.filter(item => item !== id)
            : [...selectedItems, id];
        setter(newSelection);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setNewUser(null);
        
        let payload = { ...formData };
        if (formData.role === 'ROLE_TEACHER') {
             payload.subjectIds = selectedSubjects;
             payload.classIds = selectedClasses;
        } else if (formData.role === 'ROLE_STUDENT' && payload.classIds) {
            payload.classIds = [payload.classIds];
        }

        const endpoint = userProfile.role === 'ROLE_SUPER_STAFF' ? 'http://localhost:8080/api/admin/register' : 'http://localhost:8080/api/staff/register';

        try {
            const response = await axios.post(endpoint, payload, { headers: { 'Authorization': `Bearer ${token}` } });
            setMessage({ text: 'User registered successfully!', type: 'success' });
            setNewUser(response.data);
            setFormData(prev => ({ fullName: '', email: '', password: '', contactNumber: '', role: prev.role, classIds: '' }));
            setSelectedSubjects([]);
            setSelectedClasses([]);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || err.response?.data || 'Registration failed.', type: 'error' });
        }
    };
    
    if (!userProfile) return <div className="loading-container">Loading...</div>;
    
    const isSuperStaff = userProfile.role === 'ROLE_SUPER_STAFF';
    const isAcademicAdmin = userProfile.role === 'ROLE_ACADEMIC_ADMIN';
    
    const CheckboxGroup = ({ title, items, selectedItems, onCheckboxChange, idKey, formatLabel }) => (
        <div className="form-group">
            <label>{title}</label>
            <div className="checkbox-grid">
                {items.map(item => (
                    <label key={item[idKey]} className="checkbox-label">
                        <input type="checkbox" checked={selectedItems.includes(item[idKey])} onChange={() => onCheckboxChange(item[idKey])} />
                        <span>{formatLabel(item)}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div className="user-management-container">
            <h1>User Management</h1>
            <div className="registration-card">
                <h2>{isSuperStaff ? 'Register a New Staff Member' : 'Register a New User'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Temporary Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Contact Number (Optional)</label><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} /></div>
                    
                    <div className="form-group">
                        <label>Assign Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            {isSuperStaff && (
                                <>
                                    <option value="ROLE_ADMISSIONS_STAFF">Admissions Staff</option>
                                    <option value="ROLE_ACADEMIC_ADMIN">Academic Admin</option>
                                    <option value="ROLE_HOSTEL_ADMIN">Hostel Admin</option>
                                </>
                            )}
                            {isAcademicAdmin && (
                                <>
                                    <option value="ROLE_STUDENT">Student</option>
                                    <option value="ROLE_TEACHER">Teacher</option>
                                </>
                            )}
                        </select>
                    </div>
                    
                    {isAcademicAdmin && formData.role === 'ROLE_STUDENT' && (
                        <div className="form-group">
                            <label>Assign to Class</label>
                            <select name="classIds" value={formData.classIds || ''} onChange={handleChange} required>
                                <option value="" disabled>-- Select a class --</option>
                                {allClasses.map(cls => (
                                    <option key={cls.classId} value={cls.classId}>
                                        {cls.gradeLevel} - Section {cls.section}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {isAcademicAdmin && formData.role === 'ROLE_TEACHER' && (
                        <>
                           <CheckboxGroup title="Assign Subjects" items={allSubjects} selectedItems={selectedSubjects} onCheckboxChange={(id) => handleCheckboxChange(id, selectedSubjects, setSelectedSubjects)} idKey="subjectId" formatLabel={(item) => item.name} />
                           <CheckboxGroup title="Assign Classes" items={allClasses} selectedItems={selectedClasses} onCheckboxChange={(id) => handleCheckboxChange(id, selectedClasses, setSelectedClasses)} idKey="classId" formatLabel={(item) => `${item.gradeLevel} - Section ${item.section}`} />
                        </>
                    )}

                    <button type="submit" className="register-button">Register User</button>
                </form>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
            </div>
        </div>
    );
};

export default UserManagementPage;