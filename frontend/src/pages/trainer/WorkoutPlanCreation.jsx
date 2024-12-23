//src/pages/trainer/WorkoutPlanCreation.jsx

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
  Chip,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Plus, Trash2, VideoIcon, PlayIcon } from 'lucide-react';
import { createWorkoutPlan, fetchTrainerClients } from '../../utils/api';
import { useClients } from '../../store/ClientsContext';

// Exercise Types Enum
const EXERCISE_TYPES = [
  { value: 'HIIT', label: 'HIIT' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'STRENGTH', label: 'Strength' },
  { value: 'STRETCH', label: 'Stretch' }
];

// Video Library Modal Component
const VideoLibraryModal = ({ 
  open, 
  onClose, 
  onVideoSelect 
}) => {
  // ... (keep the existing VideoLibraryModal implementation)
};

const WorkoutPlanCreation = () => {
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [workouts, setWorkouts] = useState([
    { 
      type: '', 
      exercise: '', 
      reps: '', 
      sets: '', 
      duration: '', 
      laps: '', 
      notes: '',
      videos: []
    }
  ]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) throw new Error('User data not found.');
    
        const user = JSON.parse(userString);
        if (!user?.id || user.role !== 'trainer') throw new Error('Unauthorized');
    
        const response = await api.get(`/trainer/clients/${user.id}`);
        setClients(response.data.map(item => ({
          id: item["client.id"],
          first_name: item["client.first_name"], 
          last_name: item["client.last_name"]
        })));
      } catch (err) {
        console.error('Error:', err);
      }
    };
   
    fetchClients();
   }, []);

  const addWorkout = () => {
    setWorkouts([
      ...workouts, 
      { 
        type: '', 
        exercise: '', 
        reps: '', 
        sets: '', 
        duration: '', 
        laps: '', 
        notes: '',
        videos: []
      }
    ]);
  };

  const updateWorkout = (index, field, value) => {
    const newWorkouts = [...workouts];
    newWorkouts[index][field] = value;
    setWorkouts(newWorkouts);
  };

  const removeWorkout = (index) => {
    const newWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(newWorkouts);
  };

  const openVideoModal = (workoutIndex) => {
    setCurrentWorkoutIndex(workoutIndex);
    setIsVideoModalOpen(true);
  };

  const handleVideoSelect = (selectedVideos) => {
    const newWorkouts = [...workouts];
    newWorkouts[currentWorkoutIndex].videos = selectedVideos;
    setWorkouts(newWorkouts);
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    const workoutPlanData = {
      name: planName,
      description: planDescription,
      clientId: selectedClient,
      workouts: workouts
    };

    try {
      const response = await createWorkoutPlan(workoutPlanData);
      console.log('Workout plan created:', response.data);
      alert('Workout plan created and assigned to client successfully!');
      // Reset form or redirect to another page
    } catch (error) {
      console.error('Error creating workout plan:', error);
      alert('Failed to create workout plan. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create Workout Plan
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plan Name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plan Description"
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            margin="normal"
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
                  {`${client.first_name} ${client.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {workouts.map((workout, index) => (
        <Paper key={index} sx={{ p: 3, mt: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Workout {index + 1}</Typography>
            {workouts.length > 1 && (
              <IconButton onClick={() => removeWorkout(index)} color="error">
                <Trash2 />
              </IconButton>
            )}
          </Box>
          
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={workout.notes}
                onChange={(e) => updateWorkout(index, 'notes', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                startIcon={<VideoIcon />}
                onClick={() => openVideoModal(index)}
              >
                Add Videos
              </Button>
              {workout.videos.length > 0 && (
                <Box mt={1}>
                  {workout.videos.map(video => (
                    <Chip 
                      key={video.id} 
                      label={video.title} 
                      onDelete={() => {
                        const newWorkouts = [...workouts];
                        newWorkouts[index].videos = newWorkouts[index].videos.filter(v => v.id !== video.id);
                        setWorkouts(newWorkouts);
                      }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button 
          variant="outlined" 
          startIcon={<Plus />}
          onClick={addWorkout}
        >
          Add Another Workout
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
        >
          Create and Assign Workout Plan
        </Button>
      </Box>

      {isVideoModalOpen && (
        <VideoLibraryModal
          open={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          onVideoSelect={handleVideoSelect}
        />
      )}
    </Box>
  );
};

export default WorkoutPlanCreation;
