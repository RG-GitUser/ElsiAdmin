
import React, { useState, useEffect } from 'react';
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
    Divider,
    Chip
} from '@mui/material';
import {
    Description,
    Folder,
    AddCircleOutline,
    Event as EventIcon,
    Announcement as AnnouncementIcon,
    Assignment as FormIcon
} from '@mui/icons-material';
import CreateDocumentModal from '../components/CreateDocumentModal';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const DashboardHome = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserName = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.name || user.email);
                } else {
                    setUserName(user.email);
                }
            }
        };

        fetchUserName();

        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [user, db]);

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    const metrics = [
        {
            title: 'Documents',
            value: '5,678',
            icon: <Description fontSize="medium" />,
            color: '#f50057',
        },
        {
            title: 'Templates',
            value: '90',
            icon: <Folder fontSize="medium" />,
            color: '#ff9800',
        },
    ];

    const recentTemplates = [
        { name: 'Onboarding Checklist', date: '2024-07-20' },
        { name: 'Monthly Report', date: '2024-07-19' },
        { name: 'Performance Review', date: '2024-07-18' },
    ];

    const newsItems = [
        {
            category: 'Notice',
            title: 'New HR Policy Announced',
            date: '2024-07-21',
            icon: <AnnouncementIcon />,
            color: '#2196f3'
        },
        {
            category: 'Event',
            title: 'Company Wide Picnic',
            date: '2024-08-15',
            icon: <EventIcon />,
            color: '#4caf50'
        },
        {
            category: 'Form',
            title: 'Submit Your Expense Reports',
            date: '2024-07-25',
            icon: <FormIcon />,
            color: '#ff9800'
        },
        {
            category: 'Notice',
            title: 'Scheduled System Maintenance',
            date: '2024-07-22',
            icon: <AnnouncementIcon />,
            color: '#2196f3'
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1, maxWidth: 1200, p: 3, mx: 'auto' }}>
                {/* Welcome Header */}
                <Paper
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: '#fff',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{
                            fontWeight: 'bold',
                        }}>
                            Welcome Back, {userName}!
                        </Typography>
                        <Typography variant="body1">
                            Here is a quick overview of your dashboard.
                        </Typography>
                    </Box>
                    <Box sx={{
                        textAlign: 'right',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        p: 2,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6">
                            {currentDateTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                            {currentDateTime.toLocaleTimeString('en-US')}
                        </Typography>
                    </Box>
                </Paper>

                {/* Metric Cards */}
                <Grid container spacing={4}>
                    {metrics.map((metric, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderRadius: 4,
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    },
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar sx={{ bgcolor: metric.color, width: 48, height: 48, mb: 2 }}>
                                    {metric.icon}
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="subtitle1">
                                        {metric.title}
                                    </Typography>
                                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                                        {metric.value}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content Grid */}
                <Grid container spacing={4} sx={{ mt: 2 }}>

                    {/* Create Document and Recent Templates */}
                    <Grid item xs={12} md={8}>
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
                                <Button variant="contained" onClick={handleOpenCreateModal}>Create</Button>
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

                    {/* Latest News */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)', height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Latest News
                            </Typography>
                            <List>
                                {newsItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: item.color }}>
                                                    {item.icon}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.title}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {item.date}
                                                        </Typography>
                                                        <Chip label={item.category} size="small" sx={{ ml: 1, backgroundColor: item.color, color: '#fff' }} />
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        {index < newsItems.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                </Grid>
                <CreateDocumentModal open={openCreateModal} handleClose={handleCloseCreateModal} />
            </Box>
        </Box>
    );
};

export default DashboardHome;
