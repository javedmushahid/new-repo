import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { H1 } from "components/Typography";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { register } from "react-scroll/modules/mixins/scroller";
import { registerClassroom, registerIndividual } from "apiSetup";
import { useSnackbar } from "notistack";
import FileInput from "components/fileinput/FileInput";
import { useFormik } from "formik"; // Import useFormik instead of useFormikContext

const AddSchoolSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  schoolName: Yup.string().required("School name is required"),
  schoolDistrict: Yup.string().required("School district is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const AddClassroomSchema = Yup.object().shape({
  schoolName: Yup.string().required("School name is required"),
  schoolEmail: Yup.string()
    .email("Invalid school email")
    .required("School email is required"),
  schoolDistrict: Yup.string().required("School district is required"),
  sheet: Yup.mixed().required("CSV file is required"),
});

const AddSchool = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [currentFormType, setCurrentFormType] = useState("individual");
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Values", values);
    try {
      const response = await registerIndividual(values);
      console.log(response.data);
      enqueueSnackbar("New School added.", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      resetForm();
      // Handle success here
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Email already exists error
        enqueueSnackbar("Email already exists.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
      console.error("error", error);
      // Handle error here
    }
    setSubmitting(false);
  };

  const handleSubmitClassroom = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    console.log("Classroom Values", values);
    try {
      const formData = new FormData();
      formData.append("schoolName", values.schoolName);
      formData.append("schoolEmail", values.schoolEmail);
      formData.append("schoolDistrict", values.schoolDistrict);

      // Append the CSV file to the FormData
      formData.append("sheet", values.sheet);
      // Create a function like registerClassroom to handle classroom registration with CSV file upload
      const response = await registerClassroom(formData);
      console.log("classroom data", response.data);
      enqueueSnackbar("Classroom successfully added.", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      resetForm();

      // Handle success here
    } catch (error) {
      console.error("Classroom registration error", error);
      enqueueSnackbar("Email already exists.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      // Handle error here
    }
    setSubmitting(false);
  };
  const handleFormTypeChange = (formType) => {
    setCurrentFormType(formType);
  };

  return (
    <VendorDashboardLayout>
      <Grid spacing={2} item xs={12} sm={12} mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleFormTypeChange("individual")}
          disabled={currentFormType === "individual"}
        >
          Individual Registration
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleFormTypeChange("classroom")}
          disabled={currentFormType === "classroom"}
        >
          Classroom Registration
        </Button>
      </Grid>
      {currentFormType === "individual" && (
        <Box sx={{ maxWidth: 500 }} mt={2}>
          <H1>{`Add New School (Individual)`}</H1>
          <Formik
            initialValues={{
              name: "",
              email: "",
              schoolName: "",
              schoolDistrict: "",
              password: "",
            }}
            validationSchema={AddSchoolSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="Name"
                      name="name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="Email"
                      name="email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="School Name"
                      name="schoolName"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.schoolName && !!errors.schoolName}
                      helperText={touched.schoolName && errors.schoolName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="School District"
                      name="schoolDistrict"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.schoolDistrict && !!errors.schoolDistrict}
                      helperText={
                        touched.schoolDistrict && errors.schoolDistrict
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      )}
      {currentFormType === "classroom" && (
        <Box sx={{ maxWidth: 500 }} mt={2}>
          <H1>{`Add Classroom (Bulk Register)`}</H1>
          <Formik
            initialValues={{
              schoolName: "",
              schoolEmail: "",
              schoolDistrict: "",
              sheet: null, // This will hold the uploaded CSV file
            }}
            validationSchema={AddClassroomSchema}
            onSubmit={handleSubmitClassroom}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="School Name"
                      name="schoolName"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.schoolName && !!errors.schoolName}
                      helperText={touched.schoolName && errors.schoolName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="School Email"
                      name="schoolEmail"
                      type="email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.schoolEmail && !!errors.schoolEmail}
                      helperText={touched.schoolEmail && errors.schoolEmail}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Field
                      as={TextField}
                      label="School District"
                      name="schoolDistrict"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={touched.schoolDistrict && !!errors.schoolDistrict}
                      helperText={
                        touched.schoolDistrict && errors.schoolDistrict
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FileInput name="sheet" />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </VendorDashboardLayout>
  );
};

export default AddSchool;
