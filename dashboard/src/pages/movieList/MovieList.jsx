import './movieList.scss'
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {MovieContext} from "../../context/movieContext/MovieContext"
import {deleteMovies, getMovies} from "../../context/movieContext/apiCalls"

export  const MovieList = ()=>{

    const {movies, dispatch} = useContext(MovieContext);

    useEffect(()=>{
        getMovies(dispatch);
    },[dispatch])

    const handleDelete = (id)=>{
        if(window.confirm("You are about to delete a movie. Do you want to procede?")) deleteMovies(id, dispatch);
        
    }
    const columns = [
        { field: '_id', headerName: 'ID', width: 70 },
        { field: 'movie', headerName: 'Movie', width: 200, renderCell: (params)=>{
            return(
                <>
                    <div className="movieListName">
                        <img src={params.row.img} alt=''/>
                        {params.row.title}
                    </div>
                </>
            )
        }},
        { field: 'genre', headerName: 'Genere', width: 120 },
        { field: 'limit', headerName: 'Duration', width: 120 },
        { field: 'year', headerName: 'year', width: 120 },
        { field: 'isMovie', headerName: 'isMovie', width: 120 },
      
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            renderCell: (params)=>{
                return(
                    <>
                        <Link to={{pathname:"/movies/" + params.row._id, search: JSON.stringify(params.row)}}>
                            <button className="movieListEditButton">Editar</button>
                        </Link>
                        <DeleteOutline className='deleteMovieActionButton' onClick = {()=>handleDelete(params.row._id, dispatch)}/>
                    </>
                )
            }
        },
      ];
    return(
        <div className='movieList'>
            <DataGrid
                rows={movies}
                columns={columns}
                pageSize={8}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={r=>r._id}
            />
        </div>
    )
} 