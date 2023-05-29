import React, { useState } from 'react';
import axios from 'axios';
import './styles/CreatePost.css';


const CreatePost = ({ conversation, currentUser, setPosts }) => {
    const [title, setTitle] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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
                console.log(response.data);
                setIsSubmitted(true); // Set the submitted state to true
                // Retrieve the latest post after creating it
                axios
                    .get('/api/posts/latest')
                    .then((latestPostResponse) => {
                        console.log(latestPostResponse.data);
                        setPosts((prevPosts) => [...prevPosts, latestPostResponse.data.post]); // Update the posts state with the latest post
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    if (isSubmitted) {
        return <h1 className="success-message">Post successful!</h1>;
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
            </form>
        </div>
    );
};

export default CreatePost;


