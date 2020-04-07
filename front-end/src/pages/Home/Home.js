import React, { useEffect, useContext } from 'react';
import { Context } from '../../store';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import VacationWrapper from '../../components/Vacations/VacationWrapper';
import axios from 'axios'
import mainLogo from '../../images/ivacation-text.png'
import './Home.css';


const useStyles = makeStyles((theme) => ({
    logoImg: {
        maxWidth: '10rem',
        marginBottom: '0.2rem',
    },
}));

const Home = () => {

    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    /* Checks if user is logged in or if he checked it */
    useEffect(() => {
        if (!state.userStatus.userCheckedIn) {
            axios.get('http://localhost:8000/users/check', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    dispatch({ type: 'SET_LOGGED_IN', payload: response.data.userType });
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOGGED_OUT' });
                    history.push('/login')
                });
        } else if (!state.userStatus.isLoggedIn)
            history.push('/login')
    }, [dispatch, history, state.userStatus.userCheckedIn, state.userStatus.isLoggedIn]);

    // let landingPage = state.userStatus.isLoggedIn && state.userStatus.userCheckedIn ? <VacationWrapper /> : '';

    return (
        !state.userStatus.isLoggedIn || !state.userStatus.userCheckedIn ? '' :
            <div className='home-p'>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '10vh' }}
                >
                    <img className={classes.logoImg} src={mainLogo} alt='site logo' />
                    <VacationWrapper />
                </Grid>
            </div>
    )
}


export default Home
