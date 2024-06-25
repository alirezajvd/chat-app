import { Link } from "react-router-dom";
import useForm from "./useForm";

const LogIn = () =>{
    const { formData, handleChange, handleSubmit } = useForm();

    return(
        <div>
            <form onSubmit={handleSubmit} >
                <h1>Login here</h1>
                <label htmlFor="userId">User name</label>
                <input 
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="Password">Password</label>
                <input 
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">LOGIN</button>
            </form>
            <p>user:{formData.username}</p>
            <p>pass:{formData.password}</p>
            <Link to="/signup">
                <button>signup</button>
            </Link>
            
        </div>
    );
}

export default LogIn;