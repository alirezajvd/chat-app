 import { useState } from "react";
import "./styles/sidebar.css"

const Sidebar = ({ className, liftUpRecipient }) => {
    const [recipientId, setRecipientId] = useState('');

    const handleUser = (e) =>{
        setRecipientId(e.target.value)
        

    }
    const handleGo = (e) => {
        e.preventDefault();
        if (recipientId) {
            console.log('im here');
            liftUpRecipient(recipientId);
            setRecipientId('');
        }
    }
    return (
        <div className="sidebar">
            <form>
                <label htmlFor="chooseuser">choose user to message</label>
                <input 
                    type="text" 
                    value={recipientId}
                    onChange={handleUser}
                    name="chooseuser" 
                    id=""
                    
                />
                <p>{recipientId}</p>
                <button type="submit" onClick={handleGo}>go</button>
            </form>
        </div>
    )
};

export default Sidebar;