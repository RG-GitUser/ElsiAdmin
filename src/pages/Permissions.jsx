
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
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
} from "@mui/material";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Permissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSuperAdminStatusAndFetchUsers = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true); // Force refresh the token to get latest claims
        const idTokenResult = await user.getIdTokenResult();

        // Check for the isSuperAdmin custom claim
        if (idTokenResult.claims.isSuperAdmin === true) {
          setIsSuperAdmin(true);
          const usersCollectionRef = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollectionRef);
          const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } else {
          // If not a super admin, redirect
          navigate("/");
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    checkSuperAdminStatusAndFetchUsers();
  }, [auth, db, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { role: newRole.toLowerCase() });
    setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!isSuperAdmin) {
    // Render nothing or a redirection message if not a super admin
    return null;
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
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={u.role || 'user'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          // Disable changing role for the super admin themselves
                          disabled={u.uid === auth.currentUser.uid}
                        >
                          <MenuItem value="user">User</MenuItem>
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
