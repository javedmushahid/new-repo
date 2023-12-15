import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { H1 } from "components/Typography";
import { getAllSubscriptions, deleteSubscriptions } from "apiSetup";
import { Box, Button } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

const Index = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSubscriptions = async () => {
    try {
      const response = await getAllSubscriptions();
      if (response) {
        setSubscriptions(response.subscriptions);
        setLoading(false);
      } else {
        console.error("Error fetching subscriptions:", response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch subscriptions from the API when the component mounts
    getSubscriptions();
  }, []);

  const handleDelete = async (id) => {
    // Handle subscription deletion here
    console.log(id);
    try {
      const response = await deleteSubscriptions(id);
      if (response) {
        // Remove the deleted subscription from the state
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.filter((subscription) => subscription._id !== id)
        );
        window.location.reload();
      } else {
        console.error("Error deleting subscription:", response);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  // Define the columns for the Data Grid
  const columns = [
    { field: "_id", headerName: "ID", width: 170 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
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
              // Handle delete action here
              handleDelete(params.row._id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <VendorDashboardLayout>
      <H1>Subscriptions</H1>
      <Box bgcolor={"white"} style={{ height: 400, width: "100%" }} mt={4}>
        <DataGrid
          rows={subscriptions}
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
    </VendorDashboardLayout>
  );
};

export default Index;
