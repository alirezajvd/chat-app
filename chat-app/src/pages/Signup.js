import useForm from "./useForm";

const SignUp = () =>{
    const { formData, handleChange } = useForm();

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
        <div>
            <form onSubmit={handleSignUp} >
                <h1>Sign up here</h1>
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
                <button type="submit">SIGN UP</button>
            </form>
            <p>user:{formData.username}</p>
            <p>pass:{formData.password}</p>
        </div>
    )
}

export default SignUp;