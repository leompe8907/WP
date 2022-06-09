import axios from 'axios'
import { loginFailure, loginStart, loginSuccess, logOut } from './AuthActions';

export const login = async (user, dispatch)=>{
    dispatch(loginStart());
    try{
        const res = await axios.post("auth/login", user);
        res.data.isAdmin && dispatch(loginSuccess(res.data));
    }catch(err){
        dispatch(loginFailure(err));
    }
};

export const logout = async (dispatch)=>{
    dispatch(logOut());
    localStorage.setItem("user", null);
    
};