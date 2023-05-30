import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import Post from './Post';
import SearchBar from './SearchBar';

function Home({ posts, setPosts }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    console.log("HOME POSTS", posts);

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    const handleSearchQueryChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        filterPosts(query);
    };

    const filterPosts = (query) => {
        const filtered = posts.filter((post) => {
            const title = post.title.toLowerCase();
            const lowerQuery = query.toLowerCase();
            return title.includes(lowerQuery);
        });

        setFilteredPosts(filtered);
    };
    //COMMENT
    return (
        <div className="home">
            <h1 className="font-link">Atlas</h1>
            <h2 className="sub-home">Unlock the Power of AI: Collaborate, Share, and Learn with Like-Minded Innovators</h2>
            <div className="search-bar">
                <SearchBar value={searchQuery} onChange={handleSearchQueryChange} />
            </div>
            <div className="post-list">
                {filteredPosts.map((post) => (
                    <Post key={post.id} post={post} setPosts={setPosts} />
                ))}
            </div>
        </div>
    );
}

export default Home;
