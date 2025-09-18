import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import useTemplatesStore from '../store/templatesStore';

function ShareTemplateDialog({ open, onClose, template }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
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
      } catch (err) {
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

  const handleToggleUser = (userId) => {
    const currentIndex = selectedUsers.indexOf(userId);
    const newSelectedUsers = [...selectedUsers];

    if (currentIndex === -1) {
      newSelectedUsers.push(userId);
    } else {
      newSelectedUsers.splice(currentIndex, 1);
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handleShare = () => {
    if (template) {
      updateTemplate(template.id, { sharedWith: selectedUsers });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Share Template</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              dense
              button
              onClick={() => handleToggleUser(user.id)}
            >
              <Checkbox
                edge="start"
                checked={selectedUsers.indexOf(user.id) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={user.email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleShare}>Share</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareTemplateDialog;
