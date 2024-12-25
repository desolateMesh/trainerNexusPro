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
  Alert,
} from '@mui/material';
import { Plus } from 'lucide-react';
import api from '../../utils/api';
import AddClientForm from './AddClientForm';

const Clients = () => {
  const [users, setUsers] = useState([]); // All users fetched from `users` table
  const [assignedClients, setAssignedClients] = useState([]); // IDs of assigned clients
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingClient, setIsAddingClient] = useState(false); // New state for form visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainer = JSON.parse(localStorage.getItem('user')); // Get logged-in trainer
  
        if (!trainer || trainer.role !== 'trainer') {
          throw new Error('Invalid user data or unauthorized access');
        }
  
        // Fetch all users
        const usersResponse = await api.get('/users');
        if (!Array.isArray(usersResponse.data)) {
          throw new Error('Invalid users response format');
        }
  
        // Fetch trainer-client assignments
        const assignmentsResponse = await api.get(`/trainer/clients/${trainer.id}`);
        if (!Array.isArray(assignmentsResponse.data)) {
          throw new Error('Invalid assignments response format');
        }
  
        // Filter users by role (client only)
        const allUsers = usersResponse.data.filter((user) => user.role === 'client');
  
        // Extract assigned clients (active status only)
        const assignedClientIds = assignmentsResponse.data
          .filter((assignment) => assignment.status === 'active') // Only active assignments
          .map((assignment) => assignment.client_id); // Extract client IDs
  
        // Update state
        setUsers(allUsers); // Only clients
        setAssignedClients(assignedClientIds); // IDs of assigned clients
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleAddClientClick = () => {
    setIsAddingClient(true);
  };

  const handleFormClose = () => {
    setIsAddingClient(false);
  };

  const handleClientAdded = (newClient) => {
    setAssignedClients((prev) => [...prev, newClient.id]); // Mark new client as assigned
    setUsers((prevUsers) => [...prevUsers, newClient]); // Add to users list if needed
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Users ({users.length})</Typography>
        <Button variant="contained" startIcon={<Plus size={20} />} onClick={handleAddClientClick}>
          Add Client
        </Button>
      </Box>

      {isAddingClient && (
        <AddClientForm onClose={handleFormClose} onClientAdded={handleClientAdded} />
      )}

      {users.length === 0 ? (
        <Alert severity="info">No users found. Click "Add Client" to get started.</Alert>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} md={6} key={user.id}>
              <Paper sx={{ p: 3, '&:hover': { boxShadow: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={user.profile_picture} sx={{ mr: 2 }}>
                    {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={assignedClients.includes(user.id) ? 'Assigned' : 'Unassigned'}
                    color={assignedClients.includes(user.id) ? 'success' : 'default'}
                    size="small"
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
