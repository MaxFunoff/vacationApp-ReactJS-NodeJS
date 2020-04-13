import React, { useEffect, useContext, useReducer } from 'react';
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { FormHelperText, Container, CssBaseline, TextField, Button, Typography, InputLabel, MenuItem } from '@material-ui/core';
import { ManageVacationsContext } from '../../stores/manageVacationsStore';
import vacationEditReducer from '../../reducers/vacationEditReducer'
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
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
}));

const VacationsEdit = (props) => {
    const classes = useStyles()
    const history = useHistory()
    const initialState = {
        isLoading: false,
        error: false,
        vacation: {
            image: {},
            name: '',
            description: '',
            StartDate: '',
            EndDate: '',
            price: '',
            available: '',
        }
    }
    const [ManageVacationsState, ManageVacationsDispatch] = useContext(ManageVacationsContext)
    const [editState, editDispatch] = useReducer(vacationEditReducer, initialState);

    useEffect(() => {
        if (props.match.params.id !== 'new') {
            axios.get('http://localhost:8000/admin/vacations/' + props.match.params.id, {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    editDispatch({ type: 'SET_DATA', payload: response.data.data[0] })
                })
                .catch(error => {
                    editDispatch({ type: 'SET_ERROR' });
                });
        }
    }, [ManageVacationsDispatch, ManageVacationsState.vacations.length, props.match.params.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        editDispatch({ type: 'SET_LOADING' })
        if (props.match.params.id === 'new') {
            const formData = new FormData();
            const vacationEntries = Object.entries(editState.vacation)
            vacationEntries.forEach(entry => {
                formData.append(entry[0], entry[1])
            })

            axios.post("http://localhost:8000/admin/vacation", formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                withCredentials: true,
                credentials: 'include',
            })
                .then((response) => {
                    editDispatch({ type: 'SET_FIELD', fieldName: 'id', payload: response.data.data.newId })
                    const _vacations = [...ManageVacationsState.vacations, editState.vacation]

                    editDispatch({ type: 'SET_SUCCESS' })
                    ManageVacationsDispatch({ type: 'SET_DATA', payload: _vacations})
                    history.push('/managevacations')
                }).catch((error) => {
                    editDispatch({ type: 'SET_ERROR' });
                });
        }else{
            axios.put("http://localhost:8000/admin/vacation/" + props.match.params.id, editState.vacation, {
                withCredentials: true,
                credentials: 'include',
            })
                .then((response) => {
                    const _vacations = [...ManageVacationsState.vacations]
                    const vacationIndex = _vacations.findIndex(item => item.id === editState.vacation.id)
                    _vacations[vacationIndex] = {...editState.vacation}

                    editDispatch({ type: 'SET_SUCCESS' })
                    ManageVacationsDispatch({ type: 'SET_DATA', payload: _vacations})

                    history.push('/managevacations')
                }).catch((error) => {
                    editDispatch({ type: 'SET_ERROR' });
                });
        }

    }
    return (
        <Container component="div" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    {props.match.params.id === 'new' ? 'Add New Vacation' : 'Edit Vacation'}
                </Typography>
                <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
                    {props.match.params.id !== 'new' ? '' :
                        <>
                            <InputLabel style={{ margin: '0.5rem 0' }} variant='standard'>Vacation Image</InputLabel>
                            <input
                                type='file'
                                accept="image/*"
                                className={classes.input}
                                id="outlined-button-file"
                                onChange={e =>
                                    editDispatch({
                                        type: 'SET_FIELD',
                                        fieldName: 'image',
                                        payload: e.target.files[0],
                                    })
                                }
                            />
                            <hr />
                        </>
                    }
                    <TextField
                        margin="normal"
                        label="Vacation Name"
                        InputLabelProps={{ shrink: true }}
                        value={editState.vacation.name}
                        onChange={e =>
                            editDispatch({
                                type: 'SET_FIELD',
                                fieldName: 'name',
                                payload: e.currentTarget.value,
                            })
                        }
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        multiline
                        type="text"
                        label='Description'
                        InputLabelProps={{ shrink: true }}
                        value={editState.vacation.description}
                        onChange={e =>
                            editDispatch({
                                type: 'SET_FIELD',
                                fieldName: 'description',
                                payload: e.currentTarget.value,
                            })
                        }
                    />
                    <TextField
                        margin="normal"
                        type="date"
                        label='Start Date'
                        InputLabelProps={{ shrink: true }}
                        value={editState.vacation.StartDate}
                        onChange={e =>
                            editDispatch({
                                type: 'SET_FIELD',
                                fieldName: 'StartDate',
                                payload: e.currentTarget.value,
                            })
                        }
                    />
                    <TextField
                        style={{ marginLeft: '1rem' }}
                        margin="normal"
                        type="date"
                        label='End Date'
                        InputLabelProps={{ shrink: true }}
                        value={editState.vacation.EndDate}
                        onChange={e =>
                            editDispatch({
                                type: 'SET_FIELD',
                                fieldName: 'EndDate',
                                payload: e.currentTarget.value,
                            })
                        }
                    />
                    <TextField
                        margin="normal"
                        type="number"
                        label='Price'
                        InputLabelProps={{ shrink: true }}
                        value={editState.vacation.price}
                        onChange={e =>
                            editDispatch({
                                type: 'SET_FIELD',
                                fieldName: 'price',
                                payload: e.currentTarget.value,
                            })
                        }
                    />
                    <TextField
                        margin="normal"
                        style={{ marginLeft: '1rem' }}
                        id="select"
                        label="Availablity"
                        value={editState.vacation.available}
                        InputLabelProps={{ shrink: true }}
                        select
                        onChange={e =>
                            editDispatch({
                                type: 'SET_FIELD',
                                fieldName: 'available',
                                payload: e.target.value,
                            })
                        }
                    >
                        <MenuItem value="0">False</MenuItem>
                        <MenuItem value="1">True</MenuItem>

                    </TextField>
                    {/* {loginState.errorType === 'server' && <FormHelperText error>Please try again later</FormHelperText>} */}
                    <div>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            className={classes.submit}
                            disabled={editState.isLoading}
                        >
                            Save
                        </Button>
                        <Button
                            style={{ marginLeft: '2rem' }}
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            disabled={editState.isLoading}
                            onClick={() => {
                                history.push('/managevacations')
                            }}>
                            Back
                    </Button>
                    </div>

                </form>
            </div>
        </Container>
    );

}



export default VacationsEdit
