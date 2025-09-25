import React, { useState, useEffect, Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';
import '../styles/Dashboard.css';

const DashboardPage = () => {
    const { token, logout } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) { 
                logout(); 
                return; 
            }
            
            try {
                const decodedToken = jwtDecode(token);
                const userRoles = decodedToken.roles || '';
                const isTeacher = userRoles.includes('ROLE_TEACHER');
                const endpoint = isTeacher 
                    ? 'http://localhost:8080/api/users/me/teacher' 
                    : 'http://localhost:8080/api/users/me';
                
                const response = await axios.get(endpoint, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                
                setUserProfile(response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Your session may have expired. Please log in again.');
                logout();
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserProfile();
    }, [token, logout, navigate]);

    // Handle loading states
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Loading Dashboard...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="loading-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }
    
    if (!userProfile) {
        return (
            <div className="loading-container">
                <div className="error-message">Could not load user profile.</div>
            </div>
        );
    }
    
    // Helper function to get user initials
    const getInitials = (name) => {
        if (!name) return '?';
        const nameParts = name.trim().split(' ').filter(part => part.length > 0);
        if (nameParts.length === 0) return '?';
        
        return nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : nameParts[0][0].toUpperCase();
    };

    // Helper function to format role display
    const formatRole = (role) => {
        if (!role) return 'User';
        return role.replace('ROLE_', '').replace(/_/g, ' ').toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Role checks
    const { role } = userProfile;
    const isSuperStaff = role === 'ROLE_SUPER_STAFF';
    const isAdmissionsStaff = role === 'ROLE_ADMISSIONS_STAFF';
    const isAcademicAdmin = role === 'ROLE_ACADEMIC_ADMIN';
    const isHostelAdmin = role === 'ROLE_HOSTEL_ADMIN';
    const isTeacher = role === 'ROLE_TEACHER';
    const isStudent = role === 'ROLE_STUDENT';

    // Navigation items based on role
    const getNavigationItems = () => {
        const items = [
            { path: '/profile', label: 'Profile', roles: ['all'] }
        ];

        if (isSuperStaff) {
            items.push(
                { path: '/admin-dashboard', label: 'Dashboard' },
                { path: '/user-management', label: 'Register Staff' },
                { path: '/staff-list', label: 'View Staff' },
                { path: '/class-designer', label: 'Curriculum Designer' },
                { path: '/mentor-assignment', label: 'Assign Mentors' },
                { path: '/student-progression', label: 'Student Progression' }
            );
        }

        if (isAdmissionsStaff) {
            items.push(
                { path: '/manage-admissions', label: 'Manage Admissions' }
            );
        }

        if (isAcademicAdmin) {
            items.push(
                { path: '/user-management', label: 'Register Users' },
                { path: '/class-designer', label: 'Curriculum Designer' },
                { path: '/manage-timetables', label: 'Manage Timetables' },
                { path: '/student-progression', label: 'Student Progression' },
                { path: '/view-teachers', label: 'View Teachers' },
                { path: '/view-students', label: 'View Students' },
                { path: '/mentor-assignment', label: 'Assign Mentors' },
                { path: '/manage-subjects', label: 'Manage Subjects' },
                { path: '/manage-classes', label: 'Manage Classes' },
                { path: '/manage-classrooms', label: 'Manage Classrooms' }
            );
        }

        if (isHostelAdmin) {
            items.push(
                { path: '/manage-hostel', label: 'Manage Hostel' },
                { path: '/hostel-residents', label: 'View Residents' },
                { path: '/manage-rooms', label: 'Manage Rooms' }
            );
        }

        if (isTeacher) {
            items.push(
                { path: '/my-courses', label: 'My Courses' },
                { path: '/time-table', label: 'Time Table' },
                { path: '/upload-marks', label: 'Upload Marks' },
                { path: '/risk-dashboard', label: 'Risk Dashboard' }
            );
        }

        if (isStudent) {
            items.push(
                { path: '/my-courses', label: 'My Courses' },
                { path: '/time-table', label: 'Time Table' },
                { path: '/my-result', label: 'My Result' },
                { path: '/my-attendance', label: 'My Attendance' },
                { path: '/hostel', label: 'Hostel' },
                { path: '/payment-history', label: 'Payment History' },
                { path: '/fee-payment', label: 'Pay College Fee' }
            );
        }

        return items;
    };

    const navigationItems = getNavigationItems();

    // Handle logout with confirmation
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    return (
        <div className="dashboard-container">
            {/* Enhanced Sidebar */}
            <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <h2>SmartCampus</h2>
                </div>

                {/* Enhanced User Profile */}
                <div className="user-profile">
                    <div className="user-avatar" title={userProfile.fullName}>
                        {getInitials(userProfile.fullName)}
                    </div>
                    <div className="user-info">
                        <span className="user-name" title={userProfile.fullName}>
                            {userProfile.fullName}
                        </span>
                        <span className="user-role" title={formatRole(userProfile.role)}>
                            {formatRole(userProfile.role)}
                        </span>
                    </div>
                </div>
                
                {/* Enhanced Navigation */}
                <nav className="sidebar-nav" role="navigation" aria-label="Main Navigation">
                    {navigationItems.map((item, index) => (
                        <NavLink 
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => isActive ? 'active' : ''}
                            title={item.label}
                            style={{ '--nav-index': index }}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Enhanced Sidebar Footer */}
                <div className="sidebar-footer">
                    <button 
                        onClick={handleLogout} 
                        className="logout-button"
                        title="Logout from SmartCampus"
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Enhanced Main Content */}
            <main className="main-content" role="main">
                {/* Main Content Area */}
                <div className="content-wrapper">
                    <Suspense fallback={
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <span className="loading-text">Loading Page...</span>
                        </div>
                    }>
                        <Outlet context={{ userProfile, formatRole, getInitials }} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;