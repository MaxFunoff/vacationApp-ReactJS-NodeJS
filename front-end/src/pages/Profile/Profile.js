import React, { useEffect, useContext } from 'react';
import { Context } from '../../store';
import { useHistory } from 'react-router-dom';
import { Grid, Typography, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import OrdersTable from '../../components/Tables/OrdersTable'
import axios from 'axios'


// const useStyles = makeStyles((theme) => ({
//     logoImg: {
//         maxWidth: '10rem',
//         marginBottom: '0.2rem',
//     },
// }));

const Profile = () => {

    // const classes = useStyles();
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
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '50vh' }}
                >
                    <Avatar>{state.userStatus.userEmail[0]}</Avatar>
                    <Typography paragraph variant="h4" component="h4">
                        {state.userStatus.userEmail}
                    </Typography>

                    <Typography paragraph variant="h5" component="h5">
                        Orders History
                    </Typography>
                    <OrdersTable />
                </Grid>

            </div>
    )
}


export default Profile
