import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  InputLabel
} from '@mui/material';

function Profile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        setEditedProfile(userData);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    };

    const fetchCurrentUserRole = async () => {
      if (currentUser) {
        const currentUserDocRef = doc(db, 'users', currentUser.uid);
        const currentUserDoc = await getDoc(currentUserDocRef);
        if (currentUserDoc.exists()) {
          setCurrentUserRole(currentUserDoc.data().role);
        }
      }
    };

    fetchUserProfile();
    fetchCurrentUserRole();
  }, [userId, db, currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
  };

  const handleSave = async () => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, editedProfile);
    setUserProfile(editedProfile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const canEdit = currentUser && (currentUser.uid === userId || currentUserRole === 'Admin');

  if (loading) {
    return <CircularProgress />;
  }

  if (!userProfile) {
    return <Typography>User profile not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
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
              {canEdit && (
                isEditing ? (
                  <>
                    <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>Save</Button>
                    <Button onClick={handleCancel} variant="outlined">Cancel</Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} variant="contained">Edit Profile</Button>
                )
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={editedProfile.name || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={editedProfile.email || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Employee ID"
                name="employeeId"
                fullWidth
                value={editedProfile.employeeId || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                name="department"
                fullWidth
                value={editedProfile.department || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!isEditing || !canEdit}>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  name="role"
                  value={editedProfile.role || ''}
                  onChange={handleChange}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Profile;