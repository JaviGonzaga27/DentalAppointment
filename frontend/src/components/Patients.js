import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [open, setOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({
        user: {
            first_name: '',
            last_name: '',
            email: '',
        },
        phone: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        }
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
        setNewPatient({
            user: {
                first_name: '',
                last_name: '',
                email: '',
            },
            phone: '',
            password: ''
        });
        setErrors({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: ''
        });
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'first_name':
            case 'last_name':
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
            case 'password':
                if (value.length < 8) {
                    error = 'La contraseña debe tener al menos 8 caracteres';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone' || name === 'password') {
            setNewPatient({ ...newPatient, [name]: value });
        } else {
            setNewPatient({
                ...newPatient,
                user: {
                    ...newPatient.user,
                    [name]: value
                }
            });
        }
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const isFormValid = () => {
        return Object.values(errors).every(x => x === '') && 
               newPatient.user.first_name !== '' &&
               newPatient.user.last_name !== '' &&
               newPatient.user.email !== '' &&
               newPatient.phone !== '' &&
               newPatient.password !== '';
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            console.log('Datos a enviar:', newPatient);  // Añade esta línea
            try {
                const response = await axios.post('http://localhost:8000/api/patients/', newPatient);
                if (response.status === 201) {
                    handleClose();
                    fetchPatients();
                }
            } catch (error) {
                console.error('Error creating patient', error);
                console.error('Error response:', error.response);  // Añade esta línea
                // Aquí podrías manejar los errores, por ejemplo mostrando un mensaje al usuario
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
                                <TableCell>{patient.user.first_name}</TableCell>
                                <TableCell>{patient.user.last_name}</TableCell>
                                <TableCell>{patient.user.email}</TableCell>
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
                        name="first_name"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={newPatient.user.first_name}
                        onChange={handleInputChange}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                    />
                    <TextField
                        margin="dense"
                        name="last_name"
                        label="Apellido"
                        type="text"
                        fullWidth
                        value={newPatient.user.last_name}
                        onChange={handleInputChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newPatient.user.email}
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
                    <TextField
                        margin="dense"
                        name="password"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        value={newPatient.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password}
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