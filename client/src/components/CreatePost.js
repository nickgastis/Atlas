import React, { useState } from 'react';
import "./styles/CreatePost.css";

const CreatePost = ({ conversation }) => {
    const [title, setTitle] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
    };

    return (
        <div className="container">
            <h2 className="title">Create Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2 className='title'>Title:</h2>
                    <label htmlFor="title" className="label">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label">Conversation:</label>
                    <textarea value={conversation} readOnly className="textarea" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreatePost;
