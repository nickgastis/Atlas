import React, { useEffect } from 'react';
import './styles/Post.css';

function Post({ posts }) {





    return (
        <div className="post-container">
            <div className="post">
                <div className="post-header">
                    <h3 className="post-username">{posts.username}</h3>
                    <h2 className='post-title'>{posts.title}</h2>
                    <h2 className="post-votes">Upvotes: 10</h2>
                </div>
                <div className="post-content">
                    <textarea className="post-question" readOnly value={posts.conversation}></textarea>
                </div>
                <div className="post-actions">
                    <button className="post-action-btn-up">Upvote</button>
                    <button className="post-action-btn-down">Downvote</button>
                </div>
                {/* POST ID CLICK BELOW */}
                <button className='read-more'>Read More</button>
            </div>
        </div>
    );
}

export default Post;

