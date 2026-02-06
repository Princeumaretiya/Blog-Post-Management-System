import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div style={{ textAlign: 'center', marginTop: '50px', color: '#333' }}><h2>Welcome to Dashboard</h2></div>} />
      </Routes>
    </Router>
  );
}

export default App;
