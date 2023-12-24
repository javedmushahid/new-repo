import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
} from "@mui/material";
import { H6, Small } from "components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/authSlice";
import { useRouter } from "next/router";
import { getAdminProfile } from "apiSetup";

// styled components
const Divider = styled(Box)(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`,
}));

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user); // Redux state that holds user data
  // console.log("userrrr", user);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleLogout = () => {
    setLogoutConfirmationOpen(true);
  };
  const handleLogoutConfirmed = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Dispatch the logout action to clear user data and token in Redux
    dispatch(logout());

    // Redirect the user to the login page or wherever you want after logout
    router.push("/login");

    setLogoutConfirmationOpen(false);
  };
  const open = Boolean(anchorEl); 
  const handleProfileClick = () => {
    // Redirect the user to the profile page
    router.push("/profile"); // Replace "/profile" with the actual path to your profile page
    handleClose(); // Close the menu after redirecting
  };
  useEffect(() => {
    const fetchData = async () => {
      const updatedProfile = await getAdminProfile();
      setUserData(updatedProfile.data);
    };
    fetchData();
  }, []);
  console.log("userdata", userData);

  return (
    <Box>
      <IconButton
        sx={{ padding: 0 }}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
      >
        <Avatar alt="" src="/assets/images/user-dummy.png" />
      </IconButton>

      <Menu
        open={open}
        id="account-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            boxShadow: 2,
            minWidth: 200,
            borderRadius: "8px",
            overflow: "visible",
            border: "1px solid",
            borderColor: "grey.200",
            "& .MuiMenuItem-root:hover": {
              backgroundColor: "grey.200",
            },
            "&:before": {
              top: 0,
              right: 14,
              zIndex: 0,
              width: 10,
              height: 10,
              content: '""',
              display: "block",
              position: "absolute",
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
            },
          },
        }}
      >
        <Box px={2} pt={1}>
          <H6>{userData?.name}</H6>
          <Small color="grey.500">Admin</Small>
        </Box>

        <Divider />
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        {/* <MenuItem>My Orders</MenuItem> */}
        {/* <MenuItem>Settings</MenuItem> */}
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutConfirmationOpen}
        onClose={() => setLogoutConfirmationOpen(false)}
      >
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to logout?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirmed} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPopover;
