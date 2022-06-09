import './newMovie.scss'
import { Link } from 'react-router-dom'
import storage from '../../fireBaseConfig';
import { Publish } from '@material-ui/icons';
import { useState, useContext } from 'react';
import { createMovies } from '../../context/movieContext/apiCalls';
import { MovieContext } from '../../context/movieContext/MovieContext';

export const NewMovie = ()=>{
    const [movie, setMovie] = useState({});
    const {dispatch} = useContext(MovieContext);
    const [img, setImg] = useState({});
    const [imgTitle, setImgTitle] = useState({});
    const [imgThumbnail, setimgThumbnail] = useState({});
    const [trailer, setTrailer] = useState({});
    const [video, setVideo] = useState({});
    const [fileCount, setFileCount] = useState(0);
    const handleChange = (e)=>{
        const value = e.target.value;
        setMovie({...movie, [e.target.name]: value});
    };

    const upload = (items) => {
        items.forEach(item => {
            const fileName = new Date().getTime() + item.label + item.file.name;
            const uploadTask = storage.ref(`/content/${fileName}`).put(item.file);
            uploadTask.on(
                "state_changed", 
                snapshot=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                    console.log("Upload is " + progress + "% done");
                },
                (err)=>{
                    console.log(err);
                },
                ()=>{
                    uploadTask.snapshot.ref.getDownloadURL().then(url=>{
                        setMovie((prev)=>{
                            return {...prev, [item.label] : url};
                        });
                        setFileCount((prev)=>prev+1);
                    });
                }
            );
        });
    }

    const handleCreate = (e)=>{
        e.preventDefault();
        createMovies(movie, dispatch);
    }

    const handleUpload = (e) => {
        e.preventDefault();
        upload([
            {file : img, label: "img"},
            {file : imgTitle, label: "imgTitle"},
            {file : imgThumbnail, label: "imgThumbnail"},
            {file : trailer, label: "trailer"},
            {file : video, label: "video"}
        ]);
    }
    return(
        <div className="newMovie">
            <div className="newMovieContainer">
                <form className="MovieForm">
                    <div className="newMovieItems">
                    
                        <div className="movieUpload">
                            <label For="imgThumbnail">
                                Thumbnail Imgage <span style={{cursor:"pointer"}}><Publish/></span>
                            </label>
                            <input type="file"  style={{display: "none"}} id="imgThumbnail" onChange={e=>setimgThumbnail(e.target.files[0])}/>
                        </div>
                        <div className="movieUpload">
                            <label For="imgTitle">
                                Title Imgage <span style={{cursor:"pointer"}}><Publish/></span>
                            </label>
                            <input type="file"  style={{display: "none"}} id="imgTitle" onChange={e=>setImgTitle(e.target.files[0])}/>
                        </div>
                        <div className="movieUpload">
                            <label For="img">
                                Image  <span style={{cursor:"pointer"}}><Publish/></span>
                            </label>
                            <input type="file"  style={{display: "none"}} id="img" onChange={e=>setImg(e.target.files[0])}/>
                        </div>
                        <div className="movieUpload">
                            <label For="trailer">
                                Movie Trailer <span style={{cursor:"pointer"}}><Publish/></span>
                            </label>
                            <input type="file"  style={{display: "none"}} id="trailer" onChange={e=>setTrailer(e.target.files[0])}/>
                        </div>
                        <div className="movieUpload">
                            <label For="video">
                                Movie Video <span style={{cursor:"pointer"}}><Publish/></span>
                            </label> 
                            <input type="file" style={{display: "none"}} id="video" onChange={e=>setVideo(e.target.files[0])}/>
                        </div>
                        <div className="newMovieItemContainer">
                            <label>Is a Movie</label>
                            <select name='Is Movie' id='Is Movie'>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                        </select>
                        </div>
                        <div className="newMovieItemContainer">
                            <label> Movie Title</label>
                            <input type="text" placeholder='Superman' onChange={handleChange} name="title"/>
                        </div>
                        <div className="newMovieItemContainer">
                            <label> Description </label>
                            <input type="text" placeholder='Superman' onChange={handleChange} name="desc"/>
                        </div>
                        <div className="newMovieItemContainer">
                            <label> Year</label>
                            <input type="text" placeholder='1998' onChange={handleChange} name="year"/>
                        </div>
                        <div className="newMovieItemContainer">
                            <label> Age Limit</label>
                            <input type="text" placeholder='16' onChange={handleChange} name="limit"/>
                        </div>
                        <div className="newMovieItemContainer">
                            <label> Genre</label>
                            <input type="text" placeholder='Accion' onChange={handleChange} name="genre"/>
                        </div>
                        <div className="newMovieItemContainer">
                            <label> Duration</label>
                            <input type="text" placeholder='1h:40m' onChange={handleChange} name="duration"/>
                        </div>
                        {fileCount === 5 ? 
                            <div className='button_container'>
                                <button className="movieButton" onClick={handleCreate}>Create</button>
                            </div> : <div className='button_container'>
                                <button className="movieButton" onClick={handleUpload}>Upload</button>
                            </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}