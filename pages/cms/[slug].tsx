// pages/cms/[slug].js

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
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
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { updatePage } from "apiSetup"; // Import updatePage and getPageBySlug functions
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

// Since react-quill relies on the window object, we dynamically import it to avoid issues during SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  content: Yup.string(),
  status: Yup.string().required("Status is required"),
});

const EditPage = () => {
  const [pageData, setPageData] = useState<any>({});
  const [editorHtml, setEditorHtml] = useState("");
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { slug } = router.query; // Access the slug parameter from the URL

  const handleSubmit = async (values) => {
    try {
      const requestData = {
        title: values.title,
        description: values.description,
        content: editorHtml,
        status: values.status,
      };

      // Use the updatePage function to update the page data
      const response = await updatePage(requestData, pageData.id); // You may need to adjust this depending on your API

      // Handle successful update
      if (response) {
        enqueueSnackbar("Page updated successfully", { variant: "success" });
        router.push("/cms/all-pages"); // Redirect to the list of all pages
      }
    } catch (error) {
      enqueueSnackbar("Failed to update page", { variant: "error" });
      console.error("Error updating page:", error);
    }
  };

  return (
    <VendorDashboardLayout>
      <Box mt={4} mb={4}>
        <H1>Edit Page</H1>
      </Box>
      <Box>
        <Formik
          initialValues={{
            title: pageData.title || "",
            description: pageData.description || "",
            status: pageData.status || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box marginBottom={2}>
                <Field as={TextField} name="title" label="Title" fullWidth />
                <ErrorMessage name="title" component="div" />
              </Box>

              <Box marginBottom={2}>
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  multiline
                  fullWidth
                />
                <ErrorMessage name="description" component="div" />
              </Box>

              {/* ReactQuill editor */}
              <ReactQuill
                placeholder="Enter your content"
                theme="snow"
                value={editorHtml}
                onChange={(value) => setEditorHtml(value)}
                modules={
                  {
                    // ... (your toolbar configuration)
                  }
                }
              />

              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Typography>Status:</Typography>
                  <Field name="status">
                    {({ field }) => (
                      <RadioGroup
                        style={{ marginLeft: "10px" }}
                        row
                        aria-label="status"
                        {...field}
                      >
                        <FormControlLabel
                          value="active"
                          control={<Radio color="primary" />}
                          label="Active"
                          sx={{
                            "& .MuiRadio-colorPrimary.Mui-checked": {
                              color:
                                theme.palette.grey[400] === "dark"
                                  ? "white"
                                  : "black",
                            },
                          }}
                        />
                        <FormControlLabel
                          value="inactive"
                          control={<Radio color="primary" />}
                          label="Inactive"
                          sx={{
                            "& .MuiRadio-colorPrimary.Mui-checked": {
                              color:
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : "black",
                            },
                          }}
                        />
                      </RadioGroup>
                    )}
                  </Field>
                </Box>
              </Grid>

              <Button
                type="submit"
                sx={{ mt: 1, mb: 3, p: 1.6, fontWeight: 600, fontSize: 15 }}
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                UPDATE
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </VendorDashboardLayout>
  );
};

export default EditPage;
