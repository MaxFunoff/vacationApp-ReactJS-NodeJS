import React, { useEffect, useContext } from 'react';
import { Context } from '../../store';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
    logoImg: {
        maxWidth: '10rem',
        marginBottom: '0.2rem',
    },
}));

const Profile = () => {

    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    /* Checks if user has data and is logged in*/
    useEffect(() => {
        if (!state.userStatus.userCheckedIn || !state.userStatus.userType) {
            axios.get('http://localhost:8000/users/profile', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    dispatch({ type: 'SET_DATA', payload: response.data.data[0] });
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOGGED_OUT' });
                    history.push('/login')
                });
        } else if (!state.userStatus.isLoggedIn)
            history.push('/login')
    }, [dispatch, history, state.userStatus.userCheckedIn, state.userStatus.isLoggedIn, state.userStatus.userType]);


    return (
        !state.userStatus.isLoggedIn || !state.userStatus.userType || !state.userStatus.userCheckedIn ? '' :
            <div className='home-p'>
               im the profile page
            </div>
    )
}


export default Profile
