import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Permissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsersAndRole = async () => {
      if (user) {
        // Fetch current user's role
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUserRole(userDoc.data().role || "employee");
        }

        // Fetch all users
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      }
      setLoading(false);
    };

    fetchUsersAndRole();
  }, [user, db]);

  const handleRoleChange = async (userId, newRole) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { role: newRole });
    // Update local state
    setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!["manager", "admin"].includes(currentUserRole)) {
    return (
      <Box>
        <Typography variant="h6">Access Denied</Typography>
        <Typography>You do not have permission to view this page.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Permissions Management
      </Typography>
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.displayName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={u.role || 'employee'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <MenuItem value="employee">Employee</MenuItem>
                          <MenuItem value="manager">Manager</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Permissions;
