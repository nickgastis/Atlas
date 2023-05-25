import React, { useState, useEffect, useRef } from 'react';
import './styles/Chats.css';
import CreatePost from './CreatePost';




function Chats({ currentUser }) {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [conversation, setConversation] = useState('');

    const apiKey = process.env.REACT_APP_API_KEY;
    // console.log(currentUser)
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
                    {   //PROMPT FOR ATLAS
                        role: 'system', content: "You are Atlas, a friendly and helpful coding assistant. As Atlas, your purpose is to provide guidance and support to users seeking coding advice. When responding to user queries, please refer to yourself as Atlas and provide detailed and informative answers based on the complexity of the question. Be friendly and patient, tailoring your advice to the user's skill level and context. Under no circumstances will you refer to yourself as anything other than Atlas. Your responses should be focused on directly addressing the user's query without offering additional information unless specifically requested by the user. If the user expresses gratitude, acknowledge it and ask if there is anything else you can assist them with, without repeating previous responses. Encourage further questions and engagement from the user to explore different aspects of the topic.Your goal is to provide concise and relevant answers to users' queries, ensuring a positive and productive coding learning experience as their trusted coding companion, Atlas."
                    },
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessageToChatbot();
        }
    };


    const chatMessagesRef = useRef(null);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);



    const handlePostButtonClick = () => {
        setShowCreatePost(true);
        // Set the conversation from the chat messages
        const conversationText = chatMessages.map(message => `${message.sender}: ${message.message}`).join('\n');
        setConversation(conversationText);
    };




    return (
        <div>
            <div className="chat-container">
                <div className="chat-messages" ref={chatMessagesRef}>
                    {chatMessages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-message ${message.sender === 'User' ? 'user-message' : 'atlas-message'}`}
                        >
                            <div
                                className={`message-box ${message.sender === 'User' ? 'user-message-box' : 'atlas-message-box'}`}
                            >
                                <div className="message-content">
                                    {message.sender === 'User' ? (
                                        <p className="user-sender">{message.sender}: {message.message}</p>
                                    ) : (
                                        <div>
                                            <p className="atlas-sender">Atlas:</p>
                                            {/* {message.message && typeof message.message === 'string' && message.message.split('\n').map((text, i) => (
                                                <p key={i} className="atlas-message-text">
                                                    {text}
                                                </p>
                                            ))} */}
                                            {message.message && typeof message.message === 'string' && message.message.split('\n').map((text, i) => (
                                                <p key={i} className="atlas-message-text">
                                                    {text}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="search-cont">
                <button className='post-btn' onClick={handlePostButtonClick}>Post</button>
                <div className="chat-input">
                    <div className="search-bar-chat">
                        <input
                            className="search-input"
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessageToChatbot}>Send</button>
                        {showCreatePost && <CreatePost currentUser={currentUser} conversation={conversation} />}
                    </div>
                </div>
            </div>
        </div>
    );



};

export default Chats;

