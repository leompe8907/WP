import './widgetSm.scss'
import loginImage from '../../resources/imgs/login_image.jpg'
import axios from 'axios'
import { Visibility } from '@material-ui/icons'
import { useState, useEffect } from 'react'
export const WidgetSm = () => {
    
    const [newUsers, setNewUsers] = useState([]);
    useEffect(()=>{
        const getNewUsers = async ()=>{
            try{
                const res = await axios.get("/user?new=true", {
                    headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
                });
                setNewUsers(res.data);
            }catch(err){
                console.log(err);
            }
        }
        getNewUsers();
    },[]);
  return (
    <div className='widgetSm'>
        <span className="widgetSmTitle">Nuevos Niembros</span>
        <ul className="widgetSmList">
            {newUsers.map((user)=>(
                <li className="widgetSmListItem">
                <img src={user.profileImg || loginImage} alt="" className='widgetSmImg'/>
                <div className="widgetSmUser">
                    <span className="widgetSmUserName">{user.username}</span>
                </div>
                <button className="widgetSmbutton">
                    <Visibility className='widgetSmIcon'/>
                    Display
                </button>
            </li>
            ))}
        </ul>
    </div>
  )
}
