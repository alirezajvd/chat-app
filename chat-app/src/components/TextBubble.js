import {useState, useEffect, useRef, useCallback} from "react";
import './styles/textbubble.css'
import { FaRegTrashAlt, FaEllipsisV } from "react-icons/fa";



const TextBubble = ({message, index, removeMessages}) =>{
    
    const [visibleEllipsis, setVisibleEllipsis] = useState(false);
    const ellipsisRef = useRef(null);


    useEffect(() =>{
        console.log('im is useEffect');

        const handleClickOutside = (e) =>{
            console.log('im in click outside');
            if (ellipsisRef.current && !ellipsisRef.current.contains(e.target)) {
                setVisibleEllipsis(false)
            }
        };

        document.addEventListener("click",  handleClickOutside);
        return () =>{
            document.removeEventListener("click", handleClickOutside)
        };
    }, []);

    const handleToggleEllipsis = useCallback(() => {
        setVisibleEllipsis(prevVisibleEllipsis => !prevVisibleEllipsis);
        console.log("Visibility toggled:", !visibleEllipsis);
    }, [visibleEllipsis]);

    
    const handleDeleteMessage = (e) =>{
        e.stopPropagation();
        removeMessages(message.id, index)
    }
    

    return (
        <div className="text-bubble-container" key={index}>
            {visibleEllipsis  && (               
                <div className="ellipsis-container"  ref={ellipsisRef}>                
                    <h3>{console.log('im here help')}
                        <FaRegTrashAlt
                            onClick={handleDeleteMessage}
                            className="delete-icon"
                        />
                    </h3>           
                </div>
            )}
            <FaEllipsisV
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