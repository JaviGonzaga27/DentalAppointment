import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';

function Sidebar() {
    return (
        <List>
            <ListItem button component={Link} to="/dashboard/users">
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/patients">
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Pacientes" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/appointments">
                <ListItemIcon>
                    <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Citas" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/reports">
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reportes" />
            </ListItem>
        </List>
    );
}

export default Sidebar;