import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/loginpage/Login";
import Register from "./pages/Registrationpage/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Colleges from "./pages/Colleges/Colleges";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Students from "./pages/Students/Students";
import Branches from "./pages/Branches/Branches";
import Courses from "./pages/Courses/Courses";
import Subjects from "./pages/Subjects/Subjects";
import CourseSubjects from "./pages/Coursesubjects/Coursesubjects";
import Faculty from "./pages/Faculty/Faculty";
import Exams from "./pages/Exams/Exams";
import Answersheets from "./pages/Answersheets/Answersheets";
import FacultySubject from "./pages/FaultySubject/FacultySubject";
import Evaluations from "./pages/Evaluations/Evaluations";
import Questions from "./pages/Questions/Questions";
import EditQuestion from "./pages/Questions/Editquestion";
import QuestionOption from "./pages/QuestionOption/QuestionOption";
import Layout from "./pages/Layout/Layout";
import RevaluationRequests from "./pages/RevaluationRequest/RevaulationRequests";
import RevaluationAssignments from "./pages/RevaluationAssignments/RevaluationAssignments";
import ExamSections from "./pages/ExamSections/ExamSections";
import ExamQuestions from "./pages/ExamQuestions/ExamQuestions";
import StudentAnswers from "./pages/StudentAnswers/StudentAnswers";
import StudentExamAssignments from "./pages/StudentExamAssignments/StudentExamAssignments";
import StudentReport from "./pages/Reports/StudentReports/StudentsReport";
import SubjectReport from "./pages/Reports/SubjectReports/SubjectReport";
import EvaluationReport from "./pages/Reports/EvaluationReport/EvaluationReport";
import RevaluationReport from "./pages/Reports/RevaluationReport/RevaluationReport";
import RevaluationDetails from "./pages/RevaluationDetails/RevaluationDetails";
import RevaluationMarks from "./pages/RevaluationMarks/RevaluationMarks";
import QuestionReport from "./pages/Reports/QuestionReport/QuestionReport";
import DashboardReport from "./pages/Reports/DashboardReport/DashboardReport";
import ActivityLogs from "./pages/ActivityLogs/ActivityLogs";
import AuditLogs from "./pages/AuditLogs/AuditLogs";





function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="colleges" element={<Colleges />} />
            <Route path="students" element={<Students />} />
            <Route path="branches" element={<Branches />} />
            <Route path="courses" element={<Courses />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="coursesubjects" element={<CourseSubjects />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="exams" element={<Exams />} />
            <Route path="answersheets" element={<Answersheets />} />
            <Route path="facultysubjects" element={<FacultySubject />} />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="questions/edit/:id" element={<EditQuestion />} />
            <Route path="questions" element={<Questions />} />
            <Route path="questionoptions" element={<QuestionOption />} />
            <Route path="revaluationrequests" element={<RevaluationRequests />} />
            <Route path="revaluationassignments" element={<RevaluationAssignments />} />
            <Route path="revaluationdetails" element={<RevaluationDetails />} />
            <Route path="revaluationmarks" element={<RevaluationMarks />} />
            <Route path="examsections" element={<ExamSections />} />
            <Route path="examquestions" element={<ExamQuestions />} />
            <Route path="studentanswers" element={<StudentAnswers />} />
            <Route path="studentexamassignments" element={<StudentExamAssignments />} />
            <Route path="reports/student" element={<StudentReport />} />
            <Route path="reports/subject" element={<SubjectReport />} />
            <Route path="reports/evaluation" element={<EvaluationReport />} />
            <Route path="reports/revaluation" element={<RevaluationReport />} />
            <Route path="reports/question" element={<QuestionReport />} />
            <Route path="reports/dashboard" element={<DashboardReport />} />

            <Route path="activitylogs" element={<ActivityLogs />} />
            <Route path="auditlogs" element={<AuditLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
