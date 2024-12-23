// src/pages/trainer/TrainerDashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Users,
  Calendar,
  Clock,
  Activity,
  MessageSquare,
  Video,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import Clients from './Clients';
import WorkoutPlans from './WorkoutPlans';
import WorkoutPlanCreation from './WorkoutPlanCreation';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Mock data for trainer stats
  const trainerStats = {
    activeClients: 8,
    todaySessions: 4,
    weeklyHours: 24,
  };

  const todaySchedule = [
    { time: '9:00 AM', client: 'Adam Williams', type: 'Strength Training' },
    { time: '11:00 AM', client: 'Jason Rochau', type: 'HIIT Session' },
    { time: '2:00 PM', client: 'Mike Brown', type: 'Flexibility & Mobility' },
  ];

  const clientProgress = [
    { client: 'Sarah Johnson', achievement: 'achieved her weight goal', timeAgo: '2 days ago' },
    { client: 'John Smith', achievement: 'completed marathon training', timeAgo: '1 week ago' },
  ];

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'videochat', label: 'Video Chat', icon: <Video size={20} /> },
    { id: 'workoutPlans', label: 'Workout Plans', icon: <ClipboardList size={20} /> },
  ];

  const StatsCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}.lighter`,
            p: 1,
            borderRadius: 2,
            color: `${color}.main`
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTabContent = (tabId) => {
    switch(tabId) {
      case 'schedule':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Today's Schedule
                </Typography>
                <List>
                  {todaySchedule.map((session, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {session.time} - {session.client}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {session.type}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < todaySchedule.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Client Progress
                </Typography>
                <List>
                  {clientProgress.map((progress, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${progress.client} ${progress.achievement}`}
                          secondary={progress.timeAgo}
                        />
                      </ListItem>
                      {index < clientProgress.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        );
      case 'clients':
        return <Clients />;
      case 'workoutPlans':
        return <WorkoutPlans />;
      default:
        return (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            Content for {tabs.find(t => t.id === tabId)?.label} tab coming soon...
          </Box>
        );
    }
  };

  // Get username from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const username = userData.username || 'Trainer';

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        overflowY: 'auto',
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {username}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's your training overview for today
            </Typography>
          </Grid>
  
          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <StatsCard
              title="Active Clients"
              value={trainerStats.activeClients}
              icon={<Users size={24} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard
              title="Today's Sessions"
              value={trainerStats.todaySessions}
              icon={<Calendar size={24} />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard
              title="Weekly Hours"
              value={trainerStats.weeklyHours}
              icon={<Clock size={24} />}
              color="warning"
            />
          </Grid>
  
          {/* Main Content */}
          <Grid item xs={12}>
            <Paper sx={{ borderRadius: 2, overflow: 'visible' }}>
              {/* Navigation Tabs */}
              <Box
                sx={{
                  backgroundColor: 'background.neutral',
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Grid container spacing={2}>
                  {tabs.map((tab) => (
                    <Grid item key={tab.id}>
                      <Button
                        variant={activeTab === tab.id ? 'contained' : 'text'}
                        onClick={() => setActiveTab(tab.id)}
                        startIcon={tab.icon}
                        sx={{
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          ...(activeTab === tab.id && {
                            backgroundColor: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                          }),
                        }}
                      >
                        {tab.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
  
              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                {renderTabContent(activeTab)}
  
                
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TrainerDashboard;