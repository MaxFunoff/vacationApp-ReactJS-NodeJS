import React from 'react';
import Login from '../../components/Forms/Login'
import Register from '../../components/Forms/Register'
import { Grid } from '@material-ui/core'
import mainLogo from '../../images/ivacation.png'
import './Connect.css';

const Connect = (props) => {
    return (
        <div className='login-p'>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '80vh' }}
            >
                <img className='logo-img' src={mainLogo} alt='site logo'/>
                {props.formType === 'login' && <Login />}
                {props.formType === 'register' && <Register />}
            </Grid>
        </div>
    )

}

export default Connect
