import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import AuthGuard from './components/AuthGuard';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route 
          path="/register" 
          element={
            <AuthGuard requiredAuth={false}>
              <Register />
            </AuthGuard>
          } 
        />
        <Route 
          path="/login" 
          element={
            <AuthGuard requiredAuth={false}>
              <Login />
            </AuthGuard>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/my-posts" 
          element={
            <AuthGuard>
              <div className="placeholder-page">
                <Navbar />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h1>My Posts</h1>
                  <p>This page is under construction.</p>
                </div>
              </div>
            </AuthGuard>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <AuthGuard>
              <div className="placeholder-page">
                <Navbar />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h1>Create New Post</h1>
                  <p>This page is under construction.</p>
                </div>
              </div>
            </AuthGuard>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <AuthGuard>
              <div className="placeholder-page">
                <Navbar />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h1>User Profile</h1>
                  <p>This page is under construction.</p>
                </div>
              </div>
            </AuthGuard>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
