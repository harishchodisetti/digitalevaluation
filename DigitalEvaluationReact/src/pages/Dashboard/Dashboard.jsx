import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { fetchColleges } from "../../services/collegeService"; // ✅ reuse service
import { fetchStudents } from "../../services/studentService";
import { fetchFaculties } from "../../services/facultyService"; // ✅ new import

import "./Dashboard.css";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ colleges: 0, students: 0, faculty: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Authorization check
    API.get("/Secured")
      .then(res => {
        setMessage(res.data.message || "Authorized");
      })
      .catch(() => setMessage("Unauthorized"));

    // ✅ Colleges count (using service or backend endpoint)
    fetchColleges()
      .then(data => setStats(prev => ({ ...prev, colleges: (data || []).length })))
      .catch(() => { });

    // ✅ Students count (adjust to your backend endpoint)
    fetchStudents()
      .then(data => setStats(prev => ({ ...prev, students: (data || []).length })))
      .catch(() => { });

    fetchFaculties()
      .then(data => setStats(prev => ({ ...prev, faculty: (data || []).length })))
      .catch(() => { });
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        {/* Colleges Stat Card */}
        <div className="stat-card blue">
          <h3>Total Colleges</h3>
          <p>{stats.colleges}</p>
          <span onClick={() => navigate("/colleges")}>
            View Details →
          </span>
        </div>

        {/* Students Stat Card */}
        <div className="stat-card yellow">
          <h3>Total Students</h3>
          <p>{stats.students}</p>
          <span onClick={() => navigate("/students")}>
            View Details →
          </span>
        </div>

        {/* Faculty Stat Card */}
        <div className="stat-card purple">
          <h3>Total Faculty</h3>
          <p>{stats.faculty}</p>
          <span onClick={() => navigate("/faculty")}>
            View Details →
          </span>
        </div>


        {/* Authorization Status Card */}
        <div className="stat-card green">
          <h3>Authorized</h3>
          <p>{message}</p>
          <span>System Status</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
