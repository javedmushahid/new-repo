// components/RichTextEditor.js

import React, { useState } from "react";
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
import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import { addPage } from "apiSetup";
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
const RichTextEditor = ({ name }) => {
  const [addMyPage, setAddMyPage] = useState(null);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [editorHtml, setEditorHtml] = useState("");
  const [editorText, setEditorText] = useState("");

  // Use Formik's useField hook to connect to Formik context
  const initialValues = {
    title: "",
    description: "",
    content: "",
    status: "",
  };
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const requestData = {
        title: values.title,
        description: values.description,
        content: editorHtml,
        status: values.status,
      };
      console.log("Form Data:", requestData);
      const response = await addPage(requestData);
      console.log("response after submitting: ", response.data);
      const data = response.data;
      // console.log("response from form data add page", data);
      setAddMyPage(response.data.data);
      enqueueSnackbar("Content Added", { variant: "success" });
      resetForm();
      router.push("/cms/all-pages");
    } catch (error) {
      enqueueSnackbar("Failed", { variant: "error" });
      console.log(error);
    }
  };
  return (
    <VendorDashboardLayout>
      <Box mt={4} mb={4}>
        <H1>Add Pages</H1>
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
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
                onChange={(value) => {
                  setEditorHtml(value);
                  setEditorText(value.replace(/<[^>]*>/g, ""));
                }}
                modules={{
                  toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link", "image", "video"],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                  ],
                }}
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
              >
                SUBMIT
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </VendorDashboardLayout>
  );
};

export default RichTextEditor;
