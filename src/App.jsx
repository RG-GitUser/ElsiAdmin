import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme.js";
import useThemeStore from "./store/themeStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Permissions from "./pages/Permissions";
import Analytics from "./pages/Analytics";

function App() {
  const { mode } = useThemeStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}>
            <Route path="users" element={<Users />} />
            <Route path="templates" element={<Templates />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
