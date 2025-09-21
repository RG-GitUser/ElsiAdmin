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
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  Add as AddIcon,
  UploadFile as UploadFileIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from '@mui/icons-material';

const RecentTemplateItem = ({ name }) => (
  <ListItem>
    <ListItemIcon>
      <FileIcon />
    </ListItemIcon>
    <ListItemText primary={name} />
  </ListItem>
);

const NewsItem = ({ title, content }) => (
  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2">{content}</Typography>
  </Paper>
);

function DashboardHome() {
  const [dateTime, setDateTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Date and Time */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {dateTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
              <Typography variant="h4">
                {dateTime.toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Employee News */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Latest Employee News
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                <NewsItem title="New HR Policy" content="Please review the updated HR policy on the company portal." />
                <NewsItem title="Holiday Party" content="Join us for the annual holiday party on December 20th!" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recently Used Templates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recently Used Templates
              </Typography>
              <List>
                <RecentTemplateItem name="Standard-procedure-letter.docx" />
                <RecentTemplateItem name="Request-for-proposals.docx" />
                <RecentTemplateItem name="Meeting-minutes-template.docx" />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* My Documents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                My Documents
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton aria-label="create new folder">
                  <CreateNewFolderIcon />
                </IconButton>
                <IconButton aria-label="upload file">
                  <UploadFileIcon />
                </IconButton>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Personal" />
                </ListItem>
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
              <Button size="small">View All</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardHome;
