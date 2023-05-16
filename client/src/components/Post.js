import React from 'react';
import './styles/Post.css';

function Post() {
    return (
        <div className="post-container">
            <div className="post">
                <div className="post-header">
                    <h3 className="post-username">Nick4465</h3>
                    <h2 className='post-title'>Title</h2>
                    <h2 className="post-votes">Upvotes: 10</h2>
                </div>
                <div className="post-content">
                    <div className="post-question">
                        <h2>Question:</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae finibus metus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae finibus metus </p>
                    </div>
                    <div className="post-response">
                        <img className='atlas-response' src='./mstile-150x150.png'></img>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae finibus metus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae finibus metus.</p>
                    </div>
                </div>
                <div className="post-actions">
                    <button className="post-action-btn">Upvote</button>
                    <button className="post-action-btn">Downvote</button>
                </div>
            </div>
        </div>
    );
}

export default Post;

