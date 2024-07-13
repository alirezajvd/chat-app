import { useState } from "react";
import {FaSearch, FaPlus} from "react-icons/fa";
import { useAuth } from "../../../AuthContext";

const SearchUser = ({handleLiftSearch}) =>{
    const [searchInput, setSearchInput] = useState('');
    const {auth} = useAuth()
    const {token} = auth;

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

   

    const searchForUser = async (e) => {
        e.preventDefault();

        if (searchInput){
            try {
                const response = await fetch(`http://localhost:8000/home/search-user?username=${searchInput}`,{
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok){
                    const data = await response.json();
                    console.log('RESPONSE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data);
                    handleLiftSearch(data.id)
                }
                else if(response.status === 404){
                    console.log('user not found');
                }else{
                    console.log('invalid username');
                }
                
            } catch (error) {
                console.error("Server Error", error);
            }
        }
    };

    return (
        <form onSubmit={searchForUser}>
            <input
                type="text"
                placeholder="search here.."
                value={searchInput}
                onChange={handleSearchChange}
            />
            <p>{searchInput}</p>
            <button 
                type="submit"
                
            >
                <FaSearch />
            </button>
           
            <FaPlus />
            
        </form>
    )
}

export default SearchUser;