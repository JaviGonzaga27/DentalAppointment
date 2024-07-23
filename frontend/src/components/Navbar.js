import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Tooltip, Badge, useTheme, styled, alpha } from '@mui/material';
import { IconBell, IconSearch, IconSettings, IconUser, IconLogout, IconMenu2 } from '@tabler/icons-react';
import { motion } from "framer-motion";
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import InputBase from '@mui/material/InputBase';

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:focus-within': {
        boxShadow: '0 5px 15px 0 rgba(0,0,0,0.25)',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        '&::placeholder': {
            color: alpha(theme.palette.common.white, 0.7),
            opacity: 1,
        },
    },
}));

function Navbar({ open, handleDrawerOpen }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const profilePopupState = usePopupState({ variant: 'popover', popupId: 'profileMenu' });
    const notificationsPopupState = usePopupState({ variant: 'popover', popupId: 'notificationsMenu' });

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/');
    };

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            console.log('Searching for:', searchQuery);
            // Implement search logic here
        }
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
                ml: { sm: `${open ? drawerWidth : 0}px` },
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <IconMenu2 />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    GAP Dental
                </Typography>

                <Search>
                    <SearchIconWrapper>
                        <IconSearch />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Buscar…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearch}
                    />
                </Search>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Notificaciones">
                        <IconButton color="inherit" {...bindTrigger(notificationsPopupState)}>
                            <Badge badgeContent={4} color="error">
                                <IconBell />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu {...bindMenu(notificationsPopupState)}>
                        <MenuItem onClick={notificationsPopupState.close}>Notificación 1</MenuItem>
                        <MenuItem onClick={notificationsPopupState.close}>Notificación 2</MenuItem>
                        <MenuItem onClick={notificationsPopupState.close}>Notificación 3</MenuItem>
                        <MenuItem onClick={notificationsPopupState.close}>Notificación 4</MenuItem>
                        <MenuItem onClick={notificationsPopupState.close}>Ver todas</MenuItem>
                    </Menu>

                    <Tooltip title="Perfil">
                        <IconButton {...bindTrigger(profilePopupState)}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                                    <IconUser size="1.3rem" />
                                </Avatar>
                            </motion.div>
                        </IconButton>
                    </Tooltip>
                </Box>

                <Menu {...bindMenu(profilePopupState)}>
                    <MenuItem onClick={() => { profilePopupState.close(); navigate('/profile'); }}>
                        <IconUser size="1.2rem" style={{ marginRight: 8 }} /> Perfil
                    </MenuItem>
                    <MenuItem onClick={() => { profilePopupState.close(); navigate('/settings'); }}>
                        <IconSettings size="1.2rem" style={{ marginRight: 8 }} /> Configuración
                    </MenuItem>
                    <MenuItem onClick={() => { profilePopupState.close(); handleLogout(); }}>
                        <IconLogout size="1.2rem" style={{ marginRight: 8 }} /> Cerrar sesión
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;