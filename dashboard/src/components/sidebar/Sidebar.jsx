import { BuildSharp, ConfirmationNumberSharp, CreditCardSharp, Settings, 
         GetApp, HomeOutlined, LocalOffer, PersonAdd, PersonSharp, ReceiptSharp, 
         ReportSharp, Timeline, VisibilitySharp, Work, Assignment, List,
         BookmarkBorderSharp, PlayArrow, ExitToApp} from '@material-ui/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.scss'
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout } from '../../context/authContext/apiCalls';
import { useContext} from "react";


export const Sidebar = () => {
    const {dispatch} = useContext(AuthContext);
    const handleLogOut = ()=>{
      logout(dispatch);}
  return (
    <div className='sidebar'>
        <div className="sidebarWrapper">
        <div className="sidebarMenu">
                <h3 className="sidebarTitle">Dashboard</h3>
                    
                    <ul className="sidebarList">
                        <Link to='/' className='link'><li className="sidebarItem">
                            <HomeOutlined className='sidebarIcon'/>
                            Home
                            
                        </li></Link>
                        <li className="sidebarItem">
                            <a className = "link" href="http://83.135.28.6:3000/login" target="_blank">
                                <Timeline className='sidebarIcon'/>
                                Analytics
                            </a>
                        </li>
                        <li className="sidebarItem">
                            <a className = "link" href="http://webplayerbromteck.ddns.net:880/login" target="_blank">
                                <PlayArrow className='sidebarIcon'/>
                                WebPlayer
                            </a>
                        </li>
                    </ul>

                <h3 className="sidebarTitle">Home</h3>
                    
                <ul className="sidebarList">
                    <li className="sidebarItem">
                        <HomeOutlined className='sidebarIcon'/>
                        <Link to='/' className='link'>Home</Link>
                       
                    </li>
                    <li className="sidebarItem">
                        
                        <Settings className='sidebarIcon'/>
                        My Settings
                    </li>
                    <li className="sidebarItem">
                        
                        <BuildSharp className='sidebarIcon'/>
                        System Tasks
                    </li>
                    
                    <Link to={"Download"} className='link' ><li className="sidebarItem">  
                        <GetApp className='sidebarIcon'/>
                        Downloads
                    </li> </Link>

                    <li className="sidebarItem">
                        
                        <ConfirmationNumberSharp className='sidebarIcon'/>
                        Tickets
                    </li>
                </ul>
                <h3 className="sidebarTitle">Subscribers</h3>
                    
                <ul className="sidebarList">
                    <li className="sidebarItem">
                        <PersonSharp className='sidebarIcon'/>
                        <Link to='/users' className='link'>All Subscribers</Link>                  
                    </li>
                    <li className="sidebarItem">
                        
                        <PersonAdd className='sidebarIcon'/>
                        <Link to='/newUser' className='link'>Add Subscriber</Link>
                    </li>
                    <li className="sidebarItem">
                        <CreditCardSharp className='sidebarIcon'/>
                        Assigned cupons
                    </li>
                    
                    <li className="sidebarItem">
                        <LocalOffer className='sidebarIcon'/>
                        Tags
                    </li>
                    <li className="sidebarItem">
                        <ReceiptSharp className='sidebarIcon'/>
                        Receipts
                    </li>
                </ul>

                <h3 className="sidebarTitle">Products</h3>
                    
                    <ul className="sidebarList">
                    <li className="sidebarItem">
                            
                            <VisibilitySharp className='sidebarIcon'/>
                            Overview
                        </li>
                        <li className="sidebarItem">
                            
                            <Assignment className='sidebarIcon'/>
                            Package List
                        </li>
                        <li className="sidebarItem">
                            
                            <List className='sidebarIcon'/>
                            Product List
                        </li>
                        <li className="sidebarItem">
                            <Settings className='sidebarIcon'/>
                            Product Configuration
                        </li>
                        <li className="sidebarItem">
                            <BookmarkBorderSharp className='sidebarIcon'/>
                            Orderd Products
                        </li>
                        <li className="sidebarItem">
                            <ConfirmationNumberSharp className='sidebarIcon'/>
                            Cupons
                        </li>
                    </ul>

                <h3 className="sidebarTitle">Staff</h3>
                    
                <ul className="sidebarList">
                    <li className="sidebarItem">
                        <Work className='sidebarIcon'/>
                        Manage
                    </li>
                    <li className="sidebarItem">
                        <Timeline className='sidebarIcon'/>
                        Analytics
                    </li>
                    <li className="sidebarItem">
                        <ReportSharp className='sidebarIcon'/>
                        Reports
                    </li>
                </ul>

                
                <h3 className="buttonLogOut" onClick={(e)=>{handleLogOut()}}><ExitToApp /> Log Out </h3>

            </div>
        </div>
    </div>
  )
}
