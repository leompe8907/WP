const UserReducer = (state, actions) =>{
    switch (actions.type){
        
        case "GET_USERS_START":
            return{
                users:[],
                isFetching: true,
                error: false,
            };
        case "GET_USERS_SUCCESS":
            return{
                users: actions.payload,
                isFetching: false,
                error: false,
            };
        case "GET_USERS_FAILURE":
            return{
                users:[],
                isFetching: false,
                error: true,
            };
////////////////// DELETE USERS //////////////////////////////////
        case "DELETE_USER_START":
            return{
                ...state,
                isFetching: true,
                error: false,
            };
        case "DELETE_USER_SUCCESS":
            return{
                users: state.movies.filter((user)=>user.id !== actions.payload),
                isFetching: false,
                error: false,
            };
        case "DELETE_USER_FAILURE":
            return{
                ...state,
                isFetching: false,
                error: true,
            };
            
        default:
            return {...state};
    }
}
export default UserReducer;