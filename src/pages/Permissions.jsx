
import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Button
} from '@mui/material';

const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Viewer' },
];

const roles = ['Admin', 'Editor', 'Viewer'];

const Permissions = () => {
    const [userRoles, setUserRoles] = useState(
        mockUsers.reduce((acc, user) => {
            acc[user.id] = user.role;
            return acc;
        }, {})
    );

    const handleRoleChange = (userId, newRole) => {
        setUserRoles((prevRoles) => ({
            ...prevRoles,
            [userId]: newRole,
        }));
    };

    const handleSaveChanges = () => {
        // Here you would typically send the updated roles to your backend
        console.log('Saving changes:', userRoles);
        alert('Changes saved successfully!');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                User Permissions
            </Typography>
            <Paper sx={{ borderRadius: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={userRoles[user.id]}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            sx={{ minWidth: 120 }}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default Permissions;
