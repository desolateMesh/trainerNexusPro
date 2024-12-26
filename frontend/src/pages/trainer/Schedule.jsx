import React, { useState, useEffect } from 'react';
import {
  Box, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar
} from '@mui/material';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const SESSION_TYPES = [
  'Strength Training',
  'HIIT Session', 
  'Flexibility & Mobility',
  'Cardio',
  'Recovery'
];

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newEvent, setNewEvent] = useState({
    client_id: '',
    session_type: '',
    start_time: null,
    end_time: null,
    notes: ''
  });

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': require('date-fns/locale/en-US') }
  });

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const trainerId = JSON.parse(localStorage.getItem('user'))?.id;

      const clientsRes = await fetch(`http://localhost:5000/api/trainer/clients/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!clientsRes.ok) {
        throw new Error('Failed to fetch clients');
      }

      const clientsData = await clientsRes.json();
      setClients(clientsData.filter(client => client.status === 'active'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/training-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          client_id: newEvent.client_id,
          session_type: newEvent.session_type,
          start_time: newEvent.start_time,
          end_time: newEvent.end_time,
          notes: newEvent.notes
        })
      });
  
      console.log('Response:', await response.text()); // Add this for debugging
      
      if (!response.ok) throw new Error('Failed to create session');
      setSuccess(true);
      setOpenModal(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent(prev => ({
      ...prev,
      start_time: start,
      end_time: end
    }));
    setOpenModal(true);
  };

  if (loading) return <Box p={2}>Loading...</Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: 'calc(100vh - 150px)' }}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          views={['month', 'week', 'day']}
          defaultView="week"
        />
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Schedule New Session</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={newEvent.client_id}
                  label="Client"
                  onChange={(e) => setNewEvent(prev => ({ 
                    ...prev, 
                    client_id: e.target.value 
                  }))}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.client.id} value={client.client.id}>
                      {client.client.first_name} {client.client.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Session Type</InputLabel>
                <Select
                  value={newEvent.session_type}
                  label="Session Type"
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev,
                    session_type: e.target.value
                  }))}
                >
                  {SESSION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DateTimePicker
                label="Start Time"
                value={newEvent.start_time}
                onChange={(newValue) => setNewEvent(prev => ({
                  ...prev,
                  start_time: newValue
                }))}
                slotProps={{ textField: { fullWidth: true } }}
              />

              <DateTimePicker
                label="End Time"
                value={newEvent.end_time}
                onChange={(newValue) => setNewEvent(prev => ({
                  ...prev,
                  end_time: newValue
                }))}
                minDateTime={newEvent.start_time}
                slotProps={{ textField: { fullWidth: true } }}
              />

              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newEvent.notes}
                onChange={(e) => setNewEvent(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleAddSession} variant="contained">Add Session</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Session scheduled successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default Schedule;