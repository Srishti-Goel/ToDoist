import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/colors.css'
import './css/index.css'

import SignUp from './Auth/SignUp'
import LogIn from './Auth/LogIn'
import SideNavBar from './NavBars/SideNavBar'
import Home from './Home/Home'
import NotFound from './PageNotFound'

import { useUser } from './UserContext'
import TaskChart from './TaskChart/TaskChart'
import TopNavBar from './NavBars/TopNavBar'
import Profile from './Profile/Profile'
const PALETTE_NUMBER = 1;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const Logout: React.FC = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
      setUser(null); // Clear user data on logout
      navigate('/'); // Redirect to home page
    }, [setUser, navigate]);
    return null; // This component doesn't render anything
  };
  // Collapse navBar on route change

  useEffect(() => {
    setCollapsed(true); // Collapse navBar before navigation
  }, [location]);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', PALETTE_NUMBER.toString());
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        color: `var(--palette-6)`,
        background: 'var(--palette-1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TopNavBar now contains the SideNavBar for seamless integration */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1020,
          background: 'var(--palette-1)',
          borderBottom: '1px solid var(--palette-3)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          height: '100%',
        }}>
          <SideNavBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TopNavBar collapsed={collapsed} />
        </div>
      </div>
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          minWidth: 0,
        }}
      >
        <div style={{ padding: '1.5rem 1rem 1rem 1rem', flex: 1 }}>
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/taskChart" element={<TaskChart />} />
            <Route path="/taskChart/:hobby" element={<TaskChartWithHobby />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function AppWithRouter() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

function TaskChartWithHobby() {
  const { hobby } = useParams();
  return <TaskChart hobby={hobby} />;
}
