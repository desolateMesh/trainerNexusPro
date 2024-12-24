import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { createWorkoutPlan } from '../../utils/api'; 


const EXERCISE_TYPES = [
  { value: 'HIIT', label: 'HIIT' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'STRENGTH', label: 'Strength' },
  { value: 'STRETCH', label: 'Stretch' }
];

const WorkoutPlanCreation = () => {
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [workouts, setWorkouts] = useState([{
    type: '',
    exercise: '',
    reps: '',
    sets: '',
    duration: '',
    laps: '',
    notes: ''
  }]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) throw new Error('User not found');

        const response = await api.get(`/trainer/clients/${user.id}`);
        setClients(response.data.map(item => ({
          id: item["client.id"],
          name: `${item["client.first_name"]} ${item["client.last_name"]}`
        })));
      } catch (err) {
        setError('Failed to fetch clients');
        console.error('Error:', err);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const workoutPlanData = {
        name: planName,
        description: planDescription,
        client_id: selectedClient,
        exercises: workouts.map(w => ({
          type: w.type,
          exercise_name: w.exercise,
          reps: parseInt(w.reps) || 0,
          sets: parseInt(w.sets) || 0,
          duration: parseInt(w.duration) || 0,
          laps: parseInt(w.laps) || 0,
          notes: w.notes
        }))
      };

      await createWorkoutPlan(workoutPlanData);
      resetForm();
      alert('Workout plan created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workout plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPlanName('');
    setPlanDescription('');
    setWorkouts([{ type: '', exercise: '', reps: '', sets: '', duration: '', laps: '', notes: '' }]);
    setSelectedClient('');
  };

  const addWorkout = () => setWorkouts([...workouts, { 
    type: '', exercise: '', reps: '', sets: '', duration: '', laps: '', notes: '' 
  }]);

  const updateWorkout = (index, field, value) => {
    const newWorkouts = [...workouts];
    newWorkouts[index][field] = value;
    setWorkouts(newWorkouts);
  };

  const removeWorkout = (index) => {
    if (workouts.length > 1) {
      setWorkouts(workouts.filter((_, i) => i !== index));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Create Workout Plan</Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plan Name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Assign to Client</InputLabel>
            <Select
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Plan Description"
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
          />
        </Grid>
      </Grid>

      {workouts.map((workout, index) => (
        <Paper key={index} sx={{ p: 3, mt: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Exercise {index + 1}</Typography>
            <IconButton onClick={() => removeWorkout(index)} disabled={workouts.length === 1}>
              <Trash2 />
            </IconButton>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                label="Exercise Type"
                value={workout.type}
                onChange={(e) => updateWorkout(index, 'type', e.target.value)}
              >
                {EXERCISE_TYPES.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Exercise Name"
                value={workout.exercise}
                onChange={(e) => updateWorkout(index, 'exercise', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Reps"
                value={workout.reps}
                onChange={(e) => updateWorkout(index, 'reps', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Sets"
                value={workout.sets}
                onChange={(e) => updateWorkout(index, 'sets', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Duration (mins)"
                value={workout.duration}
                onChange={(e) => updateWorkout(index, 'duration', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Laps"
                value={workout.laps}
                onChange={(e) => updateWorkout(index, 'laps', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                value={workout.notes}
                onChange={(e) => updateWorkout(index, 'notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<Plus />}
          onClick={addWorkout}
        >
          Add Exercise
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Create Workout Plan
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutPlanCreation;