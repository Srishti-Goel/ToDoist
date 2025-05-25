import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/colors.css'

import SignUp from './SignUp'
import LogIn from './LogIn'
import SideNavBar from './navBar'
import Home from './home'
import { useUser } from './UserContext'
const PALETTE_NUMBER = 6;

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
    <div style={{ height: '100vh', overflow: 'hidden', color: `var(--palette-6)` }}>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <SideNavBar collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>
  )
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
