import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Grid } from '@mui/material'; // Added Grid
import { Send } from 'lucide-react';


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'Trainer' }]);
      setNewMessage('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Messages
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px', overflowY: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Recent Conversations
            </Typography>
            <List>
              {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
                <ListItem key={index} button>
                  <ListItemText primary={name} secondary="Last message preview..." />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box flexGrow={1} mb={2} sx={{ overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    textAlign: message.sender === 'Trainer' ? 'right' : 'left',
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      display: 'inline-block',
                      maxWidth: '70%',
                      backgroundColor: message.sender === 'Trainer' ? 'primary.light' : 'grey.200',
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box display="flex">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<Send />}
                onClick={sendMessage}
                sx={{ ml: 1 }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Messages;
