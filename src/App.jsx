
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme.js";
import useThemeStore from "./store/themeStore";
import useAuthStore from "./store/authStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Users from "./pages/Users";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Permissions from "./pages/Permissions";
import Analytics from "./pages/Analytics";
import Documents from "./pages/Documents";
import TextEditor from "./pages/TextEditor";
import MarkdownEditor from "./pages/MarkdownEditor";
import SpreadsheetEditor from "./pages/SpreadsheetEditor";

function App() {
  const { mode } = useThemeStore();
  const { user, setUser, loading } = useAuthStore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth, setUser]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<Users />} />
            <Route path="templates" element={<Templates />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="documents" element={<Documents />} />
            <Route path="text-editor" element={<TextEditor />} />
            <Route path="markdown-editor" element={<MarkdownEditor />} />
            <Route path="spreadsheet-editor" element={<SpreadsheetEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
