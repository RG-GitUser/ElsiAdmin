
import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const userEngagementData = [
    { name: 'Jan', users: 4000 },
    { name: 'Feb', users: 3000 },
    { name: 'Mar', users: 5000 },
    { name: 'Apr', users: 4500 },
    { name: 'May', users: 6000 },
    { name: 'Jun', users: 5500 },
];

const documentCreationData = [
    { name: 'Week 1', documents: 10 },
    { name: 'Week 2', documents: 15 },
    { name: 'Week 3', documents: 12 },
    { name: 'Week 4', documents: 20 },
];

const popularTemplatesData = [
    { name: 'Onboarding', value: 400 },
    { name: 'Monthly Report', value: 300 },
    { name: 'Performance Review', value: 200 },
    { name: 'Project Plan', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Analytics Dashboard
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}>
                        <Typography variant="h6" gutterBottom>
                            User Engagement
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userEngagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="users" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}>
                        <Typography variant="h6" gutterBottom>
                            Document Creation Trends
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={documentCreationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="documents" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}>
                        <Typography variant="h6" gutterBottom>
                            Popular Templates
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={popularTemplatesData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {popularTemplatesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
