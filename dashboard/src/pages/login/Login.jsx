import { useContext, useState } from 'react'
import { login } from '../../context/authContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';
import './logIn.scss'

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isFetching, dispatch} = useContext(AuthContext);
  const handleClick = (event)=>{
    event.preventDefault();
    login({email, password}, dispatch);
    
  }
  return (
    <div className='login'>
      <form className="loginForm">
        <input type="email" placeholder='Email' className="loginInput" onChange={(event)=>{setEmail(event.target.value)}}/>
        <input type="password" placeholder='Password' minLength={8} className="loginInput" onChange={(event)=>{setPassword(event.target.value)}}/>
        <button className="loginButton" onClick={handleClick} disabled={isFetching}>Login</button>
      </form>
    </div>
  )
}
