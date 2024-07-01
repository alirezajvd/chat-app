import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../AuthContext.js";
import recipinetimg from "./7309681.jpg"
import "./chat.css"
import TextBubble from "./TextBubble.js";

const Chat = ({ className, recipientId }) => {
    const [userInput, setUserInput] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    // const [isTyping, setIsTyping] = useState(false)
    const {auth} = useAuth();
    const userId = auth.userId;
    const token = auth.token;
    const chatContainsRef = useRef(null);
    const ws = useRef(null)
    
    const handleTyping = (e) => {
        setUserInput(e.target.value);
        // ws.current.send(JSON.stringify({isTyping: true}))
    };

    //websocket checking message update
    useEffect(() =>{
        

        ws.current = new WebSocket('ws://localhost:8000');

        ws.current.onopen = () => {
            console.log('websocket connected');
        };

        ws.current.onmessage = (event) =>{
            console.log('Received websocket: ', event.data);
            const message = JSON.parse(event.data);
            if (message.type === 'message') {
                setChatLogs(prevChatLogs => [...prevChatLogs, message])
            }

        };

        ws.current.onclose = () => {
            console.log('Websocket disconnected');
        };

        ws.current.error = (error) => {
            console.error('Websocket err', error);
        };

        return () =>{
            ws.current.close();
        };
    },[recipientId]);

    //scrolls down when user puts a message in
    useEffect(() => {
        if (chatContainsRef.current) {
            chatContainsRef.current.scrollTop = chatContainsRef.current.scrollHeight;
        }
    }, [chatLogs])

    //GETS MESSAGES// sends (token) expects data{chatLogs{id, content}}


    useEffect(()=>{
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/home/${userId}/messages/${recipientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                const data = await response.json();
                if (response.ok) {
                    console.log("data recieved from server:", data);
                    setChatLogs(data);
                } else {
                    console.log('didnt get the messages');
                }
            } catch (error) {
                console.log('server not reached');
            }
        };
        if (recipientId && token && userId) {
            fetchMessages();
        }
    },[userId, token, recipientId]);

    //SEND MESSAGES// sends (userInput, userId) expects(data{id, successfull respones})
    const sendMessage = async (e) => {
        e.preventDefault();

        if (userInput !== '') {
            try {
                const response = await fetch(`http://localhost:8000/home/${userId}/messages`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({message: userInput, userId, recipientId})
                });
                const data = await response.json();
                if (response.ok) {
                    const newMessage = {
                        id: data.id, 
                        content: userInput, 
                        recipientId: parseInt(recipientId),
                        userId: parseInt(userId),
                        type: 'message'    
                        };
                    setChatLogs([...chatLogs, {id: data.id, content:userInput}]);
                    ws.current.send(JSON.stringify(newMessage));
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
            const response = await fetch(`http://localhost:8000/home/${userId}/messages/${messageId}`, {
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

            <div className="header-recipient">
                <img src={recipinetimg} alt="user"/>
                <p>user1</p>
            </div>
            {chatLogs.map((message, index) => (
                <TextBubble
                    className={parseInt(userId) === message.recipientId ? "text-bubble-recipient": "text-bubble-user"}
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
            <p>hello {recipientId}</p>
        </div>
    )
}

export default Chat;