import {useState, useEffect, useRef} from "react";
import './textbubble.css'
import { FaRegTrashAlt, FaEllipsisV } from "react-icons/fa";



const TextBubble = ({className, message, index, removeMessages}) =>{
    
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

    return (
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
            </div>
            
        </div>
    );
};

export default TextBubble;