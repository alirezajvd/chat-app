import {useState, useEffect, useRef} from "react";
import './styles/textbubble.css'
import { FaRegTrashAlt, FaEllipsisV } from "react-icons/fa";



const TextBubble = ({message, index, removeMessages}) =>{
    
    const [visibleEllipsis, setVisibleEllipsis] = useState(false);
    const ellipsisRef = useRef(null);


    useEffect(() =>{
        const handleClickOutside = (e) =>{
            console.log('im in click outside');
            if (ellipsisRef.current && !ellipsisRef.current.contains(e.target)) {
                setVisibleEllipsis(false)
            }
        };
        if (visibleEllipsis) {
            document.addEventListener("mousedown",  handleClickOutside);
        }else{
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () =>{
            document.removeEventListener("mousedown", handleClickOutside);
            
        };

    }, [visibleEllipsis]);

    const handleToggleEllipsis = (e) => {
        e.stopPropagation();
        setVisibleEllipsis(prevVisibleEllipsis => !prevVisibleEllipsis);
    };

    
    const handleDeleteMessage = (e) =>{
        e.stopPropagation();
        removeMessages(message.id, index);
    }
    

    return (
        <div className="text-bubble-container" key={index}>
            {visibleEllipsis  && (               
                <div className="ellipsis-container"  ref={ellipsisRef}>                
                    <h3>
                        <FaRegTrashAlt
                            onClick={handleDeleteMessage}
                            className="delete-icon"
                        />
                    </h3>           
                </div>
            )}
            <FaEllipsisV
                onMouseDown= {(e) => e.stopPropagation()}
                onClick={handleToggleEllipsis}
                className="ellipsis-icon"
            />
            <div className="text-bubble">
                 <p>{message.content}</p> 
            </div>
        </div>
    );
};

export default TextBubble;