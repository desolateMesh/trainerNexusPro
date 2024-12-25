import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import api from '../../utils/api';

const AddClientForm = ({ onClose, onClientAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'client',
    profile_picture: '', // Added field for profile picture
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const trainer = JSON.parse(localStorage.getItem('user')); // Get logged-in trainer
      const response = await api.post('/users/create', {
        ...formData,
        trainerId: trainer.id, // Include trainerId in the request
      });
  
      setSuccess(true);
      onClientAdded(response.data); // Notify parent to update client list
      setTimeout(() => {
        setSuccess(false);
        onClose(); // Close the form
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add client');
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add New Client
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Client added successfully!</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="password"
        />
        <TextField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="tel"
        />
        <TextField
          label="Profile Picture URL"
          name="profile_picture"
          value={formData.profile_picture}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit">
            Add Client
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddClientForm;
