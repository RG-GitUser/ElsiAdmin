import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  CardActions,
  Button,
  Paper,
  Divider
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const NewsItem = ({ title, content }) => (
    <>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={title}
          secondary={
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {content}
            </Typography>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
);

const RecentTemplateItem = ({ name }) => (
    <ListItem>
        <ListItemText primary={name} />
    </ListItem>
);

const UserActivity = ({ name, action, time }) => (
    <ListItem>
        <ListItemText primary={`${name} ${action}`} secondary={time} />
    </ListItem>
);


function DashboardHome() {
    const [dateTime, setDateTime] = useState(new Date());
    const navigate = useNavigate();
    const { user } = useAuthStore();


    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!user) {
        return <Typography>Loading user data...</Typography>;
      }

    return (
        <Box>
          <Grid container spacing={3}>
            {/* Time/Date Card */}
            <Grid item xs={12} md={3}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TodayIcon /> {dateTime.toLocaleDateString(undefined, { weekday: 'long' })}
                  </Typography>
                  <Typography variant="h4">{dateTime.toLocaleTimeString()}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Latest Employee News Card */}
            <Grid item xs={12} md={3}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Latest Employee News
                  </Typography>
                  <Box sx={{ pr: 2 }}>
                    <NewsItem title="New HR Policy" content="Please review the updated HR policy on the company portal." />
                    <NewsItem title="Holiday Schedule" content="The office will be closed on July 4th for Independence Day." />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recently Used Templates Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Recently Used Templates
                  </Typography>
                  <List>
                    <RecentTemplateItem name="Standard-procedure-letter.docx" />
                    <RecentTemplateItem name="Request-for-proposals.docx" />
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate('/templates')}>View All</Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Quick Stats Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', p: 2 }}>
                    <Box>
                      <Typography variant="h4">12</Typography>
                      <Typography variant="body1">Active Projects</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4">5</Typography>
                      <Typography variant="body1">Pending Tasks</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity Card */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, boxShadow: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <UserActivity name="John Doe" action="updated a template" time="2 hours ago" />
                  <UserActivity name="Jane Smith" action="shared a document" time="5 hours ago" />
                  <UserActivity name="Admin" action="approved a request" time="1 day ago" />
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
    );
}

export default DashboardHome;
