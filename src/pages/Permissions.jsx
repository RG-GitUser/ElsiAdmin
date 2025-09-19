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
  InputLabel,
} from "@mui/material";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Permissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatusAndFetchUsers = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === "Admin") {
          setIsAdmin(true);
          const usersCollectionRef = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollectionRef);
          const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } else {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    checkAdminStatusAndFetchUsers();
  }, [auth, db, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { role: newRole });
    setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAdmin) {
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
                          value={u.role || 'User'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <MenuItem value="User">User</MenuItem>
                          <MenuItem value="Admin">Admin</MenuItem>
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
