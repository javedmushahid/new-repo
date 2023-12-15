import { NextPage } from "next";
import SEO from "components/SEO";
import Login from "pages-sections/sessions/Login";
import { FlexRowCenter } from "components/flex-box";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Login" />
      <Login />
    </FlexRowCenter>
  );
};

export default LoginPage;
