import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  Button,
  Grid,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ChevronDown, Play, CheckCircle } from 'lucide-react';
import { fetchClientWorkouts } from '../../utils/api';

const ClientWorkout = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const clientId = localStorage.getItem('userId'); // Assuming you store the client's ID in localStorage
        if (!clientId) {
          throw new Error('Unauthorized: Not a client');
        }

        const response = await fetchClientWorkouts(clientId);
        if (response.data.length === 0) {
          setError('No workouts assigned yet.');
        } else {
          setWorkoutPlan(response.data[0]); // Assuming one workout is assigned at a time
        }
      } catch (err) {
        console.error('Error fetching workout plans:', err);
        setError(err.message || 'Failed to fetch workout plans');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, []);

  const handleExerciseComplete = (index) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNotesChange = (index, value) => {
    setNotes((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const calculateProgress = () => {
    if (!workoutPlan) return 0;
    const completed = Object.values(completedExercises).filter((v) => v).length;
    return (completed / workoutPlan.workouts.length) * 100;
  };

  const handleSubmitWorkout = () => {
    const workoutData = {
      planId: workoutPlan.id,
      completed: completedExercises,
      notes: notes,
      completedAt: new Date().toISOString(),
    };
    console.log('Submitting workout:', workoutData);
    // TODO: Implement API call to save workout completion
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!workoutPlan) {
    return (
      <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>
        No workout plan available.
      </Typography>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {workoutPlan.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {workoutPlan.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {Math.round(calculateProgress())}% Complete
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {workoutPlan.workouts.map((workout, index) => (
          <Grid item xs={12} key={index}>
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Checkbox
                    checked={completedExercises[index] || false}
                    onChange={() => handleExerciseComplete(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Typography sx={{ flex: 1 }}>{workout.exercise}</Typography>
                  {workout.videos && workout.videos.length > 0 && (
                    <Button
                      startIcon={<Play />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Play video:', workout.videos[0]);
                      }}
                    >
                      Watch Tutorial
                    </Button>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {workout.type}
                    </Typography>
                    {workout.reps && (
                      <Typography variant="body2">
                        Reps: {workout.reps} × Sets: {workout.sets}
                      </Typography>
                    )}
                    {workout.duration && (
                      <Typography variant="body2">
                        Duration: {workout.duration}s × Sets: {workout.sets}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Instructions: {workout.notes}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Your Notes"
                      value={notes[index] || ''}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircle />}
          onClick={handleSubmitWorkout}
          disabled={calculateProgress() < 100}
        >
          Complete Workout
        </Button>
      </Box>
    </Box>
  );
};

export default ClientWorkout;

