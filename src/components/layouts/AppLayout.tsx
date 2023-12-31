import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ListIcon from "@mui/icons-material/List";
import {
  BlockOutlined,
  LogoutOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { DraggableDialog } from "../shared/ConfirmationDialog";

const drawerWidth = 240;

type RouteType = {
  path: string;
  title: string;
  Icon: React.ReactNode;
};

const ROUTES: RouteType[] = [
  {
    path: "/",
    title: "Reports",
    Icon: <HomeIcon />,
  },
  {
    path: "/users",
    title: "Users",
    Icon: <PersonIcon />,
  },
  {
    path: "/items",
    title: "Items",
    Icon: <ListIcon />,
  },
  {
    path: "/blocks",
    title: "Blocks",
    Icon: <BlockOutlined />,
  },

  {
    path: "/notifications",
    title: "Notifications",
    Icon: <NotificationsOutlined />,
  },
];

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export const AppLayout = (props: Props) => {
  const { window } = props;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {});
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {ROUTES.map((route, index) => {
          const { Icon } = route;

          const isSelected = location.pathname === route.path;

          return (
            <ListItem
              key={route.title + index}
              disablePadding
              sx={{
                ...(isSelected && {
                  backgroundColor: (theme) => theme.palette.action.selected,
                }),
              }}
            >
              <ListItemButton onClick={() => navigate(route.path)}>
                <ListItemIcon>{Icon}</ListItemIcon>
                <ListItemText primary={route.title} />
              </ListItemButton>
            </ListItem>
          );
        })}

        <DraggableDialog
          title="Are you sure"
          description="Are you sure you want to log out?"
          open={isLogoutDialogOpen}
          setOpen={setIsLogoutDialogOpen}
          onProceed={handleLogout}
        >
          <ListItem disablePadding>
            <ListItemButton onClick={() => setIsLogoutDialogOpen(true)}>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </DraggableDialog>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Shamchiroq
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
};
