
import React from "react";
import {
  Typography,
  Box,
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import useThemeStore from "../store/themeStore";

function Settings() {
  const { mode, toggleMode } = useThemeStore();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Theme</Typography>
        <FormControlLabel
          control={<Switch checked={mode === "dark"} onChange={toggleMode} />}
          label="Dark Mode"
        />
      </Paper>
    </Box>
  );
}

export default Settings;
