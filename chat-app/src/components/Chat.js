import { useState } from "react";

const Chat = () =>{
    const [userInput, setUserInput] = useState('');
    const [chatLogs, setChatLogs] = useState([]);

    const handleChange = (e) =>{
        setUserInput(e.target.value);
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        setChatLogs([...chatLogs, userInput])
        setUserInput('');
    }



    return(
        <div>
            chat up here hmmmmmmmmm
            {chatLogs.map((content, index) => (
                <div key={index}>
                    <p>entered: {content}</p>
                </div>
            ))}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={handleChange}
                />
                <button type="submit">oik</button>
            </form>


        </div>
        
    )
}

export default Chat;