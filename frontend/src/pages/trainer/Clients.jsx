import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Plus } from 'lucide-react';
import api from '../../utils/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('User data not found');
        }
  
        const user = JSON.parse(userString);
        if (!user || !user.id || user.role !== 'trainer') {
          throw new Error('Invalid user data or unauthorized access');
        }
  
        console.log('Fetching clients for trainer:', user.id);
  
        const response = await api.get(`/trainer/clients/${user.id}`);
        console.log('API Response:', response.data);
  
        // Update the clients state with the response data
        if (response.data && Array.isArray(response.data)) {
          setClients(response.data.map((item) => item.client)); // Extract the client data from each assignment
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Client fetch error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
  
        setError(err.response?.data?.message || err.message || 'Failed to load clients');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchClients();
  }, []);
  

  // Add error boundary
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error"
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h5">
          Clients ({clients.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
        >
          Add Client
        </Button>
      </Box>
      
      {clients.length === 0 ? (
        <Alert severity="info">
          No clients found. Click "Add Client" to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {clients.map((client) => (
            <Grid item xs={12} md={6} key={client.id}>
              <Paper 
                sx={{ 
                  p: 3,
                  '&:hover': {
                    boxShadow: (theme) => theme.shadows[4]
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {/* Avatar for the client */}
                  <Avatar sx={{ mr: 2 }}>
                    {client.first_name?.[0]?.toUpperCase() || client.username?.[0]?.toUpperCase() || '?'}
                  </Avatar>

                  {/* Client name and email */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {/* Display first and last name if available, otherwise fallback to username */}
                      {client.first_name && client.last_name
                        ? `${client.first_name} ${client.last_name}`
                        : client.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {client.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Additional Client Info */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {/* Render the date when the client was assigned */}
                    Joined: {new Date(client.assigned_at).toLocaleDateString()}
                  </Typography>
                  <Chip 
                    label={client.status} 
                    color={client.status === 'active' ? 'success' : 'default'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Clients;