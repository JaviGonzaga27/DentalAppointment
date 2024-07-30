import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function Users() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [openR, setOpenRol] = useState(false);
    const [newUser, setNewUser] = useState({
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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/patients/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewUser({
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


    const handleOpenRol = () => {
        setOpenRol(true);
    };

    const handleCloseRol = () => {
        setOpenRol(false);
        setNewUser({
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
            setNewUser({ ...newUser, [name]: value });
        } else {
            setNewUser({
                ...newUser,
                user: {
                    ...newUser.user,
                    [name]: value
                }
            });
        }
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const isFormValid = () => {
        return Object.values(errors).every(x => x === '') && 
               newUser.user.first_name !== '' &&
               newUser.user.last_name !== '' &&
               newUser.user.email !== '' &&
               newUser.phone !== '' &&
               newUser.password !== '';
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            console.log('Datos a enviar:', newUser);  // Añade esta línea
            try {
                const response = await axios.post('http://localhost:8000/api/users/', newUser);
                if (response.status === 201) {
                    handleClose();
                    fetchUsers();
                }
            } catch (error) {
                console.error('Error creating user', error);
                console.error('Error response:', error.response);  // Añade esta línea
                // Aquí podrías manejar los errores, por ejemplo mostrando un mensaje al usuario
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Usuarios
            </Typography>
     <Button variant="contained" color="primary" onClick={handleOpen}>
                Agregar Usuario
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Acciones</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      
                            <TableRow >
                                <TableCell>Javier Gonzaga</TableCell>
                                <TableCell>Administrador</TableCell>
                                <TableCell>
                                    <td class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-177gid-MuiTableCell-root">
                                
                                    <button onClick={handleOpenRol} class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-sizeMedium css-1kuq5xv-MuiButtonBase-root-MuiIconButton-root" >
                                    <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"  >
                                    </svg>
                                        Asignar rol
                                    </button>
                                    <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-sizeMedium css-1kuq5xv-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" aria-label="edit">
                                        <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                                        </svg><span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
                                        </button>
                                    <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorError MuiIconButton-sizeMedium css-1jo1f9u-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" aria-label="delete">
                                        <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                                        </svg><span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
                                        </button></td>
                                </TableCell>
                              
                            </TableRow>
                        
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="first_name"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={newUser.user.first_name}
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
                        value={newUser.user.last_name}
                        onChange={handleInputChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                    />
                    <TextField
                        margin="dense"
                        name="rol"
                        label="Rol"
                        type="text"
                        fullWidth
                        value={newUser.user.rol}
                        onChange={handleInputChange}
                        error={!!errors.rol}
                        helperText={errors.rol}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        value={newUser.phone}
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
                        value={newUser.password}
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





            <Dialog open={openR} onClose={handleCloseRol}>
                <DialogTitle>Rol</DialogTitle>
                <DialogContent>
                   Reasignar Rol: 
                <select class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-sizeMedium css-1kuq5xv-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" aria-label="edit">
                     <option value="administrador">Administrador</option>
                     <option value="doctor">Doctor</option>
                     <option value="paciente">Paciente</option>
                </select>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRol} color="primary">
                        Guardar
                    </Button>
  
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Users;