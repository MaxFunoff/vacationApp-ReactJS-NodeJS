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

class Register extends React.Component {

    state = {
        /* Any password/email validation/server errors */
        validation: {
            emailErr: false,
            emailMsg: '',
            passwordErr: false,
            passwordMsg: '',
        },

        /*For Server Error*/
        err: false,

        /* Form values stored in the State */
        email: '',
        password: '',
        password2: '',

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
        let validation = this.validateData();
        if (!validation) return false

        axios.post('http://localhost:8000/users', {
            email: this.state.email,
            password: this.state.password,
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                let err = false;
                let dupErr = false;
                let dupMsg = ''
                if (error.response.status >= 500 && error.response.status < 600)
                    err = true

                if (error.response.status === 409) {
                    dupErr = true
                    dupMsg = 'Email is already in use'
                }

                this.setState({
                    validation: {
                        emailErr: dupErr,
                        emailMsg: dupMsg,
                    },
                    err,
                })
                console.log(error.response.status);
            });
    }

    /* Validates stored values */
    validateData = (e) => {
        let passwordErr = false;
        let emailErr = false;
        let passwordMsg = '';
        let emailMsg = '';

        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.state.password !== this.state.password2) {
            passwordErr = true;
            passwordMsg = 'Both passwords must match';
        }

        if (this.state.password.length < 6) {
            passwordErr = true;
            passwordMsg = 'Password must be more then 6 characters';
        }

        if (!regexp.test(this.state.email)) {
            emailErr = true;
            emailMsg = 'Invalid email address';
        }


        this.setState(
            {
                validation: {
                    passwordErr,
                    emailErr,
                    passwordMsg,
                    emailMsg,
                }
            }, _ => {
                console.log(this.state)
            })


        if (passwordErr || emailErr) return false
        else return true
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
                        Register
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            error={this.state.validation.emailErr}
                            helperText={this.state.validation.emailMsg}
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
                        {/* <FormHelperText error="true"  */}
                        <TextField
                            error={this.state.validation.passwordErr}
                            helperText={this.state.validation.passwordMsg}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={this.handleChange}
                        />
                        <TextField
                            error={this.state.validation.passwordErr}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password2"
                            label="Repeat Password"
                            type="password"
                            id="password2"
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
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/login" variant="body2">
                                    {"Have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}



export default withStyles(styles)(Register)