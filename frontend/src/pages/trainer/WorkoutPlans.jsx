// src/pages/trainer/WorkoutPlanCreation.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api'; // Ensure this is correctly configured

const EXERCISE_TYPES = [
  { value: 'HIIT', label: 'HIIT' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'STRENGTH', label: 'Strength' },
  { value: 'STRETCH', label: 'Stretch' },
];

const WorkoutPlanCreation = () => {
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [workouts, setWorkouts] = useState([
    { type: '', exercise: '', reps: '', sets: '', duration: '', laps: '', notes: '' },
  ]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) throw new Error('User data not found');
  
        const user = JSON.parse(userString);
        if (!user.id || user.role !== 'trainer') throw new Error('Invalid access');
  
        const response = await api.get(`/trainer/clients/${user.id}`);
        setClients(response.data.map(item => ({
          id: item.client_id,
          name: item.client.username // using username since first/last name are null
        })));
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
      setIsLoading(false);
    };
  
    fetchClients();
  }, []);

  const addWorkout = () => {
    setWorkouts([...workouts, { type: '', exercise: '', reps: '', sets: '', duration: '', laps: '', notes: '' }]);
  };

  const updateWorkout = (index, field, value) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index][field] = value;
    setWorkouts(updatedWorkouts);
  };

  const removeWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      alert('Please select a client.');
      return;
    }

    const workoutPlanData = {
      name: planName,
      description: planDescription,
      clientId: selectedClient,
      workouts,
    };

    try {
      const response = await api.post('/workout-plans', workoutPlanData);
      console.log('Workout plan created:', response.data);
      alert('Workout plan successfully created and assigned!');
      setPlanName('');
      setPlanDescription('');
      setWorkouts([{ type: '', exercise: '', reps: '', sets: '', duration: '', laps: '', notes: '' }]);
      setSelectedClient('');
    } catch (error) {
      console.error('Error creating workout plan:', error);
      alert('Failed to create workout plan.');
    }
  };

  if (isLoading) return <Typography>Loading clients...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create Workout Plan
      </Typography>

      {/* Plan Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plan Name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plan Description"
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="client-select-label">Assign to Client</InputLabel>
            <Select
              labelId="client-select-label"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              label="Assign to Client"
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Workouts */}
      {workouts.map((workout, index) => (
        <Paper key={index} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Workout {index + 1}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Exercise Type"
                value={workout.type}
                onChange={(e) => updateWorkout(index, 'type', e.target.value)}
              >
                {EXERCISE_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exercise"
                value={workout.exercise}
                onChange={(e) => updateWorkout(index, 'exercise', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Reps"
                value={workout.reps}
                onChange={(e) => updateWorkout(index, 'reps', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Sets"
                value={workout.sets}
                onChange={(e) => updateWorkout(index, 'sets', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Duration (mins)"
                value={workout.duration}
                onChange={(e) => updateWorkout(index, 'duration', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Laps"
                value={workout.laps}
                onChange={(e) => updateWorkout(index, 'laps', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="outlined" startIcon={<Plus />} onClick={addWorkout}>
          Add Another Workout
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create and Assign Workout Plan
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutPlanCreation;
