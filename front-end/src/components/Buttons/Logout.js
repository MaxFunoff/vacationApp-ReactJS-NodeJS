import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../../store';
import axios from 'axios'



const Logout = () => {

    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    const handleClick = (e) => {

        e.preventDefault();

        axios.delete('http://localhost:8000/users/logout', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                dispatch({ type: 'SET_LOGGED_OUT' });
                history.push('/login')
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
            });

    }

    return (
        <button onClick={handleClick}>Logout</button>
    )

}

export default Logout
