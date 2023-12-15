import React, { useState } from "react";
import { Avatar, Box, IconButton, Menu, MenuItem, styled } from "@mui/material";
import { H6, Small } from "components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/authSlice";
import { useRouter } from "next/router";

// styled components
const Divider = styled(Box)(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`,
}));

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user); // Redux state that holds user data
  // console.log("userrrr", user);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleLogout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Dispatch the logout action to clear user data and token in Redux
    dispatch(logout());

    // Redirect the user to the login page or wherever you want after logout
    router.push("/login");
  };

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
          <H6>{user.name}</H6>
          <Small color="grey.500">Admin</Small>
        </Box>

        <Divider />
        <MenuItem>Profile</MenuItem>
        {/* <MenuItem>My Orders</MenuItem> */}
        {/* <MenuItem>Settings</MenuItem> */}

        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountPopover;
