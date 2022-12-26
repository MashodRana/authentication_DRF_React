import { createContext, useState, useEffect, useHistory } from "react";
import jwt_decode from 'jwt-decode'


const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
    const token = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')): null ;

    const [authTokens, setAuthtokens] = useState(token);
    const [user, setUser] = useState(token);
    const [loading, setLoading] = useState(true)
    
    const history = useHistory();

    const loginUser = async (username, password)=>{
        const res = await fetch("http://127.0.0.1:8000/api/token/", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await res.json();
        if (res.status === 200){
            setAuthtokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            history.push('/');

        }
        else{
            alert("Something went wrong!!!");
        }
    }

    const registerUser = async(username, password, password2)=>{
        const url = "http://127.0.0.1:8000/api/register/";
        const res = await fetch(url, {
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                username,
                password,
                password2
            })
        });

        if (res.status===201){
            history.push('/login');
        }
        else{
            alert("Something went wrong!!");
        }        
    };
    const logoutUser = ()=>{
        setAuthtokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        history.push("/");
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthtokens,
        registerUser,
        loginUser,
        logoutUser
    };
    
    useEffect(()=>{
        if(authTokens){
            setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );

};