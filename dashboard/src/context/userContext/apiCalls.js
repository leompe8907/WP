import axios from "axios";
import { deleteUsersFailure, deleteUsersStart, deleteUsersSuccess, getUsersFailure, getUsersStart, getUsersSuccess } from "./UserActions";

/// GET USERS
export const getUsers = async (dispatch)=>{
    dispatch(getUsersStart());
    try{
        const res = await axios.get("/user", { 
            headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
        });
        dispatch(getUsersSuccess(res.data));
    }catch(err){
        dispatch(getUsersFailure());
    }
}

//DELETE USER

export const deleteUser = async (id, dispatch)=>{
    dispatch(deleteUsersStart());
    try{
        await axios.delete("/user/" + id, { 
            headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
        });
        dispatch(deleteUsersSuccess(id));
    }catch(err){
        dispatch(deleteUsersFailure());
    }
}