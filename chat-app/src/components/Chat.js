import { useState } from "react";
import "./styles/chat.css"

const Chat = ({ className }) => {
    const [userInput, setUserInput] = useState('');
    const [chatLogs, setChatLogs] = useState([]);

    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setChatLogs([...chatLogs, userInput])
        setUserInput('');
    };

    const handleRemove = (index) => {
        setChatLogs(chatLogs.filter((_, i) => i !== index));
    };

    return (

        <div className="chat-container">

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