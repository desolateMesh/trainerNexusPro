import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Button
} from '@mui/material';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse'; 
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const ClientSchedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': require('date-fns/locale/en-US') }
  });

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const clientId = JSON.parse(localStorage.getItem('user'))?.id;

      const response = await fetch('http://localhost:5000/api/client/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch sessions');

      const sessions = await response.json();
      
      const formattedEvents = sessions.map(session => ({
        id: session.id,
        title: `${session.session_type} with ${session.first_name} ${session.last_name}`,
        start: new Date(session.start_time),
        end: new Date(session.end_time),
        trainer: `${session.first_name} ${session.last_name}`,
        type: session.session_type,
        notes: session.notes
      }));

      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  if (loading) return <Box sx={{ p: 2 }}>Loading...</Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: 'calc(100vh - 150px)' }}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day']}
          defaultView="week"
        />
      </Paper>

      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Session Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box><strong>Session Type:</strong> {selectedEvent?.type}</Box>
            <Box><strong>Trainer:</strong> {selectedEvent?.trainer}</Box>
            <Box>
              <strong>Time:</strong> {selectedEvent && 
                `${format(selectedEvent.start, 'PPp')} - ${format(selectedEvent.end, 'p')}`
              }
            </Box>
            {selectedEvent?.notes && (
              <Box>
                <strong>Notes:</strong>
                <Box sx={{ mt: 1 }}>{selectedEvent.notes}</Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClientSchedule;