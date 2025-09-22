import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Apps, People, Settings, ConfirmationNumber } from "@mui/icons-material";
import useAuthStore from "../store/authStore";

const drawerWidth = 240;

function Sidebar() {
  const { user } = useAuthStore();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/templates">
          <ListItemIcon>
            <Apps />
          </ListItemIcon>
          <ListItemText primary="Templates" />
        </ListItem>
        <ListItem button component={Link} to="/support">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItem>
        {user && user.role === "admin" && (
          <ListItem button component={Link} to="/users">
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        )}
        {user && user.role === "admin" && (
          <ListItem button component={Link} to="/settings">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}

export default Sidebar;
