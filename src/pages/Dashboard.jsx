
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
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
  HomeRounded,
  PeopleAltRounded,
  ArticleRounded,
  SettingsApplicationsRounded,
  LogoutRounded as ExitToAppIcon,
  AccountCircleRounded,
  BarChartRounded,
  AdminPanelSettingsRounded,
  ConfirmationNumberRounded as TicketIcon
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import useThemeStore from "../store/themeStore";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
  justifyContent: "center",
  position: "relative",
}));

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useThemeStore();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user && user.email === 'wssadmin@wabanakisoftwaresolutions.com') {
        setIsAdmin(true);
      } else if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === "Admin") {
          setIsAdmin(true);
        }
      }
    };
    checkAdminStatus();
  }, [auth, db]);

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

  const iconColors = {
    Dashboard: '#FF6347', // Tomato
    'My Profile': '#6495ED', // CornflowerBlue
    Templates: '#FFD700', // Gold
    Users: '#3CB371', // MediumSeaGreen
    Permissions: '#8A2BE2', // BlueViolet
    Analytics: '#FF4500', // OrangeRed
    Settings: '#9932CC', // DarkOrchid
    Documents: '#4682B4', // SteelBlue,
    Support: '#FF69B4' // HotPink
};

  const allMenuItems = [
    { text: "Dashboard", icon: <HomeRounded />, path: "/", color: iconColors.Dashboard },
    { text: "My Profile", icon: <AccountCircleRounded />, path: `/profile/${auth.currentUser.uid}`, color: iconColors['My Profile'] },
    { text: "Templates", icon: <ArticleRounded />, path: "/templates", color: iconColors.Templates },
    { text: "Support", icon: <TicketIcon />, path: "/support", color: iconColors.Support },
    { text: "Users", icon: <PeopleAltRounded />, path: "/users", adminOnly: true, color: iconColors.Users },
    { text: "Permissions", icon: <AdminPanelSettingsRounded />, path: "/permissions", adminOnly: true, color: iconColors.Permissions },
    { text: "Analytics", icon: <BarChartRounded />, path: "/analytics", color: iconColors.Analytics },
    { text: "Settings", icon: <SettingsApplicationsRounded />, path: "/settings", color: iconColors.Settings },
    { text: "Documents", icon: <ArticleRounded />, path: "/documents", color: iconColors.Documents },
  ];

  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

  return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <StyledAppBar position="fixed" open={open} sx={{
          boxShadow: 'none',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: '#212121',
        }}>
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
              borderRight: 'none',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5'
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
              <img src="/assets/elsipogtoglogo.png" alt="Elsipogtog Employee Dashboard Logo" style={{ height: '40px'}} />
            <IconButton onClick={handleDrawerClose} sx={{ position: 'absolute', right: 8 }}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <List sx={{ p: 2}}>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: 2, 
                  mb: 1,
                  ...(location.pathname === item.path && {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  })
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 'auto',
                  mr: 2,
                  color: location.pathname === item.path ? 'primary.contrastText' : item.color,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
        <Main open={open} sx={{
          minHeight: '100vh'
        }}>
          <DrawerHeader />
          <Outlet />
        </Main>
      </Box>
  );
};

export default Dashboard;
