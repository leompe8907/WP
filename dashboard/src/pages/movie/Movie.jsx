import './movie.scss'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Chart } from '../../components/chart/Chart'
import img from '../../resources/imgs/opiece.jpg'
import { Publish } from '@material-ui/icons';


export const Movie = ()=>{
    
    const query =useLocation()
    var aux = query.search.toString().replace(/%22/g, '"');
    aux = aux.replace(/%20/g, " ").replace('?', '')
    console.log(aux.toString())
    const movie  = JSON.parse(""+aux);


    
    return(
        <div className="movie">
            <div className="movieTitleContainer">
                <h1 className="movieTitle">Movie</h1>
                <Link to="/newMovie">
                    <button className="movieAddButoon">Create</button>
                </Link>
            </div>
            <div className="movieTop">
                <div className="movieTopRight">
                    <div className="movieInfoTop">
                        <img src={movie.img} alt="" />
                        <span className="movieName">{movie.title}</span>
                    </div>

                    <div className="moiveInfoItem">
                        <span className="MovieInfoKey">id:   </span>
                        <span className="MovieInfoValue">{movie._id}</span>
                    </div>
                    <div className="moiveInfoItem">
                        <span className="MovieInfoKey">genre:</span>
                        <span className="MovieInfoValue">{movie.genre}</span>
                    </div>
                    <div className="moiveInfoItem">
                        <span className="MovieInfoKey">year:</span>
                        <span className="MovieInfoValue">{movie.year}</span>
                    </div>
                    <div className="moiveInfoItem">
                        <span className="MovieInfoKey">Age Limit:</span>
                        <span className="MovieInfoValue">{movie.limit}</span>
                    </div>
                </div>
            </div>
            <div className="movieBottom">
                <form className="MovieForm">
                    <div className="movieFormLeft">
                        <label> Movie Name</label>
                        <input type="text" placeholder={movie.title}/>
                        <label> Year</label>
                        <input type="text" placeholder={movie.year}/>
                        <label> Age Limit</label>
                        <input type="text" placeholder={movie.limit}/>
                        <label> Genre</label>
                        <input type="text" placeholder={movie.genre}/>
                        <label>Trailer</label>
                        <input type="file" placeholder={movie.trailer}/>
                        <label> Video</label>
                        <input type="file" placeholder={movie.video}/>
                    </div>
                    <div className="movieFormRigth">
                        <div className="movieUpload">
                            <img src={movie.img} alt="" className="movieUploadImg" />
                            <label For="file">
                                <Publish/>
                            </label>
                            <input type="file" id='file' style={{display: "none"}}/>
                        </div>
                        <button className="movieButton">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}