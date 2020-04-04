import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Context } from '../../store';
import Logout from '../Buttons/Logout'
import './Nav.css';



const Nav = () => {

    const [state] = useContext(Context);
    let logoutButton = state.userStatus.isLoggedIn ? <Logout /> : '';
    return (
        <div className='nav-c'>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </ul>
            {logoutButton}
        </div >
    )

}

export default Nav
