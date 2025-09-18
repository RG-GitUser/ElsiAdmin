
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Switch,
  FormControlLabel,
  ListItemButton
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as AccountCircleIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import useThemeStore from "../store/themeStore";
import { getAuth } from "firebase/auth";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeStore();
  const auth = getAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/" },
    { text: "My Profile", icon: <AccountCircleIcon />, path: "/profile" },
    { text: "Templates", icon: <DescriptionIcon />, path: "/templates" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Permissions", icon: <AdminPanelSettingsIcon />, path: "/permissions" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Elsipogtog Employee Dashboard
          </Typography>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
            label="Dark Mode"
          />
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <List>
          {menuItems.map((item) => (
            <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
};

export default Dashboard;
