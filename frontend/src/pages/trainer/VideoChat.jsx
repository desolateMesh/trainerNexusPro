import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Video } from 'lucide-react';
import api from '../../utils/api';

const VideoChat = () => {
  const startVideoChat = () => {
    console.log("Starting video chat...");
    // Implement actual video chat logic here
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Video Chat
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.200' }}>
            <Box textAlign="center">
              <Video size={64} color="grey" />
              <Typography variant="body1" mt={2}>
                Your video will appear here when the chat starts
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Start a video chat with your client
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Video />}
              onClick={startVideoChat}
              fullWidth
              sx={{ mt: 2 }}
            >
              Start Video Chat
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoChat;