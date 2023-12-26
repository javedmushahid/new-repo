import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { H1 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { ArrowBack, Delete } from "@mui/icons-material";
import { AddMicrocredentialsData } from "apiSetup";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

const AddMicrocredentials = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      courseName: "",
      duration: "",
      totalNumberOfLearners: "",
      level: "",
      description: "",
      whatWillILearn: [],
      superpower: "",
      courseImage: [],
    },
    validationSchema: Yup.object({
      courseName: Yup.string().required("Required"),
      duration: Yup.string().required("Required"),
      totalNumberOfLearners: Yup.string().required("Required"),
      level: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      superpower: Yup.string().required("Required"),
      courseImage: Yup.array(),
      whatWillILearn: Yup.array()
        .of(Yup.string())
        .min(1, "At least one item is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("courseName", values.courseName);
        formData.append("duration", values.duration);
        formData.append("totalNumberOfLearners", values.totalNumberOfLearners);
        formData.append("level", values.level);
        formData.append("description", values.description);
        formData.append("superpower", values.superpower);

        // Append each item in the "whatWillILearn" array
        values.whatWillILearn.forEach((item, index) => {
          formData.append(`whatWillILearn[${index}]`, item);
        });

        // Append each file in the "courseImages" array
        // Append each file in the "courseImages" array
        values.courseImage.forEach((file, index) => {
          formData.append(`courseImages`, file);
        });

        console.log("values:", values);
        // Your API call here
        const response = await AddMicrocredentialsData(formData);
        console.log("API Response:", response);

        formik.resetForm();
        enqueueSnackbar("Added successfully", { variant: "success" });

        router.push("/microcredentials");
      } catch (error) {
        console.error("API Error:", error);
      }
    },
  });
  const handleGoBack = () => {
    router.push("/microcredentials");
  };

  return (
    <VendorDashboardLayout>
      <Box mt={2}>
        <IconButton onClick={handleGoBack}>
          <ArrowBack />
        </IconButton>
        <H1 p={3}>Add Microcredentials</H1>
        <form onSubmit={formik.handleSubmit}>
          {/* Course Name */}
          <TextField
            fullWidth
            id="courseName"
            name="courseName"
            label="Course Name"
            value={formik.values.courseName}
            onChange={formik.handleChange}
            error={
              formik.touched.courseName && Boolean(formik.errors.courseName)
            }
            helperText={formik.touched.courseName && formik.errors.courseName}
            margin="normal"
          />

          {/* Duration */}
          <TextField
            fullWidth
            id="duration"
            name="duration"
            label="Duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
            error={formik.touched.duration && Boolean(formik.errors.duration)}
            helperText={formik.touched.duration && formik.errors.duration}
            margin="normal"
          />

          {/* Total Number of Learners */}
          <TextField
            fullWidth
            id="totalNumberOfLearners"
            name="totalNumberOfLearners"
            label="Total Number of Learners"
            value={formik.values.totalNumberOfLearners}
            onChange={formik.handleChange}
            error={
              formik.touched.totalNumberOfLearners &&
              Boolean(formik.errors.totalNumberOfLearners)
            }
            helperText={
              formik.touched.totalNumberOfLearners &&
              formik.errors.totalNumberOfLearners
            }
            margin="normal"
          />

          {/* Level */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="level-label">Level</InputLabel>
            <Select
              labelId="level-label"
              id="level"
              name="level"
              value={formik.values.level}
              onChange={formik.handleChange}
              error={formik.touched.level && Boolean(formik.errors.level)}
              label="Level"
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
            multiline
            rows={4}
          />

          {/* Superpower */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="superpower-label">Superpower</InputLabel>
            <Select
              labelId="superpower-label"
              id="superpower"
              name="superpower"
              value={formik.values.superpower}
              onChange={formik.handleChange}
              error={
                formik.touched.superpower && Boolean(formik.errors.superpower)
              }
              label="Superpower"
            >
              {[
                "Stylish Thinker",
                "Community Builder",
                "Engager",
                "Influencer",
                "Adapter",
                "Relationship Builder",
              ].map((superpower) => (
                <MenuItem key={superpower} value={superpower}>
                  {superpower}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mb={2}>
            <Typography variant="subtitle1" mb={1}>
              What Will I Learn
            </Typography>
            {formik.values.whatWillILearn.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  name={`whatWillILearn[${index}]`}
                  label={`Item ${index + 1}`}
                  value={item}
                  onChange={formik.handleChange}
                />
                <IconButton
                  color="secondary"
                  onClick={() =>
                    formik.setFieldValue(
                      "whatWillILearn",
                      formik.values.whatWillILearn.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                formik.setFieldValue("whatWillILearn", [
                  ...formik.values.whatWillILearn,
                  "",
                ])
              }
            >
              Add Item
            </Button>
          </Box>
          <input
            id="courseImages"
            name="courseImages"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              console.log("Selected files:", event.target.files);
              formik.setFieldValue(
                "courseImage",
                Array.from(event.target.files)
              );
            }}
          />
          {formik.touched.courseImage && formik.errors.courseImage && (
            <Typography color="error">
              {Array.isArray(formik.errors.courseImage)
                ? formik.errors.courseImage.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))
                : formik.errors.courseImage}
            </Typography>
          )}

          {/* Submit Button */}

          <Box mt={3} mb={5}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mb: 3 }}
            >
              Add Microcredentials
            </Button>
          </Box>
        </form>
      </Box>
    </VendorDashboardLayout>
  );
};

export default AddMicrocredentials;
