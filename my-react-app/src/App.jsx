import React from 'react';
import { BrowserRouter as Router, Routes, Route ,useLocation } from 'react-router-dom';
import './App.css';
import './components/WorkForm.css';
import AdminTrainer from './components/AdminTrainer';
import { AuthProvider } from './AuthContext';
import Admin from './components/UserDeHashMaker';
import PrivateRoute from './PrivateRoute';
import WorkCombine from './components/WorkCombineFormAndTable';
import Error404notfound from './components/NotFound404';
import LogoutButton from './components/LogoutButton';
import { useEffect, useState } from 'react';
import SignUpForm from './components/AdminSuper';

const AppContent = () => {
  
  const [loading, setLoading] = useState(false);
  const [HeyKahana, setKahana] = useState(true);
  const location = useLocation();

  useEffect(() => {

    setLoading(true); // Show the loader when route changes start

    // Simulate loading delay
    const timeout = setTimeout(() => {
      setLoading(false); // Hide the loader after delay
    }, 1000);
    if(HeyKahana){
      setKahana(false);
      console.error("hey Kahana ;)");
    }
    return () => clearTimeout(timeout); // Cleanup timeout

  }, [location]);
if (location.pathname !=='/' ){return<LogoutButton />}

}

const App = () => {
  
  return (
    <AuthProvider>
      <Router>
      <AppContent/>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AdminTrainer />} />
          <Route path="/:User/:hashedUserId/*" element={<Admin/>} />
          {/* Private routes */}
          <Route path="/:User/*" element={<PrivateRoute component={WorkCombine} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
