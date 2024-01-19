import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import { Close } from '@material-ui/icons';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    }
};
const style_modal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
}
function SimpleTable(props) {
    const { classes } = props;
    const [data, setData] = useState([]);
    const [workPlace, setWorkPlace] = useState([]);
    const [username, setUsername] = useState('');
    const [workTime, setWorkTime] = useState('');
    const [open, setOpen] = React.useState(false);
    const [selectedWorkPlace, setSelectedWorkPlace] = useState(null);
    const [selectedWorkPlaceId, setSelectedWorkPlaceId] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event, value) => {
        const selectedPlace = workPlace.find(place => place.workPlaceName === value);
        setSelectedWorkPlace(selectedPlace);
        setSelectedWorkPlaceId(selectedPlace ? selectedPlace.id : null);
        console.log(selectedPlace ? selectedPlace.id : 'No place selected');
    };
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.target);
        const info = JSON.stringify({
            "username": username,
            "workPlaceId": selectedWorkPlaceId
        })
        fetch('http://localhost:5006/api/User/AddAllInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: info,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(prevData => [...prevData, data]);
                setOpen(false);
                window.location.reload()

            })
            .catch((error) => console.error('Error:', error));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5006/api/User/DeleteInfo/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Remove the deleted item from the state
                setData(prevData => prevData.filter(item => item.id !== id));
            })
            .catch((error) => console.error('Error:', error));
    };
    useEffect(() => {
        fetch('http://localhost:5006/api/User/AllInfo')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setData(data)
            })
            .catch(error => console.error('Error:', error));
    }, [])

    useEffect(() => {
        fetch('http://localhost:5006/api/User/AllInfoWorkPlace')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setWorkPlace(data)
            })
            .catch(error => console.error('Error:', error));
    }, [])

    const workPlaceNames = workPlace.map(place => place.workPlaceName);
    return (
        <>
            <Button
                variant="contained"
                sx={{
                    float: 'right',
                    marginBottom: '20px',
                }}
                onClick={handleOpen}
            >+ Add Employee</Button>

            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>順番</TableCell>
                            <TableCell align="left">User Name</TableCell>
                            <TableCell align="left">Work Time</TableCell>
                            <TableCell align="center">Location</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((n, index) => (
                            <TableRow key={n.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" align="left" scope="row">
                                    {n.username}
                                </TableCell>
                                <TableCell align="left">{n.workTime}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        sx={{
                                            "width": "100px"
                                        }}
                                        label={`${n.workPlace ? n.workPlace.workPlaceName : 'N/A'}`}
                                        color="success" />
                                </TableCell>
                                <TableCell align="left">{n.description}</TableCell>
                                <TableCell align="center">
                                    <EditIcon
                                        onClick={handleOpen}
                                        className='button_edit'
                                        sx={{
                                            "cursor": "pointer",
                                            ":hover": {
                                                color: "blue"
                                            }
                                        }}
                                    />
                                    <DeleteIcon
                                        onClick={() => handleDelete(n.id)}
                                        className='button_edit'
                                        sx={{
                                            "cursor": "pointer",
                                            ":hover": {
                                                color: "red"
                                            }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Modal
                open={open}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style_modal}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            "float": "right",
                        }}
                    >
                        <Close />
                    </Button>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Employee Information
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Username"
                                    variant="outlined"
                                    sx={{
                                        "width": "415px"
                                    }}
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </Typography>
                            <Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Controlled picker"
                                        defaultValue={dayjs('2022-04-17T15:30')}
                                        sx={{
                                            "marginTop": "20px",
                                            "width": "415px"
                                        }}
                                    />
                                </LocalizationProvider>
                            </Typography>
                            <Typography >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={workPlaceNames}
                                    sx={{
                                        "marginTop": "20px",
                                        "width": "415px"
                                    }}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} label="Location" />}
                                />
                            </Typography>
                            <Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Description"
                                    variant="outlined"
                                    sx={{
                                        "marginTop": "20px",
                                        "width": "415px"
                                    }}
                                />
                            </Typography>

                        </Box>
                        <Box
                            sx={{
                                marginTop: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                width: '415px'
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{
                                    marginRight: '10px'
                                }}
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                            <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
                        </Box>
                    </Typography>

                </Box>
            </Modal>
        </>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
