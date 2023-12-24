import { useCallback, useState, FC } from "react";
import { Button, Card, CardProps, Box, styled } from "@mui/material";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import { H1, H6 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import BazaarTextField from "components/BazaarTextField";
import SocialButtons from "./SocialButtons";
import EyeToggleButton from "./EyeToggleButton";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import Image from "next/image";
import { adminLogin } from "apiSetup";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "store/authSlice";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import ModalAlert from "components/ModalOpen";
import ErrorModal from "components/ModalOpen";

const fbStyle = { background: "#3B5998", color: "white" };
const googleStyle = { background: "#4285F4", color: "white" };

type WrapperProps = { passwordVisibility?: boolean };

export const Wrapper = styled<FC<WrapperProps & CardProps>>(
  ({ children, passwordVisibility, ...rest }) => (
    <Card {...rest}>{children}</Card>
  )
)<CardProps>(({ theme, passwordVisibility }) => ({
  "& img": {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "30%",
  },
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: { width: "100%" },
  ".passwordEye": {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  ".facebookButton": { marginBottom: 10, ...fbStyle, "&:hover": fbStyle },
  ".googleButton": { ...googleStyle, "&:hover": googleStyle },
  ".agreement": { marginTop: 12, marginBottom: 24 },
}));

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const dispatch = useDispatch();
  const [resetClicked, setResetClicked] = useState(false); // Add state for reset click

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);
  const handleResetClick = () => {
    setResetClicked(true);
  };
  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    setError("");
    console.log(values);
    try {
      const data = await adminLogin(values.email, values.password);
      dispatch(setUser(data.updatedUser));
      dispatch(setToken(data.token));
      router.push("/");
      console.log("Login successful", data);
      // Redirect user to home/dashboard page or do whatever you want on successful login
    } catch (error) {
      if (error.message === "Not Authorized") {
        setError("Unauthorized access");
        setShowErrorModal(true);
      } else {
        setError("Login failed. Please try again.");
        setShowErrorModal(true);
      }
    }
    setLoading(false); // End loading
  };
  const handleCloseErrorModal = () => setShowErrorModal(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <img
          alt=""
          src="/assets/images/logo.png"
          // style={{ margin: "auto", width: "30%" }}
        />

        <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
          My Future Capacity-Admin
        </H1>

        <BazaarTextField
          mb={1.5}
          fullWidth
          name="email"
          size="small"
          type="email"
          variant="outlined"
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          label="Email "
          placeholder="Enter email"
          error={!!touched.email && !!errors.email}
          helperText={(touched.email && errors.email) as string}
        />

        <BazaarTextField
          mb={2}
          fullWidth
          size="small"
          name="password"
          label="Password"
          autoComplete="on"
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          placeholder="*********"
          type={passwordVisibility ? "text" : "password"}
          error={!!touched.password && !!errors.password}
          helperText={(touched.password && errors.password) as string}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ height: 44 }}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>

      {/* <SocialButtons /> */}

      <FlexBox
        justifyContent="center"
        // bgcolor="grey.200"
        borderRadius="4px"
        py={2.5}
        mt="1.25rem"
      >
        Forgot your password?
        <Link href="/reset-password">
          <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
            Reset It
          </H6>
        </Link>
      </FlexBox>

      <ErrorModal
        open={showErrorModal}
        handleClose={handleCloseErrorModal}
        errorMessage={error}
      />
    </Wrapper>
  );
};

const initialValues = { email: "", password: "" };

const formSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  email: yup.string().email("invalid email").required("Email is required"),
});

export default Login;
