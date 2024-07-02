 import { useEffect, useState } from "react";
import "./sidebar.css"
import { FaEdit, FaSearch, FaPlus} from "react-icons/fa";
import DisplayUsers from "./DisplayUsers";

const Sidebar = ({ className, liftUpRecipient, communicationLog }) => {
    const [selectedRecipient, setSelectedRecipient] = useState(2);
    const [recipientList, setRecipientList] = useState([2, 3]);

    const handleUser = (e) =>{
        setSelectedRecipient(e.target.value)
    }
    useEffect(() => {
        liftUpRecipient(selectedRecipient);
    }, []);

    const handleSelectedUserChange = (user) => {
        setSelectedRecipient(user);
        liftUpRecipient(selectedRecipient);
    };
    //placeholder to select users
    const handleGo = (e) => {
        e.preventDefault();
        if (selectedRecipient) {
            console.log('im here');
            liftUpRecipient(selectedRecipient);
            setSelectedRecipient('');
        }
    }
    return (
        <div className="sidebar">
            <div className="profile-description">
                <img src="" alt="" />
                <div className="profile-info">
                    <p>alireza javid</p>
                    <p>Developer</p>
                </div>    
                <div id="edit-container">
                    <FaEdit/>
                </div>
                
            </div>
            <div>
                <input
                    type="text"
                    placeholder="search here.."
                />
                <FaSearch />
                <FaPlus />
            </div>
            {console.log('im in sidebar comLogs::::::::', communicationLog)}
            <form>
                <label htmlFor="chooseuser">choose user to message</label>
                <input 
                    type="text" 
                    value={selectedRecipient}
                    onChange={handleUser}
                    name="chooseuser" 
                    id=""
                    
                />
                <p>{selectedRecipient}</p>
                <button type="submit" onClick={handleGo}>go</button>
            </form>
            <DisplayUsers 
                recipientList = {recipientList}
                selectedRecipient = {selectedRecipient}
                handleSelectedUserChange = {handleSelectedUserChange}
            />
        </div>
    )
};

export default Sidebar;