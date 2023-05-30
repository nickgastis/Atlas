import React, { useState } from 'react';
import axios from 'axios';
import './styles/Post.css';

function Post({ post, setPost }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpvote = async () => {
        setIsLoading(true);
        const data = { action: 'upvote' };
        try {
            await axios.patch(`/posts/${post.id}`, data);
            await fetchPostData();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleDownvote = async () => {
    //     setIsLoading(true);
    //     const data = { action: 'downvote' };
    //     try {
    //         await axios.patch(`/posts/${post.id}`, data);
    //         await fetchPostData();
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const fetchPostData = async () => {
        try {
            const response = await axios.get(`/posts/${post.id}`);
            const updatedPost = response.data;
            setPost((prevPost) => {
                return { ...prevPost, upvotes: updatedPost.upvotes }; // Update only the upvotes property of the post
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="post-container">
            <div className="post">
                <div className="post-header">
                    <h3 className="post-username">{post.username}</h3>
                    {/* <h2 className="post-votes">⬆ {post.upvotes}</h2> */}
                    <h2 className='post-title'>{post.title}</h2>
                    {/* <h2 className="post-votes">Downvotes: {post.downvotes}</h2> */}
                </div>
                <div className="post-content">
                    <textarea className="post-question" readOnly value={post.conversation}></textarea>
                </div>
                <div className="post-actions">
                    <button className="post-action-btn-up" onClick={handleUpvote} disabled={isLoading}>⬆</button>
                    <h2 className="post-votes">{post.upvotes}</h2>
                    {/* <button className="post-action-btn-down" onClick={handleDownvote} disabled={isLoading}>Downvote</button> */}
                </div>
                {/* POST ID CLICK BELOW */}
                <button className='read-more'>Read More</button>
            </div>
        </div>
    );
}

export default Post;


