import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function AppointmentCalendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/appointments/');
            const formattedEvents = response.data.map(appointment => ({
                title: `Cita: ${appointment.patient}`,
                start: new Date(appointment.date),
                end: new Date(moment(appointment.date).add(1, 'hours')),
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
            />
        </div>
    );
}

export default AppointmentCalendar;