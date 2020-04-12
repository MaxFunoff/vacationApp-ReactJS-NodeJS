import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button, Box } from '@material-ui/core';
import { ManageVacationsContext } from '../../stores/manageVacationsStore';
import axios from 'axios'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const VacationsTable = () => {
    const classes = useStyles();
    const history = useHistory();
    const [ManageVacationsState, ManageVacationsDispatch] = useContext(ManageVacationsContext);

    useEffect(() => {
        if (ManageVacationsState.vacations.length === 0) {
            axios.get('http://localhost:8000/admin/vacations', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    ManageVacationsDispatch({ type: 'SET_DATA', payload: response.data.data });
                })
                .catch(error => {
                    ManageVacationsDispatch({ type: 'SET_ERROR' });
                });
        }
    }, [ManageVacationsDispatch, ManageVacationsState.vacations.length]);

    const createData = (id, name, description, startdate, enddate, price, available) => {
        return { id, name, description, startdate, enddate, price, available };
    }

    const columns = [
        { id: 'name', label: 'Vacation Name', minWidth: 150 },
        { id: 'description', label: 'Description', minWidth: 100 },
        { id: 'startdate', label: 'Start Date', minWidth: 100 },
        { id: 'enddate', label: 'End Date', minWidth: 100 },
        { id: 'price', label: 'Price', minWidth: 100 },
        { id: 'available', label: 'Available', minWidth: 100 },
    ];

    const rows = ManageVacationsState.vacations.map(vacation => {
        return createData(vacation.id, vacation.name, vacation.description, vacation.StartDate, vacation.EndDate, vacation.price + ' $', vacation.available ? 'True' : 'False')
    });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };
    return (
        <>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, backgroundColor: '#3f51b5', color: '#fff' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell
                                    align='center'
                                    style={{ minWidth: 50, backgroundColor: '#3f51b5', color: '#fff' }}
                                >
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow id={row.id} hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    history.push('/managevacations/' + row.id)
                                                }}>
                                                Edit
                                        </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>

            <Box component="div" style={{width: '100%'}}>
                <Button
                    style={{ marginTop: '1rem' }}
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        history.push('/managevacations/new')
                    }}>
                    Add New Vacation
                </Button>
            </Box>
        </>
    );
}

export default VacationsTable;