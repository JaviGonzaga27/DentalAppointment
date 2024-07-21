import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Avatar,
    Box
} from '@mui/material';

function ProfileSettings() {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '', // Para doctores
        address: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Asume que tienes un endpoint para obtener el perfil del usuario
            const response = await axios.get('http://localhost:8000/api/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile', error);
        }
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
        setProfile({ ...profile, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.values(errors).every(x => x === '')) {
            try {
                // Asume que tienes un endpoint para actualizar el perfil
                await axios.put('http://localhost:8000/api/profile/', profile);
                alert('Perfil actualizado con éxito');
            } catch (error) {
                console.error('Error updating profile', error);
                alert('Error al actualizar el perfil');
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar
                        alt="Profile Picture"
                        src="/path-to-profile-picture.jpg"
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h4" gutterBottom>
                        Configuración de Perfil
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleInputChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Apellido"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleInputChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                name="phone"
                                value={profile.phone}
                                onChange={handleInputChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Especialización"
                                name="specialization"
                                value={profile.specialization}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Actualizar Perfil
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default ProfileSettings;