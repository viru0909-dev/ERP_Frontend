import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MyCoursesPage from './MyCoursesPage'; // The Teacher's page
import StudentCoursesPage from './StudentCoursesPage'; // The Student's page

const CourseSelectorPage = () => {
    const { userProfile } = useOutletContext();

    if (!userProfile) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (userProfile.role === 'ROLE_TEACHER') {
        return <MyCoursesPage />;
    }

    if (userProfile.role === 'ROLE_STUDENT') {
        return <StudentCoursesPage />;
    }

    // Fallback for any other roles or errors
    return <div>You do not have access to this page.</div>;
};

export default CourseSelectorPage;