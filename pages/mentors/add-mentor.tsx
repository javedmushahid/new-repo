import { Box } from "@mui/material";
import { H1 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import AddMentorForm from "components/mentor/AddMentorForm";
import React from "react";

const Addmentor = () => {
  const handleSubmit = (values) => {
    // Handle form submission here, e.g., send a POST request to your API
    console.log("Form values:", values);
  };
  return (
    <>
      <VendorDashboardLayout>
        <Box>
          <H1>Add Mentor</H1>
          <AddMentorForm />
        </Box>
      </VendorDashboardLayout>
    </>
  );
};

export default Addmentor;
