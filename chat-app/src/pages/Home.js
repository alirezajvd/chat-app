import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
import "./styles/home.css"


const Home = () => {
    const [shareRecipient, setShareRecipient] = useState('')

    const getHomeRecipient = (newState) =>{
        setShareRecipient(newState);
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