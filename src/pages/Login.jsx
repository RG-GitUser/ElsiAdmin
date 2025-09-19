
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../services/firebase"; // Import db from firebase services
import { doc, setDoc } from "firebase/firestore"; // Import doc and setDoc
import useAuthStore from "../store/authStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState("");
  const { user, error, setError, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If user object exists, redirect to the dashboard.
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500); // Wait 1.5 seconds to show the success message
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      setError(null);
      setSuccess("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSuccess("Login successful! Redirecting to the dashboard...");
      setUser(userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      setError(null);
      setSuccess("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      // **Create a user profile document in Firestore**
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        name: newUser.email, // Default name to email
        role: "user", // Default role
      });

      setSuccess("Sign up successful! Redirecting to the dashboard...");
      setUser(newUser);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              {success}
            </Alert>
          )}
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={isSignUp ? handleSignUp : handleLogin}
              disabled={!!success}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Typography
              variant="body2"
              onClick={toggleSignUp}
              sx={{ cursor: "pointer", textAlign: "center" }}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don\'t have an account? Sign Up"}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
