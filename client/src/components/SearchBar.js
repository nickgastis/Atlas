import React from 'react';
import "./styles/SearchBar.css";

function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <div className="input-container">
                <input id="input"
                    type="text" required
                    value={value}
                    onChange={onChange}
                />
                <label className="label" htmlFor="input">Search...</label>
                <div className="underline"></div>
                <div className="sideline"></div>
                <div className="upperline"></div>
                <div className="line"></div>
            </div>
        </div>
    );
}

export default SearchBar;



