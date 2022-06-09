import { Sidebar } from "./components/sidebar/Sidebar";
import { Topbar } from "./components/topBar/Topbar";
import './app.css'
import { Home } from "./pages/home/Home";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { UserList } from "./pages/userlist/UserList";
import { User } from "./pages/user/User";
import { NewUser } from "./pages/newUser/NewUser";
import { MovieList } from "./pages/movieList/MovieList";
import { Movie } from "./pages/movie/Movie";
import { NewMovie } from "./pages/NewMovie/NewMovie";
import { Login } from "./pages/login/Login";
import { useContext } from "react";
import { AuthContext } from "./context/authContext/AuthContext";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { Download} from "./pages/Downolad/Download";

function App() {
  const {user} = useContext(AuthContext);
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {user? <Topbar/>:<></>}
        <div className="container">
          {user? <Sidebar/>:<></>}
          <Routes>
            <Route path="/" element={user ? <Home/> : <Navigate to= "/login"/>}/>
            <Route path="/login" element = {user ? <Navigate to= "/"/> : <Login/>}/>
            {user && <>
              <Route path="/users" element={<UserList/>}/>
              <Route path="/users/:userName" element={<User/>}/>
              <Route path="/newUser" element={<NewUser/>}/>
              <Route path="/movies" element={<MovieList/>}/>
              <Route path="/movies/:moviesid" element={<Movie/>}/>
              <Route path="/newMovie" element={<NewMovie/>}/>
              <Route path="/Download" element={<Download/>}/>
            </>}
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
