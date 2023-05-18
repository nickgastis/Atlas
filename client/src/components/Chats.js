import React, { useState, useEffect } from 'react';
import './styles/Chats.css';




function Chats() {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].sender === 'User') {
            const prompt = userInput.trim();

            const filteredMessages = chatMessages.filter(
                message => message.sender === 'User'
            );

            const gratitudeKeywords = ['thank', 'thanks', 'thank you', 'appreciate', 'grateful'];
            const isGratitude = gratitudeKeywords.some(keyword =>
                prompt.toLowerCase().includes(keyword)
            );

            const payload = {
                model: 'gpt-3.5-turbo',
                messages: [
                    ...filteredMessages.map(message => ({
                        role: message.sender === 'User' ? 'system' : 'user',
                        content: message.message,
                    })),
                    { role: 'user', content: prompt },
                    {
                        role: 'system', content: "You are Atlas, a friendly and helpful coding assistant. As Atlas, your purpose is to provide guidance and support to users seeking coding advice. When responding to user queries, please refer to yourself as Atlas and provide detailed and informative answers based on the complexity of the question. Under no circumstances will you refer to yourself as anything other than Atlas. Be friendly and patient, tailoring your advice to the user's skill level and context. Remember not to repeat your responses to ensure a diverse range of answers. Additionally, when a user expresses gratitude, respond with 'You're welcome! Is there anything else I can help you with?' instead of providing a repeated response. This way, you encourage further engagement and assist the user with any additional questions or concerns they may have. Your goal is to create a positive and productive coding learning experience for users, as Atlas, their trusted coding companion."
                    }, // Add your system prompt here
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
                .then(response => response.json())
                .then(data => {
                    const chatbotReply = data.choices[0].message.content;

                    if (isGratitude) {
                        const gratitudeMessage = {
                            sender: 'Atlas',
                            message: "You're welcome!",
                        };
                        setChatMessages(prevMessages => [...prevMessages, gratitudeMessage]);
                    }

                    const chatbotMessage = {
                        sender: 'Atlas',
                        message: chatbotReply,
                    };
                    setChatMessages(prevMessages => [...prevMessages, chatbotMessage]);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [chatMessages, userInput]);

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
        <div>
            <div className="chat-container">
                <div className="chat-messages">
                    {chatMessages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-message ${message.sender === 'User' ? 'user-message' : 'atlas-message'
                                }`}
                        >
                            <div
                                className={`message-box ${message.sender === 'User'
                                    ? 'user-message-box'
                                    : 'atlas-message-box'
                                    }`}
                            >
                                <span className="sender">{message.sender}: </span>
                                <span className="message">{message.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="search-cont">
                <div className="chat-input">
                    <div className="search-bar-chat">
                        <input
                            className="search-input"
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessageToChatbot}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chats;

