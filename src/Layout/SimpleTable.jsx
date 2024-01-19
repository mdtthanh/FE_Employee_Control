import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
};

let id = 0;

function SimpleTable(props) {
    const { classes } = props;
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5006/api/User/AllInfo')
            .then(response => response.json())
            .then(data => { 
                console.log(data) 
                setData(data)
            })
            .catch(error => console.error('Error:', error));
    }, [])
    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>順番</TableCell>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat (g)</TableCell>
                        <TableCell align="right">Carbs (g)</TableCell>
                        <TableCell align="right">Protein (g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((n, index) => (
                        <TableRow key={n.id}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell component="th" scope="row">
                                {n.username}
                            </TableCell>
                            <TableCell align="right">{n.username}</TableCell>
                            <TableCell align="right">{n.fat}</TableCell>
                            <TableCell align="right">{n.carbs}</TableCell>
                            <TableCell align="right">{n.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);