import { FaCheck } from "react-icons/fa"
import "./displayUsers.css"

const DisplayUsers = ({recipientList, selectedRecipient, handleSelectedUserChange}) =>{
    const handleRecipientChange = (id) => {
        // console.log(id);
        handleSelectedUserChange(id);
    }


    return(
        <div>
            {recipientList.length !== 0 && recipientList.map((userId) =>(
                <div 
                    className="users-container"
                    key={userId}
                    onClick={() => handleRecipientChange(userId)}
                >
                    <img src="../../../7309681.jpg" alt="" />
                    <div className="info-container">
                        <p>Name Lastname</p>
                        <p>I message you pick up</p>
                    </div>
                    <div className="extra-container">
                        <p>12:24</p>
                        <FaCheck />
                    </div>

                </div>
            ))}
        </div>
    )
}

export default DisplayUsers;