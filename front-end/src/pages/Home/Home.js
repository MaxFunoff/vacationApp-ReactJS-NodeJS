import React, { useEffect, useContext } from 'react';
import { Context } from '../../store';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import VacationWrapper from '../../components/Vacations/VacationWrapper';

import './Home.css';



const Home = () => {

    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    useEffect(() => {
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
    }, [dispatch, history]);

    let landingPage = state.userStatus.isLoggedIn ? <VacationWrapper /> : '';

    return (
        <div>
            {landingPage}
        </div>
    )
}


export default Home
