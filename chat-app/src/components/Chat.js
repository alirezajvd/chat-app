import { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import "./styles/chat.css"

const Chat = ({ className }) => {
    const [userInput, setUserInput] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    const {auth} = useAuth();
    const chatContainsRef = useRef(null);
    
    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        const userId = auth.userId;
        const token = auth.token;
        e.preventDefault();

        if (userInput !== '') {
            try {
                const response = await fetch("http://localhost:5000/home",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({message: userInput, userId})
                });
                const data = await response.json();
                if (response.ok) {
                    setChatLogs([...chatLogs, userInput])
                    setUserInput('');
                }else{
                    console.log('Invalid chat text somehow');
                }
                
            } catch (error) {
                console.log('server not reached')
            }
        }
    };

    const handleRemove = (index) => {
        setChatLogs(chatLogs.filter((_, i) => i !== index));
    };

    //scrolls down when user puts a message in
    useEffect(() =>{
        if (chatContainsRef.current) {
            chatContainsRef.current.scrollTop = chatContainsRef.current.scrollHeight;
        }
    }, [chatLogs])
    return (

        <div className="chat-container" ref={chatContainsRef}>

            {chatLogs.map((content, index) => (
                <div className="text-bubble" key={index}>
                    <p>entered: {content}</p>
                    <button onClick={() => handleRemove(index)}>remove</button>
                </div>
            ))}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={handleChange}
                />
                <button type="submit">send</button>
            </form>


            <p>entered: {userInput}</p>
        </div>

    )
}

export default Chat;