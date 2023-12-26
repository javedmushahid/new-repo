import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { H1 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import AddMentorForm from "components/mentor/AddMentorForm";
import React from "react";
import { useRouter } from "next/router";

const Addmentor = () => {
  const router = useRouter();

  const handleSubmit = (values) => {
    // Handle form submission here, e.g., send a POST request to your API
    console.log("Form values:", values);
  };
  const handleGoBack = () => {
    router.push("/mentors");
  };
  return (
    <>
      <VendorDashboardLayout>
        <Box>
          <IconButton onClick={handleGoBack} sx={{ marginBottom: 2 }}>
            <ArrowBack />
          </IconButton>
          <H1>Add Mentor</H1>
          <AddMentorForm />
        </Box>
      </VendorDashboardLayout>
    </>
  );
};

export default Addmentor;
