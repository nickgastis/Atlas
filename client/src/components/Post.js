import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/Post.css';

function Post({ post, setPost, currentUser }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [upvotes, setUpvotes] = useState(post.upvotes);
    const [isExpanded, setIsExpanded] = useState(false)
    const contentRef = useRef(null);

    useEffect(() => {
        if (currentUser && currentUser.user_id) {
            const storedIsUpvoted = localStorage.getItem(`post-${post.id}-isUpvoted-${currentUser.user_id}`);
            setIsUpvoted(storedIsUpvoted === 'true');
        }
    }, [post.id, currentUser]);

    const handleUpvote = async () => {
        setIsLoading(true);
        const data = { action: isUpvoted ? 'remove' : 'upvote', userId: currentUser?.user_id };
        try {
            await axios.patch(`/posts/${post.id}`, data);
            fetchPostData();
            setIsUpvoted((prevIsUpvoted) => !prevIsUpvoted);
            if (currentUser && currentUser.user_id) {
                localStorage.setItem(`post-${post.id}-isUpvoted-${currentUser.user_id}`, !isUpvoted);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPostData = async () => {
        try {
            const response = await axios.get(`/posts/${post.id}`);
            const updatedPost = response.data;
            setUpvotes(updatedPost.upvotes);
            setPost(updatedPost);
        } catch (error) {
            console.error(error);
        }
    };



    const handleReadMore = () => {
        setIsExpanded(!isExpanded);
        adjustTextareaHeight();
    };
    const adjustTextareaHeight = () => {
        if (contentRef.current) {
            if (isExpanded) {
                // Revert back to the original height
                contentRef.current.style.height = `auto`;
            } else {
                // Expands hieight to fit content
                contentRef.current.style.height = 'auto';
                contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
            }
        }
    };

    return (
        <div className="post-container">
            <div className="post">
                <div className="post-header">
                    <h3 className="post-username">{post.username}</h3>
                    <h2 className="post-title">{post.title}</h2>
                </div>
                <div className="post-content">
                    <textarea
                        className={`post-question ${isExpanded ? 'expanded' : ''}`}
                        readOnly
                        value={post.conversation}
                        ref={contentRef}
                    ></textarea>                </div>
                <div className="post-actions">
                    <button
                        className={`upvote-btn ${isUpvoted ? 'active' : ''}`}
                        onClick={handleUpvote}
                        disabled={isLoading || !currentUser || !currentUser.user_id}
                    >
                        <div className="text">
                            <span></span>
                            <span>Upvote</span>
                            <span></span>
                        </div>
                        <div className="clone">
                            <span></span>
                            <span>Upvote</span>
                            <span></span>
                        </div>
                        <svg
                            width="15px"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>

                    <h2 className="post-votes">{upvotes}</h2>
                </div>
                {!isExpanded ? (
                    <button className="read-more" onClick={handleReadMore}>
                        Read More
                    </button>
                ) : (
                    <button className="read-more" onClick={handleReadMore}>
                        Read Less
                    </button>
                )}
            </div>
        </div>
    );
}

export default Post;
