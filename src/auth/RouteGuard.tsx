// Create a custom RouteGuard component
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setToken, setUser } from "store/authSlice";
import { useDispatch } from "react-redux";

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);

  useEffect(() => {
    const initializeAuth = () => {
      const userFromStorage = localStorage.getItem("user");
      const tokenFromStorage = localStorage.getItem("token");

      if (userFromStorage && tokenFromStorage) {
        dispatch(setUser(JSON.parse(userFromStorage)));
        dispatch(setToken(tokenFromStorage));
        if (
          router.pathname === "/login" ||
          router.pathname === "/reset-password"
        ) {
          router.replace("/");
        }
      } else {
        if (
          router.pathname !== "/login" &&
          router.pathname !== "/reset-password"
        ) {
          router.replace("/login");
        }
      }
    };

    initializeAuth();
  }, [dispatch, router]);

  if (
    router.pathname !== "/login" &&
    router.pathname !== "/reset-password" &&
    !authState.token
  ) {
    // If the user is not logged in and not on the login page, show null or a loading spinner
    return null; // or <LoadingSpinner />
  }

  // If the user is logged in or on the login page, render children
  return children;
};

export default RouteGuard;
