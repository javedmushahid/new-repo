import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { DataGrid } from "@mui/x-data-grid";
import { getAllSchoolsInfo } from "apiSetup";
import { H1 } from "components/Typography";

const columns = [
  { field: "_id", headerName: "ID", width: 90 },
  { field: "name", headerName: "School Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "district", headerName: "District", width: 150 },
  // ... other columns as needed
];

const Schools = () => {
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllSchoolsInfo();
        if (response.status === 200) {
          const transformedData = response.schools.map((school) => ({
            ...school,
            id: school._id, // Transform _id to id
          }));
          setRows(transformedData);
        } else {
          // Handle non-success response
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  console.log("rows", rows);
  return (
    <VendorDashboardLayout>
      <Box mt={4} mb={3}>
        <H1>All Schools</H1>
      </Box>
      <Box bgcolor={"white"}>
        <Box sx={{ height: 400, width: "100%" }}>
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

export default Schools;
