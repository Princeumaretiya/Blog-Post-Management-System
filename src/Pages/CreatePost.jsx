import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeading, FaUser, FaLink, FaCloudUploadAlt, FaTimes, FaRegPaperPlane } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './CreatePost.css';

const CreatePost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const authData = JSON.parse(localStorage.getItem("authData"));

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: authData?.name || '',
        imageUrl: '',
        imageType: 'url'
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const fetchPostToEdit = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/posts/${id}`);
                    if (response.ok) {
                        const post = await response.json();
                        setFormData({
                            title: post.title,
                            description: post.description || post.content || '',
                            author: post.author,
                            imageUrl: post.image && post.image.startsWith('http') ? post.image : '',
                            imageType: post.image && post.image.startsWith('http') ? 'url' : 'file'
                        });
                        setImagePreview(post.image);
                    }
                } catch (error) {
                    console.error("Error fetching post for edit:", error);
                }
            };
            fetchPostToEdit();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'imageUrl' && formData.imageType === 'url') {
            setImagePreview(value);
        }
    };

    const handleFileTypeChange = (type) => {
        setFormData(prev => ({ ...prev, imageType: type }));
        if (type === 'url') {
            setImagePreview(formData.imageUrl);
        } else {
            setImagePreview(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setImagePreview(null);
        if (formData.imageType === 'url') {
            setFormData(prev => ({ ...prev, imageUrl: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const postData = {
            title: formData.title,
            description: formData.description,
            author: formData.author,
            image: imagePreview,
            createdAt: isEditMode ? undefined : new Date().toISOString() // Keep original date if editing, or update if desired
        };

        const url = isEditMode 
            ? `http://localhost:5001/posts/${id}` 
            : 'http://localhost:5001/posts';
        
        const method = isEditMode ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                alert(isEditMode ? "Post updated successfully!" : "Post published successfully!");
                navigate('/dashboard');
            } else {
                alert('Failed to save post. Please try again.');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Something went wrong. Please check if the server is running.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-post-page">
            <Navbar />
            <div className="create-post-container">
                <header className="form-header">
                    <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
                    <p>{isEditMode ? 'Update your story and share it again' : 'Share your thoughts and stories with the world'}</p>
                </header>

                <div className="post-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Post Title</label>
                            <div className="input-wrapper">
                                <FaHeading className="input-icon" />
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Enter a catchy title..."
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Author Name</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input
                                    type="text"
                                    name="author"
                                    className="form-control"
                                    placeholder="Your name"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                placeholder="What's on your mind? Write your story here..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Cover Image</label>
                            
                            {!imagePreview ? (
                                <>
                                    <div className="image-source-tabs">
                                        <button
                                            type="button"
                                            className={`tab-btn ${formData.imageType === 'url' ? 'active' : ''}`}
                                            onClick={() => handleFileTypeChange('url')}
                                        >
                                            Image URL
                                        </button>
                                        <button
                                            type="button"
                                            className={`tab-btn ${formData.imageType === 'file' ? 'active' : ''}`}
                                            onClick={() => handleFileTypeChange('file')}
                                        >
                                            Upload File
                                        </button>
                                    </div>

                                    {formData.imageType === 'url' ? (
                                        <div className="input-wrapper">
                                            <FaLink className="input-icon" />
                                            <input
                                                type="url"
                                                name="imageUrl"
                                                className="form-control"
                                                placeholder="Paste image URL here (e.g. https://...)"
                                                value={formData.imageUrl}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ) : (
                                        <div className="image-upload-area" onClick={triggerFileSelect}>
                                            <FaCloudUploadAlt className="upload-icon" />
                                            <p>Click to upload image from your device</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-actions-row">
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    isEditMode ? 'Updating...' : 'Publishing...'
                                ) : (
                                    <>
                                        <FaRegPaperPlane /> {isEditMode ? 'Update Post' : 'Publish Post'}
                                    </>
                                )}
                            </button>

                            <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={isEditMode ? () => navigate('/dashboard') : () => {
                                    setFormData({
                                        title: '',
                                        description: '',
                                        author: authData?.name || '',
                                        imageUrl: '',
                                        imageType: 'url'
                                    });
                                    setImagePreview(null);
                                }}
                                disabled={isSubmitting}
                            >
                                {isEditMode ? 'Cancel' : 'Clear Form'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
