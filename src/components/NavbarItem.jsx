import React from 'react'
import {NavLink} from 'react-router-dom'


const navbarItem = (props) => 
    <li className="nav-item">
        <NavLink className="nav-link" onClick={props.onClick} to={props.href}>{props.label}</NavLink>
    </li>
    

export default navbarItem