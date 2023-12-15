import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { deleteMicrocredentials, getAllMicrocredentials } from "apiSetup"; // Replace with your API function for fetching microcredentials
import { H1 } from "components/Typography";
import { useSnackbar } from "notistack";

const Index = () => {
  const [microcredentials, setMicrocredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedMicrocredential, setSelectedMicrocredential] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const getMicrocredentials = async () => {
    try {
      const response = await getAllMicrocredentials();
      if (response) {
        setMicrocredentials(response.data);
        setLoading(false);
      } else {
        console.error("Error fetching microcredentials:", response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching microcredentials:", error);
      setLoading(false);
    }
  };
  const handleView = (microcredential) => {
    setSelectedMicrocredential(microcredential);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedMicrocredential(null);
    setOpenDialog(false);
  };
  useEffect(() => {
    // Fetch microcredentials from the API when the component mounts
    getMicrocredentials();
  }, []);
  // Define the columns for the Data Grid
  const handleDelete = async (id) => {
    try {
      const response = await deleteMicrocredentials(id);
      if (response) {
        // Remove the deleted microcredential from the state
        setMicrocredentials((prevMicrocredentials) =>
          prevMicrocredentials.filter((mc) => mc._id !== id)
        );
        enqueueSnackbar("Deleted", { variant: "success" });
      } else {
        console.error("Error deleting microcredential:", response);
      }
    } catch (error) {
      console.error("Error deleting microcredential:", error);
    }
  };

  // Define the columns for the Data Grid
  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "courseName", headerName: "Course Name", width: 200 },
    { field: "duration", headerName: "Duration", width: 150 },
    {
      field: "totalNumberOfLearners",
      headerName: "Total Learners",
      width: 200,
    },
    { field: "level", headerName: "Level", width: 150 },
    { field: "whatWillILearn", headerName: "What Will I Learn", width: 250 },
    { field: "superpower", headerName: "Superpower", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div style={{ gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleDelete(params.row._id);
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleView(params.row);
            }}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <VendorDashboardLayout>
      <Box mt={3} mb={4}>
        <H1>Microcredentials</H1>
      </Box>
      <Box bgcolor={"white"} style={{ height: 600, width: "100%" }} mt={4}>
        <DataGrid
          rows={microcredentials}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>View Microcredential</DialogTitle>
        <DialogContent>
          {selectedMicrocredential && (
            <div>
              <p>
                <strong>Course Name:</strong>{" "}
                {selectedMicrocredential.courseName}
              </p>
              <p>
                <strong>Duration:</strong> {selectedMicrocredential.duration}
              </p>
              <p>
                <strong>Total Learners:</strong>{" "}
                {selectedMicrocredential.totalNumberOfLearners}
              </p>
              {/* Add more microcredential details here */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </VendorDashboardLayout>
  );
};

export default Index;
