import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const Progress = () => {
  const progressData = [
    { client: 'John Doe', progress: 'Lost 5kg in 1 month', updated: '2 days ago' },
    { client: 'Jane Smith', progress: 'Increased bench press by 20%', updated: '1 week ago' },
    { client: 'Mike Johnson', progress: 'Completed first marathon', updated: '3 weeks ago' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Client Progress
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recent Achievements
            </Typography>
            <List>
              {progressData.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.client}: ${item.progress}`}
                      secondary={`Updated: ${item.updated}`}
                    />
                  </ListItem>
                  {index < progressData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Progress;
