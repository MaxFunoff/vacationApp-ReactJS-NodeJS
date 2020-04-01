import React from 'react';
import './Home.css';
import VacationCard from '../../components/Vacations/VacationCard'
import { Box } from '@material-ui/core';
import axios from 'axios'


class Home extends React.Component {

    state = {
        data: [],
    }
    componentDidMount() {
        axios.get('http://localhost:8000/vacations', {
            email: this.state.email,
            password: this.state.password,
        }, {
            withCredentials: true,
            credentials: 'include',
        })
            .then((response) => {
                this.setState({ data: response.data.data })
            })
            .catch((error) => {

            });
    }

    render() {
        let vacationsArr = this.state.data;
        let vacationCards = vacationsArr.map(item => {
            return <VacationCard vacation={item} key={item.id} />
        })

        return (
            <div className='home-p'>
                <Box display="flex" justifyContent="center">
                    {vacationCards}
                </Box>
            </div >
        )
    }
}

export default Home
