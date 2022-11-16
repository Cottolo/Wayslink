import React, { useState, useContext, useEffect} from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import Icon from "../../assets/Icon.png"
import cubes from "../../assets/cubes.png"
import user from "../../assets/user.png"
import chain from "../../assets/chain.png"
import logoutIcon from "../../assets/logout.png"
import { useNavigate } from "react-router-dom"
import styleCSS from "./sidebar.module.css"
import { UserContext } from "../../context/userContext"
import { API } from "../../config/api"

const SideNavbar= () => {
    const [state, dispatch] = useContext(UserContext);
    const navigate = useNavigate()
    const logout = () => {
        dispatch({
          type: "LOGOUT",
        });
        navigate("/");
    };
    return(
        <div className={styleCSS.sideNavbarcomps}>
            <div className='mt-3 py-3'>
                <img src={Icon} alt="Wayslinks" />
            </div>
            <div className=''>
                <ul>
                    <li className="mb-5">
                        <img src={cubes} alt="template" /><Link to="/dashboard">Template</Link>
                    </li>
                    <li className="mb-5">
                        <img src={user} alt="profile" /><Link to="/profile">Profile</Link>
                    </li>
                    <li className="">
                        <img src={chain} alt="My Links" /><Link to="/my-link">My Links</Link>
                    </li>
                </ul>
            </div>
            <div className={styleCSS.sideNavbarLogout}>
                <ul>
                    <li>
                        <img src={logoutIcon} alt="Logout" /><Link to="/" onClick={logout}>Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}


export default SideNavbar