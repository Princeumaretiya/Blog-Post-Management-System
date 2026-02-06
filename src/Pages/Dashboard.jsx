import React from 'react';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-welcome">
                    <h1>Welcome to your Dashboard</h1>
                    <p>Manage your posts, track engagement, and connect with your audience.</p>
                </div>

                <div className="dashboard-stats-overview">
                    <div className="dash-card">
                        <h3>Published Posts</h3>
                        <span className="dash-number">24</span>
                    </div>
                    <div className="dash-card">
                        <h3>Drafts</h3>
                        <span className="dash-number">5</span>
                    </div>
                    <div className="dash-card">
                        <h3>Total Views</h3>
                        <span className="dash-number">1,240</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
