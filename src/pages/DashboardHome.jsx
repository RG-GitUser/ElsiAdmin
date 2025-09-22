
import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Divider
} from '@mui/material';
import {
    BarChart,
    People,
    Description,
    Folder,
    AddCircleOutline,
    Edit,
    PersonAdd
} from '@mui/icons-material';

const DashboardHome = () => {
    const metrics = [
        {
            title: 'Active Users',
            value: '1,234',
            icon: <People fontSize="large" />,
            color: '#3f51b5',
        },
        {
            title: 'Documents',
            value: '5,678',
            icon: <Description fontSize="large" />,
            color: '#f50057',
        },
        {
            title: 'Templates',
            value: '90',
            icon: <Folder fontSize="large" />,
            color: '#ff9800',
        },
        {
            title: 'Engagement',
            value: '85%',
            icon: <BarChart fontSize="large" />,
            color: '#4caf50',
        },
    ];

    const recentTemplates = [
        { name: 'Onboarding Checklist', date: '2024-07-20' },
        { name: 'Monthly Report', date: '2024-07-19' },
        { name: 'Performance Review', date: '2024-07-18' },
    ];

    const recentActivities = [
        { user: 'John Doe', action: 'updated the project plan.', icon: <Edit />, color: '#4caf50' },
        { user: 'Jane Smith', action: 'added a new team member.', icon: <PersonAdd />, color: '#3f51b5' },
        { user: 'Admin', action: 'approved a new template.', icon: <Description />, color: '#ff9800' },
    ];


    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Welcome Header */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 4,
                    backgroundColor: '#212121',
                    color: '#fff',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Welcome Back!
                </Typography>
                <Typography variant="body1">
                    Here is a quick overview of your dashboard.
                </Typography>
            </Paper>

            {/* Metric Cards */}
            <Grid container spacing={4}>
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: 4,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                },
                            }}
                        >
                            <Box>
                                <Typography color="textSecondary" gutterBottom variant="subtitle1">
                                    {metric.title}
                                </Typography>
                                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                                    {metric.value}
                                </Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: metric.color, width: 56, height: 56 }}>
                                {metric.icon}
                            </Avatar>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={4} sx={{ mt: 2 }}>

                {/* Create Document and Recent Templates */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)', height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Get Started
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 3,
                                mb: 3,
                                borderRadius: 3,
                                border: (theme) => `2px dashed ${theme.palette.divider}`,
                                textAlign: 'center',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: (theme) => theme.palette.action.hover
                                }
                            }}
                        >
                            <AddCircleOutline sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                            <Typography variant="h6" gutterBottom>
                                Create New Document
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Start from a blank page or a template.
                            </Typography>
                            <Button variant="contained">Create</Button>
                        </Paper>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                            Recent Templates
                        </Typography>
                        <List>
                            {recentTemplates.map((template, index) => (
                                <ListItem key={index} disablePadding>
                                     <ListItemAvatar>
                                        <Avatar>
                                            <Folder />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={template.name} secondary={`Used on: ${template.date}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)', height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Recent Activity
                        </Typography>
                        <List>
                            {recentActivities.map((activity, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: activity.color }}>{activity.icon}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={activity.user}
                                            secondary={activity.action}
                                        />
                                    </ListItem>
                                    {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default DashboardHome;
