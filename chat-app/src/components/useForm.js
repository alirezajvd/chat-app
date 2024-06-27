import { useState } from "react";
import { useAuth } from "../AuthContext";


const useForm = (callback) =>{
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        console.log(JSON.stringify(formData));
        try{
            const response = await fetch("http://localhost:5000/", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok){
                const data = await response.json();
                console.log('Login Successful:', data);

                login(data.accessToken, data.username, data.userId)
                callback("/home");
            }
            else if (response.status === 500) {
                alert('please try again later')
            }
            else if (response.status === 401) {
                alert('invalid username or password')
            }
            else{
                console.error('invalid', response.statusText);
            }
        }catch(error){
            console.error('Error during login', error)
        };

        setFormData({
            username: "",
            password: ""
        })
    }

    return{
        formData,
        handleChange,
        handleSubmit
    }
}

export default useForm;