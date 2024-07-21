import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    TextField
} from '@mui/material';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [open, setOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phone: '' });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/patients/');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewPatient({ firstName: '', lastName: '', email: '', phone: '' });
        setErrors({ firstName: '', lastName: '', email: '', phone: '' });
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (value.trim() === '') {
                    error = 'Este campo es requerido';
                }
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email inválido';
                }
                break;
            case 'phone':
                if (!/^\d{10}$/.test(value)) {
                    error = 'Teléfono debe tener 10 dígitos';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPatient({ ...newPatient, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const isFormValid = () => {
        return Object.values(errors).every(x => x === '') && 
               Object.values(newPatient).every(x => x !== '');
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            try {
                await axios.post('http://localhost:8000/api/patients/', newPatient);
                handleClose();
                fetchPatients();
            } catch (error) {
                console.error('Error creating patient', error);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Pacientes
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
                Agregar Paciente
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Teléfono</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.firstName}</TableCell>
                                <TableCell>{patient.lastName}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={newPatient.firstName}
                        onChange={handleInputChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Apellido"
                        type="text"
                        fullWidth
                        value={newPatient.lastName}
                        onChange={handleInputChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newPatient.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        value={newPatient.phone}
                        onChange={handleInputChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={!isFormValid()}>
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Patients;