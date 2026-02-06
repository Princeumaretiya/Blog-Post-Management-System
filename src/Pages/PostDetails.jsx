import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './PostDetails.css';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5001/posts/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPost(data);
                } else {
                    alert("Post not found");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="post-details-loading">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Fetching your story...</p>
                </div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="post-details-page">
            <Navbar />
            <main className="post-details-container">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft /> Back to Feed
                </button>

                <article className="full-post">
                    <header className="post-header">
                        <div className="post-category">Journal</div>
                        <h1 className="post-full-title">{post.title}</h1>
                        
                        <div className="post-author-meta">
                            <div className="author-info">
                                <div className="author-avatar">
                                    {post.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <span className="author-name">{post.author}</span>
                                    <div className="post-date-row">
                                        <span><FaCalendarAlt /> {new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                                        <span className="dot"></span>
                                        <span><FaClock /> 5 min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="post-featured-image">
                        <img 
                            src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200'} 
                            alt={post.title} 
                        />
                    </div>

                    <div className="post-body">
                        {post.description || post.content}
                    </div>

                    <footer className="post-footer">
                        <div className="post-share">
                            <span>Share this story:</span>
                            <div className="share-buttons">
                                <button className="share-btn">Twitter</button>
                                <button className="share-btn">LinkedIn</button>
                                <button className="share-btn">Link</button>
                            </div>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
};

export default PostDetails;
