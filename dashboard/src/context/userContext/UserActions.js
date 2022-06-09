//GET USERS
export const getUsersStart = ()=>({
    type: "GET_USERS_START",
});

export const getUsersSuccess = (users)=>({
    type: "GET_USERS_SUCCESS",
    payload: users,
});

export const getUsersFailure = ()=>({
    type: "GET_USERS_FAILURE",
});

//DELETE USERS
export const deleteUsersStart = ()=>({
    type: "DELETE_USER_START",
});

export const deleteUsersSuccess = (users)=>({
    type: "DELETE_USER_SUCCESS",
    payload: users,
});

export const deleteUsersFailure = ()=>({
    type: "DELETE_USER_FAILURE",
});