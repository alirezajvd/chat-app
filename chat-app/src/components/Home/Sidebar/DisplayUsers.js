import moment from 'moment';
import 'moment-timezone';
import { FaCheck } from "react-icons/fa"
import "./displayUsers.css"

const DisplayUsers = ({recipientList, selectedRecipient, handleSelectedUserChange}) =>{
    const handleRecipientChange = (id) => {
        // console.log(id);
        handleSelectedUserChange(id);
    }


    const formatTime = (timestamp) => {
        if (!timestamp) return ''; 

        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const momentDate = moment.utc(timestamp).tz(userTimezone);
        const storeHours = momentDate.format('HH:mm');
        
        // Get current moment in Pacific Time
        const now = moment().tz(userTimezone);

        // Calculate difference in days using local time
        const diffDays = now.startOf('day').diff(momentDate.startOf('day'), 'days');

        if (diffDays === 0) {
            return storeHours; //eg. 22:06
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else {
            return momentDate.format('DD MMM'); // Example: 03 Jul
        }
    };


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
                        <p>{formatTime(obj.last_message_timestamp)} </p>
                        <FaCheck />
                    </div>

                </div>
            ))}
        </div>
    )
}

export default DisplayUsers;