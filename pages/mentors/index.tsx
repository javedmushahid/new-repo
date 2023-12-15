import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid"; // Import Data Grid component
import { deleteMentorbyId, getAllMentors } from "apiSetup";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H1 } from "components/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import the Visibility icon

const AllMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch the list of mentors when the component mounts
    const fetchMentors = async () => {
      try {
        const mentorData = await getAllMentors();
        // console.log("m entodata", mentorData);
        const transformedData = mentorData.data.map((mentor, index) => ({
          ...mentor,
          id: index + 1, // Transform _id to id
        }));
        setMentors(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Define the columns for the Data Grid
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "candidateId", headerName: "Candidate Id", width: 200 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "superpower", headerName: "SuperPower", width: 200 },
    {
      field: "profilePicture",
      headerName: "profile Picture",
      width: 200,
      renderCell: (params) => (
        <img
          src={`${process.env.NEXT_PUBLIC_DEV_OPEN_URL}/uploads/${params.value}`}
          alt={`Profile ${params.value}`}
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    { field: "userType", headerName: "user Type", width: 200 },
    { field: "expertise", headerName: "Expertise", width: 200 },
    { field: "mentorOfferings", headerName: "mento Offerings", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 340,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleViewDialogOpen(params.row)} // Open the view dialog
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<VisibilityIcon />}
            >
              View
            </Button>
          </IconButton>
          <Link
            href={`/mentors/${params.row.candidateId}`}
            style={{ marginRight: "10px" }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.candidateId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleViewDialogOpen = (mentor) => {
    setSelectedMentor(mentor);
    setViewDialogOpen(true);
  };

  const handleDelete = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      try {
        // Call the deleteMentorbyId function
        const res = await deleteMentorbyId(candidateId);
        console.log("deleted response", res);
        enqueueSnackbar("Mentor deleted succesfully", { variant: "success" });

        // After successful deletion, update the mentor list
        // You can fetch the updated list of mentors and set it in the state (similar to what you did in useEffect)
        const updatedMentorData = await getAllMentors();
        const transformedData = updatedMentorData.data.map((mentor, index) => ({
          ...mentor,
          id: index + 1,
        }));
        setMentors(transformedData);

        // Optionally, you can display a success message or perform other actions.
      } catch (error) {
        console.error("Error deleting mentor", error);
      }
    }
  };
  const handleClose = () => {
    setViewDialogOpen(false);
    setSelectedMentor(null);
  };

  return (
    <VendorDashboardLayout>
      <H1>All Mentors Listing</H1>
      <div>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={mentors}
            columns={columns}
            rowBuffer={40}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
        <Dialog
          open={viewDialogOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Mentor Details</DialogTitle>
          <DialogContent>
            {selectedMentor && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_DEV_OPEN_URL}/uploads/${selectedMentor.profilePicture}`}
                  width={120}
                  height={"auto"}
                />
                <Typography variant="h6" gutterBottom>
                  Mentor Name: {selectedMentor.fullName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  SuperPower: {selectedMentor.superpower}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  User Type: {selectedMentor.userType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Expertise: {selectedMentor.expertise}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Mentor Offerings: {selectedMentor.mentorOfferings}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Description: {selectedMentor.description}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </VendorDashboardLayout>
  );
};

export default AllMentors;
