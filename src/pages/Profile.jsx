import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const Profile = () => {
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDepartment(userData.department || "");
          setEmployeeId(userData.employeeId || "");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user, db]);

  const handleSave = async () => {
    if (user) {
      setSaving(true);
      const userDocRef = doc(db, "users", user.uid);
      try {
        await setDoc(
          userDocRef,
          { department, employeeId },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
      setSaving(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
