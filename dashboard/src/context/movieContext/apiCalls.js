import { getMoviesFailure, getMoviesStart, getMoviesSuccess, deleteMovieStart,
         deleteMovieSuccess, deleteMovieFailure, createMovieStart, createMovieSuccess,
         createMovieFailure} from "./MovieActions";
import axios from 'axios';
/// GET MOVIES
export const getMovies = async (dispatch)=>{
    dispatch(getMoviesStart());
    try{
        const res = await axios.get("/movie", { 
            headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
        });
        dispatch(getMoviesSuccess(res.data));
    }catch(err){
        dispatch(getMoviesFailure());
    }
}
/// CREATE MOVIE
export const createMovies = async (movie, dispatch)=>{
    dispatch(createMovieStart());
    try{
        const res = await axios.post("/movie", movie, { 
            headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
        });
        dispatch(createMovieSuccess(res.data));
    }catch(err){
        dispatch(createMovieFailure());
    }
}

/// DELETE MOVIES
export const deleteMovies = async (id, dispatch)=>{
    dispatch(deleteMovieStart());
    try{
        await axios.delete("/movie/" + id, { 
            headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
        });
        dispatch(deleteMovieSuccess(id));
    }catch(err){
        dispatch(deleteMovieFailure());
    }
}