import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [auth, setAuth] = useState({
        token: sessionStorage.getItem('authToken'),
        user: JSON.parse(sessionStorage.getItem('userData'))
    });

    const login = (token, user) =>{
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        setAuth({token, user});
    }

    const logout = (token, user) =>{
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        setAuth({token: null, user: null})
    };
    return(
        <AuthContext.Provider value ={{auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);