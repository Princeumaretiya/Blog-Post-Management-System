import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Navbar from '../components/Navbar';
import './Analytics.css';

const Analytics = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5001/posts');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Prepare data for the Bar Chart: Posts per Author
    const authorStats = posts.reduce((acc, post) => {
        const author = post.author || 'Unknown';
        acc[author] = (acc[author] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(authorStats).map(author => ({
        name: author,
        posts: authorStats[author]
    }));

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <div className="analytics-page">
                <Navbar />
                <div className="loading-container">Loading Analytics...</div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <Navbar />
            <main className="analytics-main">
                <header className="analytics-header">
                    <h1>Blog Analytics</h1>
                    <p>Insights into your blog's performance and activity.</p>
                </header>

                <div className="charts-container">
                    <div className="chart-card">
                        <h3>Posts per Author</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="posts" fill="#8884d8" name="Number of Posts" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>Distribution</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="posts"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="posts-table-section">
                    <h3>All Posts</h3>
                    <div className="table-wrapper">
                        <table className="analytics-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td>{post.title}</td>
                                        <td>{post.author}</td>
                                        <td>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Pagination Component */}
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
                            >
                                {number + 1}
                            </button>
                        ))}
                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
