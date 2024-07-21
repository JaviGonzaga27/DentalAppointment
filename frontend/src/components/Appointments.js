import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [open, setOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        doctorId: '',
        date: dayjs(),
        description: ''
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/appointments/');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/patients/');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/doctors/');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewAppointment({ patientId: '', doctorId: '', date: dayjs(), description: '' });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAppointment({ ...newAppointment, [name]: value });
    };

    const handleDateChange = (newDate) => {
        setNewAppointment({ ...newAppointment, date: newDate });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8000/api/appointments/', newAppointment);
            handleClose();
            fetchAppointments();
        } catch (error) {
            console.error('Error creating appointment', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Citas
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
                Agregar Cita
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Doctor</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Descripción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.patient}</TableCell>
                                <TableCell>{appointment.doctor}</TableCell>
                                <TableCell>{dayjs(appointment.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                                <TableCell>{appointment.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Agregar Nueva Cita</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Paciente</InputLabel>
                        <Select
                            name="patientId"
                            value={newAppointment.patientId}
                            onChange={handleInputChange}
                        >
                            {patients.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    {`${patient.firstName} ${patient.lastName}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Doctor</InputLabel>
                        <Select
                            name="doctorId"
                            value={newAppointment.doctorId}
                            onChange={handleInputChange}
                        >
                            {doctors.map((doctor) => (
                                <MenuItem key={doctor.id} value={doctor.id}>
                                    {`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Fecha y Hora"
                            value={newAppointment.date}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        name="description"
                        label="Descripción"
                        type="text"
                        fullWidth
                        value={newAppointment.description}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Appointments;