import { Language, NotificationsNone, Settings } from '@material-ui/icons'
import Box from '@mui/material/Box';
import { IconButton } from '@material-ui/core';
import React from 'react'
import './topbar.scss'
import loginImage from '../../resources/imgs/login_image.jpg'
import { Link } from 'react-router-dom'

export const Topbar = () => {
  return (
    <div className="topbar">
        <div className="topbarWrapper">
            <div className="topLeft">
                <Link to="/" className='link'>
                    <span className="logo">Bromteck</span>
                </Link>
            </div>
            <div className="topRight">
                <div className="iconContainer">
                    <NotificationsNone/>
                    <span className="topIconBadge">3</span>
                </div>
                <div className="iconContainer">
                    <Language/>
                    <span className="topIconBadge">3</span>
                </div>
                <div className="iconContainer">
                    <Settings/>
                </div>
                <div>
                    <IconButton>
                    <img src={loginImage} alt="" className="fotoLogin"/>
                    </IconButton>
                </div>
            </div>
        </div>
    </div>
  )
}
