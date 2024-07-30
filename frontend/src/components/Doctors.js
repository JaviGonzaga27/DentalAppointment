import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
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
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/patients/');
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
        setNewDoctor({
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
            setNewDoctor({ ...newDoctor, [name]: value });
        } else {
            setNewDoctor({
                ...newDoctor,
                user: {
                    ...newDoctor.user,
                    [name]: value
                }
            });
        }
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const isFormValid = () => {
        return Object.values(errors).every(x => x === '') && 
               newDoctor.user.first_name !== '' &&
               newDoctor.user.last_name !== '' &&
               newDoctor.user.email !== '' &&
               newDoctor.phone !== '' &&
               newDoctor.password !== '';
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            console.log('Datos a enviar:', newDoctor);  // Añade esta línea
            try {
                const response = await axios.post('http://localhost:8000/api/patients/', newDoctor);
                if (response.status === 201) {
                    handleClose();
                    fetchDoctors();
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
                Doctores
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
                Agregar Doctor
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Especialización</TableCell>
                            <TableCell>Teléfono</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                            <TableRow >
                                <TableCell>Francisco</TableCell>
                                <TableCell>Terán</TableCell>
                                <TableCell>Franteran@gapdental.com</TableCell>
                                <TableCell>Cirujano</TableCell>
                                <TableCell>0987686148</TableCell>
                            </TableRow>
                      
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Agregar Nuevo Doctor</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="first_name"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={newDoctor.user.first_name}
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
                        value={newDoctor.user.last_name}
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
                        value={newDoctor.user.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        margin="dense"
                        name="specialization"
                        label="Especializacion"
                        type="text"
                        fullWidth
                        value={newDoctor.user.specialization}
                        onChange={handleInputChange}
                        error={!!errors.specialization}
                        helperText={errors.specialization}
                    />  
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        value={newDoctor.phone}
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
                        value={newDoctor.password}
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

export default Doctors;