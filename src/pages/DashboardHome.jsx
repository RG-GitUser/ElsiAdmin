import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  UploadFile as UploadFileIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Event as EventIcon,
  Today as TodayIcon,
  RssFeed as RssFeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const RecentTemplateItem = ({ name }) => (
  <ListItem>
    <ListItemIcon>
      <FileIcon />
    </ListItemIcon>
    <ListItemText primary={name} />
  </ListItem>
);

const NewsItem = ({ title, content }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <RssFeedIcon /> {title}
    </Typography>
    <Typography variant="body2">{content}</Typography>
  </Box>
);

function DashboardHome() {
  const [dateTime, setDateTime] = React.useState(new Date());
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const events = [
    {
      title: 'Team Meeting',
      start: new Date(2024, 6, 22, 10, 0),
      end: new Date(2024, 6, 22, 11, 0),
    },
    {
      title: 'Project Deadline',
      start: new Date(2024, 6, 25, 17, 0),
      end: new Date(2024, 6, 25, 17, 0),
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TodayIcon /> {dateTime.toLocaleDateString(undefined, { weekday: 'long' })}
              </Typography>
              <Typography variant="h4">{dateTime.toLocaleTimeString()}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Latest Employee News
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 2 }}>
                <NewsItem title="New HR Policy" content="Please review the updated HR policy on the company portal." />
                <NewsItem title="Holiday Party" content="Join us for the annual holiday party on December 20th!" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
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
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    My Documents
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <IconButton aria-label="create new folder" onClick={() => alert('Create new folder clicked')}>
                      <CreateNewFolderIcon />
                    </IconButton>
                    <IconButton aria-label="upload file" onClick={handleUploadClick}>
                      <UploadFileIcon />
                    </IconButton>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText primary="Work" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FileIcon />
                      </ListItemIcon>
                      <ListItemText primary="performance-review.pdf" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate('/documents')}>View All</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon /> Calendar
                </Typography>
                <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 220 }} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardHome;
