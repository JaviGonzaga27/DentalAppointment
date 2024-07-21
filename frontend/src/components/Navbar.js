import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        // Aquí podrías añadir un mensaje de confirmación o un Snackbar
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Dental Clinic
                </Typography>
                <Tooltip title="Notificaciones">
                    <IconButton color="inherit" aria-label="mostrar notificaciones">
                        <NotificationsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Perfil">
                    <IconButton
                        size="large"
                        aria-label="cuenta del usuario actual"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => navigate('/profile')}
                    >
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
                <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;