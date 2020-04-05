import React, { useEffect, useContext } from 'react';
import { Context } from '../../store';
import { useHistory } from 'react-router-dom';
import VacationWrapper from '../../components/Vacations/VacationWrapper';
import axios from 'axios'
import './Home.css';



const Home = () => {

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

    let landingPage = state.userStatus.isLoggedIn && state.userStatus.userCheckedIn ? <VacationWrapper /> : '';

    return (
        <div>
            {landingPage}
        </div>
    )
}


export default Home
