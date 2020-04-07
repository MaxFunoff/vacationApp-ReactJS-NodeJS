import React from 'react';
import './Connect.css';
import Login from '../../components/Forms/Login'
import Register from '../../components/Forms/Register'

const Connect = (props) => {

    return (
        <div className='login-p'>
            {props.formType === 'login' && <Login />}
            {props.formType === 'register' && <Register />}
        </div>
    )

}

export default Connect
