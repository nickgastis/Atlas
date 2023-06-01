import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/CreatePost.css';

const CreatePost = ({ conversation, currentUser, setPosts, closeCreatePost }) => {
    const [title, setTitle] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            title: title,
            conversation: conversation,
            user_id: currentUser.user_id,
            username: currentUser.username,
        };

        axios
            .post('/api/posts', newPost)
            .then((response) => {
                setIsSubmitted(true);
                axios
                    .get('/api/posts/latest')
                    .then((latestPostResponse) => {
                        setPosts((prevPosts) => [...prevPosts, latestPostResponse.data.post]);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (isSubmitted) {
            window.alert('Post successful!');
            closeCreatePost(); // Trigger the closeCreatePost function
        }
    }, [isSubmitted]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="container">
            <h2 className="title">Create Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2 className="title-sub">Title:</h2>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="input"
                        placeholder="Post title..."
                        required
                    />
                </div>
                <div className="form-group">
                    <h2 className="title-sub">Conversation:</h2>
                    <textarea value={conversation} readOnly className="textarea" />
                </div>
                <button type="submit">Submit</button>
                <button className="close-create-post" onClick={closeCreatePost}>
                    X
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
