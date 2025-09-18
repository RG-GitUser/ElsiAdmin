
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import useUsersStore from "../store/usersStore";
import UserDialog from "../components/UserDialog";

function Users() {
  const { users, loading, error, fetchUsers, deleteUser } = useUsersStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = (user = null) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {filteredUsers.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenDialog(user)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteUser(user.id)}
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={user.name || "N/A"}
              secondary={user.email || "N/A"}
            />
          </ListItem>
        ))}
      </List>
      <UserDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        user={selectedUser}
      />
    </Box>
  );
}

export default Users;
