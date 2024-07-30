import React, { useState } from 'react';
import { Box, Paper, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function AppointmentCalendar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([
        { title: 'Cita con Dr. García', date: '2024-07-23' },
        { title: 'Revisión dental', date: '2024-07-25' }
    ]);
    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        doctor: '',
        treatment: '',
        description: '',
        dateTime: null
    });

    const theme = createTheme({
        palette: {
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
        },
    });

    const handleDateClick = (arg) => {
        setNewAppointment({ ...newAppointment, dateTime: dayjs(arg.date) });
        setIsModalOpen(true);
    }

    const handleEventClick = (info) => {
        alert('Cita seleccionada: ' + info.event.title);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAppointment({ ...newAppointment, [name]: value });
    }

    const handleDateTimeChange = (newValue) => {
        setNewAppointment({ ...newAppointment, dateTime: newValue });
    }

    const handleSubmit = () => {
        const newEvent = {
            title: `${newAppointment.patientName} - ${newAppointment.treatment}`,
            date: newAppointment.dateTime.toISOString(),
            extendedProps: {
                doctor: newAppointment.doctor,
                description: newAppointment.description
            }
        };
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
        setNewAppointment({
            patientName: '',
            doctor: '',
            treatment: '',
            description: '',
            dateTime: null
        });
    }

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
                    <Button variant="contained" onClick={() => setIsModalOpen(true)} sx={{ mb: 2 }}>
                        Agendar Cita
                    </Button>
                    <Paper elevation={3}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            }}
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            editable={true}
                            selectable={true}
                            height="auto"
                            themeSystem="standard"
                            sx={{
                                '& .fc-toolbar-title': { fontSize: '1.5rem' },
                                '& .fc-button': {
                                    textTransform: 'capitalize',
                                    fontWeight: 'normal',
                                },
                                '& .fc-event': {
                                    backgroundColor: theme.palette.primary.main,
                                    borderColor: theme.palette.primary.main,
                                },
                            }}
                        />
                    </Paper>
                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <h2>Agendar Nueva Cita</h2>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="patientName"
                                label="Nombre del Paciente"
                                value={newAppointment.patientName}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="doctor"
                                label="Doctor"
                                value={newAppointment.doctor}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="treatment"
                                label="Tratamiento"
                                value={newAppointment.treatment}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                name="description"
                                label="Descripción"
                                multiline
                                rows={4}
                                value={newAppointment.description}
                                onChange={handleInputChange}
                            />
                            <DateTimePicker
                                label="Fecha y Hora"
                                value={newAppointment.dateTime}
                                onChange={handleDateTimeChange}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                                Guardar Cita
                            </Button>
                        </Box>
                    </Modal>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default AppointmentCalendar;