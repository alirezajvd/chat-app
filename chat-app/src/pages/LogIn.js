import { Link, useNavigate} from "react-router-dom";
import useForm from "../components/useForm";
import './styles/login.css'

const LogIn = () =>{

    const navigate = useNavigate();
    const handleRedirect = (path) => {
        navigate(path);
    }

    const { formData, handleChange, handleSubmit } = useForm(handleRedirect);

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit} >
                <h1>Login</h1>
                <label htmlFor="userId">Username</label>
                <input 
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                />
                <label htmlFor="Password">Password</label>
                <input 
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
                <button type="submit">LOGIN</button>
            </form>
            <p className="signup-use">Or signup using</p>

            <span className="no-account">don't have an accout? </span>
            <Link to="/signup">
                <span className="sign-link">SIGN UP</span>
            </Link>
            
        </div>
    );
}

export default LogIn;