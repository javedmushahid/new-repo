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
  InputLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { H1 } from "components/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getPage, updatePage } from "apiSetup"; // Import updatePage and getPageBySlug functions
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { ArrowBack } from "@mui/icons-material";

// Since react-quill relies on the window object, we dynamically import it to avoid issues during SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  content: Yup.string(),
  status: Yup.string().required("Status is required"),
});

const EditPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [status, setStatus] = useState("active");
  const [pageData, setPageData] = useState<any>({});
  // const [editorHtml, setEditorHtml] = useState("");
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [pageDetails, setPageDetails] = useState<any>({});
  const { slug } = router.query; // Access the slug parameter from the URL
  console.log("slug", slug);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await getPage(slug);
        console.log(data, "res");
        if (data.status === 200) {
          setPageData(data.data);
          setTitle(data.data.title || "");
          setDescription(data.data.description || "");
          setEditorHtml(data.data.content || "");
          setStatus(data.data.status || "active");
          // Set the initial values for form fields and the editorHtml
          setPageDetails({
            title: data.data.title,
            description: data.data.description,
            status: data.data.status,
          });
          setEditorHtml(data.data.content || ""); // Set an empty string if content is null or undefined
        }
      } catch (error) {}
    };
    fetchPage();
  }, [slug]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestData = {
        title: title,
        description: description,
        content: editorHtml,
        status: status,
      };
      console.log("Request Data", requestData);
      // Use the updatePage function to update the page data
      const response = await updatePage(requestData, slug); // You may need to adjust this depending on your API
      console.log("resposne pages", response);
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

  // console.log("pagedata", pageData);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleContentChange = (value) => {
    setEditorHtml(value);
  };
  const handleGoBack = () => {
    router.push("/cms/all-pages");
  };
  return (
    <VendorDashboardLayout>
      <Box mt={4} mb={4}>
        <IconButton onClick={handleGoBack}>
          <ArrowBack />
        </IconButton>
        <H1>Edit Page</H1>
      </Box>
      {/* <Box>
        <Formik
          initialValues={{
            title: pageDetails.title || "",
            description: pageDetails.description || "",
            status: pageDetails.status || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box marginBottom={2}>
                <InputLabel>Title</InputLabel>
                <Field
                  as={TextField}
                  name="title"
                 
                  fullWidth
                  value={pageDetails.title}
                />
                <ErrorMessage name="title" component="div" />
              </Box>

              <Box marginBottom={2}>
                <InputLabel>Description</InputLabel>

                <Field
                  value={pageDetails.description}
                  as={TextField}
                  name="description"
                  multiline
                  fullWidth
                />
                <ErrorMessage name="description" component="div" />
              </Box>

              <InputLabel>Content</InputLabel>

              <ReactQuill
                placeholder="Enter your content"
                theme="snow"
                value={editorHtml}
                onChange={(value) => setEditorHtml(value)}
                
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
      </Box> */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={handleTitleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
            />
          </Grid>

          <Box width={800} mt={2} ml={2} marginBottom={2}>
            <ReactQuill
              placeholder="Enter your content"
              theme="snow"
              value={editorHtml}
              onChange={handleContentChange}
              modules={{
                toolbar: [
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
              style={{ width: "100%" }}
            />
          </Box>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={status === "active"}
                    onChange={() => setStatus("active")}
                    color="primary"
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={status === "inactive"}
                    onChange={() => setStatus("inactive")}
                    color="primary"
                  />
                }
                label="Inactive"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: theme.spacing(2) }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </VendorDashboardLayout>
  );
};

export default EditPage;
