import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import useTemplatesStore from '../store/templatesStore';

function ShareTemplateDialog({ open, onClose, template }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const { updateTemplate } = useTemplatesStore();
  const db = getFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users.');
      }
      setLoading(false);
    };

    if (open) {
      fetchUsers();
    }
  }, [open, db]);

  useEffect(() => {
    if (template && template.sharedWith) {
      setSelectedUsers(template.sharedWith);
    } else {
      setSelectedUsers([]);
    }
  }, [template]);

  const handleAddEmail = async () => {
    if (emailInput) {
      const user = users.find(u => u.email === emailInput);
      if (user) {
        if (!selectedUsers.includes(user.id)) {
          setSelectedUsers([...selectedUsers, user.id]);
        }
        setEmailInput('');
      } else {
        setError('User with that email not found.');
      }
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(id => id !== userId));
  };

  const handleShare = () => {
    if (template) {
      updateTemplate(template.id, { sharedWith: selectedUsers });
    }
    onClose();
  };
  
  const getEmailById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown User';
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Share Template</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Enter email to share"
            variant="outlined"
            size="small"
            fullWidth
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Button onClick={handleAddEmail} sx={{ ml: 1 }} variant="contained">
            Add
          </Button>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Shared with:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedUsers.map((userId) => (
            <Chip
              key={userId}
              label={getEmailById(userId)}
              onDelete={() => handleRemoveUser(userId)}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleShare}>Save Sharing Settings</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareTemplateDialog;