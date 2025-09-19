import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import useTemplatesStore from '../store/templatesStore';

function MyProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const { templates, fetchTemplates } = useTemplatesStore();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
          setEditedProfile(userData);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [user, db]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
  };

  const handleSave = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, editedProfile);
      setUserProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const sharedWithMeTemplates = templates.filter(template => template.sharedWith && template.sharedWith.includes(user.uid) && template.owner !== user.uid);

  if (loading) {
    return <CircularProgress />;
  }

  if (!userProfile) {
    return <Typography>No user profile found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 80, height: 80 }} />
            </Grid>
            <Grid item>
              <Typography variant="h5">{userProfile.name}</Typography>
              <Typography variant="body1" color="textSecondary">
                {userProfile.role}
              </Typography>
            </Grid>
            <Grid item sx={{ flexGrow: 1, textAlign: 'right' }}>
              {isEditing ? (
                <>
                  <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleCancel} variant="outlined">Cancel</Button>
                </>
              ) : (
                <Button onClick={handleEdit} variant="contained">Edit Profile</Button>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={editedProfile.name || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={editedProfile.email || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                name="employeeId"
                fullWidth
                value={editedProfile.employeeId || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                name="department"
                fullWidth
                value={editedProfile.department || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  name="role"
                  value={editedProfile.role || ''}
                  onChange={handleChange}
                >
                  <MenuItem value="Employee">Employee</MenuItem>
                  <MenuItem value="Team Lead">Team Lead</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Director">Director</MenuItem>
                  <MenuItem value="Administrator">Administrator</MenuItem>
                  <MenuItem value="IT Support">IT Support</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Shared With Me
        </Typography>
        <Card>
          <CardContent>
            {sharedWithMeTemplates.length > 0 ? (
              <List>
                {sharedWithMeTemplates.map(template => (
                  <ListItem key={template.id}>
                    <ListItemText primary={template.name} secondary={template.description} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No templates have been shared with you.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default MyProfile;
