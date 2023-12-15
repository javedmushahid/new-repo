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
} from "@mui/material";
import { H1 } from "components/Typography";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import { deletePage, getAllPage } from "apiSetup";

const RichTextEditor = ({ name }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const fetchPages = async () => {
    setLoading(true);

    try {
      const data = await getAllPage();
      console.log(data);
      setLoading(false);

      setPages(data.data); // Assuming the API returns the array of pages
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };
  useEffect(() => {
    fetchPages();
  }, []);
  console.log(pages, "data pages");
  const handleEdit = (id) => {
    // Handle edit action here, e.g., redirect to an edit page
    router.push(`/edit-page/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Call the deletePage function to delete the page by its ID
      await deletePage(id);
      // If deletion is successful, remove the deleted page from the state
      setPages((prevPages) => prevPages.filter((page) => page._id !== id));
      enqueueSnackbar("Page deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting page:", error);
      enqueueSnackbar("Failed to delete page", { variant: "error" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "content", headerName: "Content", width: 300 },
    { field: "status", headerName: "Status", width: 300 },
    {
      field: "action",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row._id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            onClick={() => handleDelete(params.row._id)}
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
        <H1>All Pages</H1>
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
    </VendorDashboardLayout>
  );
};

export default RichTextEditor;
