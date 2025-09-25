import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';

// LAZY LOAD ALL PAGE COMPONENTS
const LandingPage = lazy(() => import('./components/LandingPage.jsx'));
const AdmissionFormPage = lazy(() => import('./components/AdmissionFormPage.jsx'));
const LoginPage = lazy(() => import('./components/LoginPage.jsx'));
const FaceLogin = lazy(() => import('./components/FaceLogin.jsx'));
const DashboardPage = lazy(() => import('./components/DashboardPage.jsx'));
const ProfilePage = lazy(() => import('./components/ProfilePage.jsx'));
const UserManagementPage = lazy(() => import('./components/UserManagement.jsx'));
const StaffListPage = lazy(() => import('./components/StaffListPage.jsx'));
const ViewTeachersPage = lazy(() => import('./components/ViewTeachersPage.jsx'));
const ViewStudentsPage = lazy(() => import('./components/ViewStudentsPage.jsx'));
const CourseSelectorPage = lazy(() => import('./components/CourseSelectorPage.jsx'));
const TimeTablePage = lazy(() => import('./components/TimeTablePage.jsx'));
const CourseDetailPage = lazy(() => import('./components/CourseDetailPage.jsx'));
const ManageTimetablesPage = lazy(() => import('./components/ManageTimetablesPage.jsx'));
const ViewAttendancePage = lazy(() => import('./components/ViewAttendancePage.jsx'));
const TakeAttendancePage = lazy(() => import('./components/TakeAttendancePage.jsx')); 
const PublicCoursesPage = lazy(() => import('./components/PublicCoursesPage.jsx'));
const CourseBrochurePage = lazy(() => import('./components/CourseBrochurePage.jsx'));
const ManageAdmissionsPage = lazy(() => import('./components/ManageAdmissionsPage.jsx'));
const TrackApplicationPage = lazy(() => import('./components/TrackApplicationPage.jsx'));
const ManageSubjectsPage = lazy(() => import('./components/ManageSubjectsPage.jsx'));
const ManageClassesPage = lazy(() => import('./components/ManageClassesPage.jsx'));
const ManageClassroomsPage = lazy(() => import('./components/ManageClassroomsPage.jsx'));
const StudentProgressionPage = lazy(() => import('./components/StudentProgressionPage.jsx'));
const ClassDesignerPage = lazy(() => import('./components/ClassDesignerPage.jsx')); 
const MentorAssignmentPage = lazy(() => import('./components/MentorAssignmentPage.jsx')); 
const ManageHostelPage = lazy(() => import('./components/ManageHostelPage.jsx'));
const HostelPage = lazy(() => import('./components/HostelPage.jsx'));
const HostelBrochurePage = lazy(() => import('./components/HostelBrochurePage.jsx'));
const ManageRoomsPage = lazy(() => import('./components/ManageRooms.jsx')); // Remove "Page" from the filename
const HostelResidentsPage = lazy(() => import('./components/HostelResidentsPage.jsx'));
const UploadMarksPage = lazy(() => import('./components/UploadMarksPage.jsx'));
const ResultPage = lazy(() => import('./components/ResultPage.jsx'));
const SuperAdminDashboard = lazy(() => import('./components/SuperAdminDashboard.jsx')); // <-- ADD THIS
const RiskDashboard = lazy(() => import('./components/RiskDashboard.jsx'));
const PaymentHistoryPage = lazy(() => import('./components/PaymentHistoryPage.jsx'));
const FeePaymentPage = lazy(() => import('./components/FeePaymentPage.jsx'));



// --- ROUTE PROTECTION LOGIC ---
const ProtectedRoute = () => {
    const { token } = useAuth();
    return token ? <DashboardPage /> : <Navigate to="/" replace />;
};

const PublicRoute = () => {
    const { token } = useAuth();
    return token ? <Navigate to="/profile" replace /> : <Outlet />;
};


const App = () => {
    const router = createBrowserRouter([
        // --- PUBLIC ROUTES ---
        {
            element: <PublicRoute />,
            children: [
                { path: '/', element: <LandingPage /> },
                { path: '/admissions', element: <PublicCoursesPage /> }, // <-- ADD THIS
                { path: '/admissions/brochure/:classId', element: <CourseBrochurePage /> }, // <-- ADD THIS
                { path: '/apply', element: <AdmissionFormPage /> },
                { path: '/login', element: <LoginPage /> },
                { path: '/track-application', element: <TrackApplicationPage /> },
                { path: '/face-login', element: <FaceLogin /> }
            ]
        },
        // --- PROTECTED ROUTES ---
        {
            path: '/',
            element: <ProtectedRoute />,
            children: [
                { path: 'profile', element: <ProfilePage /> },
                { path: 'user-management', element: <UserManagementPage /> },
                { path: 'staff-list', element: <StaffListPage /> },
                { path: 'view-teachers', element: <ViewTeachersPage /> },
                { path: 'view-students', element: <ViewStudentsPage /> },
                { path: 'my-courses', element: <CourseSelectorPage /> },
                { path: 'time-table', element: <TimeTablePage /> },
                { path: 'course-details/:classId/:subjectId', element: <CourseDetailPage /> },
                { path: 'manage-timetables', element: <ManageTimetablesPage /> },
                { path: 'my-attendance', element: <ViewAttendancePage /> },
                { path: 'take-attendance/:slotId/:classId', element: <TakeAttendancePage /> },
                { path: 'manage-admissions', element: <ManageAdmissionsPage /> },
                { path: 'manage-subjects', element: <ManageSubjectsPage /> },
                { path: 'manage-classes', element: <ManageClassesPage /> },
                { path: 'manage-classrooms', element: <ManageClassroomsPage /> },
                { path: 'student-progression', element: <StudentProgressionPage /> }, 
                { path: 'class-designer', element: <ClassDesignerPage /> }, 
                { path: 'mentor-assignment', element: <MentorAssignmentPage /> },
                { path: 'manage-hostel', element: <ManageHostelPage /> },
                { path: 'hostel', element: <HostelPage /> },
                { path: 'hostel-brochure', element: <HostelBrochurePage /> },
                { path: 'manage-rooms', element: <ManageRoomsPage /> },
                { path: 'hostel-residents', element: <HostelResidentsPage /> },
                { path: 'upload-marks', element: <UploadMarksPage /> },
                { path: 'admin-dashboard', element: <SuperAdminDashboard /> }, // <-- ADD THIS
                { path: 'my-result', element: <ResultPage /> },
                { path: 'risk-dashboard', element: <RiskDashboard /> },
                { path: 'payment-history', element: <PaymentHistoryPage /> },
                { path: 'fee-payment', element: <FeePaymentPage /> },

            ]
        }
    ]);

    return (
        <AuthProvider>
            <Suspense fallback={<div className="loading-container">Loading Application...</div>}>
                <RouterProvider router={router} />
            </Suspense>
        </AuthProvider>
    );
};

export default App;