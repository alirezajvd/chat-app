import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [auth, setAuth] = useState({
        token: sessionStorage.getItem('authToken'),
        user: JSON.parse(sessionStorage.getItem('userData')),
        userId: sessionStorage.getItem('userId')

    });

    const login = (token, user, userId) =>{
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        sessionStorage.setItem('userId', userId);
        setAuth({ token, user, userId });
    }

    const logout = (token, user) =>{
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userId')
        setAuth({token: null, user: null, userId: null})
    };
    return(
        <AuthContext.Provider value ={{auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);