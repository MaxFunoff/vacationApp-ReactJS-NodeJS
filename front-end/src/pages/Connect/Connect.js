import React from 'react';
import './Connect.css';
import Login from '../../components/Forms/Login'
import Register from '../../components/Forms/Register'

class Connect extends React.Component {

    constructor(props){
        super(props)
        this.state.formType = props.formType
    }

    state = {
        formType: ''
    }

    render() {
        return (
            <div className='login-p'>
                {this.state.formType === 'login' && <Login />}
                {this.state.formType === 'register' && <Register />}
            </div>
        )
    }
}

export default Connect
