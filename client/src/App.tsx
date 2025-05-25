import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/colors.css'

import SignUp from './SignUp'
import LogIn from './LogIn'
import SideNavBar from './navBar'
import Home from './home'
const PALETTE_NUMBER = 6;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
