import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem("authData"));

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5001/posts');
            const data = await response.json();

            if (Array.isArray(data)) {
                const sortedData = data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setPosts(sortedData);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const response = await fetch(`http://localhost:5001/posts/${postId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setPosts(posts.filter(post => post.id !== postId));
                    alert("Post deleted successfully");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    const handleEdit = (postId) => {
        navigate(`/edit-post/${postId}`);
    };

    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-welcome">
                    <div className="welcome-text">
                        <h1>Welcome to your Dashboard</h1>
                        <p>Manage your posts, track engagement, and connect with your audience.</p>
                    </div>
                </div>

                <div className="dashboard-stats-overview">
                    <div className="dash-card">
                        <h3>Total Posts</h3>
                        <span className="dash-number">{posts.length}</span>
                    </div>
                    <div className="dash-card">
                        <h3>Your Stories</h3>
                        <span className="dash-number">{
                            posts.filter(p => p.author === authData?.name).length
                        }</span>
                    </div>
                    <div className="dash-card">
                        <h3>Community Posts</h3>
                        <span className="dash-number">{posts.length}</span>
                    </div>
                </div>

                <section className="posts-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Feed</h2>
                        <button className="create-shortcut-btn" onClick={() => navigate('/create-post')}>
                            <FaPlus /> New Post
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="no-posts">
                            <p>No posts yet. Be the first to publish!</p>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {posts.map(post => (
                                <div key={post.id} className="post-card">
                                    <div className="post-image-container">
                                        <img
                                            src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                                            alt={post.title}
                                            className="post-card-image"
                                        />
                                        <div className="post-actions">
                                            <button className="action-btn edit-btn" onClick={() => handleEdit(post.id)} title="Edit Post">
                                                <MdEdit size={22} color="#ffffff" style={{ display: 'block' }} />
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(post.id)} title="Delete Post">
                                                <MdDelete size={22} color="#ffffff" style={{ display: 'block' }} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="post-card-content">
                                        <div className="post-meta">
                                            <span className="post-author">By {post.author}</span>
                                            <span className="post-date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                                        </div>
                                        <h3 className="post-card-title">{post.title}</h3>
                                        <p className="post-card-description">
                                            {(post.description || post.content || '').length > 100
                                                ? (post.description || post.content || '').substring(0, 100) + '...'
                                                : (post.description || post.content || '')}
                                        </p>
                                        <button
                                            className="read-more-btn"
                                            onClick={() => navigate(`/post/${post.id}`)}
                                        >
                                            Read More
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

export default Dashboard;
