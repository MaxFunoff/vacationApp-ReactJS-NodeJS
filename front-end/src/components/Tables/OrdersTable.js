import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@material-ui/core';
import { Context } from '../../store';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const OrdersTable = () => {
    const classes = useStyles();
    const [state] = useContext(Context);
    const vacations = [...state.userStatus.userVacations]

    const createData = (id, name, status, laststatuschange) => {
        return { id, name, status, laststatuschange };
    }

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'status', label: 'Order Status', minWidth: 100 },
        {
            id: 'last_status_change',
            label: 'Last Change Date',
            minWidth: 170,
            align: 'right',
        },
    ];

    const rows = vacations.map(vacation => {
        return createData(vacation.id, vacation.Name, vacation.Status, vacation.lastStatusChange)
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

    const handleRowClick = (e) =>{
        e.preventDefault();
        console.log(e.currentTarget.id)
    }

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            console.log(row)
                            return (
                                <TableRow onClick={handleRowClick} id={row.id} hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
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
    );
}

export default OrdersTable;