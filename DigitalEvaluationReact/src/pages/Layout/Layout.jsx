import { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MenuList from "../../components/Menu/MenuList";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../services/AuthService"; // use the service we fixed
import "./Layout.css";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);   // desktop toggle
  const [mobileOpen, setMobileOpen] = useState(false);    // mobile toggle
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();   // revoke refresh cookie on backend
      logout();             // clear access token + user from memory
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      logout();             // still clear memory
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <header className="topbar">
        <h1 className="app-title">DEPARTMENT OF EVALUATION</h1>
        <div className="user-info">
          <div className="avatar">👤</div>
          <span className="username">
            Welcome, {user?.username || "User"}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Hamburger */}
      <button
        className="mobile-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Sidebar */}
        <aside
          className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${
            mobileOpen ? "open" : ""
          }`}
        >
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {sidebarOpen ? "Menu" : ""}
            </h2>
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>
          <MenuList sidebarOpen={sidebarOpen} />
        </aside>

        {/* Backdrop for mobile */}
        {mobileOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
