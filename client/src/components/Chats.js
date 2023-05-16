import React, { useState, useEffect } from 'react';
import './styles/Chats.css';


function Chats() {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');


    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        if (chatMessages.length > 0) {
            const prompt = userInput.trim();

            const payload = {
                model: 'gpt-3.5-turbo',
                messages: [
                    ...chatMessages.map((message) => ({
                        role: message.sender === 'User' ? 'system' : 'user',
                        content: message.message,
                    })),
                    { role: 'user', content: prompt },
                ],
            };

            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    const chatbotReply = data.choices[0].message.content;

                    const chatbotMessage = {
                        sender: 'Atlas',
                        message: chatbotReply,
                    };
                    setChatMessages([...chatMessages, chatbotMessage]);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [chatMessages]);

    const sendMessageToChatbot = () => {
        if (userInput.trim() === '') {
            return;
        }

        const newMessage = {
            sender: 'User',
            message: userInput.trim(),
        };
        setChatMessages([...chatMessages, newMessage]);

        setUserInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {chatMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message ${message.sender === 'User' ? 'user-message' : 'atlas-message'
                            }`}
                    >
                        <div
                            className={`message-box ${message.sender === 'User' ? 'user-message-box' : 'atlas-message-box'
                                }`}
                        >
                            <span className="sender">{message.sender}: </span>
                            <span className="message">{message.message}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <div className="search-bar-chat">
                    <input
                        className="search-input"
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessageToChatbot}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chats;
