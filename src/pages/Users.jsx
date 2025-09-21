import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import useUsersStore from '../store/usersStore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Users() {
  const { users, loading, error, fetchUsers } = useUsersStore();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [auth, fetchUsers, navigate]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {
        !loading && !error && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.displayName} - {user.email}
              </li>
            ))}
          </ul>
        )
      }
    </Box>
  );
}

export default Users;
