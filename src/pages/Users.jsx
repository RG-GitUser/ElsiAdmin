
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function Users() {
  const { users, loading, error, fetchUsers, deleteUser } = useUsersStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === "Admin") {
          setIsAdmin(true);
          fetchUsers();
        } else {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    };
    checkAdminStatus();
  }, [auth, db, fetchUsers, navigate]);

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

  if (!isAdmin) {
    return null; // Or a loading spinner
  }

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
