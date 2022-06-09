import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { MovieContextProvider } from './context/movieContext/MovieContext';
import { UserContextProvider } from './context/userContext/UserContext';
import { CV } from './cv/cv'

const cvUser = "nbr_sw4";
const cvPass = "Sw4network321!";
const cvToken = "pXzfslHEHzrududyAXLz";

function loginFailed(reason) {
  console.log(reason);
}

function loggedIn() {
		
  console.log("estoy logeado");
  
}

window.onload = ()=>{
  CV.init({
      baseUrl: "https://cv01.panaccess.com",
      mode: "json",
      jsonpTimeout: 5000,
      username: cvUser,
      password: cvPass,
      apiToken: cvToken,
      loginSuccessCallback: loggedIn,
      loginFailedCallback: loginFailed
  });
}

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MovieContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </MovieContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

