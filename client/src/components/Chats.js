import React, { useState, useEffect, useRef } from 'react';
import './styles/Chats.css';
import './styles/Loading.css';
import CreatePost from './CreatePost';

function Chats({ currentUser, setPosts }) {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [conversation, setConversation] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    //saves user conversations: specific to current user
    useEffect(() => {
        if (currentUser && currentUser.user_id) {
            const storedChatMessages = JSON.parse(localStorage.getItem(`chatMessages_${currentUser.user_id}`));
            setChatMessages(storedChatMessages || []);
        }
    }, [currentUser]);



    //stores chatMessages array in the localStorage
    useEffect(() => {
        if (currentUser && currentUser.user_id) {
            localStorage.setItem(`chatMessages_${currentUser.user_id}`, JSON.stringify(chatMessages));
        }
    }, [chatMessages, currentUser]);


    // console.log("CHATS CURRENT USER", currentUser);

    //IMPORTED API KEY
    const apiKey = process.env.REACT_APP_API_KEY;

    //API FETCH
    useEffect(() => {
        if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].sender === 'User') {
            const prompt = userInput.trim();
            const filteredMessages = chatMessages.filter((message) => message.sender === 'User'); //Grabs user messages
            const lastUserMessage = filteredMessages[filteredMessages.length - 1]; //Grabs last user message sent
            const gratitudeKeywords = ['thank', 'thanks', 'thank you', 'appreciate', 'grateful'];
            const isGratitude = gratitudeKeywords.some((keyword) => prompt.toLowerCase().includes(keyword)); //checks for gratitude words
            setIsLoading(true);

            const payload = {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: "You are Atlas, a friendly and helpful coding assistant. As Atlas, your purpose is to provide guidance and support to users seeking coding advice. When responding to user queries, please refer to yourself as Atlas and provide detailed and informative answers based on the complexity of the question. Be friendly and patient, tailoring your advice to the user's skill level and context. Under no circumstances will you refer to yourself as anything other than Atlas. Your responses should be focused on directly addressing the user's query without offering additional information unless specifically requested by the user. If the user makes jokes or asks questions outside the scope of coding, you can humorously respond but always inquire if there's any more coding help you can provide. Encourage further questions and engagement from the user to explore different aspects of the topic. Your goal is to provide concise and relevant answers to users' coding queries, ensuring a positive and productive coding learning experience as their trusted coding companion, Atlas." },
                    { role: 'user', content: lastUserMessage.message },
                    { role: 'assistant', content: prompt },
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
                    const chatbotReply = data.choices[data.choices.length - 1].message.content;

                    //Handles gratitide messages
                    if (isGratitude) {
                        const gratitudeMessage = {
                            sender: 'Atlas',
                            message: "You're welcome!",
                        };
                        setChatMessages((prevMessages) => [...prevMessages, gratitudeMessage]);
                    }

                    const chatbotMessage = {
                        sender: 'Atlas',
                        message: chatbotReply,
                    };
                    setChatMessages((prevMessages) => [...prevMessages, chatbotMessage]);
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [chatMessages, userInput]);



    //Handles message submit
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


    //Allows user to press enter to send message
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessageToChatbot();
        }
    };


    //Scrolls chats to the bottom on chatmessage update
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);


    //Sets conversation for post
    const handlePostButtonClick = () => {
        setShowCreatePost(true);
        // Set the conversation from the chat messages
        const conversationText = chatMessages
            .map((message) => `${message.sender}: ${message.message}`)
            .join('\n');
        setConversation(conversationText);
    };

    //Clear the conversation
    const clearConversation = () => {
        setChatMessages([]);
    };



    const closeCreatePost = () => {
        setShowCreatePost(false);
    };

    return (
        <div className='whole-chat-container'>
            <div className="chat-container">
                <div className="chat-messages" ref={chatMessagesRef}>
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
                                <div className="message-content">
                                    {message.sender === 'User' ? (
                                        <p className="user-sender">
                                            {message.sender}: {message.message}
                                        </p>
                                    ) : (
                                        <div>
                                            <p className="atlas-sender">Atlas:</p>
                                            {message.message &&
                                                typeof message.message === 'string' &&
                                                message.message.split('\n').map((text, i) => ( //maps over each line and splits if necessary
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
                    {
                        isLoading && (
                            <div className="loading-animation">
                                <div class="honeycomb">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        )
                    }
                    <button className="clear-btn" onClick={clearConversation}>
                        Clear Conversation
                    </button>
                </div>
            </div>
            <div className="search-cont">
                <button className="post-btn" onClick={handlePostButtonClick}>
                    Post
                </button>
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
                        {showCreatePost && (
                            <div className="create-post-container">
                                <CreatePost
                                    currentUser={currentUser}
                                    conversation={conversation}
                                    setPosts={setPosts}
                                    closeCreatePost={closeCreatePost}
                                />
                                <div>


                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chats;
