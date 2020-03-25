import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { FormHelperText, Container, CssBaseline, TextField, Button, Grid, Typography } from '@material-ui/core';
import axios from 'axios'


const styles = theme => ({

    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});



class Login extends React.Component {
    state = {
        /* Any password/email validation/server errors */
        validation: {
            loginErr: false,
            loginMsg: '',
        },

        /*For Server Error*/
        err: false,

        /* Form values stored in the State */
        email: '',
        password: '',

        /* Redirct to different routes */
        redirect: null,
    }

    /* Handles input changes */
    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    /* Handles form submit */
    handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/users/login', {
            email: this.state.email,
            password: this.state.password,
        },{
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                console.log(response)
                this.setState({ redirect: '/home' })
            })
            .catch((error) => {
                let err = false;
                let loginErr = false;
                let loginMsg = ''

                console.log(error.response)
                if (error.response.status >= 500 && error.response.status < 600)
                    err = true

                if (error.response.status === 401) {
                    loginErr = true
                    loginMsg = 'Email or Password is incorrect'
                }

                this.setState({
                    validation: {
                        loginErr,
                        loginMsg,
                    },
                    err,
                })
                console.log(error.response.status);
            });
    }

    test = (e) => {
        e.preventDefault();
        console.log(':)')
        axios.get('http://localhost:8000/users/profile',
         { withCredentials: true, credentials: 'include'})
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            error={this.state.validation.loginErr}
                            helperText={this.state.validation.loginMsg}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.handleChange}
                        />
                        <TextField
                            error={this.state.validation.loginErr}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.handleChange}
                        />
                        {this.state.err && <FormHelperText error>Please try again later</FormHelperText>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.test}
                    >
                        Gimmi
                    </Button>
                </div>
            </Container>
        );
    }
}



export default withStyles(styles)(Login)
