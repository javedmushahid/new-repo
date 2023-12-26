// components/RichTextEditor.js

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import {
  Box,
  FormControlLabel,
  useTheme,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { H1 } from "components/Typography";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import { deletePage, getAllPage } from "apiSetup";

const RichTextEditor = ({ name }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedPage, setViewedPage] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const fetchPages = async () => {
    setLoading(true);

    try {
      const data = await getAllPage();
      console.log(data);
      setLoading(false);
      const updatedRows = data.data.map((row, index) => ({
        ...row,
        id: index + 1,
      }));
      setPages(updatedRows); // Assuming the API returns the array of pages
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };
  useEffect(() => {
    fetchPages();
  }, []);

  const handleDeleteConfirmationOpen = (id) => {
    setPageToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setPageToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleEdit = (id) => {
    // Handle edit action here, e.g., redirect to an edit page
    router.push(`/edit-page/${id}`);
  };
  const handleViewDialogOpen = (page) => {
    setViewedPage(page);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewedPage(null);
    setViewDialogOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      // Call the deletePage function to delete the page by its ID
      await deletePage(pageToDelete);
      // If deletion is successful, remove the deleted page from the state
      setPages((prevPages) =>
        prevPages.filter((page) => page._id !== pageToDelete)
      );
      enqueueSnackbar("Page deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting page:", error);
      enqueueSnackbar("Failed to delete page", { variant: "error" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "content",
      headerName: "Content",
      width: 250,
      renderCell: (params) => (
        <div dangerouslySetInnerHTML={{ __html: params.value }} />
      ),
    },
    { field: "status", headerName: "Status", width: 160 },
    {
      field: "action",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewDialogOpen(params.row)}
          >
            View
          </Button>
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            color="primary"
            onClick={() => router.push(`/cms/${params.row._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            onClick={() => handleDeleteConfirmationOpen(params.row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
    // Add more columns as needed
  ];

  return (
    <VendorDashboardLayout>
      <Box>
        <H1 mt={2} mb={2}>
          All Pages
        </H1>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={pages}
            loading={loading}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            getRowId={(row) => row._id}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </Box>
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>View Page</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          {viewedPage && (
            <div>
              <Typography>Title: {viewedPage.title}</Typography>
              <Typography>Description: {viewedPage.description}</Typography>
              <Typography>
                Content:
                <div dangerouslySetInnerHTML={{ __html: viewedPage.content }} />
              </Typography>{" "}
              <Typography>Status: {viewedPage.status}</Typography>
              {/* Add more details as needed */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this page?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteConfirmationClose}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </VendorDashboardLayout>
  );
};

export default RichTextEditor;
