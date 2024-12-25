import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid,
  Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Button
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

const ClientWorkout = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({}); // Initialize state to track completed workouts

  useEffect(() => {
    fetchWorkout();
  }, []);

  const fetchWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/client-workouts/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch workout');
      const data = await response.json();
      setWorkoutPlan(data);

      // Initialize completed state for workouts
      const initialCompletedState = {};
      data.forEach((exercise) => {
        initialCompletedState[exercise.workout_id] = false;
      });
      setCompletedWorkouts(initialCompletedState);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/client-workouts/${workoutId}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to mark workout as complete');
      setCompletedWorkouts((prev) => ({ ...prev, [workoutId]: true }));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Box>;
  if (!workoutPlan) return <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>No assigned workouts.</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>{workoutPlan[0]?.workout_name}</Typography>
        <Typography color="text.secondary" gutterBottom>{workoutPlan[0]?.workout_description}</Typography>
      </Paper>

      <Grid container spacing={3}>
        {workoutPlan.map((exercise, index) => (
          <Grid item xs={12} key={index}>
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>{exercise.exercise}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {exercise.type}
                    </Typography>
                    {exercise.reps > 0 && (
                      <Typography variant="body2">
                        Reps: {exercise.reps} × Sets: {exercise.sets}
                      </Typography>
                    )}
                    {exercise.duration > 0 && (
                      <Typography variant="body2">
                        Duration: {exercise.duration}s × Sets: {exercise.sets}
                      </Typography>
                    )}
                    {exercise.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Instructions: {exercise.notes}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCompleteWorkout(exercise.workout_id)}
                      disabled={completedWorkouts[exercise.workout_id]}
                    >
                      {completedWorkouts[exercise.workout_id] ? 'Completed' : 'Mark as Complete'}
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClientWorkout;
