import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Chip from "@mui/material/Chip";
import { Close } from "@material-ui/icons";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import utc from 'dayjs-plugin-utc';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import 'dayjs/locale/zh-cn';
dayjs.extend(utc);
const styles = {
    root: {
        width: "100%",
        overflowX: "auto",
    },
    table: {
        minWidth: 700,
    },
};
const style_modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const statusColors = ["#7986cb", "#2196f3", "#4fc3f7", "#4dd0e1", "#4db6ac", "#81c784", "#aed581", "#fdd835", "#ffd54f", "#ffb74d", "#ff7043"];
function SimpleTable(props) {
    const { classes } = props;
    const [data, setData] = useState([]);

    const [workPlace, setWorkPlace] = useState([]);
    const [username, setUsername] = useState("");
    const [workTime, setWorkTime] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = React.useState(false);
    const [selectedWorkPlace, setSelectedWorkPlace] = useState("");
    const [selectedWorkPlaceId, setSelectedWorkPlaceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [idEmployee, setIdEmployee] = useState();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedDate, setSelectedDate] = useState(new Date('2024-01-01'));
    const [currentDate, setCurrentDate] = useState(new Date());
    // const [filteredData, setFilteredData] = useState(null);
    const [matchingEmployees, setMatchingEmployees] = useState(data);
    function padTo2Digits(num) {
        return num.toString().padStart(2, "0");
    }

    function padTo2DigitsTime(num) {
        return String(num).padStart(2, "0");
    }

    //     function handleDateChange(date) {
    //         const dateStr = new Date(date)
    //         const day = dateStr.getDate()-1; // get the day
    //         const month = dateStr.getMonth() + 1; // get the month (getMonth() returns month index starting from 0)
    //         const year = dateStr.getFullYear(); // get the year
    //         // Convert the selected date to a string in the format YYYY-MM-DD
    //         const timeDate = `${padTo2Digits(day)}/${padTo2Digits(month)}/${year}`;

    //         // Filter the employees whose workTime matches the selected date
    //         const matchingEmployees = data.filter(employee => {
    //             // Convert the employee's workTime to a date and then to a string in the format YYYY-MM-DD
    //             const employeeDate = new Date(employee.workTime);
    //             const formattedWorkTime = employeeDate.toLocaleDateString('en-GB', { timeZone: 'UTC' });
    //             // console.log(formattedWorkTime)
    //             return formattedWorkTime === timeDate;
    //         });
    //         setMatchingEmployees(matchingEmployees);
    //         // console.log(matchingEmployees)
    //         // console.log(timeDate);
    //         const today = new Date();
    //         const date1 = today.getDate(); // Ngày của tháng (từ 1 đến 31)
    //         const month1 = today.getMonth() + 1; // Tháng (từ 0 đến 11, nên cần cộng thêm 1 để có tháng từ 1 đến 12)
    //         const year1= today.getFullYear(); // Năm

    // // console.log(`Hôm nay là ngày ${date1} tháng ${month1} năm ${year1}`);
    //     }

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateStr = new Date(date)
        const day = dateStr.getDate() - 1;
        const month = dateStr.getMonth() + 1; // getMonth() returns a value from 0 to 11
        const year = dateStr.getFullYear();

        fetch(`http://localhost:5006/api/User/DateNow/${day}/${month}/${year}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Handle the response data
                setMatchingEmployees(data);
            })
            .catch(error => {
                console.error("Error:", error);
                // Handle the error
            });
    };

    const handleAddEmployeeClick = () => {
        setIdEmployee('');
        setUsername('');
        setDescription('');
        setWorkTime('');
        setSelectedWorkPlace(null);
        setIdEmployee('');
        setOpen(true);
    };

    const handleChange = (event, value) => {
        const selectedPlace = workPlace.find(
            (place) => place.workPlaceName === value
        );
        setSelectedWorkPlace(selectedPlace);
        setSelectedWorkPlaceId(selectedPlace ? selectedPlace.id : null);
        console.log(selectedPlace ? selectedPlace.id : "No place selected");
    };
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleWorkTimeChange = (event) => {
        console.log(workPlace);
        setWorkTime(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.target);
        const info = JSON.stringify({
            username: username,
            workPlaceId: selectedWorkPlaceId,
            description: description,
            workTime: workTime
        });
        fetch("http://localhost:5006/api/User/AddAllInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: info,
        })
            .then((response) => response.json())
            .then((data) => {
                setData((prevData) => [...prevData, data]);
                window.location.reload();
                setOpen(false);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleShowInfoEmployee = (id) => {
        fetch(`http://localhost:5006/api/User/AllInfo/${id}`)
            .then((response) => response.json())
            .then((data) => {
                // Set the state with the fetched data
                setUsername(data.username);
                setSelectedWorkPlaceId(data.workPlaceId);
                setDescription(data.description);
                setSelectedWorkPlace(data.workPlace.workPlaceName);
                setIdEmployee(data.id);
                setWorkTime(data.workTime);

                // Open the edit dialog
                setOpen(true);
                console.log(data.workTime);
                // console.log(data)
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleEdit = (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            username: username,
            workPlaceId: selectedWorkPlaceId,
            description: description,
            workTime: workTime,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        fetch(`http://localhost:5006/api/User/EditInfo/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setOpen(false);
                window.location.reload();
                console.log(result);
            })
            .catch((error) => console.log("error", error));
    };
    useEffect(() => {
        fetch("http://localhost:5006/api/User/DateNow")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setData(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);
    const handleDelete = (id) => {
        fetch(`http://localhost:5006/api/User/DeleteInfo/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Remove the deleted item from the state
                setData((prevData) => prevData.filter((item) => item.id !== id));
            })
            .catch((error) => console.error("Error:", error));
    };
    useEffect(() => {
        setMatchingEmployees(data);
    }, [data]);
    // useEffect(() => {
    //     fetch("http://localhost:5006/api/User/AllInfo")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data);
    //             setData(data);
    //         })
    //         .catch((error) => console.error("Error:", error));
    // }, []);


    useEffect(() => {
        fetch("http://localhost:5006/api/User/AllInfoWorkPlace")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setWorkPlace(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);
    return (
        <>

            <Grid sx={{ display: "flex", justifyContent: "end" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="帰社時間"
                        value={dayjs(currentDate)}
                        format="YYYY/MM/DD"
                        // defaultValue={dayjs(currentDate)}
                        // onChange={(newValue) => setWorkTime(newValue)}
                        onChange={(newValue) => {
                            // const formattedDate = dayjs(newValue).format('DD:MM:YYYY');
                            setSelectedDate(newValue);
                            // console.log(newValue);
                            handleDateChange(newValue);
                        }}

                    />
                </LocalizationProvider>

                <Button
                    variant="contained"
                    sx={{
                        float: "right",
                        marginBottom: "20px",
                        height: "55px",
                        marginLeft: "20px",
                    }}
                    onClick={handleAddEmployeeClick}
                >
                    勤務追加
                </Button>
            </Grid>

            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    sx={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    順番
                                </Typography>
                            </TableCell>
                            <TableCell width={"20%"} align="center">
                                <Typography
                                    sx={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    氏名
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                    行先
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                    帰社時間
                                </Typography>
                            </TableCell>
                            <TableCell align="center" width={"30%"}>
                                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                    備考
                                </Typography>
                            </TableCell>
                            <TableCell align="left">
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matchingEmployees.map((n, index) => {
                            matchingEmployees.sort((a, b) => new Date(b.workTime) - new Date(a.workTime));
                            // Convert workTime to a Date object
                            const date = new Date(n.workTime);
                            const day = date.getUTCDate();
                            const month = date.getUTCMonth() + 1;
                            const year = date.getUTCFullYear();
                            const hours = date.getUTCHours();
                            const minutes = date.getUTCMinutes();

                            return (
                                <TableRow key={n.id}>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "18px" }}>
                                            {index + 1}
                                        </Typography>
                                    </TableCell>
                                    <TableCell width={"20%"} component="th" align="center" scope="row">
                                        <Typography sx={{ fontSize: "18px" }}>
                                            {n.username}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            sx={{
                                                width: "100px",
                                                backgroundColor: statusColors[n.workPlace.id - 1],
                                                color: "black",
                                                fontWeight: "bold",
                                                fontSize: "18px"
                                            }}
                                            label={`${n.workPlace ? n.workPlace.workPlaceName : "N/A"
                                                }`}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography sx={{ fontSize: "18px" }}>
                                            {/* {n.workTime} */}
                                            {/* {year} {month} {day} */}

                                            {year}年{padTo2DigitsTime(month)}月{padTo2DigitsTime(day)}日  {padTo2DigitsTime(hours)}:{padTo2DigitsTime(minutes)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" width={"30%"}>
                                        <Typography sx={{ fontSize: "18px" }}>
                                            {n.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <EditIcon
                                            onClick={() => handleShowInfoEmployee(n.id)}
                                            className="button_edit"
                                            sx={{ cursor: "pointer", ":hover": { color: "blue" } }}
                                        />
                                        <DeleteIcon
                                            sx={{ cursor: "pointer", ":hover": { color: "red" } }}
                                            onClick={() => handleDelete(n.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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
                            float: "right",
                        }}
                    >
                        <Close />
                    </Button>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                        従業員情報
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                        <Box
                            component="form"
                            sx={{
                                "& > :not(style)": { m: 1, width: "25ch" },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Typography>
                                <TextField
                                    required
                                    id="outlined-basic"
                                    label="氏名"
                                    variant="outlined"
                                    sx={{
                                        width: "415px",
                                    }}
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </Typography>
                            <Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        required
                                        inputFormat="dd/MM/YYYY 
                                        HH:mm"

                                        label="帰社時間"
                                        sx={{
                                            marginTop: "20px",
                                            width: "415px",
                                        }}
                                        value={dayjs(workTime)}
                                        onChange={(selectedDate) => {
                                            setWorkTime(selectedDate);
                                        }}
                                    />
                                </LocalizationProvider>
                            </Typography>
                            <Typography>
                                <TextField
                                    required
                                    label="行先"
                                    value={selectedWorkPlaceId}
                                    onChange={(e) => setSelectedWorkPlaceId(e.target.value)}
                                    select
                                    sx={{
                                        marginTop: "20px",
                                        width: "415px",
                                    }}
                                >
                                    {workPlace.map((place) => (
                                        <MenuItem value={place.id}>{place.workPlaceName}</MenuItem>
                                    ))}
                                </TextField>
                            </Typography>
                            <Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="備考"
                                    variant="outlined"
                                    sx={{
                                        marginTop: "20px",
                                        width: "415px",
                                    }}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                marginTop: "30px",
                                display: "flex",
                                justifyContent: "center",
                                width: "415px",
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{
                                    marginRight: "10px",
                                }}
                                onClick={(e) =>
                                    idEmployee ? handleEdit(idEmployee) : handleSubmit(e)
                                }
                            >
                                保存
                            </Button>
                            <Button onClick={handleClose} variant="outlined" color="error">
                                キャンセル
                            </Button>
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
