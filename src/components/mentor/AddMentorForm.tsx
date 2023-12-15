import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  CameraAltOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { RemoveCircleOutline } from "@mui/icons-material";
import { createMentor } from "apiSetup";
import { useRouter } from "next/router";

const AddMentorForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    description: "",
    userType: "",
    expertise: [""],
    mentorOfferings: [""],
    superpower: "",
    profilePicture: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddExpertise = () => {
    setFormData({
      ...formData,
      expertise: [...formData.expertise, ""],
    });
  };

  const handleRemoveExpertise = (index) => {
    const updatedExpertise = [...formData.expertise];
    updatedExpertise.splice(index, 1);
    setFormData({
      ...formData,
      expertise: updatedExpertise,
    });
  };

  const handleAddMentorOffering = () => {
    setFormData({
      ...formData,
      mentorOfferings: [...formData.mentorOfferings, ""],
    });
  };

  const handleRemoveMentorOffering = (index) => {
    const updatedMentorOfferings = [...formData.mentorOfferings];
    updatedMentorOfferings.splice(index, 1);
    setFormData({
      ...formData,
      mentorOfferings: updatedMentorOfferings,
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      profilePicture: event.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDatas = new FormData();
    formDatas.append("fullName", formData.fullName);
    formDatas.append("email", formData.email);
    formDatas.append("password", formData.password);
    formDatas.append("description", formData.description);
    formDatas.append("userType", formData.userType);
    formDatas.append("superpower", formData.superpower);

    // Handle expertise array
    formData.expertise.forEach((expertise, index) => {
      formDatas.append(`expertise[${index}]`, expertise);
    });

    // Handle mentorOfferings array
    formData.mentorOfferings.forEach((mentorOffering, index) => {
      formDatas.append(`mentorOfferings[${index}]`, mentorOffering);
    });

    // Handle profilePicture
    if (formData.profilePicture) {
      formDatas.append("profilePicture", formData.profilePicture);
    }
    console.log("formData:", formData);
    // console.log("response", formData);
    // Now you can use the formDatas object for submission
    // Example: You can send this data to a server using an API call
    const response = await createMentor(formDatas);
    console.log("Mentor created:", response);
    router.push("/mentors");
    // Reset the form data if needed
    setFormData({
      fullName: "",
      email: "",
      password: "",
      description: "",
      userType: "",
      expertise: [""],
      mentorOfferings: [""],
      superpower: "",
      profilePicture: null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ maxWidth: 500 }} mt={1} mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="User Type"
              name="userType"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.userType}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            {formData.expertise.map((expertise, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={11}>
                  <TextField
                    label="Expertise"
                    name={`expertise.${index}`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={expertise}
                    onChange={(event) => {
                      const updatedExpertise = [...formData.expertise];
                      updatedExpertise[index] = event.target.value;
                      setFormData({
                        ...formData,
                        expertise: updatedExpertise,
                      });
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    onClick={() => handleRemoveExpertise(index)}
                    edge="end"
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handleAddExpertise}
            >
              Add Expertise
            </Button>
          </Grid>
          <Grid item xs={12}>
            {formData.mentorOfferings.map((mentorOffering, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={11}>
                  <TextField
                    label="Mentor Offering"
                    name={`mentorOfferings.${index}`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={mentorOffering}
                    onChange={(event) => {
                      const updatedMentorOfferings = [
                        ...formData.mentorOfferings,
                      ];
                      updatedMentorOfferings[index] = event.target.value;
                      setFormData({
                        ...formData,
                        mentorOfferings: updatedMentorOfferings,
                      });
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    onClick={() => handleRemoveMentorOffering(index)}
                    edge="end"
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handleAddMentorOffering}
            >
              Add Mentor Offering
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Superpower"
              name="superpower"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.superpower}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="profilePicture">
              <Button
                variant="contained"
                color="primary"
                component="span"
                style={{
                  //   backgroundColor: "#2b42f3",
                  //   color: "white",
                  borderRadius: "8px",
                  // padding: "10px 25px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  marginBottom: "20px",
                }}
              >
                <CameraAltOutlined sx={{ mr: 1 }} />
                Upload Profile Picture
              </Button>
            </label>
            <input
              accept="image/*"
              id="profilePicture"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {formData.profilePicture && (
              <Typography variant="body2">
                {formData.profilePicture.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default AddMentorForm;
