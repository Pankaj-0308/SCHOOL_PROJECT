import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import AdminLanding from './pages/admin/AdminLanding';
import TeacherLanding from './pages/teacher/TeacherLanding';
import StudentLanding from './pages/student/StudentLanding';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherSchedule from './pages/teacher/TeacherSchedule.jsx';
import TeacherAssignments from './pages/teacher/TeacherAssignments.jsx';
import TeacherStudents from './pages/teacher/TeacherStudents.jsx';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentSubmit from './pages/student/StudentSubmit.jsx';
import StudentStats from './pages/student/StudentStats.jsx';
import StudentQuestionPapers from './pages/student/StudentQuestionPapers.jsx';
import StudentTimetable from './pages/student/StudentTimetable.jsx';
import AdmissionLanding from './components/admission/AdmissionLanding';
import AdmissionTest from './components/admission/AdmissionTest';
import DocumentSubmission from './components/admission/DocumentSubmission';
import AdmissionSuccess from './components/admission/AdmissionSuccess';
import AdmissionFailed from './components/admission/AdmissionFailed.jsx';
import AdmissionStatus from './components/admission/AdmissionStatus';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import JobsList from './pages/jobs/JobsList';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import AdminJobs from './pages/admin/AdminJobs.jsx';
import AdminAdmissions from './pages/admin/AdminAdmissions.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import Gallery from './pages/site/Gallery.jsx';
import Results from './pages/site/Results.jsx';
import AdminTeachers from './pages/admin/AdminTeachers.jsx';
import AdminAddTeacher from './pages/admin/AdminAddTeacher.jsx';


function App() {
  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <header>
          <NavBar />
        </header>
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'transparent' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/results" element={<Results />} />
            <Route path="/directions" element={<Navigate to="/contact" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/:role" element={<SignUp />} />

            {/* Role landing pages */}
            <Route path="/admin" element={<AdminLanding />} />
            <Route path="/teacher" element={<TeacherLanding />} />
            <Route path="/student" element={<StudentLanding />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allow={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allow={["admin"]}><AdminJobs /></ProtectedRoute>} />
            <Route path="/admin/admissions" element={<ProtectedRoute allow={["admin"]}><AdminAdmissions /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allow={["admin"]}><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute allow={["admin"]}><AdminTeachers /></ProtectedRoute>} />
            <Route path="/admin/teachers/add" element={<ProtectedRoute allow={["admin"]}><AdminAddTeacher /></ProtectedRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<ProtectedRoute allow={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/schedule" element={<ProtectedRoute allow={["teacher"]}><TeacherSchedule /></ProtectedRoute>} />
            <Route path="/teacher/assignments" element={<ProtectedRoute allow={["teacher"]}><TeacherAssignments /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute allow={["teacher"]}><TeacherStudents /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allow={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/submit" element={<ProtectedRoute allow={["student"]}><StudentSubmit /></ProtectedRoute>} />
            <Route path="/student/stats" element={<ProtectedRoute allow={["student"]}><StudentStats /></ProtectedRoute>} />
            <Route path="/student/question-papers" element={<ProtectedRoute allow={["student"]}><StudentQuestionPapers /></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute allow={["student"]}><StudentTimetable /></ProtectedRoute>} />

            {/* Admission Routes */}
            <Route path="/admission" element={<AdmissionLanding />} />
            <Route path="/admission/test" element={<AdmissionTest />} />
            <Route path="/admission/documents" element={<DocumentSubmission />} />
            <Route path="/admission/status" element={<AdmissionStatus />} />
            <Route path="/admission/success" element={<AdmissionSuccess />} />
            <Route path="/admission/failed" element={<AdmissionFailed />} />

            {/* Redirect unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <footer>
          <Footer />
        </footer>
      </Box>
    </Router>
  );
}

export default App;