import React, { useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import "./styles/CreatePost.css";

=======
import './styles/CreatePost.css';


>>>>>>> wednesday11
const CreatePost = ({ conversation, currentUser }) => {
    const [title, setTitle] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    // console.log('USER CREATE P', currentUser.user_id)
    const handleSubmit = (e) => {
        e.preventDefault();

<<<<<<< HEAD
        console.log(currentUser)

=======
>>>>>>> wednesday11
        const newPost = {
            title: title,
            conversation: conversation,
            user_id: currentUser.user_id,
            username: currentUser.username,
        };
<<<<<<< HEAD
        // console.log('NEW POST CREATED', newPost);

        axios.post('/api/posts', newPost)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
=======

        axios
            .post('/api/posts', newPost)
            .then((response) => {
                console.log(response.data);
                setIsSubmitted(true); // Set the submitted state to true
            })
            .catch((error) => {
>>>>>>> wednesday11
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

<<<<<<< HEAD
=======

>>>>>>> wednesday11
