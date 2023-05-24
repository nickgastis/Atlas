import React, { useState } from 'react';
import axios from 'axios';
import "./styles/CreatePost.css";

const CreatePost = ({ conversation, currentUser }) => {
    const [title, setTitle] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    // console.log('USER CREATE P', currentUser.user_id)
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(currentUser)

        const newPost = {
            title: title,
            conversation: conversation,
            user_id: currentUser.user_id,
            username: currentUser.username,
        };
        // console.log('NEW POST CREATED', newPost);

        axios.post('/api/posts', newPost)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="container">
            <h2 className="title">Create Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2 className='title-sub'>Title:</h2>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="input"
                        placeholder='Post title...'
                        required
                    />
                </div>
                <div className="form-group">
                    <h2 className='title-sub'>Conversation:</h2>
                    <textarea value={conversation} readOnly className="textarea" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreatePost;

