import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdPhotoCamera } from 'react-icons/md';
import './Profile.css';

const Profile = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem("authData"));

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch('http://localhost:5001/posts');
                const allPosts = await response.json();
                
                // Filter posts by current user name (assuming name is the author identifier)
                const filteredPosts = allPosts.filter(post => post.author === authData?.name);
                
                // Sort by latest first
                filteredPosts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                
                setUserPosts(filteredPosts);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (authData?.name) {
            fetchUserPosts();
        }
    }, [authData?.name]);

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const response = await fetch(`http://localhost:5001/posts/${postId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setUserPosts(userPosts.filter(post => post.id !== postId));
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-banner-container">
                <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200" 
                    alt="Banner" 
                    className="profile-banner"
                />
            </div>
            <main className="profile-main">
                <header className="profile-header">
                    <div className="profile-avatar-container">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(authData?.name || 'User')}&background=6c5ce7&color=fff&size=200`} 
                            alt="Profile" 
                            className="profile-avatar"
                        />
                        <button className="edit-avatar-btn">
                            <MdPhotoCamera size={20} />
                        </button>
                    </div>
                    <div className="profile-info">
                        <h1>{authData?.name || 'User Name'}</h1>
                        <span className="profile-email">{authData?.email || 'user@example.com'}</span>
                        <p className="profile-bio">
                            Passionate storyteller and content creator. I love sharing my thoughts on technology, 
                            lifestyle, and everything in between. Coffee enthusiast and life-long learner.
                        </p>
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{userPosts.length}</span>
                                <span className="stat-label">Posts</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1.2k</span>
                                <span className="stat-label">Followers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">450</span>
                                <span className="stat-label">Following</span>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="profile-content-section">
                    <h2 className="section-title">My Published Posts</h2>
                    
                    {loading ? (
                        <div className="loading-spinner">Loading your stories...</div>
                    ) : userPosts.length === 0 ? (
                        <div className="no-posts-message">
                            <h3>You haven't written anything yet.</h3>
                            <button className="create-shortcut-btn" onClick={() => navigate('/create-post')} style={{ marginTop: '20px' }}>
                                Start Writing
                            </button>
                        </div>
                    ) : (
                        <div className="profile-posts-grid">
                            {userPosts.map(post => (
                                <div key={post.id} className="post-card">
                                    <div className="post-image-container">
                                        <img 
                                            src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                                            alt={post.title} 
                                            className="post-card-image" 
                                        />
                                        <div className="post-actions">
                                            <button className="action-btn edit-btn" onClick={() => navigate(`/edit-post/${post.id}`)}>
                                                <MdEdit size={22} color="#ffffff" />
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(post.id)}>
                                                <MdDelete size={22} color="#ffffff" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="post-card-content">
                                        <div className="post-meta">
                                            <span className="post-date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                                        </div>
                                        <h3 className="post-card-title">{post.title}</h3>
                                        <p className="post-card-description">
                                            {(post.description || post.content || '').substring(0, 100)}...
                                        </p>
                                        <button className="read-more-btn" onClick={() => navigate(`/post/${post.id}`)}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Profile;
