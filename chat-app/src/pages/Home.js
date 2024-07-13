import { useEffect, useRef, useState } from "react"
import Sidebar from "../components/Home/Sidebar/Sidebar"
import Chat from "../components/Home/Chat/Chat"
import "./styles/home.css"
import { useAuth } from "../AuthContext"

//remember: communication log is an array of objects that has properties :
    // last_message (from a previous user) 
    // last_message_timestamp, 
    // recipient_id, 
    // recipient_username 
//all this is used to show info in sidebar 
const Home = () => {
    const [shareRecipient, setShareRecipient] = useState('');
    const [communicationLog, setCommunicationLog] = useState([]);
    const {auth} = useAuth();
    const {token, userId} = auth;
    const ws =useRef(null)

    //UPDATE USER HISTORY// updates communication log with ws 
    //*this websocket is anchored to the other one in chat.js which means this only triggers
    //when a message is sent 
    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000");

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            console.log('UPDATED DATA I GOT WEBSOCKET 2:::', message , message.type);

            //trigger when a message is sent to *this user* REFER TO chat.js ws for more info
            if (message.type === 'message') {
                
                fetchCommunicationLog();
            }    
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.current.close();
        };

    }, [userId, token]);

    //fetch function to get communication log using http get
    const fetchCommunicationLog = async () => {
        try {
            const response = await fetch(`http://localhost:8000/home/${userId}/communication-log`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                
                console.log('communication log::::::::::', data);
                setCommunicationLog(data);
                //ws.current.send(JSON.stringify({ type: 'recipient', data }));
                
            } else {
                console.log('Failed to fetch Communication log');
            }
        } catch (error) {
            console.log('Server not reached');
        }
    };

    //starts communication log at the start of page
    useEffect(() =>{
        if (userId && token) {
            fetchCommunicationLog();
        }
    },[userId, token])

    const getHomeRecipient = (newRecipient) =>{
        setShareRecipient(newRecipient);
    }

    return (
        <div className="home-container">
            <Sidebar 
                className="sidebar"
                liftUpRecipient = {getHomeRecipient} 
                communicationLog = {communicationLog}
                
            />
            <Chat 
                className="chat-container" 
                recipientId = {shareRecipient}
            />
        </div>
    )
}
export default Home;