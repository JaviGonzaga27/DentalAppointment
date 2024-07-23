import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, useTheme } from '@mui/material';
import { IconDashboard, IconUsers, IconCalendarEvent, IconReportAnalytics, IconSettings, IconUserCircle } from '@tabler/icons-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import logoImage from '../assets/logo.png';

const menuItems = [
    { icon: IconDashboard, title: 'Dashboard', path: '/dashboard' },
    { icon: IconUsers, title: 'Usuarios', path: '/dashboard/users', },
    { icon: IconUserCircle, title: 'Pacientes', path: '/dashboard/patients', },
    { icon: IconUserCircle, title: 'Doctores', path: '/dashboard/doctors', },
    { icon: IconCalendarEvent, title: 'Citas', path: '/dashboard/appointments', },
    { icon: IconReportAnalytics, title: 'Reportes', path: '/dashboard/reports', },
];

const Sidebar = () => {
    const theme = useTheme();
    const location = useLocation();

    const NavItem = ({ item, level }) => {
        const isSelected = location.pathname === item.path;

        return (
            <ListItem
                button
                component={Link}
                to={item.path}
                sx={{
                    mb: 0.5,
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`,
                    '&:hover': {
                        bgcolor: theme.palette.primary.lighter
                    },
                    '&.Mui-selected': {
                        bgcolor: theme.palette.primary.lighter,
                        borderRight: `2px solid ${theme.palette.primary.main}`,
                        color: theme.palette.primary.main,
                        '&:hover': {
                            bgcolor: theme.palette.primary.lighter,
                            color: theme.palette.primary.main
                        }
                    }
                }}
                selected={isSelected}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 36,
                        color: isSelected ? theme.palette.primary.main : theme.palette.text.primary
                    }}
                >
                    <item.icon stroke={1.5} size="1.3rem" />
                </ListItemIcon>
                <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ variant: 'body1' }}
                />
            </ListItem>
        );
    };

    return (
        <Box sx={{ height: '100%', boxSizing: 'border-box' }}>
            <PerfectScrollbar
                component="div"
                style={{
                    height: 'calc(100vh - 88px)',
                    paddingLeft: '16px',
                    paddingRight: '16px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                        mb: 2
                    }}
                >
                    <img 
                        src={logoImage} 
                        alt="GAP Dental Logo" 
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '120px' // Ajusta esto según el tamaño que desees
                        }}
                    />
                </Box>
                <Divider sx={{ mt: 0.5, mb: 1.5 }} />
                <List
                    sx={{
                        '& .MuiListItemIcon-root': {
                            minWidth: 28,
                            marginRight: 1
                        },
                        '& .MuiListItemText-primary': {
                            fontSize: '14px'
                        }
                    }}
                >
                    {menuItems.map((item, index) => (
                        <NavItem key={index} item={item} level={1} />
                    ))}
                </List>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <NavItem
                    item={{
                        icon: IconSettings,
                        title: 'Configuración',
                        path: '/dashboard/settings'
                    }}
                    level={1}
                />
            </PerfectScrollbar>
        </Box>
    );
};

export default Sidebar;