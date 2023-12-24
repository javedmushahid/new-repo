import Link from "next/link";
import { useFormik } from "formik";
import { NextPage } from "next";
import SEO from "components/SEO";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { H1, H6, Small } from "components/Typography";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { forgotPassword, resetPassword, validateOTP } from "apiSetup";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await resetPassword(values.email);
        if (response.status === 200 && response.roles === "Admin") {
          setShowOtpField(true);
          setEmail(values.email);
        } else {
          // Handle other status codes or error messages if needed
          enqueueSnackbar("Invalid admin credentials", { variant: "error" });
          //   router.reload();
          console.error("Error:", response.message);
        }
      } catch (error) {
        // Handle API request errors
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    },
  });
  const handleOtpSubmit = async () => {
    try {
      setLoading(true);

      const otpValidationResponse = await validateOTP(email, otp);
      if (otpValidationResponse.status === 200) {
        // OTP validation successful, you can now proceed with the reset password logic
        console.log("OTP validation successful");
        // alert("Validate otp");
        setShowOtpField(false);
        setShowPassword(true);

        // Add your logic for resetting the password
      } else {
        enqueueSnackbar("Invalid OTP", { variant: "error" });

        // Handle other status codes or error messages if needed
        console.error("Error:", otpValidationResponse.message);
      }
    } catch (error) {
      // Handle API request errors
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    try {
      setLoading(true);

      const otpValidationResponse = await forgotPassword(email, password);
      if (
        otpValidationResponse.status === 200 &&
        otpValidationResponse.data !== null
      ) {
        enqueueSnackbar("Password reset successfull", { variant: "success" });

        setShowOtpField(true);
        setShowPassword(false);
        router.push("/login");
        // Add your logic for resetting the password
      } else {
        // Handle other status codes or error messages if needed
        enqueueSnackbar("Could not reset", { variant: "error" });

        console.error("Error:", otpValidationResponse.message);
      }
    } catch (error) {
      enqueueSnackbar("Could not reset", { variant: "error" });

      // Handle API request errors
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Reset Password" />

      <Card sx={{ padding: 4, maxWidth: 600, marginTop: 4, boxShadow: 1 }}>
        <H1 fontSize={20} fontWeight={700} mb={4} textAlign="center">
          Reset your password
        </H1>

        <FlexBox justifyContent="space-between" flexWrap="wrap" my={2}>
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            {!showOtpField && !showpassword && (
              <>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  label="Email"
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Reset"}
                  </Button>
                </Box>
              </>
            )}
          </form>
          {showOtpField ? (
            <TextField
              fullWidth
              name="otp"
              type="text"
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          ) : null}
          {showOtpField ? (
            <FlexRowCenter mt="1.25rem" justifyContent="center" width="100%">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleOtpSubmit}
              >
                {loading ? <CircularProgress size={24} /> : "Submit "}
              </Button>
            </FlexRowCenter>
          ) : (
            <>
              {!showpassword && (
                <FlexRowCenter
                  mt="1.25rem"
                  justifyContent="center"
                  width="100%"
                >
                  <Box>Already have an account?</Box>
                  <Link href="/login">
                    <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
                      Login
                    </H6>
                  </Link>
                </FlexRowCenter>
              )}
            </>
          )}
          {showpassword ? (
            <>
              {" "}
              <TextField
                fullWidth
                name="password"
                type={visiblePassword ? "text" : "password"}
                label="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setVisiblePassword(!visiblePassword)}
                      edge="end"
                    >
                      {visiblePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </>
          ) : (
            <></>
          )}
        </FlexBox>
      </Card>
    </FlexRowCenter>
  );
};

export default ResetPassword;
