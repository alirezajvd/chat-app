import {useState, useEffect, useRef} from "react";
import './textbubble.css'
import { FaRegTrashAlt, FaEllipsisV } from "react-icons/fa";
import moment from 'moment';
import 'moment-timezone';


const TextBubble = ({className, message, index, removeMessages, previousMessageTimestamp}) =>{
    
    const [visibleTrashIcon, setVisibleTrashIcon] = useState(false);
    const [visibleEllipsis, setVisibleEllipsis] = useState(false)
    const [showDelivered, setShowDelivered] = useState(false);
    const [showSeen, setShowSeen] = useState(false);
    const ellipsisRef = useRef(null);


    
    useEffect(() =>{
        const handleClickOutside = (e) =>{
            console.log('im in click outside');
            if (ellipsisRef.current && !ellipsisRef.current.contains(e.target)) {
                setVisibleTrashIcon(false)
            }
        };
        if (visibleTrashIcon) {
            document.addEventListener("mousedown",  handleClickOutside);
        }else{
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () =>{
            document.removeEventListener("mousedown", handleClickOutside);
            
        };

    }, [visibleTrashIcon]);

    const handleToggleEllipsis = (e) => {
        e.stopPropagation();
        setVisibleTrashIcon(prevVisibleTrashIcon => !prevVisibleTrashIcon);
    };

    
    const handleDeleteMessage = (e) =>{
        e.stopPropagation();
        removeMessages(message.id, index);
    };
    
    const toggleEllipsis = (e) =>{
        e.stopPropagation();
        setVisibleEllipsis(prevVisibleEllipsis => !prevVisibleEllipsis)
    };

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

    const shouldShowDateLine = () => {
        if (!previousMessageTimestamp) return true;
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const currentMessageDate = moment.utc(message.timeStamp).tz(userTimezone).format('YYYY-MM-DD');
        const previousMessageDate = moment.utc(previousMessageTimestamp).tz(userTimezone).format('YYYY-MM-DD');
        console.log(previousMessageDate);
        return currentMessageDate !== previousMessageDate;
    };

    return (
        <>
            {shouldShowDateLine() && (
            <div className="date-line">
                {moment.utc(message.timeStamp).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'TODAY' : moment.utc(message.timeStamp).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD MMM')}
            </div>
            )}
            <div 
                className={`text-bubble-container ${className}`} 
                key={index}
                onClick={toggleEllipsis}
            >
                {visibleTrashIcon  && (               
                    <div className="ellipsis-container"  ref={ellipsisRef}>                
                        <h3>
                            <FaRegTrashAlt
                                onClick={handleDeleteMessage}
                                className="delete-icon"
                            />
                        </h3>           
                    </div>
                )}
                { visibleEllipsis && (
                <FaEllipsisV
                    onMouseDown= {(e) => e.stopPropagation()}
                    onClick={handleToggleEllipsis}
                    className="ellipsis-icon"
                />
                )}
                <div className="text-bubble">
                    <p>{message.content}</p> 
                    <p>{formatTime(message.timeStamp)}</p>
                </div>
                
            </div>
        </>
    );
};

export default TextBubble;