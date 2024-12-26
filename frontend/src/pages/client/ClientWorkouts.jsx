import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid,
  Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Button, Card, CardContent, CardActions
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

const ClientWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({});

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/client-workouts/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      
      // Group exercises by workout
      const workoutMap = data.reduce((acc, item) => {
        if (!acc[item.workout_id]) {
          acc[item.workout_id] = {
            id: item.workout_id,
            name: item.workout_name,
            description: item.workout_description,
            exercises: []
          };
        }
        acc[item.workout_id].exercises.push({
          exercise: item.exercise,
          type: item.type,
          reps: item.reps,
          sets: item.sets,
          duration: item.duration,
          notes: item.notes
        });
        return acc;
      }, {});

      setWorkouts(Object.values(workoutMap));
      
      // Initialize completed states
      const initialCompletedState = {};
      Object.keys(workoutMap).forEach(id => {
        initialCompletedState[id] = false;
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
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to mark workout as complete');
      setCompletedWorkouts(prev => ({ ...prev, [workoutId]: true }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Box>;
  if (!workouts.length) return <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>No assigned workouts.</Typography>;

  return (
    <Grid container spacing={3}>
      {workouts.map((workout) => (
        <Grid item xs={12} md={6} key={workout.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>{workout.name}</Typography>
              <Typography color="text.secondary" paragraph>{workout.description}</Typography>
              
              {workout.exercises.map((exercise, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ChevronDown />}>
                    <Typography>{exercise.exercise}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
            
            <CardActions sx={{ mt: 'auto', p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleCompleteWorkout(workout.id)}
                disabled={completedWorkouts[workout.id]}
              >
                {completedWorkouts[workout.id] ? 'Completed' : 'Mark as Complete'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ClientWorkout;