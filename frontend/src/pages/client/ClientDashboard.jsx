// C:\Users\jrochau\projects\trainerNexus\frontend\src\pages\client\ClientDashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { Calendar, Activity, MessageCircle, Video, Target, Apple } from 'lucide-react';
import ClientWorkout from './ClientWorkouts'; // Correct relative path
import Schedule from './Schedule'; // Ensure Schedule.jsx exists or adjust accordingly


const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const stats = [
    { label: 'Workouts Completed', value: '12', icon: <Activity size={24} /> },
    { label: 'Next Session', value: 'Today 3PM', icon: <Calendar size={24} /> },
    { label: 'Current Streak', value: '5 days', icon: <Target size={24} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ClientWorkout />;
      case 1:
        return <Schedule />;
      case 2:
        return <Typography>Nutrition content coming soon!</Typography>;
      case 3:
        return <Typography>Goals content coming soon!</Typography>;
      case 4:
        return <Typography>Messages content coming soon!</Typography>;
      case 5:
        return <Typography>Video Chat content coming soon!</Typography>;
      default:
        return <Typography>Tab content not found!</Typography>;
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                  <Typography color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
                <IconButton color="primary" sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main' } }}>
                  {stat.icon}
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Activity size={20} />} label="Workouts" />
            <Tab icon={<Calendar size={20} />} label="Schedule" />
            <Tab icon={<Apple size={20} />} label="Nutrition" />
            <Tab icon={<Target size={20} />} label="Goals" />
            <Tab icon={<MessageCircle size={20} />} label="Messages" />
            <Tab icon={<Video size={20} />} label="Video Chat" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {renderTabContent()}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientDashboard;
