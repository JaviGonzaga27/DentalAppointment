import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Paper, Typography, Box, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

moment.locale('es');
const localizer = momentLocalizer(moment);

function AppointmentCalendar() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patient: '',
        doctor: '',
        notes: '',
        date: null
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/appointments/');
            const formattedEvents = response.data.map(appointment => ({
                id: appointment.id,
                title: `Cita: ${appointment.patient}`,
                start: new Date(appointment.date),
                end: new Date(moment(appointment.date).add(1, 'hours')),
                patient: appointment.patient,
                doctor: appointment.doctor,
                notes: appointment.notes
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
    }, []);

    const handleSelectSlot = useCallback(({ start }) => {
        setNewAppointment(prev => ({ ...prev, date: start }));
        setIsDialogOpen(true);
    }, []);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setNewAppointment({
            patient: '',
            doctor: '',
            notes: '',
            date: null
        });
    };

    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleAppointmentSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/appointments/', {
                ...newAppointment,
                date: moment(newAppointment.date).format()
            });
            setEvents(prev => [...prev, {
                id: response.data.id,
                title: `Cita: ${newAppointment.patient}`,
                start: new Date(newAppointment.date),
                end: new Date(moment(newAppointment.date).add(1, 'hours')),
                patient: newAppointment.patient,
                doctor: newAppointment.doctor,
                notes: newAppointment.notes
            }]);
            handleDialogClose();
        } catch (error) {
            console.error('Error creating appointment', error);
        }
    };

    const pastelColors = [
        '#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA',
    ];

    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = pastelColors[event.id % pastelColors.length];
        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'black',
                border: 'none',
                display: 'block'
            }
        };
    };

    return (
        <Box sx={{ 
            height: '80vh', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden'
        }}>
            <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
                Calendario de Citas
            </Typography>
            <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    flexGrow: 1, 
                    height: isMobile ? 'calc(100% - 200px)' : '100%', 
                    overflow: 'hidden'
                }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        eventPropGetter={eventStyleGetter}
                        messages={{
                            next: "Siguiente",
                            previous: "Anterior",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día"
                        }}
                    />
                </Box>
                {selectedEvent && (
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            width: isMobile ? 'auto' : '300px',
                            height: isMobile ? '200px' : 'auto',
                            overflowY: 'auto'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Detalles de la Cita
                        </Typography>
                        <Typography><strong>Paciente:</strong> {selectedEvent.patient}</Typography>
                        <Typography><strong>Doctor:</strong> {selectedEvent.doctor}</Typography>
                        <Typography><strong>Fecha:</strong> {moment(selectedEvent.start).format('LLL')}</Typography>
                        <Typography><strong>Notas:</strong> {selectedEvent.notes}</Typography>
                    </Paper>
                )}
            </Box>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="patient"
                        label="Paciente"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newAppointment.patient}
                        onChange={handleAppointmentChange}
                    />
                    <TextField
                        margin="dense"
                        name="doctor"
                        label="Doctor"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newAppointment.doctor}
                        onChange={handleAppointmentChange}
                    />
                    <TextField
                        margin="dense"
                        name="notes"
                        label="Notas"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={newAppointment.notes}
                        onChange={handleAppointmentChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancelar</Button>
                    <Button onClick={handleAppointmentSubmit}>Agendar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AppointmentCalendar;