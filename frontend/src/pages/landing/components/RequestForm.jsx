// src/pages/landing/components/RequestForm.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem
} from '@mui/material';
import api from '../../../utils/api';

const RequestForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/request-access', formData);
      // Show success message or redirect
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ boxShadow: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Request Access
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="role"
            label="Role"
            select
            value={formData.role}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="trainer">Trainer</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </TextField>
          <TextField
            fullWidth
            name="message"
            label="Message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            size="large"
            sx={{ height: 48 }}
          >
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;