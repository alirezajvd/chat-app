import { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import "./styles/chat.css"


import TextBubble from "./TextBubble.js";

const Chat = ({ className }) => {
    const [userInput, setUserInput] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    const {auth} = useAuth();
    const userId = auth.userId;
    const token = auth.token;
    const chatContainsRef = useRef(null);
    
    const handleTyping = (e) => {
        setUserInput(e.target.value);
    };

    //scrolls down when user puts a message in
    useEffect(() => {
        if (chatContainsRef.current) {
            chatContainsRef.current.scrollTop = chatContainsRef.current.scrollHeight;
        }
    }, [chatLogs])

    //GETS MESSAGES// sends (token) expects data{chatLogs{id, content}}
    useEffect(()=>{
        const fetchMessages = async () =>{
            try {
                const response = await fetch(`http://localhost:5000/home/${userId}/messages`,{
                    method: 'GET',
                    headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json();
                if (response.ok) {
                    setChatLogs(data);
                }else{
                    console.log('didnt get the messages');
                }   
            } catch (error) {
                console.log('server not reached');
            }
        }
        fetchMessages();
    },[userId,token]);


    //STORE MESSAGES// stores sends (userInput, userId) expects(data{id, successfull respones})
    const sendMessage = async (e) => {
        e.preventDefault();

        if (userInput !== '') {
            try {
                const response = await fetch(`http://localhost:5000/home/${userId}/messages`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({message: userInput, userId})
                });
                const data = await response.json();
                if (response.ok) {
                    setChatLogs([...chatLogs, {id: data.id, content:userInput}])
                    setUserInput('');
                }else{
                    console.log('Invalid chat text somehow');
                }
                
            } catch (error) {
                console.log('server not reached')
            }
        }
    };

    //removes message// sends (token, messageid) expects chatlogs
    const removeMessages = async (messageId, index) => {
        try {
            const response = await fetch(`http://localhost:5000/home/${userId}/messages/${messageId}`, {
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) { 
                const updatedLog = [...chatLogs];
                updatedLog.splice(index,1);
                setChatLogs(updatedLog);                
            }
            else{
                console.log('Failed to delete');
            }

        } catch (error) {
            console.log('cant get to server');
        }
    };


    return (
        <div className="chat-container" ref={chatContainsRef}>
            {chatLogs.map((message, index) => (
                <TextBubble
                    key={message.id}
                    message = {message}
                    index={index}
                    removeMessages={removeMessages}
                />
            ))}

            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={userInput}
                    onChange={handleTyping}
                    placeholder="Write Something here..."
                />
                <button type="submit">send</button>
            </form>
        </div>
    )
}

export default Chat;