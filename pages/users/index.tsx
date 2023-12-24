import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { allUsersInfo, deleteUsersInfo } from "apiSetup";
import { H1 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const Index = () => {
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

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
          onClick={() => handleDelete(params.row.candidateId)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  const handleDelete = async (userId) => {
    console.log(userId, "userid");
    try {
      const response = await deleteUsersInfo(userId);
      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.filter((row) => row.candidateId !== userId)
        );
      } else {
        // Handle deletion failure
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
    </VendorDashboardLayout>
  );
};

export default Index;
