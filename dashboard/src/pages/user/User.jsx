import './user.scss'
import userImg from '../../resources/imgs/opiece.jpg'
import { EmailOutlined, PermIdentity, PhoneAndroidOutlined, Publish } from '@material-ui/icons'
import { Link } from 'react-router-dom'
export const User = () => {
  return (
    <div className='user'>
        <div className="userTitleContainer">
            <h1 className="userTitle">Edit User</h1>
            <Link to = '/newUser'>
                <button className="userAddButton">Create</button>
            </Link>
            
        </div>

        <div className="userContainer">
            <div className="userShow">
                <div className="userShowTop">
                    <img src={userImg} alt="" className="userShowImg" />
                    
                    <div className="userShowTopTitle">
                        <span className="userShowTopName">Mariano Medela</span>
                        <span className="userShowTopCompany">Network Broadcast</span>
                    </div>
                </div>
                <div className="userShowBottom">
                    <span className="userShowBottomTitle">Detalles de cuenta</span>
                    <div className="userShowInfo">
                        <PermIdentity className='userShowIcon'/>
                        <span className="userShowInfoTitle">marian89</span>
                    </div>
                    <span className="userShowBottomTitle">Detalles de contacto</span>
                    <div className="userShowInfo">
                        <PhoneAndroidOutlined className='userShowIcon'/>
                        <span className="userShowInfoTitle">+541136744424</span>
                    </div>
                    <div className="userShowInfo">
                        <EmailOutlined className='userShowIcon'/>
                        <span className="userShowInfoTitle">yo@yo.yo</span>
                    </div>
                </div>
            </div>
            <div className="userUpdate">
                <span className="userUpdateTitle">Edit</span>
                <form className="userUpdateForm">
                    <div className="userUpdateLeft">
                        <div className="userUpdateItem">
                            <label>User Name</label>
                            <input type="text" placeholder='marian89' className="userUpdateInput" />
                        </div>
                        <div className="userUpdateItem">
                            <label>Phone</label>
                            <input type="text" placeholder='+541136744424' className="userUpdateInput" />
                        <div className="userUpdateItem">
                            <label>Email</label>
                            <input type='email' placeholder='yo@yo.yo' className="userUpdateInput" />
                        </div>
                        </div>
                    </div>
                    <div className="userUpdateRight">
                        <div className="userUpdateUpload">
                            <img src={userImg} alt="" className="userUpdateImg" />
                            <label htmlFor="file" style={{cursor: 'pointer'}}><Publish/> </label>
                            <input type="file"  id="file" style={{display:"none"}}/>
                        </div>
                        <button className="userUpdateButton">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
