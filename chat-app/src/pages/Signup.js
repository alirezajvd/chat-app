import { Link, useNavigate } from "react-router-dom";
import useForm from "../components/useForm";
import { useAuth } from "../AuthContext";
import './styles/login.css'

const SignUp = () =>{
    const { formData, handleChange } = useForm();

    const {login} = useAuth()
    const navigate = useNavigate();

    const handleSignUp = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if (response.ok){
                const data = await response.json();
                console.log('successful :))', data);
                login(data.accessToken, data.username);
                navigate('/home');
            }
            else if(response.status === 409)
            {
                const errorData = await response.json();
                console.log('Username already exist:', errorData.error);
                alert('Username already exists! try to login or choose a different username')
            }
            else
            {
                console.log(response.status);
                console.log('invalid input');
            }
        } catch (error) {
            console.log('didnt get there :(');
        }
    }

    return(
        <div className="form-container">
            <form onSubmit={handleSignUp}  >
                <h1>Sign Up </h1>
                <label htmlFor="userId">User name</label>
                <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username here"
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
                <button type="submit">SIGN UP</button>
            </form>
            <span className="no-account">already have an account </span>
            <Link to="/login">
                <span className="sign-link">Login</span>
            </Link>

        </div>
    )
}

export default SignUp;