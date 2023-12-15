import { ReactElement, ReactNode, useEffect } from "react";
import Head from "next/head";
import { NextPage } from "next";
import Router from "next/router";
import { AppProps } from "next/app";
import nProgress from "nprogress";
import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { appWithTranslation } from "next-i18next";
import RTL from "components/RTL";
import MuiTheme from "theme/MuiTheme";
import OpenGraphTags from "utils/OpenGraphTags";
import { AppProvider } from "contexts/AppContext";
import SettingsProvider from "contexts/SettingContext";
import SnackbarProvider from "components/SnackbarProvider";
import createEmotionCache from "createEmotionCache";
import { useRouter } from "next/router";
import "nprogress/nprogress.css";
import "simplebar-react/dist/simplebar.min.css";
import "../src/__server__";
import { Provider } from "react-redux";
import { useStore } from "store/store";
import { useSelector } from "react-redux";
import { isAuthenticated } from "auth/authentication";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "store/authSlice";
import RouteGuard from "auth/RouteGuard";
import { Route } from "@mui/icons-material";

//Binding events.
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPage & { getLayout?: (page: ReactElement) => ReactNode };
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const store = useStore(pageProps.initialReduxState);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="My Future Capacity" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <OpenGraphTags />
          <title>Admin-My Future Capacity</title>
        </Head>

        <SettingsProvider>
          <AppProvider>
            <MuiTheme>
              <SnackbarProvider>
                {" "}
                <RouteGuard>
                  {" "}
                  <RTL>{getLayout(<Component {...pageProps} />)}</RTL>
                </RouteGuard>
              </SnackbarProvider>
            </MuiTheme>
          </AppProvider>
        </SettingsProvider>
      </CacheProvider>
    </Provider>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default appWithTranslation(App);
