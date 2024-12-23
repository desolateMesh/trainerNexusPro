import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  CircularProgress
} from '@mui/material';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import api from '../../utils/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    {
      title: "Virtual Training",
      description: "Connect with professional trainers through live video sessions",
      icon: "🎥"
    },
    {
      title: "Custom Plans",
      description: "Get personalized workout and nutrition guidance",
      icon: "🥗"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed analytics",
      icon: "📈"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      if (response.data && response.data.token) {
        // Store auth data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.userId,
          username: response.data.username,
          role: response.data.role
        }));
  
        // Navigate based on role
        switch (response.data.role) {
          case 'trainer':
            navigate('/trainer-dashboard');
            break;
          case 'client':
            navigate('/client-dashboard');
            break;
          default:
            setError('Invalid user role');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <Card sx={{ boxShadow: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Sign In
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ 
              height: 48,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderRequestForm = () => (
    <Card sx={{ boxShadow: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Request Access
        </Typography>
        <TextField
          fullWidth
          label="Full Name"
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Role"
          select
          SelectProps={{
            native: true,
          }}
          sx={{ mb: 3 }}
        >
          <option value="">Select a role</option>
          <option value="trainer">Trainer</option>
          <option value="client">Client</option>
        </TextField>
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ height: 48 }}
        >
          Submit Request
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 8,
        backgroundImage: 'linear-gradient(to right, #1976d2, #1565c0)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Transform Your Fitness Journey
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Connect with expert trainers, track your progress, and achieve your fitness goals
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  color="secondary"
                  onClick={() => setActiveForm('login')}
                  sx={{ px: 4 }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  color="inherit"
                  onClick={() => setActiveForm('request')}
                  sx={{ px: 4 }}
                >
                  Request Access
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="/images/logo.png"
                alt="image"
                sx={{ 
                  width: 'auto',
                  maxWidth: 400,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Form Display */}
      {activeForm && (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          {activeForm === 'login' ? renderLoginForm() : renderRequestForm()}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button color="primary" onClick={() => setActiveForm(null)}>
              Back to Home
            </Button>
          </Box>
        </Container>
      )}

      {/* Features Section */}
      {!activeForm && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h1" sx={{ mb: 2, textAlign: 'center' }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default LandingPage;