import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import CreatePost from './Pages/CreatePost';
import PostDetails from './Pages/PostDetails';
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
          path="/create-post" 
          element={
            <AuthGuard>
              <CreatePost />
            </AuthGuard>
          } 
        />
        <Route 
          path="/edit-post/:id" 
          element={
            <AuthGuard>
              <CreatePost />
            </AuthGuard>
          } 
        />
        <Route 
          path="/post/:id" 
          element={
            <AuthGuard>
              <PostDetails />
            </AuthGuard>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
