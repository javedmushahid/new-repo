import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { allUsersInfo, deleteUsersInfo } from "apiSetup";
import { H1 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const Index = () => {
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await allUsersInfo();
      if (response.status === 200) {
        console.log("response", response);
        const filteredRows = response.data.filter(
          (row) => row.roles === "User"
        );
        const rowsWithFormattedData = filteredRows.map((row, index) => ({
          ...row,
          id: index + 1,
          createdAt: new Date(row.createdAt).toLocaleString(),
          updatedAt: new Date(row.updatedAt).toLocaleString(),
        }));

        setRows(rowsWithFormattedData);
      } else {
        // Handle non-success response
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
    setLoading(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Full Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "candidateId", headerName: "Candidate ID", width: 150 },
    { field: "roles", headerName: "Roles", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
          color="primary"
          aria-label="Delete"
          onClick={() => handleOpenDeleteDialog(params.row.candidateId)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleOpenDeleteDialog = (userId) => {
    setDeleteUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteUserId(null);
    setDeleteDialogOpen(false);
  };
  const handleDelete = async (userId) => {
    console.log(userId, "userid");
    try {
      const response = await deleteUsersInfo(deleteUserId);
      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.filter((row) => row.candidateId !== deleteUserId)
        );
      } else {
        // Handle deletion failure
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      handleCloseDeleteDialog();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <VendorDashboardLayout>
      <Box>
        <H1>All Users</H1>
      </Box>
      <Box bgcolor={"white"}>
        <Box sx={{ height: 700, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowBuffer={40}
            loading={isLoading}
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
      </Box>
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </VendorDashboardLayout>
  );
};

export default Index;
