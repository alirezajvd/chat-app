import { useEffect, useRef, useState } from "react"
import Sidebar from "../components/Home/Sidebar/Sidebar"
import Chat from "../components/Home/Chat/Chat"
import "./styles/home.css"


const Home = () => {
    const [shareRecipient, setShareRecipient] = useState('');
    const [communicationLog, setCommunicationLog] = useState('');
    const ws = useRef(null);


    //GETS USER HISTORY// gets recipient id, username, last message timestamp and list of recipients
    useEffect(() =>{
        ws.current = new WebSocket('ws://localhost:8000');

        ws.current.onopen = () =>{
            console.log('Websocket 2 connected');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'recipient') {

                console.log('hoooraaaaaa im in msg type');
                setCommunicationLog(prevLog => [...prevLog, message]);
            }
        };

        ws.current.onclose = () =>{
            console.log('WebSocket 2 disconnected');
        };

        ws.current.onerror = (error) => {
            console.error('Websocket 2 error', error);
        };

        return () => ws.current.close();
    },[])


    const getHomeRecipient = (newRecipient) =>{
        setShareRecipient(newRecipient);
    }

    return (
        <div className="home-container">
            <Sidebar 
                className="sidebar"
                liftUpRecipient = {getHomeRecipient} 
                
            />
            <Chat 
                className="chat-container" 
                recipientId = {shareRecipient}
            />
        </div>
    )
}
export default Home;