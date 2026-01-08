
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  IconButton,
  Modal,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function Profile() {
  const { userId: userIdFromParams } = useParams();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const currentUser = auth.currentUser;
  const userId = userIdFromParams || currentUser?.uid;

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        setEditedProfile(userData);
        setPreviewUrl(userData.profilePictureUrl || null);
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

    return () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
    };
  }, [userId, db, currentUser, previewUrl]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
    setProfilePictureFile(null);
    setPreviewUrl(userProfile.profilePictureUrl || null);
    setCropModalOpen(false);
  };

  const handleSave = async () => {
    let profilePictureUrl = editedProfile.profilePictureUrl || '';

    if (profilePictureFile) {
      const storageRef = ref(storage, `profilePictures/${userId}`);
      await uploadBytes(storageRef, profilePictureFile);
      profilePictureUrl = await getDownloadURL(storageRef);
    }

    const updatedProfile = { ...editedProfile, profilePictureUrl };
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updatedProfile);
    setUserProfile(updatedProfile);
    setIsEditing(false);
    setProfilePictureFile(null);
    setPreviewUrl(profilePictureUrl);
    setCropModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
        setCropModalOpen(true);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  const onCropComplete = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
        const croppedImageBlob = await getCroppedImg(
            imgRef.current,
            crop,
            profilePictureFile.name
        );
        setProfilePictureFile(croppedImageBlob);
    }
  }

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
            <Avatar src={previewUrl} sx={{ width: 80, height: 80 }} />
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
            <Grid item xs={12}>
              {isEditing && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography>{profilePictureFile ? profilePictureFile.name : "Upload new picture"}</Typography>
                </Box>
              )}
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                label="Email Signature"
                name="signature"
                fullWidth
                multiline
                rows={4}
                value={editedProfile.signature || ''}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6" gutterBottom>Signature Preview</Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar src={previewUrl || "/assets/elsipogtoglogo.png"} sx={{ width: 56, height: 56 }} />
              </Grid>
              <Grid item>
                <Typography variant="body1">{editedProfile.name}</Typography>
                <Typography variant="body2" color="textSecondary">{editedProfile.role}</Typography>
                <Typography variant="body2" color="textSecondary">{editedProfile.email}</Typography>
                <Typography variant="body2" color="textSecondary">{editedProfile.department}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'Ephesis, cursive', fontSize: '24px' }}>
                {editedProfile.signature}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Modal
        open={isCropModalOpen}
        onClose={() => setCropModalOpen(false)}
        aria-labelledby="crop-image-modal"
        aria-describedby="crop-image-modal-description"
      >
        <Box sx={modalStyle}>
            <ReactCrop 
                src={previewUrl}
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={onCropComplete}
            >
                <img ref={imgRef} src={previewUrl} />
            </ReactCrop>
            <Button onClick={handleSave}>Save Crop</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Profile;
