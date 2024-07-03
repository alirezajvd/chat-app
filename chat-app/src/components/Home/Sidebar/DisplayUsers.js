import { FaCheck } from "react-icons/fa"
import "./displayUsers.css"

const DisplayUsers = ({recipientList, selectedRecipient, handleSelectedUserChange}) =>{
    const handleRecipientChange = (id) => {
        // console.log(id);
        handleSelectedUserChange(id);
    }


    return(
        <div>
            {recipientList.length !== 0 && recipientList.map((obj) =>(
                <div 
                    className="users-container"
                    key={obj.partner_id}
                    onClick={() => handleRecipientChange(obj.partner_id)}
                >
                    <img src="../../../7309681.jpg" alt="" />
                    <div className="info-container">
                        <p>{obj.partner_username} #{obj.partner_id}</p>
                        <p>{obj.last_message}</p>
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