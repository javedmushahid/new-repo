import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { getAdminProfile, editAdminProfile } from "apiSetup";
import { H1, H2, H3, H4, Span } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { ArrowBack, EditOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";

const AdminProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State variables for editable fields
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getAdminProfile();
        setUserData(response.data);
        // Initialize editable fields with current user data
        setEditedName(response.data.name);
        setEditedEmail(response.data.email);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Call the API function to edit user profile
      console.log(editedEmail, editedName);
      const response = await editAdminProfile({
        name: editedName,
        email: editedEmail,
        // Add other fields as needed
      });

      const updatedProfile = await getAdminProfile();
      setUserData(updatedProfile.data);
      setIsEditMode(!isEditMode);
      router.reload();
    } catch (error) {
      console.error("Error editing user profile:", error);
    }
  };
  const handleEditClick = () => {
    // Enter edit mode when the edit icon is clicked
    setIsEditMode(!isEditMode);
  };
  return (
    <VendorDashboardLayout>
      <Box mt={2}>
        <Box>
          <H1 mb={3} color={"green"}>
            Admin Profile
          </H1>
          {/* <IconButton > */}
          {!isEditMode && (
            <Button
              sx={{
                mb: 2,
              }}
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
          {/* </IconButton> */}
        </Box>
        {loading ? (
          <CircularProgress />
        ) : userData ? (
          <Box display={"flex"} justifyContent={"space-between"}>
            {isEditMode ? (
              // Edit mode view
              <Box
                display={"flex"}
                flexDirection={"column"}
                width={"50%"}
                gap={2}
              >
                <ArrowBack onClick={handleEditClick} />
                <TextField
                  label="Name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <TextField
                  label="Email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </Box>
            ) : (
              // Read-only view
              <Box>
                <H4>{`Name: ${userData.name}`}</H4>
                <H4>{`Email: ${userData.email}`}</H4>
                <H4>{`Role: ${userData.roles}`}</H4>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body1">User data not available</Typography>
        )}
      </Box>
    </VendorDashboardLayout>
  );
};

export default AdminProfile;
